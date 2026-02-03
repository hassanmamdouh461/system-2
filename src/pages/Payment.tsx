import React, { useState } from 'react';
import { MOCK_ORDERS, Order, OrderStatus } from '../types/order';
import { PaymentModal } from '../components/payment/PaymentModal';
import { CreditCard, DollarSign, Search, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Payment() {
  // Filter only active orders that are not settled (Completed/Cancelled)
  // For demo, we also show 'Ready' orders as payable
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS.filter(o => ['New', 'Preparing', 'Ready'].includes(o.status)));
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenPayment = (order: Order) => {
    setSelectedOrder(order);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentComplete = (orderId: string, method: 'Cash' | 'Card') => {
    console.log(`Payment completed for ${orderId} via ${method}`);
    // Update local state to remove paid order or mark as completed
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'Completed' } : o));
  };

  const filteredOrders = orders.filter(o => 
    o.tableId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = 4289.00; // Mock revenue

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment & Invoicing</h1>
          <p className="text-gray-500">Process payments and manage transactions.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                <DollarSign size={20} />
            </div>
            <div>
                <p className="text-xs text-gray-500 font-medium">Today's Revenue</p>
                <p className="text-lg font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
            </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by Table or Order ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
        />
      </div>

      {/* Payable Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.length > 0 ? (
           filteredOrders.map(order => (
            <motion.div
              layout
              key={order.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-300 transition-colors relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                   <h3 className="text-xl font-bold text-gray-900">{order.tableId}</h3>
                   <p className="text-sm text-gray-500">order #{order.id.split('-')[1]}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                   order.status === 'Ready' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'
                }`}>
                   {order.status}
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {order.items.slice(0, 2).map((item, idx) => (
                   <div key={idx} className="flex justify-between text-sm text-gray-600">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                   </div>
                ))}
                {order.items.length > 2 && (
                   <p className="text-xs text-gray-400 italic">+{order.items.length - 2} more items...</p>
                )}
                <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-lg text-gray-900">
                   <span>Total</span>
                   <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => handleOpenPayment(order)}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
              >
                <CreditCard size={18} /> Process Payment
              </button>
            </motion.div>
           ))
        ) : (
           <div className="col-span-full text-center py-20 text-gray-500">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Calculator className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium">No payable orders found</p>
           </div>
        )}
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        order={selectedOrder}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
}
