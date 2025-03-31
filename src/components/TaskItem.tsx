
import React from 'react';
import { Task } from '@/types';
import { useTaskContext } from '@/context/TaskContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import CategoryBadge from './CategoryBadge';
import { 
  Pencil, 
  Trash2, 
  Clock, 
  AlertTriangle,
  ArrowUp 
} from 'lucide-react';
import { Card } from '@/components/ui/card';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const { toggleTaskCompletion, deleteTask } = useTaskContext();

  const priorityClasses = {
    low: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900',
    medium: 'bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-900',
    high: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-900'
  };

  const isPastDue = task.dueDate && new Date() > task.dueDate;

  return (
    <Card 
      className={`p-4 mb-3 border hover:shadow-md transition-all duration-200 ${task.completed ? 'opacity-70' : ''} ${priorityClasses[task.priority]}`}
    >
      <div className="flex items-start gap-3">
        <Checkbox 
          id={`task-${task.id}`}
          checked={task.completed} 
          onCheckedChange={() => toggleTaskCompletion(task.id)}
          className="mt-1"
        />
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className={`font-medium text-lg ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={`text-sm text-muted-foreground mt-1 ${task.completed ? 'line-through' : ''}`}>
                  {task.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {task.priority === 'high' && (
                <span className="text-red-500 dark:text-red-400">
                  <ArrowUp className="h-4 w-4" />
                </span>
              )}
              
              <CategoryBadge category={task.category} />
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {format(task.createdAt, 'MMM d, yyyy')}
              </span>
              
              {task.dueDate && (
                <span className={`flex items-center gap-1 ${isPastDue && !task.completed ? 'text-red-600 dark:text-red-400 font-medium' : ''}`}>
                  {isPastDue && !task.completed && <AlertTriangle className="h-3 w-3" />}
                  Due: {format(task.dueDate, 'MMM d, yyyy')}
                </span>
              )}
            </div>
            
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 w-8 p-0" 
                onClick={() => onEdit(task)}
              >
                <Pencil className="h-3.5 w-3.5" />
                <span className="sr-only">Edit</span>
              </Button>
              
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950" 
                onClick={() => deleteTask(task.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TaskItem;
