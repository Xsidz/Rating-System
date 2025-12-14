import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import { handleStoreError } from '../utils/storeHelpers.js';


const useRatingStore = create((set, get) => ({
  ratings: [],
  userRatings: [], 
  storeRatings: [], 
  loading: false,
  error: null,

  
  submitRating: async (ratingData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/api/ratings', ratingData);

      
      const newRating = {
        id: response.data.ratingId,
        store_id: ratingData.store_id,
        rating: ratingData.rating,
        created_at: new Date().toISOString()
      };

      
      const { addUserRating } = get();
      addUserRating(newRating);

      set({ loading: false, error: null });
      return newRating;
    } catch (error) {
      const errorMessage = handleStoreError(error, 'Failed to submit rating');
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  
  submitOrUpdateRating: async (storeId, rating) => {
    const { userRatings, submitRating, updateRating } = get();

    
    const existingRating = userRatings.find(r => r.store_id === storeId);

    if (existingRating) {
      
      return await updateRating(existingRating.id, { rating });
    } else {
      
      return await submitRating({ store_id: storeId, rating });
    }
  },

  
  updateRating: async (ratingId, ratingData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(`/api/ratings/${ratingId}`, ratingData);

      
      const { updateUserRating } = get();
      updateUserRating(ratingId, { rating: ratingData.rating, updated_at: new Date().toISOString() });

      set({ loading: false, error: null });
      return response.data;
    } catch (error) {
      const errorMessage = handleStoreError(error, 'Failed to update rating');
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  
  fetchStoreRatings: async (storeId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/api/ratings/stores/${storeId}`);
      set({
        storeRatings: response.data.ratings || response.data,
        loading: false,
        error: null
      });
      return response.data.ratings || response.data;
    } catch (error) {
      const errorMessage = handleStoreError(error, 'Failed to fetch store ratings');
      set({
        storeRatings: [],
        loading: false,
        error: errorMessage
      });
      throw error;
    }
  },

  
  addUserRating: (rating) => {
    set(state => ({
      userRatings: [...state.userRatings.filter(r => r.store_id !== rating.store_id), rating]
    }));
  },

  
  fetchUserRatings: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/api/ratings/user');
      set({
        userRatings: response.data.ratings || response.data,
        loading: false,
        error: null
      });
      return response.data.ratings || response.data;
    } catch (error) {
      const errorMessage = handleStoreError(error, 'Failed to fetch user ratings');
      set({
        userRatings: [],
        loading: false,
        error: errorMessage
      });
      throw error;
    }
  },

  
  updateUserRating: (ratingId, updatedRating) => {
    set(state => ({
      userRatings: state.userRatings.map(rating =>
        rating.id === ratingId ? { ...rating, ...updatedRating } : rating
      )
    }));
  },

  
  getUserRatingForStore: (userId, storeId) => {
    const { userRatings } = get();
    return userRatings.find(rating =>
      rating.store_id === storeId
    );
  },

  
  getStoreAverageRating: (storeId) => {
    const { ratings } = get();
    const storeRatings = ratings.filter(rating => rating.storeId === storeId);

    if (storeRatings.length === 0) return 0;

    const sum = storeRatings.reduce((acc, rating) => acc + rating.rating, 0);
    return (sum / storeRatings.length).toFixed(1);
  },

  // Get users who rated a specific store (for store owner view)
  getStoreRatingUsers: (storeId) => {
    const { storeRatings } = get();
    return storeRatings.filter(rating => rating.storeId === storeId)
      .map(rating => ({
        userId: rating.userId,
        userName: rating.userName || rating.user?.name,
        userEmail: rating.userEmail || rating.user?.email,
        rating: rating.rating,
        createdAt: rating.createdAt
      }));
  },

  
  clearUserRatings: () => set({ userRatings: [] }),
  clearStoreRatings: () => set({ storeRatings: [] }),


  clearError: () => set({ error: null }),
}));

export default useRatingStore;