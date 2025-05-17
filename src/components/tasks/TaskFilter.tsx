import React, { useState } from 'react';
import { Filter, Search, X } from 'lucide-react';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface TaskFilterProps {
  onFilterChange: (filters: { category?: string | null; status?: string | null; search?: string }) => void;
  activeFilters: {
    category: string | null;
    status: string | null;
    search: string;
  };
}

const TaskFilter: React.FC<TaskFilterProps> = ({ onFilterChange, activeFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(activeFilters.search || '');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ search: searchTerm });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'all' ? null : e.target.value;
    onFilterChange({ status: value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'all' ? null : e.target.value;
    onFilterChange({ category: value });
  };

  const clearFilters = () => {
    setSearchTerm('');
    onFilterChange({ category: null, status: null, search: '' });
  };

  const hasActiveFilters = activeFilters.category || activeFilters.status || activeFilters.search;

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'Personal', label: 'Personal' },
    { value: 'Work', label: 'Work' },
    { value: 'Urgent', label: 'Urgent' },
    { value: 'Other', label: 'Other' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Filter size={18} className="text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-800">Filters</h3>
          </div>
          <div className="flex space-x-2">
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                leftIcon={<X size={14} />}
              >
                Clear
              </Button>
            )}
            <Button
              variant={isExpanded ? "primary" : "outline"}
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center mb-3">
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
            className="flex-grow"
            inputClassName="pr-10"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="-ml-9 z-10"
            aria-label="Search"
          >
            <Search size={18} />
          </Button>
        </form>

        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Select
              label="Category"
              options={categoryOptions}
              value={activeFilters.category || 'all'}
              onChange={handleCategoryChange}
              fullWidth
            />
            <Select
              label="Status"
              options={statusOptions}
              value={activeFilters.status || 'all'}
              onChange={handleStatusChange}
              fullWidth
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskFilter;