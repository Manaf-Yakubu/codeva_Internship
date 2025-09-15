import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button
} from '@mui/material';
import {
  People,
  ShoppingBag,
  TrendingUp,
  Star,
  Person,
  Store,
  Settings,
  Assessment
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import { adminService } from '@services/adminService';
import LoadingSpinner from '@components/UI/LoadingSpinner';

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminService.getStats,
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading admin dashboard..." />;
  }

  const overview = stats?.data?.users || {};
  const productStats = stats?.data?.products || {};
  const userRoles = stats?.data?.userRoles || {};

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
          border: `1px solid ${color}30`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 25px ${color}20`,
          }
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography color="text.secondary" gutterBottom variant="body2">
                {title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color }}>
                {value}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
              {icon}
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Admin Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          System overview and management tools
        </Typography>
      </motion.div>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={overview.total || 0}
            icon={<People />}
            color="#2196f3"
            subtitle={`${overview.active || 0} active`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={productStats.total || 0}
            icon={<ShoppingBag />}
            color="#ff9800"
            subtitle={`${productStats.active || 0} active`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="New Registrations"
            value={overview.recentRegistrations || 0}
            icon={<TrendingUp />}
            color="#4caf50"
            subtitle="Last 30 days"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Sessions"
            value={stats?.data?.sessions?.active || 0}
            icon={<Star />}
            color="#9c27b0"
            subtitle="Current users"
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Quick Actions
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List>
                  <ListItem
                    component={Link}
                    to="/admin/users"
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <ListItemIcon>
                      <People color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Manage Users" />
                  </ListItem>
                  <ListItem
                    component={Link}
                    to="/admin/products"
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <ListItemIcon>
                      <Store color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Manage Products" />
                  </ListItem>
                  <ListItem
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <ListItemIcon>
                      <Assessment color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="View Reports" />
                  </ListItem>
                  <ListItem
                    sx={{
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <ListItemIcon>
                      <Settings color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="System Settings" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* User Role Distribution */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  User Roles
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Administrators</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {userRoles.admin || 0}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={((userRoles.admin || 0) / (overview.total || 1)) * 100}
                    sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.200' }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Regular Users</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {userRoles.user || 0}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={((userRoles.user || 0) / (overview.total || 1)) * 100}
                    sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.200' }}
                  />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* System Health */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  System Health
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Database</Typography>
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                      Healthy
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={100}
                    color="success"
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">API Response</Typography>
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                      Fast
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={95}
                    color="success"
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Server Load</Typography>
                    <Typography variant="body2" color="warning.main" sx={{ fontWeight: 600 }}>
                      Moderate
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={65}
                    color="warning"
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card sx={{ mt: 4, background: 'linear-gradient(135deg, #dc143c 0%, #006b3c 100%)', color: 'white' }}>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              System Administration
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              Manage your application with powerful admin tools
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/admin/users"
                variant="contained"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  fontWeight: 600,
                  '&:hover': { bgcolor: 'grey.100' }
                }}
              >
                User Management
              </Button>
              <Button
                component={Link}
                to="/admin/products"
                variant="outlined"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Product Management
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
};

export default AdminDashboard;
