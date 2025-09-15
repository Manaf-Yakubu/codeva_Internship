import api from './api';

export const adminService = {
  // System statistics
  async getStats() {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // User management
  async getUsers(params = {}) {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  async getUser(id) {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  async updateUserRole(id, role) {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  async toggleUserStatus(id) {
    const response = await api.put(`/admin/users/${id}/status`);
    return response.data;
  },

  async deleteUser(id) {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Product management
  async getProducts(params = {}) {
    const response = await api.get('/admin/products', { params });
    return response.data;
  }
};
