import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  People,
  ShoppingBag,
  Star,
  AccessTime,
  CheckCircle,
  Person,
  AdminPanelSettings
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import { useAuth } from '@context/AuthContext';
import { dashboardService } from '@services/dashboardService';
import LoadingSpinner from '@components/UI/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats,
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['dashboard-activities'],
    queryFn: () => dashboardService.getActivities({ limit: 5 }),
  });

  if (statsLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  const StatCard = ({ title, value, icon, color, trend }) => (
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
              {trend && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                  <Typography variant="body2" color="success.main">
                    {trend}
                  </Typography>
                </Box>
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

  const WelcomeCard = () => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card
        sx={{
          background: 'linear-gradient(135deg, #dc143c 0%, #006b3c 100%)',
          color: 'white',
          mb: 3
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: 'rgba(255,255,255,0.2)',
                fontSize: '1.5rem',
                fontWeight: 600
              }}
            >
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                Welcome back, {user?.firstName}!
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
                {user?.email}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  icon={isAdmin ? <AdminPanelSettings /> : <Person />}
                  label={isAdmin ? 'Administrator' : 'User'}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 500
                  }}
                />
                <Chip
                  icon={<CheckCircle />}
                  label="Active"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(76,175,80,0.2)',
                    color: 'white',
                    fontWeight: 500
                  }}
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderAdminStats = () => {
    const overview = stats?.data?.overview || {};
    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={overview.totalUsers || 0}
            icon={<People />}
            color="#2196f3"
            trend="+12% this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={overview.totalProducts || 0}
            icon={<ShoppingBag />}
            color="#ff9800"
            trend="+8% this week"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Products"
            value={overview.activeProducts || 0}
            icon={<Star />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="New Users"
            value={overview.recentUsers || 0}
            icon={<TrendingUp />}
            color="#9c27b0"
            trend="Last 7 days"
          />
        </Grid>
      </Grid>
    );
  };

  const renderUserStats = () => {
    const overview = stats?.data?.overview || {};
    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="My Products"
            value={overview.myProducts || 0}
            icon={<ShoppingBag />}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Account Age"
            value={`${overview.accountAge || 0} days`}
            icon={<AccessTime />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Last Login"
            value={overview.lastLogin ? new Date(overview.lastLogin).toLocaleDateString() : 'Today'}
            icon={<CheckCircle />}
            color="#4caf50"
          />
        </Grid>
      </Grid>
    );
  };

  const renderRecentActivity = () => {
    if (activitiesLoading) {
      return (
        <Card>
          <CardContent>
            <LinearProgress />
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              Loading activities...
            </Typography>
          </CardContent>
        </Card>
      );
    }

    const activityData = activities?.data || {};

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Recent Activity
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {isAdmin ? (
              <>
                {activityData.recentUsers?.length > 0 && (
                  <>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                      New Users
                    </Typography>
                    <List dense>
                      {activityData.recentUsers.map((user) => (
                        <ListItem key={user.id}>
                          <ListItemIcon>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                              {user.firstName[0]}{user.lastName[0]}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={`${user.firstName} ${user.lastName}`}
                            secondary={`${user.email} • ${new Date(user.createdAt).toLocaleDateString()}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
                
                {activityData.recentProducts?.length > 0 && (
                  <>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                      New Products
                    </Typography>
                    <List dense>
                      {activityData.recentProducts.map((product) => (
                        <ListItem key={product.id}>
                          <ListItemIcon>
                            <ShoppingBag color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={product.name}
                            secondary={`By ${product.creator?.firstName} ${product.creator?.lastName} • ${new Date(product.createdAt).toLocaleDateString()}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </>
            ) : (
              <>
                {activityData.myProducts?.length > 0 ? (
                  <List>
                    {activityData.myProducts.map((product) => (
                      <ListItem key={product.id}>
                        <ListItemIcon>
                          <ShoppingBag color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={product.name}
                          secondary={`Updated ${new Date(product.updatedAt).toLocaleDateString()} • Stock: ${product.stock}`}
                        />
                        <Chip
                          label={product.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          color={product.isActive ? 'success' : 'default'}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                    No recent activity to display
                  </Typography>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <WelcomeCard />
      
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
      </Typography>

      {isAdmin ? renderAdminStats() : renderUserStats()}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {renderRecentActivity()}
        </Grid>
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Quick Actions
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {isAdmin ? (
                    <>
                      <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                        → Manage Users
                      </Typography>
                      <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                        → Manage Products
                      </Typography>
                      <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                        → View System Logs
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                        → Update Profile
                      </Typography>
                      <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                        → Browse Products
                      </Typography>
                      <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                        → View Orders
                      </Typography>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
