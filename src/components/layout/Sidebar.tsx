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
  ChevronRight
} from 'lucide-react';
import { SidebarItem } from './SidebarItem';
import { clsx } from 'clsx';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div 
      className={clsx(
        "h-screen bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 relative",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 bg-orange-500 text-white p-1 rounded-full shadow-lg hover:bg-orange-600 transition-colors z-50"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Brand */}
      <div className="p-6 flex items-center gap-3 border-b border-gray-800">
        <div className="bg-gradient-to-br from-orange-400 to-red-500 p-2 rounded-lg shadow-lg shadow-orange-500/20">
          <ChefHat className="w-6 h-6 text-white" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-white font-bold text-lg leading-none">Resto<span className="text-orange-500">Pro</span></h1>
            <p className="text-gray-500 text-xs">Manager</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" collapsed={collapsed} />
        <SidebarItem icon={ClipboardList} label="Orders" to="/orders" collapsed={collapsed} />
        <SidebarItem icon={UtensilsCrossed} label="Menu" to="/menu" collapsed={collapsed} />
        <SidebarItem icon={CreditCard} label="Payment & Invoice" to="/payment" collapsed={collapsed} />
        <SidebarItem icon={BarChart3} label="Reports" to="/reports" collapsed={collapsed} />
        
        <div className="my-4 border-t border-gray-800" />
        
        <SidebarItem icon={Settings} label="Settings" to="/settings" collapsed={collapsed} />
      </nav>

      {/* User Mini Profile */}
      <div className="p-4 border-t border-gray-800">
        <div className={clsx("flex items-center gap-3 p-2 rounded-lg bg-gray-800/50", collapsed && "justify-center")}>
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
            alt="User" 
            className="w-8 h-8 rounded-full bg-gray-700"
          />
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-gray-400 truncate">Manager</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
