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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, here's what's happening today.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Today's Date</p>
          <p className="font-semibold text-gray-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className={`${action.color} ${action.hover} text-white p-6 rounded-xl flex flex-col items-center justify-center gap-3 transition-colors shadow-lg shadow-gray-200 transform hover:scale-105 active:scale-95 transition-transform`}
                >
                  <Icon className="w-8 h-8" />
                  <span className="font-semibold">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
             <div className="text-gray-500 text-sm">Recent activity feed loading...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
