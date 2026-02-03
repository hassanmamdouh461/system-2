import React, { useState } from 'react';
import { Order, MOCK_ORDERS, OrderStatus } from '../types/order';
import { OrderCard } from '../components/orders/OrderCard';
import { OrderDetails } from '../components/orders/OrderDetails';
import { Filter } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'All'>('All');

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const columns: { title: string; status: OrderStatus; color: string }[] = [
    { title: 'New Orders', status: 'New', color: 'bg-blue-50 text-blue-700' },
    { title: 'Preparing', status: 'Preparing', color: 'bg-orange-50 text-orange-700' },
    { title: 'Ready', status: 'Ready', color: 'bg-green-50 text-green-700' },
  ];

  const filteredOrders = filterStatus === 'All' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500">Manage order flow and track status.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-1 flex">
            {(['All', 'New', 'Preparing', 'Ready', 'Completed'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filterStatus === status 
                    ? 'bg-gray-900 text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-[1000px] h-full">
          {columns.map(col => (
            <div key={col.status} className="flex-1 flex flex-col bg-gray-100/50 rounded-2xl p-4 border border-gray-200/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${col.color.replace('bg-', 'bg-').split(' ')[0].replace('50', '500')}`} />
                  {col.title}
                </h3>
                <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {orders.filter(o => o.status === col.status).length}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                {orders
                  .filter(o => o.status === col.status)
                  .map(order => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onClick={setSelectedOrder}
                    />
                  ))}
              </div>
            </div>
          ))}

          {/* Completed / Cancelled Column (Combined/Optional) */}
           <div className="flex-1 flex flex-col bg-gray-100/50 rounded-2xl p-4 border border-gray-200/50 opacity-75">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-500">Completed</h3>
                <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {orders.filter(o => o.status === 'Completed').length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                {orders
                  .filter(o => o.status === 'Completed')
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map(order => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onClick={setSelectedOrder}
                    />
                  ))}
              </div>
           </div>
        </div>
      </div>

      <OrderDetails 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
