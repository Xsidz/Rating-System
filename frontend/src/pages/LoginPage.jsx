import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from '../stores/authStore';
import { Button, Card, ErrorMessage } from '../components';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

 
  const navigate = useNavigate();
  const { login, loading, error, isAuthenticated, user, clearError } = useAuthStore();


  useEffect(() => {
    if (isAuthenticated && user && user.role) {
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
  }, [isAuthenticated, user, navigate]);

  
  useEffect(() => {
    clearError();
  }, [clearError]);

  
  const validateEmail = (email) => {
    if (!email || email.trim() === '') {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    
    
    if (!password || password.trim() === '') {
      return 'Password is required';
    }
    return '';
  };

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

 
  const validateForm = () => {
    const newErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (validateForm()) {
      try {
        const user = await login(formData.email, formData.password);

        
        if (user && user.role) {
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
        } else {
          
          navigate('/dashboard');
        }
      } catch (error) {
        
        console.error('Login failed:', error);
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
       
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Welcome back
          </h2>
          <p className="mt-3 text-gray-600 text-lg">Sign in to your Rating System account</p>
        </div>

        <Card gradient shadow="lg" className="mt-8">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
           
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            
            {error && (
              <ErrorMessage message={error} />
            )}

            <div>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || loading}
                loading={isSubmitting || loading}
                className="w-full"
                size="lg"
              >
                Sign in
              </Button>
            </div>

            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;