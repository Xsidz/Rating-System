import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import StoreCard from '../components/StoreCard';
import PasswordUpdateForm from '../components/PasswordUpdateForm';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import LoadingSpinner from '../components/LoadingSpinner';
import useAuthStore from '../stores/authStore';
import useStoreStore from '../stores/storeStore';
import useRatingStore from '../stores/ratingStore';


const UserDashboard = () => {
  const { user } = useAuthStore();
  const {
    stores,
    loading: storesLoading,
    error: storesError,
    fetchStores,
    setSearchTerm,
    searchTerm,
    getFilteredStores
  } = useStoreStore();
  const { fetchUserRatings } = useRatingStore();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  // Fetch data on component load
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchStores(),
          fetchUserRatings()
        ]);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    loadData();
  }, [fetchStores, fetchUserRatings]);

  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setSearchTerm(value);
  };

  
  const handlePasswordUpdateSuccess = () => {
    setShowPasswordForm(false);
    setSuccessMessage('Password updated successfully!');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  
  const filteredStores = getFilteredStores();

  return (
    <Layout>
      <PageHeader
        title="User Dashboard"
        subtitle={`Welcome back, ${user?.name}`}
      />

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">{successMessage}</p>
        </div>
      )}

      
      <div className="mb-6 sm:mb-8">
        <Card>
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="flex-1 min-w-0">
              <FormInput
                type="text"
                name="search"
                placeholder="Search stores..."
                value={searchInput}
                onChange={handleSearchChange}
                className="mb-0"
              />
            </div>
            <div className="flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => setShowPasswordForm(true)}
                size="md"
                className="w-full sm:w-auto"
              >
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-6 6c-3 0-5.5-1.5-5.5-4a3.5 3.5 0 117 0A6 6 0 0112 15a6 6 0 01-6-6 2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2m-6 4h4" />
                </svg>
                <span className="hidden sm:inline">Update Password</span>
                <span className="sm:hidden">Password</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Store Listings */}
      <div className="space-y-6">
        
        {storesLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading stores..." />
          </div>
        )}

        
        {storesError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">Error loading stores: {storesError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchStores()}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        
        {!storesLoading && !storesError && (
          <>
         
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
              <div className="min-w-0 flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                  {searchTerm ? 'Search Results' : 'Discover Stores'}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {searchTerm ? `Results for "${searchTerm}"` : 'Find and rate your favorite local stores'}
                </p>
              </div>
              <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-4 flex-shrink-0">
                <span className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium whitespace-nowrap">
                  {filteredStores.length} {filteredStores.length === 1 ? 'store' : 'stores'}
                </span>
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchInput('');
                      setSearchTerm('');
                    }}
                    className="text-xs sm:text-sm"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear
                  </Button>
                )}
              </div>
            </div>

            
            {filteredStores.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredStores.map((store) => (
                  <StoreCard key={store.id} store={store} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No stores found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm
                    ? `No stores match your search for "${searchTerm}"`
                    : 'No stores are available at the moment'
                  }
                </p>
                {searchTerm && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchInput('');
                      setSearchTerm('');
                    }}
                    className="mt-3"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      
      {showPasswordForm && (
        <PasswordUpdateForm
          onClose={() => setShowPasswordForm(false)}
          onSuccess={handlePasswordUpdateSuccess}
        />
      )}
    </Layout>
  );
};

export default UserDashboard;