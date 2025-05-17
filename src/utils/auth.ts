import { jwtDecode } from 'jwt-decode';

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return false;
  }
  
  try {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    return decodedToken.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getStoredUser = (): any => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = (user: any): void => {
  localStorage.setItem('user', JSON.stringify(user));
};