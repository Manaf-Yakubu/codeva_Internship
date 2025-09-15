import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED' && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshResponse = await api.post('/auth/refresh');
        const { accessToken } = refreshResponse.data.data;
        
        // Update token in localStorage
        localStorage.setItem('accessToken', accessToken);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors (but not for auth check requests)
    const isAuthCheck = originalRequest.url?.includes('/auth/me');
    
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.response?.status === 403 && !isAuthCheck) {
      toast.error('You do not have permission to perform this action.');
    } else if (error.response?.status === 404) {
      toast.error('Resource not found.');
    }

    return Promise.reject(error);
  }
);

export default api;
