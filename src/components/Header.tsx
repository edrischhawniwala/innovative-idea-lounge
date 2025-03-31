
import React from 'react';
import { CheckCircle } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center py-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold">TaskFlow</h1>
      </div>
      <div className="text-sm text-muted-foreground ml-auto">
        <span>Organize your life with ease</span>
      </div>
    </header>
  );
};

export default Header;
