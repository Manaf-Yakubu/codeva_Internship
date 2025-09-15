import api from './api';

export const productService = {
  // Get all products with pagination and filters
  async getProducts(params = {}) {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get featured products
  async getFeaturedProducts() {
    const response = await api.get('/products/featured');
    return response.data;
  },

  // Get product by ID
  async getProduct(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create new product (Admin only)
  async createProduct(productData) {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product (Admin only)
  async updateProduct(id, productData) {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product (Admin only)
  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Toggle featured status (Admin only)
  async toggleFeatured(id) {
    const response = await api.put(`/products/${id}/featured`);
    return response.data;
  },

  // Search products
  async searchProducts(query, filters = {}) {
    const params = { search: query, ...filters };
    const response = await api.get('/products', { params });
    return response.data;
  }
};
