import { executeD1Query } from '../lib/cloudflareD1';
import { Order, OrderStatus, PaymentStatus } from '../types/order';

/**
 * Orders Service - Handle all CRUD operations for Orders using Cloudflare D1
 */
export const ordersService = {
  /**
   * Fetch all orders from D1
   */
  async getAll(): Promise<Order[]> {
    try {
      const results = await executeD1Query<any>('SELECT * FROM orders ORDER BY createdAt DESC');
      
      return results.map((row: any) => {
        let items = row.items;
        if (typeof items === 'string') {
          try {
            items = JSON.parse(items);
          } catch (e) {
            console.error('[ordersService] Failed to parse items:', e);
            items = [];
          }
        }
        if (!Array.isArray(items)) {
          items = [];
        }

        return {
          id: row.id,
          orderNumber: row.orderNumber,
          tableId: row.tableId,
          items,
          status: row.status as OrderStatus,
          paymentStatus: (row.paymentStatus as PaymentStatus) ?? 'Unpaid',
          totalAmount: Number(row.totalAmount),
          createdAt: row.createdAt,
        };
      });
    } catch (error) {
      console.error('[ordersService] Error fetching orders:', error);
      throw new Error('Failed to fetch orders');
    }
  },

  /**
   * Create a new order in D1
   */
  async create(order: Omit<Order, 'id'>): Promise<Order> {
    try {
      const id = crypto.randomUUID();
      const createdAt = order.createdAt
        ? new Date(order.createdAt).toISOString()
        : new Date().toISOString();

      await executeD1Query(
        `INSERT INTO orders (id, orderNumber, tableId, items, status, paymentStatus, paymentMethod, totalAmount, createdAt, paidAt, branch_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          String(order.orderNumber),
          String(order.tableId),
          JSON.stringify(order.items),
          String(order.status),
          order.paymentStatus ?? 'Unpaid',
          null, // paymentMethod
          Number(order.totalAmount),
          createdAt,
          null, // paidAt
          'default' // branch_id
        ]
      );

      return {
        id,
        ...order,
        createdAt,
      };
    } catch (error) {
      console.error('[ordersService] Error creating order:', error);
      throw new Error('Failed to create order');
    }
  },

  /**
   * Update order status in D1
   */
  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    try {
      await executeD1Query(
        'UPDATE orders SET status = ? WHERE id = ?',
        [String(status), id]
      );

      // Fetch the updated order to return it
      const updatedList = await executeD1Query<any>('SELECT * FROM orders WHERE id = ?', [id]);
      if (updatedList.length === 0) {
        throw new Error('Order not found after updateStatus');
      }

      const row = updatedList[0];
      let items = row.items;
      if (typeof items === 'string') {
        try { items = JSON.parse(items); } catch { items = []; }
      }
      if (!Array.isArray(items)) items = [];

      return {
        id: row.id,
        orderNumber: row.orderNumber,
        tableId: row.tableId,
        items,
        status: row.status as OrderStatus,
        paymentStatus: (row.paymentStatus as PaymentStatus) ?? 'Unpaid',
        totalAmount: Number(row.totalAmount),
        createdAt: row.createdAt,
      };
    } catch (error) {
      console.error('[ordersService] Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  },

  /**
   * Update entire order in D1
   */
  async update(id: string, data: Partial<Omit<Order, 'id'>>): Promise<Order> {
    try {
      const fieldsToUpdate: string[] = [];
      const params: any[] = [];

      if (data.orderNumber !== undefined) {
        fieldsToUpdate.push('orderNumber = ?');
        params.push(String(data.orderNumber));
      }
      if (data.tableId !== undefined) {
        fieldsToUpdate.push('tableId = ?');
        params.push(String(data.tableId));
      }
      if (data.items !== undefined) {
        fieldsToUpdate.push('items = ?');
        params.push(JSON.stringify(data.items));
      }
      if (data.status !== undefined) {
        fieldsToUpdate.push('status = ?');
        params.push(String(data.status));
      }
      if (data.paymentStatus !== undefined) {
        fieldsToUpdate.push('paymentStatus = ?');
        params.push(String(data.paymentStatus));
      }
      if (data.totalAmount !== undefined) {
        fieldsToUpdate.push('totalAmount = ?');
        params.push(Number(data.totalAmount));
      }
      if (data.createdAt !== undefined) {
        fieldsToUpdate.push('createdAt = ?');
        params.push(data.createdAt);
      }

      if (fieldsToUpdate.length === 0) {
        // Nothing to update, fetch and return
        const updatedList = await executeD1Query<any>('SELECT * FROM orders WHERE id = ?', [id]);
        if (updatedList.length === 0) throw new Error('Order not found');
        const row = updatedList[0];
        let items = row.items;
        if (typeof items === 'string') {
          try { items = JSON.parse(items); } catch { items = []; }
        }
        if (!Array.isArray(items)) items = [];
        return {
          id: row.id,
          orderNumber: row.orderNumber,
          tableId: row.tableId,
          items,
          status: row.status as OrderStatus,
          paymentStatus: (row.paymentStatus as PaymentStatus) ?? 'Unpaid',
          totalAmount: Number(row.totalAmount),
          createdAt: row.createdAt,
        };
      }

      params.push(id); // for the WHERE clause

      await executeD1Query(
        `UPDATE orders SET ${fieldsToUpdate.join(', ')} WHERE id = ?`,
        params
      );

      // Fetch the updated order to return it
      const updatedList = await executeD1Query<any>('SELECT * FROM orders WHERE id = ?', [id]);
      if (updatedList.length === 0) {
        throw new Error('Order not found after update');
      }

      const row = updatedList[0];
      let items = row.items;
      if (typeof items === 'string') {
        try { items = JSON.parse(items); } catch { items = []; }
      }
      if (!Array.isArray(items)) items = [];

      return {
        id: row.id,
        orderNumber: row.orderNumber,
        tableId: row.tableId,
        items,
        status: row.status as OrderStatus,
        paymentStatus: (row.paymentStatus as PaymentStatus) ?? 'Unpaid',
        totalAmount: Number(row.totalAmount),
        createdAt: row.createdAt,
      };
    } catch (error) {
      console.error('[ordersService] Error updating order:', error);
      throw new Error('Failed to update order');
    }
  },

  /**
   * Mark an order as Paid — called exclusively from Payment.tsx.
   */
  async completeWithPayment(id: string, method: 'Cash' | 'Card' = 'Cash'): Promise<Order> {
    try {
      const now = new Date().toISOString();
      await executeD1Query(
        'UPDATE orders SET paymentStatus = ?, paymentMethod = ?, paidAt = ? WHERE id = ?',
        ['Paid', method, now, id]
      );

      const updatedList = await executeD1Query<any>('SELECT * FROM orders WHERE id = ?', [id]);
      if (updatedList.length === 0) {
        throw new Error('Order not found after payment');
      }

      const row = updatedList[0];
      let items = row.items;
      if (typeof items === 'string') {
        try { items = JSON.parse(items); } catch { items = []; }
      }
      if (!Array.isArray(items)) items = [];

      return {
        id: row.id,
        orderNumber: row.orderNumber,
        tableId: row.tableId,
        items,
        status: row.status as OrderStatus,
        paymentStatus: 'Paid',
        totalAmount: Number(row.totalAmount),
        createdAt: row.createdAt,
      };
    } catch (error) {
      console.error('[ordersService] Error completing order with payment:', error);
      throw new Error('Failed to complete payment');
    }
  },

  /**
   * Delete an order from D1
   */
  async delete(id: string): Promise<void> {
    try {
      await executeD1Query('DELETE FROM orders WHERE id = ?', [id]);
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
      await executeD1Query('DELETE FROM orders');
      
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
