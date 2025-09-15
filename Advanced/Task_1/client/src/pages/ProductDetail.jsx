import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  ShoppingCart,
  Star,
  ArrowBack,
  CheckCircle,
  Inventory,
  Category,
  Branding
} from '@mui/icons-material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import { productService } from '@services/productService';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
  });

  const product = data?.data?.product;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          Product not found or failed to load.
        </Alert>
        <Button
          component={Link}
          to="/products"
          startIcon={<ArrowBack />}
          variant="contained"
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          onClick={() => navigate(-1)}
          startIcon={<ArrowBack />}
          sx={{ mb: 3 }}
        >
          Back
        </Button>
      </motion.div>

      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <Box
                sx={{
                  height: 400,
                  background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                {product.isFeatured && (
                  <Chip
                    label="Featured"
                    color="primary"
                    icon={<Star />}
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      fontWeight: 600
                    }}
                  />
                )}
                <Typography variant="h4" color="text.secondary">
                  {product.name}
                </Typography>
              </Box>
            </Card>
          </motion.div>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Box>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                {product.name}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                  ${product.price}
                </Typography>
                {product.stock > 0 ? (
                  <Chip
                    label={`${product.stock} in stock`}
                    color="success"
                    icon={<CheckCircle />}
                  />
                ) : (
                  <Chip
                    label="Out of stock"
                    color="error"
                  />
                )}
              </Box>

              {product.rating > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        sx={{
                          fontSize: 20,
                          color: i < Math.floor(product.rating) ? '#ffd700' : '#e0e0e0'
                        }}
                      />
                    ))}
                  </Box>
                  <Typography variant="body2">
                    {product.rating} ({product.reviewCount} reviews)
                  </Typography>
                </Box>
              )}

              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                {product.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                <Chip
                  label={product.category}
                  icon={<Category />}
                  color="primary"
                  variant="outlined"
                />
                {product.brand && (
                  <Chip
                    label={product.brand}
                    icon={<Branding />}
                    variant="outlined"
                  />
                )}
                <Chip
                  label={`SKU: ${product.sku}`}
                  icon={<Inventory />}
                  variant="outlined"
                  size="small"
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  disabled={product.stock === 0}
                  sx={{ flex: 1 }}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ minWidth: 120 }}
                >
                  Wishlist
                </Button>
              </Box>

              {/* Creator Info */}
              {product.creator && (
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Created by
                  </Typography>
                  <Typography variant="body2">
                    {product.creator.firstName} {product.creator.lastName}
                  </Typography>
                </Card>
              )}
            </Box>
          </motion.div>
        </Grid>
      </Grid>

      {/* Product Details */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Specifications
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List dense>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <ListItem key={key} sx={{ px: 0 }}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </Typography>
                              <Typography variant="body2">
                                {value}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Additional Info */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Product Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Category:
                          </Typography>
                          <Typography variant="body2">
                            {product.category}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {product.brand && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              Brand:
                            </Typography>
                            <Typography variant="body2">
                              {product.brand}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  )}
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            SKU:
                          </Typography>
                          <Typography variant="body2">
                            {product.sku}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Availability:
                          </Typography>
                          <Typography variant="body2">
                            {product.stock > 0 ? `${product.stock} units` : 'Out of stock'}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Tags
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {product.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </motion.div>
    </Container>
  );
};

export default ProductDetail;
