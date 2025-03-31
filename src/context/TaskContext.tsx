
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskFilter, TaskCategory, TaskPriority } from '@/types';
import { toast } from "@/components/ui/use-toast";

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  filter: TaskFilter;
  setFilter: React.Dispatch<React.SetStateAction<TaskFilter>>;
  filteredTasks: Task[];
  categories: TaskCategory[];
  priorities: TaskPriority[];
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Finish project proposal',
    description: 'Complete the draft and send for review',
    completed: false,
    createdAt: new Date('2023-05-01'),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    priority: 'high',
    category: 'work'
  },
  {
    id: '2',
    title: 'Grocery shopping',
    description: 'Buy fruits, vegetables, and essentials',
    completed: true,
    createdAt: new Date('2023-05-02'),
    priority: 'medium',
    category: 'personal'
  },
  {
    id: '3',
    title: 'Schedule dentist appointment',
    completed: false,
    createdAt: new Date('2023-05-03'),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    priority: 'low',
    category: 'health'
  },
  {
    id: '4',
    title: 'Pay electricity bill',
    completed: false,
    createdAt: new Date('2023-05-04'),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    priority: 'high',
    category: 'finance'
  }
];

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        // Parse the JSON and convert string dates back to Date objects
        const parsedTasks = JSON.parse(savedTasks);
        return parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined
        }));
      } catch (error) {
        console.error('Error parsing tasks from localStorage:', error);
        return initialTasks;
      }
    }
    return initialTasks;
  });

  const [filter, setFilter] = useState<TaskFilter>({});

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const categories: TaskCategory[] = ['work', 'personal', 'health', 'finance', 'other'];
  const priorities: TaskPriority[] = ['low', 'medium', 'high'];

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setTasks([...tasks, newTask]);
    toast({
      title: "Task added",
      description: "Your task has been successfully added.",
    });
  };

  const updateTask = (id: string, updatedTaskData: Partial<Task>) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, ...updatedTaskData } : task)));
    toast({
      title: "Task updated",
      description: "Your task has been successfully updated.",
    });
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: "Task deleted",
      description: "Your task has been removed.",
    });
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Filter tasks based on the current filter
  const filteredTasks = tasks.filter(task => {
    // Filter by category if specified
    if (filter.category && task.category !== filter.category) {
      return false;
    }

    // Filter by priority if specified
    if (filter.priority && task.priority !== filter.priority) {
      return false;
    }

    // Filter by completion status if specified
    if (filter.completed !== undefined && task.completed !== filter.completed) {
      return false;
    }

    // Filter by search term if specified
    if (filter.searchTerm && !task.title.toLowerCase().includes(filter.searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        filter,
        setFilter,
        filteredTasks,
        categories,
        priorities
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
