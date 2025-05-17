import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../utils/api';
import type { Task, TaskFormData } from '../types';
import { useAuth } from './AuthContext';


interface TaskState {
  tasks: Task[];
  filteredTasks: Task[];
  activeTask: Task | null;
  isLoading: boolean;
  error: string | null;
  filter: {
    category: string | null;
    status: string | null;
    search: string;
  };
}


type TaskAction =
  | { type: 'FETCH_TASKS_REQUEST' }
  | { type: 'FETCH_TASKS_SUCCESS'; payload: Task[] }
  | { type: 'FETCH_TASKS_FAILURE'; payload: string }
  | { type: 'ADD_TASK_REQUEST' }
  | { type: 'ADD_TASK_SUCCESS'; payload: Task }
  | { type: 'ADD_TASK_FAILURE'; payload: string }
  | { type: 'UPDATE_TASK_REQUEST' }
  | { type: 'UPDATE_TASK_SUCCESS'; payload: Task }
  | { type: 'UPDATE_TASK_FAILURE'; payload: string }
  | { type: 'DELETE_TASK_REQUEST' }
  | { type: 'DELETE_TASK_SUCCESS'; payload: string }
  | { type: 'DELETE_TASK_FAILURE'; payload: string }
  | { type: 'SET_ACTIVE_TASK'; payload: Task | null }
  | { type: 'FILTER_TASKS'; payload: { category?: string | null; status?: string | null; search?: string } };


const initialState: TaskState = {
  tasks: [],
  filteredTasks: [],
  activeTask: null,
  isLoading: false,
  error: null,
  filter: {
    category: null,
    status: null,
    search: '',
  },
};


const TaskContext = createContext<{
  state: TaskState;
  fetchTasks: () => Promise<void>;
  addTask: (task: TaskFormData) => Promise<void>;
  updateTask: (id: string, task: Partial<TaskFormData>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setActiveTask: (task: Task | null) => void;
  filterTasks: (filters: { category?: string | null; status?: string | null; search?: string }) => void;
}>({
  state: initialState,
  fetchTasks: async () => {},
  addTask: async () => {},
  updateTask: async () => {},
  deleteTask: async () => {},
  setActiveTask: () => {},
  filterTasks: () => {},
});


const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'FETCH_TASKS_REQUEST':
    case 'ADD_TASK_REQUEST':
    case 'UPDATE_TASK_REQUEST':
    case 'DELETE_TASK_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_TASKS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        tasks: action.payload,
        filteredTasks: applyFilters(action.payload, state.filter),
        error: null,
      };
    case 'ADD_TASK_SUCCESS':
      return {
        ...state,
        isLoading: false,
        tasks: [action.payload, ...state.tasks],
        filteredTasks: applyFilters([action.payload, ...state.tasks], state.filter),
        error: null,
      };
    case 'UPDATE_TASK_SUCCESS':
      return {
        ...state,
        isLoading: false,
        tasks: state.tasks.map((task) => (task._id === action.payload._id ? action.payload : task)),
        filteredTasks: applyFilters(
          state.tasks.map((task) => (task._id === action.payload._id ? action.payload : task)),
          state.filter
        ),
        activeTask: state.activeTask?._id === action.payload._id ? action.payload : state.activeTask,
        error: null,
      };
    case 'DELETE_TASK_SUCCESS':
      return {
        ...state,
        isLoading: false,
        tasks: state.tasks.filter((task) => task._id !== action.payload),
        filteredTasks: applyFilters(state.tasks.filter((task) => task._id !== action.payload), state.filter),
        activeTask: state.activeTask?._id === action.payload ? null : state.activeTask,
        error: null,
      };
    case 'FETCH_TASKS_FAILURE':
    case 'ADD_TASK_FAILURE':
    case 'UPDATE_TASK_FAILURE':
    case 'DELETE_TASK_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'SET_ACTIVE_TASK':
      return {
        ...state,
        activeTask: action.payload,
      };
    case 'FILTER_TASKS':
      const newFilter = {
        ...state.filter,
        ...(action.payload.category !== undefined && { category: action.payload.category }),
        ...(action.payload.status !== undefined && { status: action.payload.status }),
        ...(action.payload.search !== undefined && { search: action.payload.search }),
      };
      return {
        ...state,
        filter: newFilter,
        filteredTasks: applyFilters(state.tasks, newFilter),
      };
    default:
      return state;
  }
};


const applyFilters = (
  tasks: Task[],
  filter: { category: string | null; status: string | null; search: string }
): Task[] => {
  return tasks.filter((task) => {

    if (filter.category && task.category !== filter.category) {
      return false;
    }
    
  
    if (filter.status && task.status !== filter.status) {
      return false;
    }
    
   
    if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });
};


export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { state: authState } = useAuth();


  const fetchTasks = async () => {
    if (!authState.isAuthenticated) return;
    
    dispatch({ type: 'FETCH_TASKS_REQUEST' });
    
    try {
      const res = await api.get('/tasks');
      dispatch({
        type: 'FETCH_TASKS_SUCCESS',
        payload: res.data,
      });
    } catch (error: any) {
      dispatch({
        type: 'FETCH_TASKS_FAILURE',
        payload: error.response?.data?.message || 'Failed to fetch tasks',
      });
    }
  };


  const addTask = async (task: TaskFormData) => {
    dispatch({ type: 'ADD_TASK_REQUEST' });
    
    try {
      const res = await api.post('/tasks', task);
      dispatch({
        type: 'ADD_TASK_SUCCESS',
        payload: res.data,
      });
    } catch (error: any) {
      dispatch({
        type: 'ADD_TASK_FAILURE',
        payload: error.response?.data?.message || 'Failed to add task',
      });
      throw error;
    }
  };

 
  const updateTask = async (id: string, task: Partial<TaskFormData>) => {
    dispatch({ type: 'UPDATE_TASK_REQUEST' });
    
    try {
      const res = await api.patch(`/tasks/${id}`, task);
      dispatch({
        type: 'UPDATE_TASK_SUCCESS',
        payload: res.data,
      });
    } catch (error: any) {
      dispatch({
        type: 'UPDATE_TASK_FAILURE',
        payload: error.response?.data?.message || 'Failed to update task',
      });
      throw error;
    }
  };

 
  const deleteTask = async (id: string) => {
    dispatch({ type: 'DELETE_TASK_REQUEST' });
    
    try {
      await api.delete(`/tasks/${id}`);
      dispatch({
        type: 'DELETE_TASK_SUCCESS',
        payload: id,
      });
    } catch (error: any) {
      dispatch({
        type: 'DELETE_TASK_FAILURE',
        payload: error.response?.data?.message || 'Failed to delete task',
      });
      throw error;
    }
  };


  const setActiveTask = (task: Task | null) => {
    dispatch({
      type: 'SET_ACTIVE_TASK',
      payload: task,
    });
  };


  const filterTasks = (filters: { category?: string | null; status?: string | null; search?: string }) => {
    dispatch({
      type: 'FILTER_TASKS',
      payload: filters,
    });
  };


  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchTasks();
    }
  }, [authState.isAuthenticated]);

  return (
    <TaskContext.Provider
      value={{
        state,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        setActiveTask,
        filterTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};


export const useTask = () => useContext(TaskContext);