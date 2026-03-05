import { databases, APPWRITE_CONFIG } from '../lib/appwrite';
import { Order, OrderStatus } from '../types/order';
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
      const response: any = await databases.createDocument(
        APPWRITE_CONFIG.DB_ID,
        APPWRITE_CONFIG.COLLECTIONS.ORDERS,
        ID.unique(),
        {
          orderNumber: order.orderNumber,
          tableId: order.tableId,
          items: JSON.stringify(order.items), // Store as JSON string
          status: order.status,
          totalAmount: Number(order.totalAmount),
          createdAt: order.createdAt,
        }
      );

      return {
        id: response.$id,
        orderNumber: response.orderNumber,
        tableId: response.tableId,
        items: response.items,
        status: response.status,
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
      const response: any = await databases.updateDocument(
        APPWRITE_CONFIG.DB_ID,
        APPWRITE_CONFIG.COLLECTIONS.ORDERS,
        id,
        { status }
      );

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
      // Clean and prepare data for Appwrite
      const cleanData: any = {};
      if (data.orderNumber !== undefined) cleanData.orderNumber = data.orderNumber;
      if (data.tableId !== undefined) cleanData.tableId = data.tableId;
      if (data.items !== undefined) cleanData.items = JSON.stringify(data.items);
      if (data.status !== undefined) cleanData.status = data.status;
      if (data.totalAmount !== undefined) cleanData.totalAmount = Number(data.totalAmount);
      if (data.createdAt !== undefined) cleanData.createdAt = data.createdAt;

      const response: any = await databases.updateDocument(
        APPWRITE_CONFIG.DB_ID,
        APPWRITE_CONFIG.COLLECTIONS.ORDERS,
        id,
        cleanData
      );

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
        totalAmount: response.totalAmount,
        createdAt: response.createdAt,
      };
    } catch (error) {
      console.error('[ordersService] Error updating order:', error);
      throw new Error('Failed to update order');
    }
  },

  /**
   * Delete an order from Appwrite
   */
  async delete(id: string): Promise<void> {
    try {
      await databases.deleteDocument(
        APPWRITE_CONFIG.DB_ID,
        APPWRITE_CONFIG.COLLECTIONS.ORDERS,
        id
      );
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
