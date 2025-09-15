import api from './api';

export const dashboardService = {
  // Get dashboard statistics
  async getStats() {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  // Get recent activities
  async getActivities(params = {}) {
    const response = await api.get('/dashboard/activities', { params });
    return response.data;
  }
};
