import React, { useState } from 'react';
import { Order, OrderStatus } from '../types/order';
import { OrderCard } from '../components/orders/OrderCard';
import { OrderDetails } from '../components/orders/OrderDetails';
import { Filter } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';
import { useOrders } from '../hooks/useOrders';
import { LoadingScreen } from '../components/ui/LoadingScreen';

export default function Orders() {
  // Use Appwrite for real-time data persistence
  const { orders, loading, error, updateOrderStatus } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'All'>('All');
  const isMobile = useIsMobile();

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      
      // Update selected order if it's the one being changed
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status');
    }
  };

  // Show loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Failed to load orders</p>
          <p className="text-gray-500 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  const columns: { title: string; status: OrderStatus; color: string }[] = [
    { title: 'New Orders', status: 'New', color: 'bg-mocha-100 text-mocha-800' },
    { title: 'Brewing ☕', status: 'Preparing', color: 'bg-caramel-light text-coffee-dark' },
    { title: 'Ready for Pickup 🛎️', status: 'Ready', color: 'bg-green-50 text-green-700' },
  ];

  const filteredOrders = filterStatus === 'All' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col">
      {/* Header */}
      <div className="mb-3 md:mb-6">
        <div className="flex justify-between items-start md:items-center mb-3 gap-2">
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-xs md:text-base text-gray-500">Manage order flow and track status.</p>
          </div>
        </div>
        
        {/* Filters - Horizontal scroll on mobile */}
        <div className="overflow-x-auto hide-scrollbar -mx-3 px-3 md:mx-0 md:px-0">
          <div className="bg-white border border-gray-200 rounded-lg p-1 flex gap-1 min-w-max md:min-w-0">
            {(['All', 'New', 'Preparing', 'Ready', 'Completed'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`mobile-touch-target px-2.5 md:px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
                  filterStatus === status 
                    ? 'bg-gray-900 text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {status}
                {status !== 'All' && (
                  <span className="ml-1.5 text-xs opacity-75">
                    ({orders.filter(o => o.status === status).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban Board - Desktop only | Mobile: Simple list */}
      {isMobile ? (
        /* Mobile: Simple List View */
        <div className="flex-1 overflow-y-auto space-y-2 pb-4">
          {filteredOrders.map(order => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onClick={setSelectedOrder}
            />
          ))}
          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No orders found</p>
            </div>
          )}
        </div>
      ) : (
        /* Desktop: Kanban View */
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

            {/* Completed Column */}
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
      )}

      <OrderDetails 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
