import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    const titles: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/menu': 'Menu',
      '/orders': 'Orders',
      '/payment': 'Payment',
      '/reports': 'Reports',
      '/settings': 'Settings',
    };
    return titles[path] || 'RestoPro';
  };

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-30 pt-safe-top">
      {/* Gradient background with glassmorphism */}
      <div className="relative bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 p-[1px]">
        <div className="bg-white/90 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-4">
            {/* Menu Button with gradient background */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onMenuClick}
              className="mobile-touch-target p-2.5 rounded-xl bg-gradient-to-br from-orange-50 to-pink-50 text-orange-600 hover:from-orange-100 hover:to-pink-100 transition-all shadow-sm border border-orange-100"
            >
              <Menu size={22} strokeWidth={2.5} />
            </motion.button>

            {/* Page Title with gradient text */}
            <motion.h1 
              key={getPageTitle()}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent"
            >
              {getPageTitle()}
            </motion.h1>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications with badge */}
              <motion.button 
                whileTap={{ scale: 0.95 }}
                className="mobile-touch-target relative p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 hover:from-blue-100 hover:to-indigo-100 transition-all shadow-sm border border-blue-100"
              >
                <Bell size={20} strokeWidth={2.5} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-full border-2 border-white shadow-sm" />
              </motion.button>

              {/* User Avatar with gradient border */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="mobile-touch-target w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all"
              >
                <User size={18} strokeWidth={2.5} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
