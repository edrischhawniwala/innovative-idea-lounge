
import React from 'react';
import Header from '@/components/Header';
import TaskList from '@/components/TaskList';
import { TaskProvider } from '@/context/TaskContext';

const Index: React.FC = () => {
  return (
    <TaskProvider>
      <div className="container max-w-4xl py-4 px-4 mx-auto min-h-screen">
        <Header />
        <main className="mt-4">
          <TaskList />
        </main>
      </div>
    </TaskProvider>
  );
};

export default Index;
