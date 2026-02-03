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

const statusColors: Record<OrderStatus, string> = {
  New: 'border-blue-500 bg-blue-50 text-blue-700',
  Preparing: 'border-orange-500 bg-orange-50 text-orange-700',
  Ready: 'border-green-500 bg-green-50 text-green-700',
  Completed: 'border-gray-300 bg-gray-50 text-gray-600',
  Cancelled: 'border-red-300 bg-red-50 text-red-600',
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

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      onClick={() => onClick(order)}
      className={clsx(
        "cursor-pointer p-4 rounded-xl border-2 transition-all relative overflow-hidden",
        selected ? "border-orange-500 bg-white shadow-lg shadow-orange-500/10" : "border-transparent bg-white shadow-sm hover:border-gray-200"
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900">{order.tableId}</span>
          <span className="text-xs text-gray-400">#{order.id.split('-')[1]}</span>
        </div>
        <div className={clsx("px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1.5", statusColors[order.status])}>
          <StatusIcon size={12} />
          {order.status}
        </div>
      </div>

      <div className="space-y-1 mb-4">
        {order.items.slice(0, 3).map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-gray-600">
              <span className="font-semibold text-gray-900">{item.quantity}x</span> {item.name}
            </span>
          </div>
        ))}
        {order.items.length > 3 && (
          <p className="text-xs text-gray-400 italic">+{order.items.length - 3} more items...</p>
        )}
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <Clock size={12} />
          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <span className="font-bold text-base text-gray-900">${order.totalAmount.toFixed(2)}</span>
      </div>
    </motion.div>
  );
}
