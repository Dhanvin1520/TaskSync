import React from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import type { TaskFormData } from '../../types';
import type { Task } from '../../types';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Check, X } from 'lucide-react';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: task
      ? {
          title: task.title,
          description: task.description,
          dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
          category: task.category,
          status: task.status,
        }
      : {
          title: '',
          description: '',
          dueDate: '',
          category: 'Personal',
          status: 'pending',
        },
  });

  const categoryOptions = [
    { value: 'Personal', label: 'Personal' },
    { value: 'Work', label: 'Work' },
    { value: 'Urgent', label: 'Urgent' },
    { value: 'Other', label: 'Other' },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="title"
        label="Title"
        fullWidth
        placeholder="Task title"
        error={errors.title?.message}
        {...register('title', { required: 'Title is required' })}
      />

      <TextArea
        id="description"
        label="Description"
        fullWidth
        rows={3}
        placeholder="Task description"
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          id="dueDate"
          type="date"
          label="Due Date"
          fullWidth
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />

        <Select
          id="category"
          label="Category"
          fullWidth
          options={categoryOptions}
          error={errors.category?.message}
          {...register('category', { required: 'Category is required' })}
        />

        <Select
          id="status"
          label="Status"
          fullWidth
          options={statusOptions}
          error={errors.status?.message}
          {...register('status', { required: 'Status is required' })}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          leftIcon={<X size={18} />}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          leftIcon={<Check size={18} />}
        >
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;