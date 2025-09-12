import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import PasswordUpdateForm from '../components/PasswordUpdateForm';
import useAuthStore from '../stores/authStore';
import useRatingStore from '../stores/ratingStore';
import useStoreStore from '../stores/storeStore';

const StoreOwnerDashboard = () => {
  const { user } = useAuthStore();
  const {
    storeRatings,
    loading: ratingsLoading,
    error: ratingsError,
    fetchStoreRatings
  } = useRatingStore();
  const {
    stores,
    loading: storesLoading,
    error: storesError,
    fetchStores
  } = useStoreStore();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [userStore, setUserStore] = useState(null);
  const [storeAnalytics, setStoreAnalytics] = useState({
    averageRating: 0,
    totalRatings: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });

  // Check if user has store_owner role
  if (user && user.role !== 'store_owner') {
    return (
      <Layout>
        <PageHeader
          title="Access Denied"
          subtitle="Store Owner Dashboard"
        />
        <Card>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">You do not have permission to access this page.</p>
            <p className="text-sm text-gray-500">
              This page is only available to store owners.
            </p>
          </div>
        </Card>
      </Layout>
    );
  }

  // Find the store owned by the current user
  useEffect(() => {
    const loadStoreData = async () => {
      try {
        await fetchStores();
      } catch (error) {
        console.error('Failed to fetch stores:', error);
      }
    };

    if (user?.id) {
      loadStoreData();
    }
  }, [user?.id, fetchStores]);

  // Find user's store and fetch ratings
  useEffect(() => {
    if (stores.length > 0 && user?.id) {
      const ownedStore = stores.find(store => store.owner_id === user.id);
      if (ownedStore) {
        setUserStore(ownedStore);
        fetchStoreRatings(ownedStore.id);
      }
    }
  }, [stores, user?.id, fetchStoreRatings]);

  
  useEffect(() => {
    if (storeRatings.length > 0) {
      const totalRatings = storeRatings.length;
      const sumRatings = storeRatings.reduce((sum, rating) => sum + rating.rating, 0);
      const averageRating = totalRatings > 0 ? (sumRatings / totalRatings) : 0;

      // Calculate rating distribution
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      storeRatings.forEach(rating => {
        distribution[rating.rating] = (distribution[rating.rating] || 0) + 1;
      });

      setStoreAnalytics({
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalRatings,
        ratingDistribution: distribution
      });
    } else {
      setStoreAnalytics({
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    }
  }, [storeRatings]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStarRating = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  if (storesLoading || ratingsLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (storesError || ratingsError) {
    return (
      <Layout>
        <ErrorMessage message={storesError || ratingsError} />
      </Layout>
    );
  }

  if (!userStore) {
    return (
      <Layout>
        <PageHeader
          title="Store Owner Dashboard"
          subtitle={`Welcome back, ${user?.name}`}
        />
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No store found for your account.</p>
            <p className="text-sm text-gray-500">
              Please contact an administrator to set up your store.
            </p>
          </div>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="Store Owner Dashboard"
        subtitle={`Welcome back, ${user?.name}`}
      />

      
      <div className="mb-6">
        <Card>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{userStore.name}</h2>
              <p className="text-gray-600 mb-1">{userStore.address}</p>
              <p className="text-gray-600">{userStore.email}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPasswordForm(true)}
            >
              Update Password
            </Button>
          </div>
        </Card>
      </div>

     
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card hover gradient className="group sm:col-span-2 lg:col-span-2">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:text-blue-700 transition-colors duration-200">
              {storeAnalytics.averageRating}
            </div>
            <div className="text-sm font-medium text-gray-600 mb-3">Average Rating</div>
            <div className="flex justify-center">
              {renderStarRating(storeAnalytics.averageRating)}
            </div>
          </div>
        </Card>

        <Card hover gradient className="group sm:col-span-2 lg:col-span-2">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-green-600 group-hover:to-green-700 transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-2 group-hover:text-green-700 transition-colors duration-200">
              {storeAnalytics.totalRatings}
            </div>
            <div className="text-sm font-medium text-gray-600 mb-3">Total Reviews</div>
            <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block">
              Customer Feedback
            </div>
          </div>
        </Card>
      </div>

      {/* Rating Distribution Rating wise &$id*/}
      <div className="mb-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = storeAnalytics.ratingDistribution[rating] || 0;
              const percentage = storeAnalytics.totalRatings > 0
                ? (count / storeAnalytics.totalRatings) * 100
                : 0;

              return (
                <div key={rating} className="flex items-center">
                  <div className="flex items-center w-16">
                    <span className="text-sm font-medium text-gray-700">{rating}</span>
                    <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-sm text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Customer Ratings List */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Ratings</h3>

        {storeRatings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No ratings yet for your store.</p>
            <p className="text-sm text-gray-500 mt-2">
              Ratings from customers will appear here once they start rating your store.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {storeRatings.map((rating) => (
                  <tr key={rating.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {rating.user_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {rating.user_email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStarRating(rating.rating)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(rating.created_at)}
                      {rating.updated_at && rating.updated_at !== rating.created_at && (
                        <div className="text-xs text-gray-400">
                          Updated: {formatDate(rating.updated_at)}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      
      {showPasswordForm && (
        <PasswordUpdateForm
          onClose={() => setShowPasswordForm(false)}
          onSuccess={() => setShowPasswordForm(false)}
        />
      )}
    </Layout>
  );
};

export default StoreOwnerDashboard;