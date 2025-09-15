import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Dashboard,
  Logout,
  AdminPanelSettings,
  ShoppingCart,
  Home,
  Store
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useAuth } from '@context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'Products', path: '/products', icon: <Store /> },
  ];

  const isActivePath = (path) => location.pathname === path;

  const renderDesktopMenu = () => (
    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
      {navItems.map((item) => (
        <Button
          key={item.path}
          component={Link}
          to={item.path}
          color="inherit"
          startIcon={item.icon}
          sx={{
            fontWeight: isActivePath(item.path) ? 600 : 400,
            backgroundColor: isActivePath(item.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            }
          }}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  );

  const renderMobileMenu = () => (
    <Menu
      anchorEl={mobileMenuAnchor}
      open={Boolean(mobileMenuAnchor)}
      onClose={handleMenuClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {navItems.map((item) => (
        <MenuItem
          key={item.path}
          component={Link}
          to={item.path}
          onClick={handleMenuClose}
          sx={{
            fontWeight: isActivePath(item.path) ? 600 : 400,
            backgroundColor: isActivePath(item.path) ? 'rgba(220, 20, 60, 0.1)' : 'transparent',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {item.icon}
            {item.label}
          </Box>
        </MenuItem>
      ))}
    </Menu>
  );

  const renderUserMenu = () => (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem component={Link} to="/dashboard" onClick={handleMenuClose}>
        <Dashboard sx={{ mr: 1 }} />
        Dashboard
      </MenuItem>
      <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
        <AccountCircle sx={{ mr: 1 }} />
        Profile
      </MenuItem>
      {user?.role === 'admin' && (
        <MenuItem component={Link} to="/admin" onClick={handleMenuClose}>
          <AdminPanelSettings sx={{ mr: 1 }} />
          Admin Panel
        </MenuItem>
      )}
      <MenuItem onClick={handleLogout}>
        <Logout sx={{ mr: 1 }} />
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar position="fixed" elevation={2}>
      <Toolbar>
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 0,
              fontWeight: 700,
              textDecoration: 'none',
              color: 'inherit',
              mr: 4,
              background: 'linear-gradient(45deg, #fff 30%, #ffd700 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            CodeVa App
          </Typography>
        </motion.div>

        {/* Desktop Navigation */}
        {renderDesktopMenu()}

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            color="inherit"
            onClick={handleMobileMenuOpen}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* User Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isAuthenticated ? (
            <>
              {/* Shopping Cart (placeholder) */}
              <IconButton color="inherit">
                <Badge badgeContent={0} color="secondary">
                  <ShoppingCart />
                </Badge>
              </IconButton>

              {/* User Avatar */}
              <IconButton onClick={handleProfileMenuOpen} color="inherit">
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'secondary.main',
                    color: 'primary.main',
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}
                >
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </Avatar>
              </IconButton>

              {/* Welcome Text (Desktop only) */}
              {!isMobile && (
                <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
                  Welcome, {user?.firstName}!
                </Typography>
              )}
            </>
          ) : (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              <Button
                component={Link}
                to="/login"
                color="inherit"
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                color="secondary"
                variant="contained"
                sx={{
                  fontWeight: 600,
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(255,215,0,0.3)',
                  }
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Box>

        {/* Menus */}
        {renderMobileMenu()}
        {renderUserMenu()}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
