import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const LogoutButton = ({ className = "", variant = "default" }) => {
  const { logout, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, redirect to login
      navigate('/login');
    }
  };

  const baseClasses = "flex items-center space-x-2 transition-colors duration-200";
  
  const variants = {
    default: "px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg",
    minimal: "text-gray-600 hover:text-red-600",
    sidebar: "w-full px-3 py-2 text-left text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md"
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`${baseClasses} ${variants[variant]} ${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <LogOut size={18} />
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;