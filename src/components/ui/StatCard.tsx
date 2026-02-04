import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  color: string;
}

const colorConfig: Record<string, { gradient: string; iconBg: string; iconText: string; glow: string }> = {
  orange: { 
    gradient: 'from-orange-500 to-pink-500', 
    iconBg: 'bg-gradient-to-br from-orange-100 to-pink-100', 
    iconText: 'text-orange-600',
    glow: 'shadow-orange-500/20'
  },
  blue: { 
    gradient: 'from-blue-500 to-cyan-500', 
    iconBg: 'bg-gradient-to-br from-blue-100 to-cyan-100', 
    iconText: 'text-blue-600',
    glow: 'shadow-blue-500/20'
  },
  green: { 
    gradient: 'from-green-500 to-emerald-500', 
    iconBg: 'bg-gradient-to-br from-green-100 to-emerald-100', 
    iconText: 'text-green-600',
    glow: 'shadow-green-500/20'
  },
  purple: { 
    gradient: 'from-purple-500 to-pink-500', 
    iconBg: 'bg-gradient-to-br from-purple-100 to-pink-100', 
    iconText: 'text-purple-600',
    glow: 'shadow-purple-500/20'
  },
};

export function StatCard({ label, value, icon: Icon, trend, color }: StatCardProps) {
  const colors = colorConfig[color] || colorConfig.orange;

  return (
    <motion.div 
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm p-5 md:p-6 rounded-2xl shadow-md hover:shadow-xl border border-gray-200/50 relative overflow-hidden group transition-all mobile-touch-target"
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3 md:mb-4">
          {/* Icon with gradient background */}
          <motion.div 
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className={`p-2.5 md:p-3 rounded-xl ${colors.iconBg} ${colors.iconText} shadow-sm`}
          >
            <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          </motion.div>
          
          {/* Trend badge */}
          <span className="text-xs font-bold text-green-700 bg-gradient-to-br from-green-50 to-emerald-50 px-2.5 py-1 rounded-lg border border-green-200/50 shadow-sm">
            {trend}
          </span>
        </div>
        
        <h3 className="text-gray-500 text-xs md:text-sm font-semibold mb-1 uppercase tracking-wide">{label}</h3>
        <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          {value}
        </p>
      </div>

      {/* Decorative gradient circle */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${colors.gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300 blur-2xl`} />
    </motion.div>
  );
}
