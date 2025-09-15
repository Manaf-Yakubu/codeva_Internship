import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Search,
  FilterList,
  ShoppingCart,
  Star,
  Visibility
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import { productService } from '@services/productService';

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const limit = 12;

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', { 
      search: searchQuery, 
      category: selectedCategory, 
      sortBy, 
      sortOrder, 
      page, 
      limit,
      featured: showFeaturedOnly 
    }],
    queryFn: () => productService.getProducts({
      search: searchQuery,
      category: selectedCategory,
      sortBy,
      sortOrder,
      page,
      limit,
      featured: showFeaturedOnly
    }),
    keepPreviousData: true,
  });

  const products = data?.data?.products || [];
  const categories = data?.data?.categories || [];
  const pagination = data?.data?.pagination || {};

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const ProductCard = ({ product, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
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
        <Box
          sx={{
            height: 200,
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
              size="small"
              icon={<Star />}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                fontWeight: 600
              }}
            />
          )}
          <Typography variant="h6" color="text.secondary">
            {product.name}
          </Typography>
        </Box>
        
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            {product.name}
          </Typography>
          
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5
            }}
          >
            {product.description}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              label={product.category}
              size="small"
              variant="outlined"
              color="primary"
            />
            {product.brand && (
              <Chip
                label={product.brand}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
              ${product.price}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Stock: {product.stock}
            </Typography>
          </Box>
          
          {product.rating > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Star sx={{ fontSize: 16, color: '#ffd700' }} />
              <Typography variant="body2">
                {product.rating} ({product.reviewCount} reviews)
              </Typography>
            </Box>
          )}
        </CardContent>
        
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            component={Link}
            to={`/products/${product.id}`}
            variant="outlined"
            startIcon={<Visibility />}
            sx={{ mr: 1 }}
          >
            View Details
          </Button>
          <Button
            variant="contained"
            startIcon={<ShoppingCart />}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Products
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Discover our collection of authentic Ghanaian products
        </Typography>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card sx={{ mb: 4, p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterList sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filters & Search
            </Typography>
          </Box>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  label="Sort By"
                >
                  <MenuItem value="createdAt">Newest</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="price">Price</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant={showFeaturedOnly ? 'contained' : 'outlined'}
                  onClick={() => {
                    setShowFeaturedOnly(!showFeaturedOnly);
                    setPage(1);
                  }}
                  startIcon={<Star />}
                  size="small"
                >
                  Featured Only
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    setSortBy('createdAt');
                    setSortOrder('desc');
                    setShowFeaturedOnly(false);
                    setPage(1);
                  }}
                  size="small"
                >
                  Clear Filters
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          Failed to load products. Please try again later.
        </Alert>
      )}

      {/* Products Grid */}
      {!isLoading && !error && (
        <>
          {products.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {products.map((product, index) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <ProductCard product={product} index={index} />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={pagination.totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" gutterBottom>
                  No products found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Try adjusting your search criteria or browse all products.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    setShowFeaturedOnly(false);
                  }}
                >
                  Show All Products
                </Button>
              </Box>
            </motion.div>
          )}
        </>
      )}
    </Container>
  );
};

export default Products;
