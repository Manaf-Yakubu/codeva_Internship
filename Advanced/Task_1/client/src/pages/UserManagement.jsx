import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Alert
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Block,
  CheckCircle,
  AdminPanelSettings,
  Person
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { adminService } from '@services/adminService';

const UserManagement = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '', user: null });
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminService.getUsers({ limit: 100 }),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => adminService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      toast.success('User role updated successfully');
      handleCloseMenu();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update user role');
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (userId) => adminService.toggleUserStatus(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      toast.success('User status updated successfully');
      setConfirmDialog({ open: false, action: '', user: null });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId) => adminService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      toast.success('User deleted successfully');
      setConfirmDialog({ open: false, action: '', user: null });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  });

  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleConfirmAction = (action, user) => {
    setConfirmDialog({ open: true, action, user });
    handleCloseMenu();
  };

  const executeAction = () => {
    const { action, user } = confirmDialog;
    
    switch (action) {
      case 'toggleStatus':
        toggleStatusMutation.mutate(user.id);
        break;
      case 'delete':
        deleteUserMutation.mutate(user.id);
        break;
      default:
        break;
    }
  };

  const columns = [
    {
      field: 'avatar',
      headerName: '',
      width: 60,
      renderCell: (params) => (
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            fontWeight: 600
          }}
        >
          {params.row.firstName[0]}{params.row.lastName[0]}
        </Box>
      ),
      sortable: false,
      filterable: false
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      valueGetter: (params) => `${params.row.firstName} ${params.row.lastName}`
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      renderCell: (params) => (
        <Chip
          icon={params.value === 'admin' ? <AdminPanelSettings /> : <Person />}
          label={params.value === 'admin' ? 'Admin' : 'User'}
          color={params.value === 'admin' ? 'primary' : 'default'}
          size="small"
        />
      )
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          icon={params.value ? <CheckCircle /> : <Block />}
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'error'}
          size="small"
        />
      )
    },
    {
      field: 'createdAt',
      headerName: 'Joined',
      width: 120,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString()
    },
    {
      field: 'activeSessions',
      headerName: 'Sessions',
      width: 100,
      align: 'center'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      renderCell: (params) => (
        <IconButton
          onClick={(event) => handleMenuClick(event, params.row)}
          size="small"
        >
          <MoreVert />
        </IconButton>
      ),
      sortable: false,
      filterable: false
    }
  ];

  const users = data?.data?.users || [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          User Management
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage user accounts, roles, and permissions
        </Typography>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load users. Please try again later.
        </Alert>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={users}
              columns={columns}
              loading={isLoading}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none'
                }
              }}
            />
          </Box>
        </Card>
      </motion.div>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {selectedUser?.role !== 'admin' && (
          <MenuItem
            onClick={() => updateRoleMutation.mutate({ userId: selectedUser.id, role: 'admin' })}
          >
            <AdminPanelSettings sx={{ mr: 1 }} />
            Make Admin
          </MenuItem>
        )}
        {selectedUser?.role === 'admin' && (
          <MenuItem
            onClick={() => updateRoleMutation.mutate({ userId: selectedUser.id, role: 'user' })}
          >
            <Person sx={{ mr: 1 }} />
            Make User
          </MenuItem>
        )}
        <MenuItem
          onClick={() => handleConfirmAction('toggleStatus', selectedUser)}
        >
          {selectedUser?.isActive ? <Block sx={{ mr: 1 }} /> : <CheckCircle sx={{ mr: 1 }} />}
          {selectedUser?.isActive ? 'Deactivate' : 'Activate'}
        </MenuItem>
        <MenuItem
          onClick={() => handleConfirmAction('delete', selectedUser)}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1 }} />
          Delete User
        </MenuItem>
      </Menu>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, action: '', user: null })}
      >
        <DialogTitle>
          Confirm Action
        </DialogTitle>
        <DialogContent>
          <Typography>
            {confirmDialog.action === 'toggleStatus' && (
              <>
                Are you sure you want to {confirmDialog.user?.isActive ? 'deactivate' : 'activate'} 
                {' '}<strong>{confirmDialog.user?.firstName} {confirmDialog.user?.lastName}</strong>?
              </>
            )}
            {confirmDialog.action === 'delete' && (
              <>
                Are you sure you want to delete 
                {' '}<strong>{confirmDialog.user?.firstName} {confirmDialog.user?.lastName}</strong>? 
                This action cannot be undone.
              </>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ open: false, action: '', user: null })}
          >
            Cancel
          </Button>
          <Button
            onClick={executeAction}
            color={confirmDialog.action === 'delete' ? 'error' : 'primary'}
            variant="contained"
            disabled={toggleStatusMutation.isLoading || deleteUserMutation.isLoading}
          >
            {confirmDialog.action === 'delete' ? 'Delete' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;
