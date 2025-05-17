import React from 'react';
import { format } from 'date-fns';
import type { Task } from '../../types';
import Badge from '../ui/Badge';
import { AlertCircle, Calendar, CheckCircle, Clock, Edit, Trash2 } from 'lucide-react';
import Card, { CardBody } from '../ui/Card';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'in-progress':
        return <Badge variant="primary">In Progress</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Personal':
        return <Badge variant="secondary">Personal</Badge>;
      case 'Work':
        return <Badge variant="primary">Work</Badge>;
      case 'Urgent':
        return <Badge variant="danger">Urgent</Badge>;
      default:
        return <Badge>Other</Badge>;
    }
  };

  const isDueSoon = (dueDate: string) => {
    if (!dueDate) return false;
    
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 && diffDays <= 2;
  };

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false;
    
    const today = new Date();
    const due = new Date(dueDate);
    
    return due < today;
  };

  return (
    <Card className="task-item hover:shadow-md transition-shadow duration-200">
      <CardBody>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              {task.status === 'completed' && (
                <CheckCircle size={18} className="text-green-500 mr-2" />
              )}
              {task.title}
            </h3>
            <div className="flex space-x-1">
              <button
                onClick={() => onEdit(task)}
                className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                title="Edit task"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                title="Delete task"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-gray-600 text-sm">{task.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {getStatusBadge(task.status)}
            {getCategoryBadge(task.category)}
            
            {task.dueDate && (
              <div className="flex items-center">
                <Calendar size={14} className="mr-1 text-gray-500" />
                <span className={`text-xs ${isOverdue(task.dueDate) ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                  {format(new Date(task.dueDate), 'MMM d, yyyy')}
                  {isOverdue(task.dueDate) && ' (Overdue)'}
                </span>
              </div>
            )}
            
            {isDueSoon(task.dueDate) && !isOverdue(task.dueDate) && (
              <div className="flex items-center text-amber-600">
                <AlertCircle size={14} className="mr-1" />
                <span className="text-xs font-medium">Due soon</span>
              </div>
            )}
            
            <div className="flex items-center ml-auto">
              <Clock size={14} className="mr-1 text-gray-500" />
              <span className="text-xs text-gray-500">
                {format(new Date(task.createdAt), 'MMM d')}
              </span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default TaskItem;