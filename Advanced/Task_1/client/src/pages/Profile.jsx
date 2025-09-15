import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  Switch,
  FormControlLabel,
  Chip
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Edit,
  Save,
  Cancel,
  Security
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { useAuth } from '@context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      country: user?.country || 'Ghana'
    }
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await updateProfile(data);
      setIsEditing(false);
    } catch (error) {
      // Error handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Profile Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage your account information and preferences
        </Typography>
      </motion.div>

      <Grid container spacing={4}>
        {/* Profile Info */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Personal Information
                  </Typography>
                  {!isEditing ? (
                    <Button
                      startIcon={<Edit />}
                      onClick={() => setIsEditing(true)}
                      variant="outlined"
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        startIcon={<Cancel />}
                        onClick={handleCancel}
                        variant="outlined"
                        color="secondary"
                      >
                        Cancel
                      </Button>
                      <Button
                        startIcon={<Save />}
                        onClick={handleSubmit(onSubmit)}
                        variant="contained"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ mb: 3 }} />

                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        {...register('firstName', {
                          required: 'First name is required',
                          minLength: { value: 2, message: 'Minimum 2 characters' }
                        })}
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        {...register('lastName', {
                          required: 'Last name is required',
                          minLength: { value: 2, message: 'Minimum 2 characters' }
                        })}
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        value={user?.email || ''}
                        disabled
                        InputProps={{
                          startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />
                        }}
                        helperText="Email cannot be changed"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        {...register('phone')}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City"
                        {...register('city')}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: <LocationOn sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        {...register('address')}
                        disabled={!isEditing}
                        multiline
                        rows={2}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Country"
                        {...register('country')}
                        disabled={!isEditing}
                      />
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Profile Summary */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    fontWeight: 600
                  }}
                >
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </Avatar>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {user?.email}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
                  <Chip
                    label={user?.role === 'admin' ? 'Administrator' : 'User'}
                    color={user?.role === 'admin' ? 'primary' : 'default'}
                    size="small"
                  />
                  <Chip
                    label="Active"
                    color="success"
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Account Settings
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Email Notifications"
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Marketing Updates"
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Security Alerts"
                  />
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Security />}
                  sx={{ mb: 2 }}
                >
                  Change Password
                </Button>

                <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
                  Account created on {new Date(user?.createdAt).toLocaleDateString()}
                </Alert>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
