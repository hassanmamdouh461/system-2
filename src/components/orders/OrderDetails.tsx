import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order, OrderStatus } from '../../types/order';
import { X, Clock, Printer, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { useSwipe } from '../../hooks/useSwipe';
import { useIsMobile } from '../../hooks/useIsMobile';

interface OrderDetailsProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export function OrderDetails({ order, onClose, onUpdateStatus }: OrderDetailsProps) {
  const isMobile = useIsMobile();
  
  const swipeHandlers = useSwipe({
    onSwipeDown: () => {
      if (isMobile) onClose();
    },
  });

  return (
    <AnimatePresence>
      {order && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed ${
              isMobile 
                ? 'inset-0 rounded-t-3xl' 
                : 'right-0 top-0 bottom-0 w-full max-w-md rounded-none'
            } bg-white shadow-2xl z-50 flex flex-col`}
            {...(isMobile ? swipeHandlers : {})}
          >
            {/* Swipe Indicator - Mobile Only */}
            {isMobile && (
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>
            )}

            {/* Header */}
            <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900">Order #{order.id.split('-')[1]}</h2>
                <p className="text-sm text-gray-500">Table {order.tableId}</p>
              </div>
              <button 
                onClick={onClose} 
                className="mobile-touch-target p-2 hover:bg-gray-200 rounded-full transition-colors tap-highlight-none"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 smooth-scroll">
              {/* Status Stepper (Simplified) */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base ${['New', 'Preparing', 'Ready', 'Completed'].includes(order.status) ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>1</div>
                  <span className="text-xs">New</span>
                </div>
                <div className="h-0.5 flex-1 bg-gray-200 mx-2" />
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base ${['Preparing', 'Ready', 'Completed'].includes(order.status) ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}>2</div>
                  <span className="text-xs">Preparing</span>
                </div>
                <div className="h-0.5 flex-1 bg-gray-200 mx-2" />
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base ${['Ready', 'Completed'].includes(order.status) ? 'bg-green-500 text-white' : 'bg-gray-100'}`}>3</div>
                  <span className="text-xs">Ready</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Items</h3>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 md:p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="bg-white w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-md border border-gray-200 font-bold text-sm">
                        {item.quantity}x
                      </span>
                      <span className="font-medium text-gray-700 text-sm md:text-base">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-gray-500 text-sm md:text-base">
                  <span>Subtotal</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm md:text-base">
                  <span>Tax (10%)</span>
                  <span>${(order.totalAmount * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg md:text-xl font-bold text-gray-900 pt-2">
                  <span>Total</span>
                  <span>${(order.totalAmount * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50/50 space-y-3 mobile-safe-area">
              <div className="grid grid-cols-2 gap-3">
                {order.status === 'New' && (
                  <button 
                    onClick={() => onUpdateStatus(order.id, 'Preparing')}
                    className="mobile-touch-target col-span-2 bg-blue-600 text-white py-3 md:py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 tap-highlight-none active:scale-95 transition-transform"
                  >
                    Start Preparing <ArrowRight size={18} />
                  </button>
                )}
                {order.status === 'Preparing' && (
                  <button 
                    onClick={() => onUpdateStatus(order.id, 'Ready')}
                    className="mobile-touch-target col-span-2 bg-orange-500 text-white py-3 md:py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-orange-600 tap-highlight-none active:scale-95 transition-transform"
                  >
                    Mark as Ready <CheckCircle2 size={18} />
                  </button>
                )}
                {order.status === 'Ready' && (
                  <button 
                    onClick={() => onUpdateStatus(order.id, 'Completed')}
                    className="mobile-touch-target col-span-2 bg-green-600 text-white py-3 md:py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 tap-highlight-none active:scale-95 transition-transform"
                  >
                    Complete Order <CheckCircle2 size={18} />
                  </button>
                )}
              </div>
              
              <div className="flex gap-3">
                <button className="mobile-touch-target flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 tap-highlight-none active:scale-95 transition-transform">
                  <Printer size={18} /> Print Invoice
                </button>
                {order.status !== 'Cancelled' && order.status !== 'Completed' && (
                  <button 
                    onClick={() => {
                        if(confirm('Cancel this order?')) onUpdateStatus(order.id, 'Cancelled');
                    }}
                    className="mobile-touch-target px-4 py-3 border border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-50 tap-highlight-none active:scale-95 transition-transform"
                  >
                    <XCircle size={18} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
