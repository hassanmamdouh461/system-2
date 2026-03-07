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
    bg: 'bg-amber-50', 
    text: 'text-amber-700', 
    gradient: 'from-amber-400 to-orange-400',
    icon: 'text-amber-600'
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

export const OrderCard = React.forwardRef<HTMLDivElement, OrderCardProps>(
  function OrderCard({ order, onClick, selected }, ref) {
  const StatusIcon = statusIcons[order.status];
  const colors = statusColors[order.status];

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.96 }}
      transition={{ type: 'spring', damping: 22, stiffness: 280 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(order)}
      className={clsx(
        "mobile-touch-target cursor-pointer p-3 md:p-4 rounded-xl md:rounded-2xl transition-all relative overflow-hidden group",
        selected 
          ? "bg-white shadow-xl shadow-caramel/20 border-2 border-caramel/30" 
          : "bg-white/90 backdrop-blur-sm shadow-md hover:shadow-xl border border-gray-200/50 hover:border-gray-300/50"
      )}
    >
      {/* Soft gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-mocha-50/0 to-caramel-light/0 group-hover:from-mocha-50/20 group-hover:to-caramel-light/20 transition-all duration-300 pointer-events-none rounded-2xl" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-2 md:mb-3">
          <div className="flex items-center gap-1.5 md:gap-2">
            <span className="font-bold text-base md:text-lg text-gray-900">{order.tableId}</span>
            <span className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
              #{order.orderNumber}
            </span>
          </div>
          
          {/* Status badge - softer */}
          <div className={clsx(
            "px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm border",
            colors.bg,
            colors.text,
            "border-current/10"
          )}>
            <StatusIcon size={14} className={colors.icon} />
            {order.status}
          </div>
        </div>

        {/* Items */}
        <div className="space-y-2 mb-4">
          {order.items && order.items.length > 0 ? order.items.slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm items-center">
              <span className="text-gray-600">
                <span className="inline-flex items-center justify-center min-w-[24px] h-6 rounded-lg bg-mocha-50 text-mocha-700 font-bold text-xs mr-2 px-1.5 border border-mocha-100/50">
                  {item.quantity}×
                </span>
                {item.name}
              </span>
            </div>
          )) : (
            <div className="text-xs text-gray-400 italic">No items</div>
          )}
          {order.items && order.items.length > 3 && (
            <p className="text-xs text-gray-400 italic font-medium pl-9">
              +{order.items.length - 3} more items...
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center text-xs pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-500">
            <div className="p-1 rounded-lg bg-gray-100">
              <Clock size={12} />
            </div>
            <span className="font-medium">
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
);
