import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ClipboardList, 
  CreditCard, 
  BarChart3, 
  Settings, 
  ChefHat,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { SidebarItem } from './SidebarItem';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../../hooks/useIsMobile';

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const handleItemClick = () => {
    // Close sidebar on mobile when item is clicked
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const sidebarContent = (
    <div 
      className={clsx(
        "h-full bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 relative",
        !isMobile && (collapsed ? "w-20" : "w-64")
      )}
    >
      {/* Toggle Button - Desktop Only */}
      {!isMobile && (
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-8 bg-orange-500 text-white p-1 rounded-full shadow-lg hover:bg-orange-600 transition-colors z-50"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      )}

      {/* Close Button - Mobile Only */}
      {isMobile && (
        <button
          onClick={onMobileClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors z-50"
        >
          <X size={24} />
        </button>
      )}

      {/* Brand */}
      <div className="p-6 flex items-center gap-3 border-b border-gray-800">
        <div className="bg-gradient-to-br from-orange-400 to-red-500 p-2 rounded-lg shadow-lg shadow-orange-500/20">
          <ChefHat className="w-6 h-6 text-white" />
        </div>
        {(!collapsed || isMobile) && (
          <div>
            <h1 className="text-white font-bold text-lg leading-none">Resto<span className="text-orange-500">Pro</span></h1>
            <p className="text-gray-500 text-xs">Manager</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" collapsed={!isMobile && collapsed} onClick={handleItemClick} />
        <SidebarItem icon={ClipboardList} label="Orders" to="/orders" collapsed={!isMobile && collapsed} onClick={handleItemClick} />
        <SidebarItem icon={UtensilsCrossed} label="Menu" to="/menu" collapsed={!isMobile && collapsed} onClick={handleItemClick} />
        <SidebarItem icon={CreditCard} label="Payment & Invoice" to="/payment" collapsed={!isMobile && collapsed} onClick={handleItemClick} />
        <SidebarItem icon={BarChart3} label="Reports" to="/reports" collapsed={!isMobile && collapsed} onClick={handleItemClick} />
        
        <div className="my-4 border-t border-gray-800" />
        
        <SidebarItem icon={Settings} label="Settings" to="/settings" collapsed={!isMobile && collapsed} onClick={handleItemClick} />
      </nav>

      {/* User Mini Profile */}
      <div className="p-4 border-t border-gray-800">
        <div className={clsx("flex items-center gap-3 p-2 rounded-lg bg-gray-800/50", (!isMobile && collapsed) && "justify-center")}>
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
            alt="User" 
            className="w-8 h-8 rounded-full bg-gray-700"
          />
          {(!collapsed || isMobile) && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-gray-400 truncate">Manager</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Mobile: Render as drawer with overlay
  if (isMobile) {
    return (
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 z-50"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop: Render normally
  return sidebarContent;
}
