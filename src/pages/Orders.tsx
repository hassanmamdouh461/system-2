import React, { useState, useMemo } from 'react';
import { Order, OrderStatus, OrderItem } from '../types/order';
import { OrderCard } from '../components/orders/OrderCard';
import { OrderDetails } from '../components/orders/OrderDetails';
import { NewOrderModal } from '../components/orders/NewOrderModal';
import { useIsMobile } from '../hooks/useIsMobile';
import { useOrders } from '../hooks/useOrders';
import { useMenu } from '../hooks/useMenu';
import { PlusCircle } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export default function Orders() {
  // Use Appwrite for real-time data persistence
  const { orders, error, updateOrderStatus, addOrder } = useOrders();
  const { items: menuItems } = useMenu();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'All'>('All');
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleCreateOrder = async (tableId: string, items: OrderItem[]) => {
    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    await addOrder({
      orderNumber,
      tableId,
      items,
      status: 'New',
      paymentStatus: 'Unpaid',
      totalAmount,
      createdAt: new Date().toISOString(),
    });
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      
      // Update selected order if it's the one being changed
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Failed to update order status');
    }
  };

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
    { title: 'Cancelled ✕', status: 'Cancelled', color: 'bg-red-50 text-red-600' },
  ];

  // Single-pass grouping — O(n) instead of O(n × columns).
  // All kanban columns and the mobile list read from this memo.
  const groupedOrders = useMemo(() => {
    const map: Record<string, Order[]> = {
      New: [], Preparing: [], Ready: [], Completed: [], Cancelled: [],
    };
    for (const o of orders) {
      if (map[o.status]) map[o.status].push(o);
    }
    // Completed sorted newest-first so the most recent payment is at the top
    map.Completed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return map;
  }, [orders]);

  const filteredOrders = filterStatus === 'All'
    ? orders
    : (groupedOrders[filterStatus] ?? []);

  return (
    <div className="flex flex-col" style={{ height: 'calc(100dvh - 4rem)' }}>
      {/* Header */}
      <div className="mb-2 md:mb-4 shrink-0">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-xs md:text-sm text-gray-500">Manage order flow and track status.</p>
          </div>
          <button
            onClick={() => setIsNewOrderOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-mocha-700 text-white rounded-xl text-sm font-semibold hover:bg-mocha-800 active:scale-95 transition-all shadow-sm"
          >
            <PlusCircle size={16} />
            <span className="hidden sm:inline">New Order</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
        
        {/* Filters */}
        <div className="overflow-x-auto hide-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
          <div className="bg-white border border-gray-200 rounded-lg p-1 flex gap-1 w-max sm:w-auto">
            {(['All', 'New', 'Preparing', 'Ready', 'Completed', 'Cancelled'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  filterStatus === status 
                    ? 'bg-gray-900 text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {status}
                {status !== 'All' && (
                  <span className="ml-1 text-xs opacity-70">
                    ({(groupedOrders[status] ?? []).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban Board - Desktop | Mobile: Simple list */}
      {isMobile ? (
        /* Mobile: Full-width list, padded for bottom nav */
        <div className="flex-1 overflow-y-auto space-y-2 pb-24">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm">No orders found</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onClick={setSelectedOrder}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      ) : (
        /* Desktop: Kanban View */
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[900px] h-full">
            {columns.map(col => (
              <div key={col.status} className="flex-1 flex flex-col bg-gray-100/50 rounded-2xl p-3 border border-gray-200/50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-gray-700 text-sm">{col.title}</h3>
                  <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">
                    {(groupedOrders[col.status] ?? []).length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1">
                  <AnimatePresence mode="popLayout">
                    {(groupedOrders[col.status] ?? [])
                      .map(order => (
                        <OrderCard 
                          key={order.id} 
                          order={order} 
                          onClick={setSelectedOrder}
                        />
                      ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}

            {/* Completed Column */}
            <div className="flex-1 flex flex-col bg-gray-100/50 rounded-2xl p-3 border border-gray-200/50 opacity-75">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-500 text-sm">Completed</h3>
                <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {groupedOrders.Completed.length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1">
                <AnimatePresence mode="popLayout">
                  {groupedOrders.Completed
                    .map(order => (
                      <OrderCard 
                        key={order.id} 
                        order={order} 
                        onClick={setSelectedOrder}
                      />
                    ))}
                </AnimatePresence>
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

      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        menuItems={menuItems}
        onSubmit={handleCreateOrder}
      />
    </div>
  );
}
