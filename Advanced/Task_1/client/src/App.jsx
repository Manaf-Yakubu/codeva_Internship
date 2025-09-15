import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

import { useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Products = React.lazy(() => import('./pages/Products'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Profile = React.lazy(() => import('./pages/Profile'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const UserManagement = React.lazy(() => import('./pages/UserManagement'));
const ProductManagement = React.lazy(() => import('./pages/ProductManagement'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

const PageLoader = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="60vh"
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <CircularProgress size={60} thickness={4} />
    </motion.div>
  </Box>
);

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute requireAdmin>
                <UserManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/products" 
            element={
              <ProtectedRoute requireAdmin>
                <ProductManagement />
              </ProtectedRoute>
            } 
          />

          {/* Redirects */}
          <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
