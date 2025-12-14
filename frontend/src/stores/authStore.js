import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import { handleStoreError } from '../utils/storeHelpers.js';

// Auth store for managing authentication state
const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // Login functionality
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const user = response.data;
      set({
        user,
        isAuthenticated: true,
        loading: false,
        error: null
      });
      console.log(user);
      return user;
    } catch (error) {
      const errorMessage = handleStoreError(error, 'Login failed');
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: errorMessage
      });
      throw error;
    }
  },

  // Logout functionality
  logout: async () => {
    set({ loading: true });
    try {
      await axiosInstance.post('/auth/logout');
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });
    } catch (error) {
      // Even if logout fails on server, clear local state
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });
    }
  },

  // Update password functionality
  updatePassword: async (currentPassword, newPassword) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.put('/auth/update-password', {
        currentPassword,
        newPassword
      });
      set({ loading: false, error: null });
      return true;
    } catch (error) {
      const errorMessage = handleStoreError(error, 'Password update failed');
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  // Check authentication status
  checkAuth: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get('/auth/check');
      const user = response.data;
      set({
        user,
        isAuthenticated: true,
        loading: false,
        error: null
      });
      return user;
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });
      return null;
    }
  },

  // Sign up functionality
  signup: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/auth/signup', userData);
      const user = response.data;
      set({
        user,
        isAuthenticated: true,
        loading: false,
        error: null
      });
      return user;
    } catch (error) {
      const errorMessage = handleStoreError(error, 'Signup failed');
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: errorMessage
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;