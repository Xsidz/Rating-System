import React, { useState, useEffect, useCallback } from 'react';
import { validateName, validateEmail, validatePassword, validateAddress } from '../lib/validation';


const FormInput = ({
  type = 'text',
  name,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  validationType,
  className = '',
  disabled = false,
  icon,
  helpText,
  ...props
}) => {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);


  const validationFunctions = {
    name: validateName,
    email: validateEmail,
    password: validatePassword,
    address: validateAddress,
  };


  const validateInput = useCallback((inputValue) => {
    if (!validationType) return { isValid: true, error: '' };

    const validationFn = validationFunctions[validationType];
    if (!validationFn) return { isValid: true, error: '' };

    return validationFn(inputValue);
  }, [validationType, validationFunctions]);

  
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(e);

    // Only validate if the field has been touched
    if (touched) {
      const validation = validateInput(newValue);
      setError(validation.error);
    }
  };

  // Handle blur event to mark field as touched
  const handleBlur = () => {
    setTouched(true);
    setFocused(false);
    const validation = validateInput(value);
    setError(validation.error);
  };

  // Handle focus event
  const handleFocus = () => {
    setFocused(true);
  };

  // Validate when value changes externally
  useEffect(() => {
    if (touched) {
      const validation = validateInput(value);
      setError(validation.error);
    }
  }, [value, touched, validateInput]);

  const hasError = error && touched;
  const hasValue = value && value.length > 0;
  const isValid = touched && !error && hasValue;

  const inputClasses = `
    w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 
    ${hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50'
      : isValid
        ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20 bg-green-50/50'
        : focused
          ? 'border-blue-300 focus:border-blue-500 focus:ring-blue-500/20 bg-blue-50/50'
          : 'border-gray-300 hover:border-gray-400 bg-white'
    }
    ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
    ${icon ? 'pl-11' : ''}
    ${className}
  `.trim();

  const InputComponent = type === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="mb-6">
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className={`w-5 h-5 transition-colors duration-200 ${hasError ? 'text-red-400' : isValid ? 'text-green-400' : focused ? 'text-blue-400' : 'text-gray-400'
              }`}>
              {icon}
            </div>
          </div>
        )}

        <InputComponent
          type={type === 'textarea' ? undefined : type}
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={inputClasses}
          rows={type === 'textarea' ? 4 : undefined}
          {...props}
        />

        
        {(hasError || isValid) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {hasError ? (
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : isValid ? (
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : null}
          </div>
        )}
      </div>

      
      {hasError && (
        <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      
      {helpText && !hasError && (
        <p className="mt-2 text-sm text-gray-500">{helpText}</p>
      )}

      
      {validationType === 'password' && !hasError && focused && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-2">Password requirements:</p>
          <ul className="space-y-1 text-sm text-blue-700">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              8-16 characters long
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              At least one uppercase letter
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              At least one special character
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default FormInput;