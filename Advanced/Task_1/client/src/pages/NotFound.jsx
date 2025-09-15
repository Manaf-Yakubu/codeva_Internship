import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent
} from '@mui/material';
import {
  Home,
  ArrowBack,
  SearchOff
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card
          sx={{
            textAlign: 'center',
            p: 6,
            background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
            border: '2px solid #e0e0e0'
          }}
        >
          <CardContent>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SearchOff sx={{ fontSize: 120, color: 'text.secondary', mb: 2 }} />
            </motion.div>
            
            <Typography
              variant="h1"
              sx={{
                fontSize: '6rem',
                fontWeight: 700,
                color: 'primary.main',
                mb: 2,
                background: 'linear-gradient(45deg, #dc143c 30%, #006b3c 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              404
            </Typography>
            
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Page Not Found
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back on track!
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/"
                variant="contained"
                size="large"
                startIcon={<Home />}
                sx={{ fontWeight: 600 }}
              >
                Go Home
              </Button>
              <Button
                onClick={() => navigate(-1)}
                variant="outlined"
                size="large"
                startIcon={<ArrowBack />}
                sx={{ fontWeight: 600 }}
              >
                Go Back
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
};

export default NotFound;
