import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute: React.FC = () => {
  const { state } = useAuth();
  
  if (state.isLoading) {
    return <div>Loading...</div>;
  }
  
  return state.isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;