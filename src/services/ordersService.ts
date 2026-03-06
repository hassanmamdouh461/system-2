import { databases, directCreate, directUpdate, directDelete, APPWRITE_CONFIG } from '../lib/appwrite';
import { Order, OrderStatus, PaymentStatus } from '../types/order';
import { ID } from 'appwrite';

/**
 * Orders Service - Handle all CRUD operations for Orders using Appwrite
 */
export const ordersService = {
  /**
   * Fetch all orders from Appwrite
   */
  async getAll(): Promise<Order[]> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.DB_ID,
        APPWRITE_CONFIG.COLLECTIONS.ORDERS
      );

      return response.documents.map((doc: any) => {
        // Parse items if it's a string (Appwrite might store it as JSON)
        let items = doc.items;
        if (typeof items === 'string') {
          try {
            items = JSON.parse(items);
          } catch (e) {
            console.error('[ordersService] Failed to parse items:', e);
            items = [];
          }
        }
        // Ensure items is always an array
        if (!Array.isArray(items)) {
          items = [];
        }

        return {
          id: doc.$id,
          orderNumber: doc.orderNumber,
          tableId: doc.tableId,
          items: items,
          status: doc.status as OrderStatus,
          paymentStatus: (doc.paymentStatus as PaymentStatus) ?? 'Unpaid',
          totalAmount: doc.totalAmount,
          createdAt: doc.createdAt,
        };
      });
    } catch (error) {
      console.error('[ordersService] Error fetching orders:', error);
      throw new Error('Failed to fetch orders');
    }
  },

  /**
   * Create a new order in Appwrite
   */
  async create(order: Omit<Order, 'id'>): Promise<Order> {
    try {
      const response = await directCreate(APPWRITE_CONFIG.COLLECTIONS.ORDERS, ID.unique(), {
        orderNumber: String(order.orderNumber),
        tableId: String(order.tableId),
        items: JSON.stringify(order.items),
        status: String(order.status),
        paymentStatus: order.paymentStatus ?? 'Unpaid',
        totalAmount: Number(order.totalAmount),
        createdAt: order.createdAt
          ? new Date(order.createdAt).toISOString()
          : new Date().toISOString(),
      });

      let items = response.items;
      if (typeof items === 'string') {
        try { items = JSON.parse(items); } catch { items = []; }
      }
      if (!Array.isArray(items)) items = [];

      return {
        id: response.$id,
        orderNumber: response.orderNumber,
        tableId: response.tableId,
        items,
        status: response.status,
        paymentStatus: (response.paymentStatus as PaymentStatus) ?? 'Unpaid',
        totalAmount: response.totalAmount,
        createdAt: response.createdAt,
      };
    } catch (error) {
      console.error('[ordersService] Error creating order:', error);
      throw new Error('Failed to create order');
    }
  },

  /**
   * Update order status in Appwrite
   */
  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    try {
      const response = await directUpdate(APPWRITE_CONFIG.COLLECTIONS.ORDERS, id, { status: String(status) });

      // Parse items from JSON string
      let items = response.items;
      if (typeof items === 'string') {
        try {
          items = JSON.parse(items);
        } catch (e) {
          items = [];
        }
      }

      return {
        id: response.$id,
        orderNumber: response.orderNumber,
        tableId: response.tableId,
        items: items,
        status: response.status,
        paymentStatus: (response.paymentStatus as PaymentStatus) ?? 'Unpaid',
        totalAmount: response.totalAmount,
        createdAt: response.createdAt,
      };
    } catch (error) {
      console.error('[ordersService] Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  },

  /**
   * Update entire order in Appwrite
   */
  async update(id: string, data: Partial<Omit<Order, 'id'>>): Promise<Order> {
    try {
      const cleanData: Record<string, unknown> = {};
      if (data.orderNumber !== undefined) cleanData.orderNumber = data.orderNumber;
      if (data.tableId !== undefined) cleanData.tableId = data.tableId;
      if (data.items !== undefined) cleanData.items = JSON.stringify(data.items);
      if (data.status !== undefined) cleanData.status = String(data.status);
      if (data.paymentStatus !== undefined) cleanData.paymentStatus = String(data.paymentStatus);
      if (data.totalAmount !== undefined) cleanData.totalAmount = Number(data.totalAmount);
      if (data.createdAt !== undefined) cleanData.createdAt = data.createdAt;

      const response = await directUpdate(APPWRITE_CONFIG.COLLECTIONS.ORDERS, id, cleanData);

      // Parse items from JSON string
      let items = response.items;
      if (typeof items === 'string') {
        try {
          items = JSON.parse(items);
        } catch (e) {
          items = [];
        }
      }

      return {
        id: response.$id,
        orderNumber: response.orderNumber,
        tableId: response.tableId,
        items: items,
        status: response.status,
        paymentStatus: (response.paymentStatus as PaymentStatus) ?? 'Unpaid',
        totalAmount: response.totalAmount,
        createdAt: response.createdAt,
      };
    } catch (error) {
      console.error('[ordersService] Error updating order:', error);
      throw new Error('Failed to update order');
    }
  },

  /**
   * Mark an order as Completed AND Paid — called exclusively from Payment.tsx.
   * This is the ONLY path that sets paymentStatus = 'Paid', ensuring revenue
   * is never counted for orders closed from the kitchen screen.
   */
  async completeWithPayment(id: string): Promise<Order> {
    try {
      const response = await directUpdate(APPWRITE_CONFIG.COLLECTIONS.ORDERS, id, {
        status: 'Completed',
        paymentStatus: 'Paid',
      });

      let items = response.items;
      if (typeof items === 'string') {
        try { items = JSON.parse(items); } catch { items = []; }
      }
      if (!Array.isArray(items)) items = [];

      return {
        id: response.$id,
        orderNumber: response.orderNumber,
        tableId: response.tableId,
        items,
        status: response.status,
        paymentStatus: 'Paid',
        totalAmount: response.totalAmount,
        createdAt: response.createdAt,
      };
    } catch (error) {
      console.error('[ordersService] Error completing order with payment:', error);
      throw new Error('Failed to complete payment');
    }
  },

  /**
   * Delete an order from Appwrite
   */
  async delete(id: string): Promise<void> {
    try {
      await directDelete(APPWRITE_CONFIG.COLLECTIONS.ORDERS, id);
    } catch (error) {
      console.error('[ordersService] Error deleting order:', error);
      throw new Error('Failed to delete order');
    }
  },

  /**
   * Reset orders to defaults (delete all + recreate)
   */
  async resetToDefaults(defaultOrders: Omit<Order, 'id'>[]): Promise<Order[]> {
    try {
      // Get all existing orders
      const existing = await this.getAll();
      
      // Delete all existing orders
      await Promise.all(existing.map(order => this.delete(order.id)));
      
      // Create new default orders
      const created = await Promise.all(
        defaultOrders.map(order => this.create(order))
      );
      
      return created;
    } catch (error) {
      console.error('[ordersService] Error resetting orders:', error);
      throw new Error('Failed to reset orders');
    }
  },
};
