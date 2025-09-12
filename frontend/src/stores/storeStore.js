import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';

// Store  for managing store data and operations
const useStoreStore = create((set, get) => ({
  stores: [],
  loading: false,
  error: null,
  searchTerm: '',
  filters: {
    name: '',
    email: '',
    address: '',
    role: ''
  },

  
  fetchStores: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/api/stores/stores');
      const stores = (response.data.stores || response.data).map(store => ({
        ...store,
        averageRating: parseFloat(store.avgRating) || 0,
        totalRatings: parseInt(store.totalRatings) || 0
      }));
      set({
        stores,
        loading: false,
        error: null
      });
      return stores;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch stores';
      set({
        stores: [],
        loading: false,
        error: errorMessage
      });
      throw error;
    }
  },

  
  createStore: async (storeData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/api/stores/stores', storeData);
      
      set({ loading: false, error: null });

      
      const { fetchStores } = get();
      await fetchStores();

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create store';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  
  getStoreById: (storeId) => {
    const { stores } = get();
    return stores.find(store => store.id === storeId);
  },

  
  setSearchTerm: (term) => set({ searchTerm: term }),

  
  setFilters: (filters) => set(state => ({
    filters: { ...state.filters, ...filters }
  })),

 
  clearFilters: () => set({
    searchTerm: '',
    filters: { name: '', email: '', address: '', role: '' }
  }),

  
  getFilteredStores: () => {
    const { stores, searchTerm, filters } = get();
    return stores.filter(store => {
      const matchesSearch = !searchTerm ||
        store.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters =
        (!filters.name || store.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.email || store.email?.toLowerCase().includes(filters.email.toLowerCase())) &&
        (!filters.address || store.address?.toLowerCase().includes(filters.address.toLowerCase())) &&
        (!filters.role || store.role === filters.role);

      return matchesSearch && matchesFilters;
    });
  },

  
  getStoresWithRatings: () => {
    const { stores } = get();
    return stores.map(store => ({
      ...store,
      averageRating: store.averageRating || 0,
      totalRatings: store.totalRatings || 0
    }));
  },

  
  getStoreByOwnerId: (ownerId) => {
    const { stores } = get();
    return stores.find(store => store.owner_id === ownerId);
  },


  clearError: () => set({ error: null }),
}));

export default useStoreStore;