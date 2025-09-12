import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import useAuthStore from './stores/authStore';

function App() {
  const { checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    
    checkAuth();
  }, [checkAuth]);

  
  const getDefaultRoute = () => {
    if (!isAuthenticated || !user || !user.role) return '/login';

    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'store_owner':
        return '/store-owner';
      case 'user':
      default:
        return '/dashboard';
    }
  };

  return (
    <Router>
      <Routes>
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/store-owner"
          element={
            <ProtectedRoute allowedRoles={['store_owner']}>
              <StoreOwnerDashboard />
            </ProtectedRoute>
          }
        />

        
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

       
        <Route path="/404" element={<NotFound />} />

      
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App
