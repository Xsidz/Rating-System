/**
 * Common store state management utilities
 */

// Set loading and error state
export const setLoading = (set, loading, error = null) => {
  set({ loading, error });
};

// Handle error with message extraction
export const handleStoreError = (error, defaultMessage) => {
  return error.response?.data?.message || defaultMessage;
};

// Create a generic fetch handler
export const createFetchHandler = async (set, fetchFn, errorMessage) => {
  set({ loading: true, error: null });
  try {
    const result = await fetchFn();
    set({ loading: false, error: null });
    return result;
  } catch (error) {
    const errorMsg = handleStoreError(error, errorMessage);
    set({ loading: false, error: errorMsg });
    throw error;
  }
};

// Common filter logic for search and filters
export const applyFilters = (items, searchTerm, filters, searchFields) => {
  return items.filter(item => {
    // Apply search across specified fields
    const matchesSearch = !searchTerm || searchFields.some(field =>
      item[field]?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply filters
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      if (typeof value === 'string') {
        return item[key]?.toLowerCase().includes(value.toLowerCase());
      }
      return item[key] === value;
    });

    return matchesSearch && matchesFilters;
  });
};
