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
    gradient: 'from-orange-200 to-pink-200', 
    iconBg: 'bg-gradient-to-br from-orange-50 to-pink-50', 
    iconText: 'text-orange-500',
    glow: 'shadow-orange-200/10'
  },
  blue: { 
    gradient: 'from-blue-200 to-cyan-200', 
    iconBg: 'bg-gradient-to-br from-blue-50 to-cyan-50', 
    iconText: 'text-blue-500',
    glow: 'shadow-blue-200/10'
  },
  green: { 
    gradient: 'from-green-200 to-emerald-200', 
    iconBg: 'bg-gradient-to-br from-green-50 to-emerald-50', 
    iconText: 'text-green-500',
    glow: 'shadow-green-200/10'
  },
  purple: { 
    gradient: 'from-purple-200 to-pink-200', 
    iconBg: 'bg-gradient-to-br from-purple-50 to-pink-50', 
    iconText: 'text-purple-500',
    glow: 'shadow-purple-200/10'
  },
};

export function StatCard({ label, value, icon: Icon, trend, color }: StatCardProps) {
  const colors = colorConfig[color] || colorConfig.orange;

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 backdrop-blur-sm p-5 md:p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-200/50 relative overflow-hidden group transition-all mobile-touch-target"
    >
      {/* Soft gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`} />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3 md:mb-4">
          {/* Icon with soft gradient */}
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className={`p-2.5 md:p-3 rounded-xl ${colors.iconBg} ${colors.iconText} shadow-sm border border-current/10`}
          >
            <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
          </motion.div>
          
          {/* Trend badge - softer */}
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-lg border border-green-100/50 shadow-sm">
            {trend}
          </span>
        </div>
        
        <h3 className="text-gray-500 text-xs md:text-sm font-semibold mb-1 uppercase tracking-wide">{label}</h3>
        <p className="text-2xl md:text-3xl font-bold text-gray-800">
          {value}
        </p>
      </div>

      {/* Very subtle decorative circle */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${colors.gradient} rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-300 blur-2xl`} />
    </motion.div>
  );
}
