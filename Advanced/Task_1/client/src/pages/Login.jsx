import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
  Chip,
  Avatar
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return;
    }
    
    const success = await login(formData);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  const fillDemoCredentials = (type) => {
    if (type === 'admin') {
      setFormData({
        email: 'admin@codeva.com',
        password: 'Admin123!',
      });
    } else {
      setFormData({
        email: 'user@codeva.com',
        password: 'User123!',
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)),
          url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container component="main" maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Paper
            elevation={24}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 2,
                    background: 'linear-gradient(135deg, #CE1126 0%, #FCD116 50%, #006B3F 100%)',
                    fontSize: '2rem',
                  }}
                >
                  <LoginIcon sx={{ fontSize: 40, color: 'white' }} />
                </Avatar>
              </motion.div>
              
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #CE1126 0%, #FCD116 50%, #006B3F 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                Welcome Back
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                Sign in to your CodeVA account
              </Typography>
            </Box>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 2,
                    '& .MuiAlert-message': { fontWeight: 500 }
                  }}
                >
                  {error}
                </Alert>
              </motion.div>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    }
                  }
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    }
                  }
                }}
              />

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 2,
                    mb: 2,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #CE1126 0%, #FCD116 50%, #006B3F 100%)',
                    boxShadow: '0 8px 32px rgba(206, 17, 38, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #B50E20 0%, #E8BC0A 50%, #005A35 100%)',
                      boxShadow: '0 12px 40px rgba(206, 17, 38, 0.4)',
                    },
                    '&:disabled': {
                      background: 'rgba(0, 0, 0, 0.12)',
                    }
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </motion.div>

              <Divider sx={{ my: 3 }}>
                <Chip 
                  label="Demo Accounts" 
                  size="small" 
                  sx={{ 
                    fontWeight: 600,
                    backgroundColor: 'rgba(206, 17, 38, 0.1)',
                    color: '#CE1126'
                  }}
                />
              </Divider>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <motion.div whileHover={{ scale: 1.05 }} style={{ flex: 1 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => fillDemoCredentials('admin')}
                    sx={{ 
                      textTransform: 'none',
                      borderRadius: 2,
                      py: 1.5,
                      fontWeight: 600,
                      borderColor: '#CE1126',
                      color: '#CE1126',
                      '&:hover': {
                        borderColor: '#B50E20',
                        backgroundColor: 'rgba(206, 17, 38, 0.04)',
                      }
                    }}
                  >
                    Admin Demo
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} style={{ flex: 1 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => fillDemoCredentials('user')}
                    sx={{ 
                      textTransform: 'none',
                      borderRadius: 2,
                      py: 1.5,
                      fontWeight: 600,
                      borderColor: '#006B3F',
                      color: '#006B3F',
                      '&:hover': {
                        borderColor: '#005A35',
                        backgroundColor: 'rgba(0, 107, 63, 0.04)',
                      }
                    }}
                  >
                    User Demo
                  </Button>
                </motion.div>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    style={{
                      color: '#CE1126',
                      textDecoration: 'none',
                      fontWeight: 700,
                    }}
                  >
                    Sign up here
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;
