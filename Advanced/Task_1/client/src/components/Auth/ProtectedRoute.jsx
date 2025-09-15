import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { Lock, AdminPanelSettings } from '@mui/icons-material';

import { useAuth } from '@context/AuthContext';
import LoadingSpinner from '@components/UI/LoadingSpinner';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          p: 3
        }}
      >
        <AdminPanelSettings sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom color="error">
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
          You need administrator privileges to access this page. Please contact your system administrator if you believe this is an error.
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.history.back()}
          startIcon={<Lock />}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;
