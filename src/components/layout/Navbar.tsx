import React from 'react';
import { User } from 'lucide-react';
import { Button } from '../ui/Button';

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center">
          <span className="text-xl font-semibold text-neutral-900">Auto Appointment Scheduler</span>
        </div>

        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="rounded-full">
            <User size={20} className="text-neutral-700" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;