
export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskCategory = 'work' | 'personal' | 'health' | 'finance' | 'other';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority: TaskPriority;
  category: TaskCategory;
}

export type TaskFilter = {
  category?: TaskCategory;
  priority?: TaskPriority;
  completed?: boolean;
  searchTerm?: string;
};
