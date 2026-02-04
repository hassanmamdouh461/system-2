import React from 'react';
import { motion } from 'framer-motion';
import { Order, OrderStatus } from '../../types/order';
import { Clock, CheckCircle2, ChefHat, AlertCircle, ShoppingBag, XCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface OrderCardProps {
  order: Order;
  onClick: (order: Order) => void;
  selected?: boolean;
}

const statusColors: Record<OrderStatus, { bg: string; text: string; gradient: string; icon: string }> = {
  New: { 
    bg: 'bg-blue-50', 
    text: 'text-blue-700', 
    gradient: 'from-blue-400 to-cyan-400',
    icon: 'text-blue-600'
  },
  Preparing: { 
    bg: 'bg-orange-50', 
    text: 'text-orange-700', 
    gradient: 'from-orange-400 to-pink-400',
    icon: 'text-orange-600'
  },
  Ready: { 
    bg: 'bg-green-50', 
    text: 'text-green-700', 
    gradient: 'from-green-400 to-emerald-400',
    icon: 'text-green-600'
  },
  Completed: { 
    bg: 'bg-gray-50', 
    text: 'text-gray-600', 
    gradient: 'from-gray-300 to-slate-300',
    icon: 'text-gray-500'
  },
  Cancelled: { 
    bg: 'bg-red-50', 
    text: 'text-red-600', 
   gradient: 'from-red-400 to-rose-400',
    icon: 'text-red-500'
  },
};

const statusIcons: Record<OrderStatus, React.ElementType> = {
  New: AlertCircle,
  Preparing: ChefHat,
  Ready: CheckCircle2,
  Completed: ShoppingBag,
  Cancelled: XCircle,
};

export function OrderCard({ order, onClick, selected }: OrderCardProps) {
  const StatusIcon = statusIcons[order.status];
  const colors = statusColors[order.status];

  return (
    <motion.div
      layout
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(order)}
      className={clsx(
        "mobile-touch-target cursor-pointer p-4 rounded-2xl transition-all relative overflow-hidden group",
        selected 
          ? "bg-white shadow-xl shadow-orange-500/20 border-2 border-orange-500/30" 
          : "bg-white/90 backdrop-blur-sm shadow-md hover:shadow-xl border border-gray-200/50 hover:border-gray-300/50"
      )}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-pink-50/0 group-hover:from-orange-50/30 group-hover:to-pink-50/30 transition-all duration-300 pointer-events-none rounded-2xl" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-gray-900">{order.tableId}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
              #{order.id.split('-')[1]}
            </span>
          </div>
          
          {/* Status badge with gradient */}
          <div className={clsx(
            "px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm border",
            colors.bg,
            colors.text,
            "border-current/20"
          )}>
            <StatusIcon size={14} className={colors.icon} />
            {order.status}
          </div>
        </div>

        {/* Items */}
        <div className="space-y-2 mb-4">
          {order.items.slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm items-center">
              <span className="text-gray-600">
                <span className="inline-flex items-center justify-center min-w-[24px] h-6 rounded-lg bg-gradient-to-br from-orange-100 to-pink-100 text-orange-700 font-bold text-xs mr-2 px-1.5">
                  {item.quantity}×
                </span>
                {item.name}
              </span>
            </div>
          ))}
          {order.items.length > 3 && (
            <p className="text-xs text-gray-400 italic font-medium pl-9">
              +{order.items.length - 3} more items...
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-500">
            <div className="p-1 rounded-lg bg-gray-100">
              <Clock size={12} />
            </div>
            <span className="font-medium">
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            ${order.totalAmount.toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
