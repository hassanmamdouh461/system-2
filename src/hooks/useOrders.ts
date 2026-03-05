import { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '../types/order';
import { ordersService } from '../services/ordersService';

interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  addOrder: (order: Omit<Order, 'id'>) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  updateOrder: (id: string, data: Partial<Omit<Order, 'id'>>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
}

/**
 * Custom Hook for Orders State Management with Appwrite
 * Handles loading, error states, and CRUD operations
 */
export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch orders from Appwrite
   */
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ordersService.getAll();
      setOrders(data);
      console.log('[useOrders] ✅ Loaded', data.length, 'orders from Appwrite');
    } catch (err) {
      setError(err as Error);
      console.error('[useOrders] ❌ Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Initial load on mount
   */
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /**
   * Add new order (Optimistic UI Update)
   */
  const addOrder = useCallback(async (order: Omit<Order, 'id'>) => {
    try {
      // Create in Appwrite first
      const newOrder = await ordersService.create(order);
      
      // Update local state
      setOrders(prev => [newOrder, ...prev]);
      console.log('[useOrders] ✅ Added order:', newOrder.orderNumber);
    } catch (err) {
      console.error('[useOrders] ❌ Error adding order:', err);
      throw err;
    }
  }, []);

  /**
   * Update order status (Optimistic UI Update with rollback)
   * This is the most common operation for orders
   */
  const updateOrderStatus = useCallback(async (id: string, status: OrderStatus) => {
    // Store old state for rollback
    const oldOrders = [...orders];
    
    try {
      // Optimistic update
      setOrders(prev => prev.map(order => 
        order.id === id ? { ...order, status } : order
      ));
      
      // Update in Appwrite
      await ordersService.updateStatus(id, status);
      console.log('[useOrders] ✅ Updated order status:', id, '→', status);
    } catch (err) {
      // Rollback on error
      setOrders(oldOrders);
      console.error('[useOrders] ❌ Error updating order status, rolled back:', err);
      throw err;
    }
  }, [orders]);

  /**
   * Update entire order (Optimistic UI Update with rollback)
   */
  const updateOrder = useCallback(async (id: string, data: Partial<Omit<Order, 'id'>>) => {
    // Store old state for rollback
    const oldOrders = [...orders];
    
    try {
      // Optimistic update
      setOrders(prev => prev.map(order => 
        order.id === id ? { ...order, ...data } : order
      ));
      
      // Update in Appwrite
      await ordersService.update(id, data);
      console.log('[useOrders] ✅ Updated order:', id);
    } catch (err) {
      // Rollback on error
      setOrders(oldOrders);
      console.error('[useOrders] ❌ Error updating order, rolled back:', err);
      throw err;
    }
  }, [orders]);

  /**
   * Delete order (Optimistic UI Update with rollback)
   */
  const deleteOrder = useCallback(async (id: string) => {
    // Store old state for rollback
    const oldOrders = [...orders];
    
    try {
      // Optimistic delete
      setOrders(prev => prev.filter(order => order.id !== id));
      
      // Delete from Appwrite
      await ordersService.delete(id);
      console.log('[useOrders] ✅ Deleted order:', id);
    } catch (err) {
      // Rollback on error
      setOrders(oldOrders);
      console.error('[useOrders] ❌ Error deleting order, rolled back:', err);
      throw err;
    }
  }, [orders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    addOrder,
    updateOrderStatus,
    updateOrder,
    deleteOrder,
  };
}
