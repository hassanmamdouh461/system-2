import React from 'react';
import { ShoppingBag, DollarSign, Utensils, TrendingUp, PlusCircle, FileText, Coffee, Users } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Orders', value: '124', icon: ShoppingBag, trend: '+12%', color: 'blue' },
    { label: 'Total Sales', value: '$4,289', icon: DollarSign, trend: '+8%', color: 'green' },
    { label: 'Open Orders', value: '8', icon: Utensils, trend: 'Active', color: 'orange' },
    { label: 'Total Customers', value: '1,240', icon: Users, trend: '+24%', color: 'purple' },
  ];

  const quickActions = [
    { label: 'New Order', icon: PlusCircle, color: 'bg-orange-500', hover: 'hover:bg-orange-600', path: '/orders' },
    { label: 'Manage Menu', icon: Coffee, color: 'bg-blue-500', hover: 'hover:bg-blue-600', path: '/menu' },
    { label: 'View Reports', icon: FileText, color: 'bg-purple-500', hover: 'hover:bg-purple-600', path: '/reports' },
    { label: 'Tables', icon: Utensils, color: 'bg-green-500', hover: 'hover:bg-green-600', path: '/tables' },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm md:text-base text-gray-500">Welcome back, here's what's happening today.</p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-sm text-gray-500">Today's Date</p>
          <p className="font-semibold text-gray-900 text-sm md:text-base">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats Grid - 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className={`mobile-touch-target ${action.color} ${action.hover} text-white p-4 md:p-6 rounded-xl flex flex-col items-center justify-center gap-2 md:gap-3 transition-all shadow-lg shadow-gray-200 active:scale-95 tap-highlight-none`}
                >
                  <Icon className="w-6 h-6 md:w-8 md:h-8" />
                  <span className="font-semibold text-sm md:text-base">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-6">Recent Activity</h2>
          <div className="space-y-4">
             <div className="text-gray-500 text-sm">Recent activity feed loading...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
