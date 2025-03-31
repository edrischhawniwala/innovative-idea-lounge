
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TaskCategory } from '@/types';
import { 
  Briefcase, 
  User, 
  Heart, 
  Wallet, 
  FileQuestion 
} from 'lucide-react';

interface CategoryBadgeProps {
  category: TaskCategory;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const getCategoryStyles = (category: TaskCategory) => {
    switch (category) {
      case 'work':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900',
          text: 'text-blue-700 dark:text-blue-300',
          border: 'border-blue-200 dark:border-blue-800',
          icon: <Briefcase className="h-3 w-3 mr-1" />
        };
      case 'personal':
        return {
          bg: 'bg-purple-100 dark:bg-purple-900',
          text: 'text-purple-700 dark:text-purple-300',
          border: 'border-purple-200 dark:border-purple-800',
          icon: <User className="h-3 w-3 mr-1" />
        };
      case 'health':
        return {
          bg: 'bg-green-100 dark:bg-green-900',
          text: 'text-green-700 dark:text-green-300',
          border: 'border-green-200 dark:border-green-800',
          icon: <Heart className="h-3 w-3 mr-1" />
        };
      case 'finance':
        return {
          bg: 'bg-amber-100 dark:bg-amber-900',
          text: 'text-amber-700 dark:text-amber-300',
          border: 'border-amber-200 dark:border-amber-800',
          icon: <Wallet className="h-3 w-3 mr-1" />
        };
      case 'other':
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-800',
          text: 'text-gray-700 dark:text-gray-300',
          border: 'border-gray-200 dark:border-gray-700',
          icon: <FileQuestion className="h-3 w-3 mr-1" />
        };
    }
  };

  const { bg, text, border, icon } = getCategoryStyles(category);

  return (
    <Badge variant="outline" className={`${bg} ${text} ${border} flex items-center`}>
      {icon}
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </Badge>
  );
};

export default CategoryBadge;
