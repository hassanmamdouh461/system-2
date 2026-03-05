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

      return response.documents.map((doc: any) => ({
        id: doc.$id,
        orderNumber: doc.orderNumber,
        tableId: doc.tableId,
        items: doc.items,
        status: doc.status as OrderStatus,
        totalAmount: doc.totalAmount,
        createdAt: doc.createdAt,
      }));
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
          items: order.items,
          status: order.status,
          totalAmount: order.totalAmount,
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
      console.error('[ordersService] Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  },

  /**
   * Update entire order in Appwrite
   */
  async update(id: string, data: Partial<Omit<Order, 'id'>>): Promise<Order> {
    try {
      const response: any = await databases.updateDocument(
        APPWRITE_CONFIG.DB_ID,
        APPWRITE_CONFIG.COLLECTIONS.ORDERS,
        id,
        data
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
