import React from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAuthPage && <Navbar />}
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          pt: isAuthPage ? 0 : 8, // Account for navbar height
          pb: 2
        }}
      >
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </Box>
      
      {!isAuthPage && <Footer />}
    </Box>
  );
};

export default Layout;
