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
  Star,
  StarBorder,
  Add,
  Visibility
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { adminService, productService } from '@services/adminService';

const ProductManagement = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '', product: null });
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => adminService.getProducts({ limit: 100 }),
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: (productId) => productService.toggleFeatured(productId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      toast.success('Product featured status updated');
      handleCloseMenu();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update featured status');
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: (productId) => productService.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      toast.success('Product deleted successfully');
      setConfirmDialog({ open: false, action: '', product: null });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  });

  const handleMenuClick = (event, product) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  const handleConfirmAction = (action, product) => {
    setConfirmDialog({ open: true, action, product });
    handleCloseMenu();
  };

  const executeAction = () => {
    const { action, product } = confirmDialog;
    
    switch (action) {
      case 'delete':
        deleteProductMutation.mutate(product.id);
        break;
      default:
        break;
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Product Name',
      width: 250,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            SKU: {params.row.sku}
          </Typography>
        </Box>
      )
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
          color="primary"
        />
      )
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 100,
      valueFormatter: (params) => `$${params.value}`
    },
    {
      field: 'stock',
      headerName: 'Stock',
      width: 80,
      align: 'center'
    },
    {
      field: 'isFeatured',
      headerName: 'Featured',
      width: 100,
      renderCell: (params) => (
        <Chip
          icon={params.value ? <Star /> : <StarBorder />}
          label={params.value ? 'Yes' : 'No'}
          color={params.value ? 'primary' : 'default'}
          size="small"
        />
      )
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'error'}
          size="small"
        />
      )
    },
    {
      field: 'creator',
      headerName: 'Created By',
      width: 150,
      valueGetter: (params) => 
        params.row.creator ? `${params.row.creator.firstName} ${params.row.creator.lastName}` : 'Unknown'
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 120,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString()
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

  const products = data?.data?.products || [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Product Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage products, inventory, and featured items
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ fontWeight: 600 }}
          >
            Add Product
          </Button>
        </Box>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load products. Please try again later.
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
              rows={products}
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
        <MenuItem onClick={handleCloseMenu}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleCloseMenu}>
          <Edit sx={{ mr: 1 }} />
          Edit Product
        </MenuItem>
        <MenuItem
          onClick={() => toggleFeaturedMutation.mutate(selectedProduct?.id)}
        >
          {selectedProduct?.isFeatured ? <StarBorder sx={{ mr: 1 }} /> : <Star sx={{ mr: 1 }} />}
          {selectedProduct?.isFeatured ? 'Remove Featured' : 'Make Featured'}
        </MenuItem>
        <MenuItem
          onClick={() => handleConfirmAction('delete', selectedProduct)}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1 }} />
          Delete Product
        </MenuItem>
      </Menu>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, action: '', product: null })}
      >
        <DialogTitle>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete 
            {' '}<strong>{confirmDialog.product?.name}</strong>? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ open: false, action: '', product: null })}
          >
            Cancel
          </Button>
          <Button
            onClick={executeAction}
            color="error"
            variant="contained"
            disabled={deleteProductMutation.isLoading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductManagement;
