import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Only check auth if token exists
      if (!authService.isAuthenticated()) {
        dispatch({ type: 'AUTH_FAILURE', payload: null });
        return;
      }

      dispatch({ type: 'AUTH_START' });
      const response = await authService.getCurrentUser();
      dispatch({ type: 'AUTH_SUCCESS', payload: response.data.data.user });
    } catch (error) {
      // Don't show error message for auth check failures
      dispatch({ type: 'AUTH_FAILURE', payload: null });
      authService.clearToken();
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authService.login(credentials);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.data.data.user });
      toast.success('Login successful!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      toast.error(message);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authService.register(userData);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.data.data.user });
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      toast.error(message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully');
    } catch (error) {
      // Even if logout fails on server, clear local state
      dispatch({ type: 'LOGOUT' });
      toast.error('Logout failed, but you have been logged out locally');
    }
  };

  const logoutAll = async () => {
    try {
      await authService.logoutAll();
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out from all devices');
    } catch (error) {
      dispatch({ type: 'LOGOUT' });
      toast.error('Failed to logout from all devices');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      dispatch({ type: 'UPDATE_USER', payload: response.data.data.user });
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      throw error;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      await authService.changePassword(passwordData);
      toast.success('Password changed successfully. Please login again.');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      toast.error(message);
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    logoutAll,
    updateProfile,
    changePassword,
    clearError,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
