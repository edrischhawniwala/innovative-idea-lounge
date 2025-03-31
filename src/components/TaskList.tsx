
import React, { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import TaskItem from './TaskItem';
import { Task, TaskFilter } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Filter } from 'lucide-react';
import TaskForm from './TaskForm';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const TaskList: React.FC = () => {
  const { filteredTasks, setFilter, filter, categories, priorities } = useTaskContext();
  const [searchInput, setSearchInput] = useState('');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    setFilter(prev => ({ ...prev, searchTerm: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFilter(prev => ({ 
      ...prev, 
      category: value === 'all' ? undefined : value as any
    }));
  };

  const handlePriorityChange = (value: string) => {
    setFilter(prev => ({ 
      ...prev, 
      priority: value === 'all' ? undefined : value as any 
    }));
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as any);
    if (value === 'all') {
      setFilter(prev => ({ ...prev, completed: undefined }));
    } else if (value === 'active') {
      setFilter(prev => ({ ...prev, completed: false }));
    } else if (value === 'completed') {
      setFilter(prev => ({ ...prev, completed: true }));
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const resetFilters = () => {
    setFilter({});
    setSearchInput('');
    setActiveTab('all');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
            value={searchInput}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex gap-2 self-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h3 className="font-medium">Filter tasks</h3>
                <div className="space-y-2">
                  <label className="text-sm">Category</label>
                  <Select onValueChange={handleCategoryChange} value={filter.category || 'all'}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Priority</label>
                  <Select onValueChange={handlePriorityChange} value={filter.priority || 'all'}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      {priorities.map(priority => (
                        <SelectItem key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" size="sm" onClick={resetFilters} className="w-full">
                  Reset Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button onClick={() => {
            setEditingTask(null);
            setIsTaskFormOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" /> Add Task
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6">
        {filteredTasks.length > 0 ? (
          <div className="space-y-2 animate-slide-up">
            {filteredTasks.map(task => (
              <TaskItem key={task.id} task={task} onEdit={handleEditTask} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center animate-fade-in">
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <div className="mb-4 rounded-full bg-muted p-3">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="mb-1 font-semibold text-foreground">No tasks found</h3>
              <p className="text-sm max-w-md">
                {Object.keys(filter).length > 0 
                  ? "Try adjusting your filters to find what you're looking for."
                  : "Get started by adding a new task."}
              </p>
              {Object.keys(filter).length > 0 && (
                <Button variant="link" onClick={resetFilters} className="mt-2">
                  Reset filters
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>

      <TaskForm 
        isOpen={isTaskFormOpen} 
        onClose={() => setIsTaskFormOpen(false)}
        editingTask={editingTask}
      />
    </div>
  );
};

export default TaskList;
