import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      fullWidth = false,
      className = '',
      labelClassName = '',
      inputClassName = '',
      errorClassName = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && (
          <label
            htmlFor={props.id}
            className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm 
            placeholder-gray-400 focus:outline-none focus:ring-blue-500 
            focus:border-blue-500 sm:text-sm ${fullWidth ? 'w-full' : ''}
            ${error ? 'border-red-500' : ''}
            ${inputClassName}
          `}
          {...props}
        />
        {error && (
          <p className={`mt-1 text-sm text-red-600 ${errorClassName}`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;