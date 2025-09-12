import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';


const useUserStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,
  searchTerm: '',
  filters: {
    role: '',
    name: '',
    email: '',
    address: ''
  },

  
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/api/users');
      set({
        users: response.data.users || response.data,
        loading: false,
        error: null
      });
      return response.data.users || response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch users';
      set({
        users: [],
        loading: false,
        error: errorMessage
      });
      throw error;
    }
  },

  
  getUserById: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/api/users/${userId}`);
      const user = response.data.user || response.data;
      set({ loading: false, error: null });
      return user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch user details';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  
  createUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/api/users', userData);
      
      set({ loading: false, error: null });

      
      const { fetchUsers } = get();
      await fetchUsers();

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create user';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  
  setSearchTerm: (term) => set({ searchTerm: term }),

 
  setFilters: (filters) => set(state => ({
    filters: { ...state.filters, ...filters }
  })),

  
  clearFilters: () => set({
    searchTerm: '',
    filters: { role: '', name: '', email: '', address: '' }
  }),

  
  getFilteredUsers: () => {
    const { users, searchTerm, filters } = get();
    return users.filter(user => {
      const matchesSearch = !searchTerm ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.address?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters =
        (!filters.role || user.role === filters.role) &&
        (!filters.name || user.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.email || user.email?.toLowerCase().includes(filters.email.toLowerCase())) &&
        (!filters.address || user.address?.toLowerCase().includes(filters.address.toLowerCase()));

      return matchesSearch && matchesFilters;
    });
  },

 
  getDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/api/dashboard');
      set({ loading: false, error: null });
      return response.data;
    } catch (error) {
      
      const { users } = get();
      const dashboardData = {
        totalUsers: users.length,
        totalStores: 0,
        totalRatings: 0 
      };
      set({ loading: false, error: null });
      return dashboardData;
    }
  },

  
  clearError: () => set({ error: null }),
}));

export default useUserStore;