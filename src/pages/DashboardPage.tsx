import React, { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import TaskFilter from '../components/tasks/TaskFilter';
import Modal from '../components/common/Modal';
import Button from '../components/ui/Button';
import type { Task, TaskFormData } from '../types';
import { Plus, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardPage: React.FC = () => {
  const { state, addTask, updateTask, deleteTask, fetchTasks, setActiveTask, filterTasks } = useTask();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleAddTask = async (data: TaskFormData) => {
    setIsLoading(true);
    try {
      await addTask(data);
      toast.success('Task created successfully');
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async (data: TaskFormData) => {
    if (!state.activeTask) return;
    
    setIsLoading(true);
    try {
      await updateTask(state.activeTask._id, data);
      toast.success('Task updated successfully');
      setIsModalOpen(false);
      setActiveTask(null);
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setActiveTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        toast.success('Task deleted successfully');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchTasks();
      toast.success('Tasks refreshed');
    } catch (error) {
      toast.error('Failed to refresh tasks');
    } finally {
      setRefreshing(false);
    }
  };


  const statusCounts = {
    pending: state.tasks.filter(task => task.status === 'pending').length,
    'in-progress': state.tasks.filter(task => task.status === 'in-progress').length,
    completed: state.tasks.filter(task => task.status === 'completed').length,
  };

  useEffect(() => {
    document.title = 'Dashboard | TaskFlow';
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">My Tasks</h1>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                leftIcon={<RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />}
                isLoading={refreshing}
              >
                Refresh
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setActiveTask(null);
                  setIsModalOpen(true);
                }}
                leftIcon={<Plus size={18} />}
              >
                Add Task
              </Button>
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
              <p className="text-3xl font-bold text-gray-900">{state.tasks.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Pending</h3>
              <p className="text-3xl font-bold text-amber-600">{statusCounts.pending}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
              <p className="text-3xl font-bold text-blue-600">{statusCounts['in-progress']}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Completed</h3>
              <p className="text-3xl font-bold text-green-600">{statusCounts.completed}</p>
            </div>
          </div>

     
          <div className="mb-6">
            <TaskFilter
              onFilterChange={filterTasks}
              activeFilters={state.filter}
            />
          </div>

   
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              {state.isLoading ? (
                <div className="flex justify-center py-8">
                  <RefreshCw size={24} className="animate-spin text-blue-600" />
                </div>
              ) : (
                <TaskList
                  tasks={state.filteredTasks}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                />
              )}
            </div>
          </div>
        </div>
      </main>


      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setActiveTask(null);
        }}
        title={state.activeTask ? 'Edit Task' : 'Add New Task'}
      >
        <TaskForm
          task={state.activeTask || undefined}
          onSubmit={state.activeTask ? handleUpdateTask : handleAddTask}
          onCancel={() => {
            setIsModalOpen(false);
            setActiveTask(null);
          }}
          isLoading={isLoading}
        />
      </Modal>
      
      <Footer />
    </div>
  );
};

export default DashboardPage;