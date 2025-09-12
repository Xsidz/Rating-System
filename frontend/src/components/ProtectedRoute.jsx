import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, checkAuth, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    
    if (!isAuthenticated && !loading) {
      checkAuth();
    }
  }, [isAuthenticated, loading, checkAuth]);

  useEffect(() => {
    
    if (!loading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check role permissions
    if (!loading && isAuthenticated && user && user.role && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role)) {
        
        switch (user.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'store_owner':
            navigate('/store-owner');
            break;
          case 'user':
          default:
            navigate('/dashboard');
            break;
        }
      }
    }
  }, [loading, isAuthenticated, user, allowedRoles, navigate]);

  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-600 border-t-transparent"></div>
          <span className="text-slate-600">Loading...</span>
        </div>
      </div>
    );
  }

  
  if (!isAuthenticated || (allowedRoles.length > 0 && user && user.role && !allowedRoles.includes(user.role))) {
    return null;
  }

  return children;
};

export default ProtectedRoute;