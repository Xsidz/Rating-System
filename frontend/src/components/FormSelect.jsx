import React, { useState } from 'react';


const FormSelect = ({
  name,
  label,
  value,
  onChange,
  options = [],
  required = false,
  className = '',
  disabled = false,
  placeholder = 'Select an option...',
  ...props
}) => {
  const [touched, setTouched] = useState(false);

  const handleChange = (e) => {
    onChange(e);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const hasError = required && touched && !value;
  const selectClasses = `
    w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
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
      
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        required={required}
        disabled={disabled}
        className={selectClasses}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {hasError && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          This field is required
        </p>
      )}
    </div>
  );
};

export default FormSelect;