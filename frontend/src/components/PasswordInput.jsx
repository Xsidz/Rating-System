import React, { useState } from 'react';
import { validatePassword } from '../lib/validation';

const PasswordInput = ({
    name,
    label,
    value,
    onChange,
    placeholder,
    required = false,
    showValidation = false,
    className = '',
    disabled = false,
    error = '',
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState(false);
    const [validationError, setValidationError] = useState('');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const newValue = e.target.value;
        onChange(e);

       
        if (showValidation && touched) {
            const validation = validatePassword(newValue);
            setValidationError(validation.error);
        }
    };

    const handleBlur = () => {
        setTouched(true);
        if (showValidation) {
            const validation = validatePassword(value);
            setValidationError(validation.error);
        }
    };

    const hasError = (error || validationError) && touched;
    const inputClasses = `
    w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
    ${hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    ${className}
  `.trim();

    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className={inputClasses}
                    {...props}
                />

                <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                    disabled={disabled}
                >
                    {showPassword ? (
                        <svg
                            className="h-5 w-5 text-gray-400 hover:text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="h-5 w-5 text-gray-400 hover:text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                        </svg>
                    )}
                </button>
            </div>

            {hasError && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error || validationError}
                </p>
            )}

          
            {showValidation && !hasError && touched && (
                <div className="mt-1 text-xs text-gray-500">
                    <p>Password requirements:</p>
                    <ul className="list-disc list-inside ml-2">
                        <li>8-16 characters long</li>
                        <li>At least one uppercase letter</li>
                        <li>At least one special character</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PasswordInput;