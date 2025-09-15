import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  useTheme
} from '@mui/material';
import {
  Rocket,
  Security,
  Speed,
  Code,
  ArrowForward,
  CheckCircle
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

import { productService } from '@services/productService';

const Home = () => {
  const theme = useTheme();

  const { data: featuredProducts } = useQuery({
    queryKey: ['featured-products'],
    queryFn: productService.getFeaturedProducts,
  });

  const features = [
    {
      icon: <Security />,
      title: 'Secure Authentication',
      description: 'JWT-based authentication with refresh tokens and role-based access control'
    },
    {
      icon: <Speed />,
      title: 'High Performance',
      description: 'Optimized with caching, compression, and efficient database queries'
    },
    {
      icon: <Code />,
      title: 'Modern Stack',
      description: 'Built with React 18, Node.js, PostgreSQL, and Material-UI'
    },
    {
      icon: <Rocket />,
      title: 'Production Ready',
      description: 'Docker containerization, CI/CD pipeline, and deployment configuration'
    }
  ];

  const stats = [
    { label: 'Technologies', value: '10+' },
    { label: 'Components', value: '25+' },
    { label: 'API Endpoints', value: '30+' },
    { label: 'Test Coverage', value: '90%' }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #dc143c 0%, #ffd700 50%, #006b3c 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.2
                  }}
                >
                  CodeVa Full-Stack
                  <br />
                  <span style={{ color: theme.palette.secondary.main }}>
                    Application
                  </span>
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    fontWeight: 400,
                    fontSize: { xs: '1.2rem', md: '1.5rem' }
                  }}
                >
                  Advanced PERN stack application with authentication, 
                  role-based access control, and modern UI/UX design.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    component={Link}
                    to="/products"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        bgcolor: 'grey.100',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    Explore Products
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Get Started
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 2,
                    mt: { xs: 4, md: 0 }
                  }}
                >
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    >
                      <Card
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          textAlign: 'center',
                          p: 2
                        }}
                      >
                        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                          {stat.label}
                        </Typography>
                      </Card>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Why Choose Our Platform?
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            Built with modern technologies and best practices for scalability, 
            security, and performance.
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={feature.title}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          p: 1,
                          borderRadius: 2,
                          mr: 2
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products Section */}
      {featuredProducts?.data?.products?.length > 0 && (
        <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h3"
                component="h2"
                textAlign="center"
                gutterBottom
                sx={{ fontWeight: 700, mb: 2 }}
              >
                Featured Products
              </Typography>
              <Typography
                variant="h6"
                textAlign="center"
                color="text.secondary"
                sx={{ mb: 6 }}
              >
                Discover our handpicked selection of premium products from Ghana
              </Typography>
            </motion.div>

            <Grid container spacing={3}>
              {featuredProducts.data.products.slice(0, 3).map((product, index) => (
                <Grid item xs={12} md={4} key={product.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
                            {product.name}
                          </Typography>
                          <Chip
                            label="Featured"
                            color="primary"
                            size="small"
                            icon={<CheckCircle />}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2, lineHeight: 1.6 }}
                        >
                          {product.description}
                        </Typography>
                        <Typography
                          variant="h5"
                          color="primary"
                          sx={{ fontWeight: 700 }}
                        >
                          ${product.price}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ p: 3, pt: 0 }}>
                        <Button
                          component={Link}
                          to={`/products/${product.id}`}
                          variant="contained"
                          fullWidth
                          endIcon={<ArrowForward />}
                        >
                          View Details
                        </Button>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                component={Link}
                to="/products"
                variant="outlined"
                size="large"
                endIcon={<ArrowForward />}
              >
                View All Products
              </Button>
            </Box>
          </Container>
        </Box>
      )}

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card
            sx={{
              background: 'linear-gradient(135deg, #dc143c 0%, #006b3c 100%)',
              color: 'white',
              textAlign: 'center',
              p: 6
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join our platform and experience the power of modern full-stack development
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  fontWeight: 600,
                  px: 4,
                  '&:hover': {
                    bgcolor: 'grey.100',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Create Account
              </Button>
              <Button
                component={Link}
                to="/products"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  fontWeight: 600,
                  px: 4,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Browse Products
              </Button>
            </Box>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Home;
