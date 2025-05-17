import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { CheckSquare } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { state } = useAuth();


  if (state.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 sm:space-y-10">
          <div className="text-center">
            <div className="flex justify-center">
              <CheckSquare size={48} className="text-blue-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              TaskFlow
            </h2>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Sign in to manage your tasks efficiently
            </p>
          </div>


          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <LoginForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;


