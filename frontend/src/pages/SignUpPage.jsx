import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { validateName, validateEmail, validatePassword, validateAddress } from '../lib/validation';
import useAuthStore from '../stores/authStore';
import { Button, Card, ErrorMessage } from '../components';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, loading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user' 
  });
  const [errors, setErrors] = useState({});

 


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

  
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

        
  const validateForm = () => {
    const newErrors = {};

    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) newErrors.name = nameValidation.error;

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) newErrors.email = emailValidation.error;

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) newErrors.password = passwordValidation.error;

    const addressValidation = validateAddress(formData.address);
    if (!addressValidation.isValid) newErrors.address = addressValidation.error;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        
        const user = await signup({
          Name: formData.name,
          Email: formData.email,
          Password: formData.password,
          Address: formData.address
          
        });

        console.log('Signup successful:', user);
        alert('Account created successfully! You are now logged in.');

        
        
        navigate('/dashboard');

      } catch (error) {
        console.error('Signup error:', error);
        
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">

        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Create your account
          </h2>
          <p className="mt-3 text-gray-600 text-lg">Join the Rating System community</p>
        </div>

        <Card gradient shadow="lg" className="mt-8">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
              <div className="flex justify-between text-xs mt-1">
                <span className="text-gray-500">Minimum 20 characters</span>
                <span className={`${formData.name.length > 60 ? 'text-red-600' : 'text-gray-500'}`}>
                  {formData.name.length}/60
                </span>
              </div>
            </div>

            
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Create a secure password"
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
              <p className="mt-1 text-xs text-gray-500">
                8-16 characters • Uppercase letter • Special character
              </p>
            </div>

            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                required
                value={formData.address}
                onChange={handleInputChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm resize-none"
                placeholder="Enter your address"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
              <div className="text-right mt-1">
                <span className={`text-xs ${formData.address.length > 400 ? 'text-red-600' : 'text-gray-500'}`}>
                  {formData.address.length}/400
                </span>
              </div>
            </div>

            
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-500 underline"
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-500 underline"
                >
                  Privacy Policy
                </button>
              </label>
            </div>

            
            {error && (
              <ErrorMessage message={error} />
            )}

            
            <div>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                loading={loading}
                className="w-full"
                size="lg"
              >
                Create account
              </Button>
            </div>

            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;