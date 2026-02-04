import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const location = useLocation();
  
  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('orders')) return 'Orders';
    if (path.includes('menu')) return 'Menu';
    if (path.includes('payment')) return 'Payment & Invoice';
    if (path.includes('reports')) return 'Reports';
    if (path.includes('settings')) return 'Settings';
    return 'RestoPro';
  };

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 mobile-safe-area">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Menu Button */}
        <button
          onClick={onMenuClick}
          className="mobile-touch-target flex items-center justify-center p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors tap-highlight-none"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        {/* Page Title */}
        <h1 className="text-lg font-bold text-gray-900 truncate px-2">
          {getPageTitle()}
        </h1>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            className="mobile-touch-target relative flex items-center justify-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors tap-highlight-none"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full"></span>
          </button>

          {/* User Avatar */}
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            alt="User"
            className="w-8 h-8 rounded-full bg-gray-200"
          />
        </div>
      </div>
    </header>
  );
}
