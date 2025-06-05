import React, { useState } from 'react';
import { Menu, User, X } from 'lucide-react';
import { Button } from '../ui/Button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-500">
              <path d="M16 4C9.383 4 4 9.383 4 16C4 22.617 9.383 28 16 28C22.617 28 28 22.617 28 16C28 9.383 22.617 4 16 4ZM16 6C21.535 6 26 10.465 26 16C26 21.535 21.535 26 16 26C10.465 26 6 21.535 6 16C6 10.465 10.465 6 16 6ZM16 10C13.791 10 12 11.791 12 14H14C14 12.895 14.895 12 16 12C17.105 12 18 12.895 18 14C18 15.105 17.105 16 16 16V18H18V17.766C19.724 17.391 21 15.849 21 14C21 11.791 19.209 10 17 10H16ZM15 20V22H17V20H15Z" fill="currentColor"/>
            </svg>
            <span className="ml-2 text-xl font-semibold text-neutral-900">Smart Scheduler</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Button variant="ghost" className="text-neutral-700">Dashboard</Button>
          <Button variant="ghost" className="text-neutral-700">Calendar</Button>
          <Button variant="ghost" className="text-neutral-700">Analytics</Button>
          <Button variant="ghost" className="text-neutral-700">Settings</Button>
        </nav>

        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="rounded-full">
            <User size={20} className="text-neutral-700" />
          </Button>
          <button 
            className="p-2 rounded-full text-neutral-700 md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100 animate-slide-down">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-1">
              <Button variant="ghost" className="text-neutral-700 justify-start">Dashboard</Button>
              <Button variant="ghost" className="text-neutral-700 justify-start">Calendar</Button>
              <Button variant="ghost" className="text-neutral-700 justify-start">Analytics</Button>
              <Button variant="ghost" className="text-neutral-700 justify-start">Settings</Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;