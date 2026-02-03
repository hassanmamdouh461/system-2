import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order } from '../../types/order';
import { X, CheckCircle2, Receipt, Printer, CreditCard, Banknote } from 'lucide-react';
import { clsx } from 'clsx';

interface PaymentModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: (orderId: string, method: 'Cash' | 'Card') => void;
}

export function PaymentModal({ order, isOpen, onClose, onPaymentComplete }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card'>('Cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  if (!isOpen || !order) return null;

  const subtotal = order.totalAmount;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleProcessPayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowReceipt(true);
    }, 1500);
  };

  const handleClose = () => {
    if (showReceipt) {
      onPaymentComplete(order.id, paymentMethod);
    }
    setShowReceipt(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.95 }}
           className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="text-orange-500" />
              {showReceipt ? 'Payment Successful' : 'Process Payment'}
            </h2>
            <button onClick={handleClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            {!showReceipt ? (
              <div className="space-y-6">
                 {/* Order Summary */}
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">Table</span>
                      <span className="font-bold text-gray-900">{order.tableId}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-sm text-gray-500">Order ID</span>
                       <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">{order.id}</span>
                    </div>
                    <div className="border-t border-gray-200 my-3" />
                    <div className="flex justify-between items-center text-lg font-bold">
                       <span>Total to Pay</span>
                       <span className="text-orange-600">${total.toFixed(2)}</span>
                    </div>
                 </div>

                 {/* Payment Method Selection */}
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Select Payment Method</label>
                    <div className="grid grid-cols-2 gap-4">
                       <button
                          onClick={() => setPaymentMethod('Cash')}
                          className={clsx(
                             "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                             paymentMethod === 'Cash' ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-100 hover:border-gray-200 text-gray-600"
                          )}
                       >
                          <Banknote size={24} />
                          <span className="font-medium">Cash</span>
                       </button>
                       <button
                          onClick={() => setPaymentMethod('Card')}
                          className={clsx(
                             "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                             paymentMethod === 'Card' ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-100 hover:border-gray-200 text-gray-600"
                          )}
                       >
                          <CreditCard size={24} />
                          <span className="font-medium">Card / UPI</span>
                       </button>
                    </div>
                 </div>

                 <button
                    onClick={handleProcessPayment}
                    disabled={isProcessing}
                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                 >
                    {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                 </button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                 <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} />
                 </div>
                 
                 <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">Payment Received!</h3>
                    <p className="text-gray-500">Transaction completed successfully.</p>
                 </div>

                 {/* Mock Receipt Preview */}
                 <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-left font-mono text-sm shadow-inner relative overflow-hidden">
                    {/* Jaggered edge effect */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent to-white bg-[length:10px_100%]" />
                    
                    <div className="text-center border-b border-gray-200 pb-4 mb-4">
                       <p className="font-bold text-lg">RESTOPRO</p>
                       <p className="text-xs text-gray-400">123 Culinary Ave, Food City</p>
                    </div>

                    <div className="space-y-2 mb-4">
                       {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between">
                             <span>{item.quantity}x {item.name}</span>
                             <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                       ))}
                    </div>

                    <div className="border-t border-gray-200 pt-4 space-y-1">
                       <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>${subtotal.toFixed(2)}</span>
                       </div>
                       <div className="flex justify-between">
                          <span>Tax</span>
                          <span>${tax.toFixed(2)}</span>
                       </div>
                       <div className="flex justify-between font-bold text-base pt-2">
                          <span>TOTAL</span>
                          <span>${total.toFixed(2)}</span>
                       </div>
                    </div>
                    
                    <div className="text-center mt-6 text-xs text-gray-400">
                       <p>Paid via {paymentMethod}</p>
                       <p>{new Date().toLocaleString()}</p>
                       <p>Thank you for dining with us!</p>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <button onClick={() => window.print()} className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
                       <Printer size={18} /> Print Receipt
                    </button>
                    <button onClick={handleClose} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 shadow-lg shadow-orange-500/20">
                       Done
                    </button>
                 </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
