export interface User {
    id: string;
    name: string;
    email: string;
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }
  
  export interface Task {
    _id: string;
    title: string;
    description: string;
    dueDate: string;
    category: 'Personal' | 'Work' | 'Urgent' | 'Other';
    status: 'pending' | 'in-progress' | 'completed';
    createdAt: string;
    updatedAt: string;
  }
  
  export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
  }
  
  export interface LoginFormData {
    email: string;
    password: string;
  }
  
  export interface TaskFormData {
    title: string;
    description: string;
    dueDate: string;
    category: 'Personal' | 'Work' | 'Urgent' | 'Other';
    status: 'pending' | 'in-progress' | 'completed';
  }