import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Divider
} from '@mui/material';
import {
  GitHub,
  LinkedIn,
  Email,
  LocationOn,
  Code
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 4,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              CodeVa Full-Stack App
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              Advanced PERN stack application showcasing modern web development 
              practices with Ghana-inspired design elements.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                color="inherit"
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ '&:hover': { color: 'secondary.main' } }}
              >
                <GitHub />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ '&:hover': { color: 'secondary.main' } }}
              >
                <LinkedIn />
              </IconButton>
              <IconButton
                color="inherit"
                href="mailto:yakubu@codeva.com"
                sx={{ '&:hover': { color: 'secondary.main' } }}
              >
                <Email />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/" color="inherit" underline="hover">
                Home
              </Link>
              <Link href="/products" color="inherit" underline="hover">
                Products
              </Link>
              <Link href="/dashboard" color="inherit" underline="hover">
                Dashboard
              </Link>
              <Link href="/profile" color="inherit" underline="hover">
                Profile
              </Link>
            </Box>
          </Grid>

          {/* Developer Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Developer
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Code fontSize="small" />
                <Typography variant="body2">
                  Yakubu Abdul Manaf
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn fontSize="small" />
                <Typography variant="body2">
                  Ghana, West Africa
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                CodeVa Internship Program
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Advanced Level - Task 1
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {currentYear} CodeVa Full-Stack App. Built with ❤️ for Ghana.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              fontSize: '0.875rem',
              opacity: 0.8
            }}
          >
            <span>PERN Stack</span>
            <span>•</span>
            <span>React 18</span>
            <span>•</span>
            <span>Material-UI</span>
            <span>•</span>
            <span>PostgreSQL</span>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
