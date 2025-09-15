import api from './api';

export const authService = {
  // Authentication
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.data.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
    }
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.data.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
    }
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    return response.data;
  },

  async logoutAll() {
    const response = await api.post('/auth/logout-all');
    localStorage.removeItem('accessToken');
    return response.data;
  },

  async refreshToken() {
    const response = await api.post('/auth/refresh');
    if (response.data.data.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
    }
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Profile management
  async updateProfile(profileData) {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  async updatePreferences(preferences) {
    const response = await api.put('/users/preferences', preferences);
    return response.data;
  },

  async changePassword(passwordData) {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },

  // Utility
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },

  getToken() {
    return localStorage.getItem('accessToken');
  },

  clearToken() {
    localStorage.removeItem('accessToken');
  }
};
