import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { RegisterFormData } from '../../types';
import { useAuth } from '../../context/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { UserPlus } from 'lucide-react';

const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData & { confirmPassword: string }>();

  const onSubmit = async (data: RegisterFormData & { confirmPassword: string }) => {
    setIsLoading(true);
    setError(null);
    
    const { confirmPassword, ...formData } = data;
    
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const password = watch('password', '');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">Create an Account</h2>
      
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <Input
        id="name"
        type="text"
        label="Full Name"
        fullWidth
        placeholder="Enter your name"
        error={errors.name?.message}
        {...registerField('name', {
          required: 'Name is required',
          minLength: {
            value: 2,
            message: 'Name must be at least 2 characters',
          },
        })}
      />
      
      <Input
        id="email"
        type="email"
        label="Email"
        fullWidth
        placeholder="Enter your email"
        error={errors.email?.message}
        {...registerField('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        })}
      />
      
      <Input
        id="password"
        type="password"
        label="Password"
        fullWidth
        placeholder="Create a password"
        error={errors.password?.message}
        {...registerField('password', {
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
          },
        })}
      />
      
      <Input
        id="confirmPassword"
        type="password"
        label="Confirm Password"
        fullWidth
        placeholder="Confirm your password"
        error={errors.confirmPassword?.message}
        {...registerField('confirmPassword', {
          required: 'Please confirm your password',
          validate: (value) => value === password || 'Passwords do not match',
        })}
      />
      
      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isLoading}
        leftIcon={<UserPlus size={18} />}
      >
        Register
      </Button>
      
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Log In
        </button>
      </p>
    </form>
  );
};

export default RegisterForm;