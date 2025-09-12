import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import PasswordInput from './PasswordInput';
import useAuthStore from '../stores/authStore';


const PasswordUpdateForm = ({ onClose, onSuccess }) => {
    const navigate = useNavigate();
    const { updatePassword, logout, loading, error } = useAuthStore();

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [formErrors, setFormErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.currentPassword) {
            errors.currentPassword = 'Current password is required';
        }

        if (!formData.newPassword) {
            errors.newPassword = 'New password is required';
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your new password';
        } else if (formData.newPassword !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            await updatePassword(formData.currentPassword, formData.newPassword);

           
            alert('Password updated successfully! Please log in again with your new password.');

           
            onClose();

            
            await logout();

            
            navigate('/login');

            
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Failed to update password:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                    
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Update Password</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    
                    <form onSubmit={handleSubmit}>
                        <PasswordInput
                            name="currentPassword"
                            label="Current Password"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            placeholder="Enter your current password"
                            required
                            error={formErrors.currentPassword}
                        />

                        <PasswordInput
                            name="newPassword"
                            label="New Password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            placeholder="Enter your new password"
                            showValidation={true}
                            required
                            error={formErrors.newPassword}
                        />

                        <PasswordInput
                            name="confirmPassword"
                            label="Confirm New Password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm your new password"
                            required
                            error={formErrors.confirmPassword}
                        />


                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1"
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={loading}
                                className="flex-1"
                            >
                                Update Password
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PasswordUpdateForm;