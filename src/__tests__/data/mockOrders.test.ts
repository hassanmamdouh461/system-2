import { describe, it, expect } from 'vitest';
import { MOCK_ORDERS, Order, OrderStatus } from '../../types/order';

describe('MOCK_ORDERS data integrity', () => {
  it('contains exactly 8 orders', () => {
    expect(MOCK_ORDERS).toHaveLength(8);
  });

  it('every order has a unique id', () => {
    const ids = MOCK_ORDERS.map(o => o.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(MOCK_ORDERS.length);
  });

  it('every order has a unique orderNumber', () => {
    const nums = MOCK_ORDERS.map(o => o.orderNumber);
    const unique = new Set(nums);
    expect(unique.size).toBe(MOCK_ORDERS.length);
  });

  it('all orders start as Unpaid', () => {
    MOCK_ORDERS.forEach(order => {
      expect(order.paymentStatus).toBe('Unpaid');
    });
  });

  it('contains 3 New, 2 Preparing, and 3 Ready orders', () => {
    const counts = MOCK_ORDERS.reduce<Record<OrderStatus, number>>(
      (acc, o) => {
        acc[o.status] = (acc[o.status] ?? 0) + 1;
        return acc;
      },
      {} as Record<OrderStatus, number>,
    );

    expect(counts['New']).toBe(3);
    expect(counts['Preparing']).toBe(2);
    expect(counts['Ready']).toBe(3);
    expect(counts['Completed']).toBeUndefined();
    expect(counts['Cancelled']).toBeUndefined();
  });

  it('every order has a positive totalAmount', () => {
    MOCK_ORDERS.forEach((order: Order) => {
      expect(order.totalAmount).toBeGreaterThan(0);
    });
  });

  it('every order has at least one item', () => {
    MOCK_ORDERS.forEach(order => {
      expect(order.items.length).toBeGreaterThan(0);
    });
  });

  it('every order has a valid ISO 8601 createdAt timestamp', () => {
    MOCK_ORDERS.forEach(order => {
      const ts = new Date(order.createdAt).getTime();
      expect(Number.isNaN(ts)).toBe(false);
    });
  });

  it('all orderNumbers follow the ORD-NNN format', () => {
    MOCK_ORDERS.forEach(order => {
      expect(order.orderNumber).toMatch(/^ORD-\d+$/);
    });
  });

  it('every order item has a positive price and a positive quantity', () => {
    MOCK_ORDERS.forEach(order => {
      order.items.forEach(item => {
        expect(item.price).toBeGreaterThan(0);
        expect(item.quantity).toBeGreaterThan(0);
      });
    });
  });
});
