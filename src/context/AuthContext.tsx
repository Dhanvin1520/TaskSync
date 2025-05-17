import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../utils/api';
import { setAuthToken, removeAuthToken, getStoredUser, setStoredUser, isAuthenticated } from '../utils/auth';
import type { AuthState, LoginFormData, RegisterFormData, User } from '../types';

// Define action types
type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_REQUEST' }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'LOAD_USER' }
  | { type: 'AUTH_ERROR' };

// Initial state
const initialState: AuthState = {
  user: getStoredUser(),
  token: localStorage.getItem('token'),
  isAuthenticated: isAuthenticated(),
  isLoading: false,
  error: null,
};

// Create the auth context
const AuthContext = createContext<{
  state: AuthState;
  login: (formData: LoginFormData) => Promise<void>;
  register: (formData: RegisterFormData) => Promise<void>;
  logout: () => void;
}>({
  state: initialState,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'REGISTER_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case 'LOGOUT':
    case 'AUTH_ERROR':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
      };
    case 'LOAD_USER':
      return {
        ...state,
        isLoading: true,
      };
    default:
      return state;
  }
};

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Login function
  const login = async (formData: LoginFormData) => {
    dispatch({ type: 'LOGIN_REQUEST' });

    try {
      const res = await api.post('/auth/login', formData);
      const { token, user } = res.data;

      setAuthToken(token);
      setStoredUser(user);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      });
      
      removeAuthToken();
      throw new Error(errorMessage);
    }
  };

  // Register function
  const register = async (formData: RegisterFormData) => {
    dispatch({ type: 'REGISTER_REQUEST' });

    try {
      const res = await api.post('/auth/register', formData);
      const { token, user } = res.data;

      setAuthToken(token);
      setStoredUser(user);

      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: { user, token },
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: errorMessage,
      });
      
      removeAuthToken();
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = () => {
    removeAuthToken();
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);