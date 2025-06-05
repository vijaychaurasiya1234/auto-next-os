import React from 'react';
import Navbar from './Navbar';
import { Toaster } from '../ui/Toast';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 md:p-6 container mx-auto max-w-[1440px]">
        {children}
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;