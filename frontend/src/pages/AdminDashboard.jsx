import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import useAuthStore from '../stores/authStore';
import useUserStore from '../stores/userStore';
import useStoreStore from '../stores/storeStore';
import { validateForm } from '../lib/validation';


const AdminDashboard = () => {
  const { user } = useAuthStore();
  const {
    users,
    loading: userLoading,
    error: userError,
    fetchUsers,
    createUser,
    getFilteredUsers,
    setSearchTerm,
    setFilters,
    clearFilters,
    getDashboard
  } = useUserStore();

  const {
    stores,
    loading: storeLoading,
    error: storeError,
    fetchStores,
    createStore,
    getFilteredStores,
    setSearchTerm: setStoreSearchTerm,
    setFilters: setStoreFilters,
    clearFilters: clearStoreFilters
  } = useStoreStore();

  // Dashboard state
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });

  
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [createUserForm, setCreateUserForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: ''
  });
  const [createUserLoading, setCreateUserLoading] = useState(false);
  const [createUserError, setCreateUserError] = useState('');

  
  const [showCreateStoreModal, setShowCreateStoreModal] = useState(false);
  const [createStoreForm, setCreateStoreForm] = useState({
    name: '',
    email: '',
    address: '',
    owner_id: ''
  });
  const [createStoreLoading, setCreateStoreLoading] = useState(false);
  const [createStoreError, setCreateStoreError] = useState('');

  
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userFilters, setUserFilters] = useState({
    role: '',
    name: '',
    email: '',
    address: ''
  });

  const [storeSearchTerm, setStoreSearchTermLocal] = useState('');
  const [storeFilters, setStoreFiltersLocal] = useState({
    name: '',
    email: '',
    address: ''
  });

  
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        
        const dashboard = await getDashboard();
        setDashboardData({
          totalUsers: dashboard.totalUsers || users.length,
          totalStores: dashboard.totalStores || stores.length,
          totalRatings: dashboard.totalRatings || 0
        });
      } catch (error) {
       
        setDashboardData({
          totalUsers: users.length,
          totalStores: stores.length,
          totalRatings: 0
        });
      }
    };

    fetchUsers();
    fetchStores();
    loadDashboardData();
  }, [fetchUsers, fetchStores, getDashboard, users.length, stores.length]);



  
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateUserLoading(true);
    setCreateUserError('');

   
    const validation = validateForm(createUserForm);

    if (!validation.isValid) {
      const errorMessages = Object.values(validation.errors).join(', ');
      setCreateUserError(`Validation failed: ${errorMessages}`);
      setCreateUserLoading(false);
      return;
    }

    if (!createUserForm.name || !createUserForm.email || !createUserForm.password || !createUserForm.address || !createUserForm.role) {
      setCreateUserError('All fields are required');
      setCreateUserLoading(false);
      return;
    }

    try {
      await createUser(createUserForm);
      setShowCreateUserModal(false);
      setCreateUserForm({
        name: '',
        email: '',
        password: '',
        address: '',
        role: ''
      });
      // Update dashboard data with new user count
      setDashboardData(prev => ({
        ...prev,
        totalUsers: users.length
      }));
    } catch (error) {
      setCreateUserError(error.response?.data?.message || error.message || 'Failed to create user');
    } finally {
      setCreateUserLoading(false);
    }
  };

  // Handle user search and filters
  const handleUserSearch = (term) => {
    setUserSearchTerm(term);
    setSearchTerm(term);
  };

  const handleUserFilters = (newFilters) => {
    setUserFilters(prev => ({ ...prev, ...newFilters }));
    setFilters(newFilters);
  };

  const clearUserFilters = () => {
    setUserSearchTerm('');
    setUserFilters({ role: '', name: '', email: '', address: '' });
    clearFilters();
  };

 
  const handleCreateStore = async (e) => {
    e.preventDefault();
    setCreateStoreLoading(true);
    setCreateStoreError('');

    
    const storeOwners = users.filter(u => u.role === 'store_owner');
    if (storeOwners.length === 0) {
      setCreateStoreError('No store owners available. Please create a user with "Store Owner" role first.');
      setCreateStoreLoading(false);
      return;
    }

    
    if (!createStoreForm.name || !createStoreForm.email || !createStoreForm.address || !createStoreForm.owner_id) {
      setCreateStoreError('Name, email, address, and store owner are required');
      setCreateStoreLoading(false);
      return;
    }

    try {
      await createStore(createStoreForm);
      setShowCreateStoreModal(false);
      setCreateStoreForm({
        name: '',
        email: '',
        address: '',
        owner_id: ''
      });
      // Update dashboard data with new store count
      setDashboardData(prev => ({
        ...prev,
        totalStores: stores.length
      }));
    } catch (error) {
      setCreateStoreError(error.response?.data?.message || error.message || 'Failed to create store');
    } finally {
      setCreateStoreLoading(false);
    }
  };

  
  const handleStoreSearch = (term) => {
    setStoreSearchTermLocal(term);
    setStoreSearchTerm(term);
  };

  const handleStoreFilters = (newFilters) => {
    setStoreFiltersLocal(prev => ({ ...prev, ...newFilters }));
    setStoreFilters(newFilters);
  };

  const clearStoreFiltersHandler = () => {
    setStoreSearchTermLocal('');
    setStoreFiltersLocal({ name: '', email: '', address: '' });
    clearStoreFilters();
  };

  
  const filteredUsers = getFilteredUsers();
  const filteredStores = getFilteredStores();

  
  const roleOptions = [
    { value: 'user', label: 'Normal User' },
    { value: 'store_owner', label: 'Store Owner' },
    { value: 'admin', label: 'System Administrator' }
  ];

  return (
    <Layout>
      <PageHeader
        title="Admin Dashboard"
        subtitle={`Welcome back, ${user?.name}`}
        action={
          <Button
            onClick={() => setShowCreateUserModal(true)}
            className="ml-4"
          >
            Add New User
          </Button>
        }
      />

     
      <div className="mb-6 sm:mb-8">
        <Card className="p-1">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 text-center font-medium text-xs sm:text-sm transition-all duration-200 rounded-md ${activeTab === 'overview'
                ? 'bg-blue-50 text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Overview</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 text-center font-medium text-xs sm:text-sm transition-all duration-200 rounded-md ${activeTab === 'users'
                ? 'bg-blue-50 text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span>Users</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('stores')}
              className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 text-center font-medium text-xs sm:text-sm transition-all duration-200 rounded-md ${activeTab === 'stores'
                ? 'bg-blue-50 text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Stores</span>
              </div>
            </button>
          </nav>
        </Card>
      </div>

      
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card hover gradient className="group">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors duration-200">
                      {dashboardData.totalUsers}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Active
                  </span>
                </div>
              </div>
            </Card>

            <Card hover gradient className="group">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:from-green-600 group-hover:to-green-700 transition-all duration-300 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Stores</p>
                    <p className="text-3xl font-bold text-gray-900 group-hover:text-green-900 transition-colors duration-200">
                      {dashboardData.totalStores}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Listed
                  </span>
                </div>
              </div>
            </Card>

            <Card hover gradient className="group sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center group-hover:from-yellow-600 group-hover:to-yellow-700 transition-all duration-300 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Ratings</p>
                    <p className="text-3xl font-bold text-gray-900 group-hover:text-yellow-900 transition-colors duration-200">
                      {dashboardData.totalRatings}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Reviews
                  </span>
                </div>
              </div>
            </Card>
          </div>

          
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="text-sm font-medium text-gray-900">
                  {users.filter(u => u.role === 'user').length}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Store Owners</span>
                <span className="text-sm font-medium text-gray-900">
                  {users.filter(u => u.role === 'store_owner').length}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">System Administrators</span>
                <span className="text-sm font-medium text-gray-900">
                  {users.filter(u => u.role === 'admin').length}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Registered Stores</span>
                <span className="text-sm font-medium text-gray-900">{stores.length}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Search and Filter Users</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <FormInput
                type="text"
                placeholder="Search users..."
                value={userSearchTerm}
                onChange={(e) => handleUserSearch(e.target.value)}
                className="mb-0"
              />
              <FormInput
                type="text"
                placeholder="Filter by name..."
                value={userFilters.name}
                onChange={(e) => handleUserFilters({ name: e.target.value })}
                className="mb-0"
              />
              <FormInput
                type="text"
                placeholder="Filter by email..."
                value={userFilters.email}
                onChange={(e) => handleUserFilters({ email: e.target.value })}
                className="mb-0"
              />
              <FormSelect
                value={userFilters.role}
                onChange={(e) => handleUserFilters({ role: e.target.value })}
                options={roleOptions}
                placeholder="Filter by role..."
                className="mb-0"
              />
              <Button variant="outline" onClick={clearUserFilters}>
                Clear Filters
              </Button>
            </div>
          </Card>

          {/* Users List */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Users ({filteredUsers.length})
              </h3>
            </div>

            {userLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner text="Loading users..." />
              </div>
            ) : userError ? (
              <div className="p-6">
                <ErrorMessage message={userError} />
              </div>
            ) : (
              <div className="overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Address
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Store Rating
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${user.role === 'admin'
                              ? 'bg-red-100 text-red-800'
                              : user.role === 'store_owner'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                              }`}>
                              {user.role === 'store_owner' ? 'Store Owner' :
                                user.role === 'admin' ? 'Admin' : 'User'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {user.address}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.role === 'store_owner' ? (
                              (() => {
                                const avgRating = parseFloat(user.averageRating) || 0;
                                const totalRatings = parseInt(user.totalRatings) || 0;

                                return avgRating > 0 ? (
                                  <div className="flex items-center">
                                    <span className="text-yellow-400 mr-1">★</span>
                                    <span className="font-medium">{avgRating.toFixed(1)}</span>
                                    <span className="text-gray-400 ml-1">({totalRatings})</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">No ratings yet</span>
                                );
                              })()
                            ) : (
                              '-'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {filteredUsers.map((user) => (
                    <Card key={user.id} className="p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin'
                          ? 'bg-red-100 text-red-800'
                          : user.role === 'store_owner'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                          }`}>
                          {user.role === 'store_owner' ? 'Store Owner' :
                            user.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{user.address}</p>
                      {user.role === 'store_owner' && (
                        <div className="flex items-center">
                          {(() => {
                            const avgRating = parseFloat(user.averageRating) || 0;
                            const totalRatings = parseInt(user.totalRatings) || 0;

                            return avgRating > 0 ? (
                              <div className="flex items-center">
                                <span className="text-yellow-400 mr-1">★</span>
                                <span className="font-medium text-sm">{avgRating.toFixed(1)}</span>
                                <span className="text-gray-400 ml-1 text-sm">({totalRatings})</span>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">No ratings yet</span>
                            );
                          })()}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                    <p className="text-gray-500">No users match your current search criteria.</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Store Management Tab */}
      {activeTab === 'stores' && (
        <div className="space-y-6">
          
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Search and Filter Stores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormInput
                type="text"
                placeholder="Search stores..."
                value={storeSearchTerm}
                onChange={(e) => handleStoreSearch(e.target.value)}
                className="mb-0"
              />
              <FormInput
                type="text"
                placeholder="Filter by name..."
                value={storeFilters.name}
                onChange={(e) => handleStoreFilters({ name: e.target.value })}
                className="mb-0"
              />
              <FormInput
                type="text"
                placeholder="Filter by email..."
                value={storeFilters.email}
                onChange={(e) => handleStoreFilters({ email: e.target.value })}
                className="mb-0"
              />
              <Button variant="outline" onClick={clearStoreFiltersHandler}>
                Clear Filters
              </Button>
            </div>
          </Card>

          {/* Stores List */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Stores ({filteredStores.length})
              </h3>
              <Button
                onClick={() => setShowCreateStoreModal(true)}
                disabled={users.filter(u => u.role === 'store_owner').length === 0}
                title={users.filter(u => u.role === 'store_owner').length === 0 ? 'Create a store owner first' : 'Add new store'}
              >
                Add New Store
              </Button>
            </div>

            {storeLoading ? (
              <LoadingSpinner text="Loading stores..." />
            ) : storeError ? (
              <ErrorMessage message={storeError} />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Ratings
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStores.map((store) => (
                      <tr key={store.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {store.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {store.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {store.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {store.averageRating ? (
                            <div className="flex items-center">
                              <span className="text-yellow-400 mr-1">★</span>
                              {store.averageRating.toFixed(1)}
                            </div>
                          ) : (
                            <span className="text-gray-400">No ratings</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {store.totalRatings || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredStores.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No stores found matching your criteria.
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      
      {showCreateUserModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className=""
              onClick={() => setShowCreateUserModal(false)}
            ></div>

            {/* Center modal */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-lg">
              {/* Header */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Add New User
                  </h3>
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setShowCreateUserModal(false)}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div>
                  <p className="mb-4 text-gray-600">Create a new user in the system.</p>
                </div>
                <form onSubmit={handleCreateUser}>
                  {createUserError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{createUserError}</p>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={createUserForm.name}
                      onChange={(e) => setCreateUserForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                      placeholder="Enter full name (20-60 characters)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={createUserForm.email}
                      onChange={(e) => setCreateUserForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                      placeholder="Enter email address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={createUserForm.password}
                      onChange={(e) => setCreateUserForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                      placeholder="Enter password (8-16 characters)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={createUserForm.address}
                      onChange={(e) => setCreateUserForm(prev => ({ ...prev, address: e.target.value }))}
                      required
                      placeholder="Enter address (max 400 characters)"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="role"
                      value={createUserForm.role}
                      onChange={(e) => setCreateUserForm(prev => ({ ...prev, role: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select user role</option>
                      <option value="user">Normal User</option>
                      <option value="store_owner">Store Owner</option>
                      <option value="admin">System Administrator</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowCreateUserModal(false)}
                      disabled={createUserLoading}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createUserLoading}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {createUserLoading ? 'Creating...' : 'Create User'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      
      {showCreateStoreModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            
            <div
              className=""
              onClick={() => setShowCreateStoreModal(false)}
            ></div>

            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-lg">
              
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Add New Store
                  </h3>
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setShowCreateStoreModal(false)}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div>
                  <p className="mb-4 text-gray-600">Create a new store in the system.</p>
                </div>
                <form onSubmit={handleCreateStore}>
                  {createStoreError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{createStoreError}</p>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Store Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={createStoreForm.name}
                      onChange={(e) => setCreateStoreForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                      placeholder="Enter store name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={createStoreForm.email}
                      onChange={(e) => setCreateStoreForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                      placeholder="Enter store email address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={createStoreForm.address}
                      onChange={(e) => setCreateStoreForm(prev => ({ ...prev, address: e.target.value }))}
                      required
                      placeholder="Enter store address"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {users.filter(u => u.role === 'store_owner').length > 0 ? (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Store Owner <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="owner_id"
                        value={createStoreForm.owner_id}
                        onChange={(e) => setCreateStoreForm(prev => ({ ...prev, owner_id: e.target.value }))}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select store owner</option>
                        {users.filter(u => u.role === 'store_owner').map(u => (
                          <option key={u.id} value={u.id}>
                            {u.name} ({u.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Store Owner
                      </label>
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500">
                        No store owners available. Please create a user with 'Store Owner' role first.
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowCreateStoreModal(false)}
                      disabled={createStoreLoading}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createStoreLoading}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {createStoreLoading ? 'Creating...' : 'Create Store'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminDashboard;