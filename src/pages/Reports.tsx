import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, ShoppingBag, Users, Calendar, Download } from 'lucide-react';

export default function Reports() {
  const [dateRange, setDateRange] = useState('This Week');

  // Mock Data
  const stats = [
    { label: 'Total Revenue', value: '$12,450', change: '+15%', icon: DollarSign, color: 'green' },
    { label: 'Total Orders', value: '452', change: '+8%', icon: ShoppingBag, color: 'blue' },
    { label: 'Avg. Order Value', value: '$27.50', change: '+4%', icon: TrendingUp, color: 'orange' },
    { label: 'New Customers', value: '128', change: '+12%', icon: Users, color: 'purple' },
  ];

  const salesData = [
    { day: 'Mon', value: 45, items: 32 },
    { day: 'Tue', value: 60, items: 45 },
    { day: 'Wed', value: 35, items: 28 },
    { day: 'Thu', value: 75, items: 58 },
    { day: 'Fri', value: 95, items: 82 },
    { day: 'Sat', value: 120, items: 96 },
    { day: 'Sun', value: 85, items: 64 },
  ];

  const topItems = [
    { name: 'Spanish Latte', orders: 145, revenue: 870.00 },
    { name: 'Iced Caramel Macchiato', orders: 112, revenue: 728.00 },
    { name: 'Cappuccino', orders: 98, revenue: 490.00 },
    { name: 'Mocha Frappe', orders: 89, revenue: 623.00 },
  ];

  const maxSale = Math.max(...salesData.map(d => d.value));

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-xs md:text-base text-gray-500">Track your cafe performance and growth.</p>
        </div>
        <div className="flex gap-2 md:gap-3">
           <div className="relative flex-1 md:flex-initial">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 md:w-4 md:h-4" />
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full pl-8 md:pl-9 pr-3 md:pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-caramel"
              >
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
           </div>
           <button className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-gray-900 text-white rounded-lg text-xs md:text-sm font-medium hover:bg-black transition-colors">
              <Download size={14} className="md:w-4 md:h-4" /> 
              <span className="hidden sm:inline">Export</span>
           </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-3 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-2 md:mb-4">
              <div className={`p-2 md:p-3 rounded-lg md:rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                <stat.icon size={18} className="md:w-6 md:h-6" />
              </div>
              <span className="text-[10px] md:text-xs font-semibold text-green-600 bg-green-50 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
           <h2 className="text-lg font-bold text-gray-900 mb-6">Revenue Trend</h2>
           <div className="flex-1 flex items-end justify-between gap-4 h-64 pb-2">
              {salesData.map((data, idx) => (
                 <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="relative w-full flex justify-center">
                       <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${(data.value / maxSale) * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="w-full max-w-[40px] bg-mocha-100 rounded-t-lg group-hover:bg-caramel transition-colors relative"
                       >
                         <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap z-10">
                            ${(data.value * 10).toFixed(0)} ({data.items} orders)
                         </div>
                       </motion.div>
                    </div>
                    <span className="text-xs font-medium text-gray-500">{data.day}</span>
                 </div>
              ))}
           </div>
        </div>

        {/* Top Items */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h2 className="text-lg font-bold text-gray-900 mb-6">Top Selling Items</h2>
           <div className="space-y-6">
              {topItems.map((item, idx) => (
                 <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm">
                       <span className="font-medium text-gray-900">{item.name}</span>
                       <span className="text-gray-500">{item.orders} orders</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.orders / 200) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-caramel rounded-full" 
                       />
                    </div>
                 </div>
              ))}
           </div>
           <button className="w-full mt-6 py-2 border border-mocha-200 text-mocha-700 rounded-xl text-sm font-semibold hover:bg-mocha-50 transition-colors">
              View All Items
           </button>
        </div>
      </div>
    </div>
  );
}
