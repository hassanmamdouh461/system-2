export type OrderStatus = 'New' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';
export type PaymentStatus = 'Unpaid' | 'Paid';
export type SortingOption = 'Newest' | 'Oldest';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string; // Database ID (for API calls)
  orderNumber: string; // Display ID (e.g., ORD-1025)
  tableId: string;
  status: OrderStatus;
  /** Financial status. Only set to 'Paid' from Payment.tsx — never from the kitchen/orders screen. */
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string; // ISO string
}

export const MOCK_ORDERS: Order[] = [
  // ═══════════════ 2 NEW ORDERS ═══════════════
  {
    id: 'mock-id-1008',
    orderNumber: 'ORD-1008',
    tableId: 'T-3',
    status: 'New',
    paymentStatus: 'Unpaid',
    items: [
      { id: '1', name: 'Espresso', quantity: 2, price: 3.50 },
      { id: '3', name: 'Cappuccino', quantity: 1, price: 5.00 },
    ],
    totalAmount: 12.00,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mock-id-1007',
    orderNumber: 'ORD-1007',
    tableId: 'T-5',
    status: 'New',
    paymentStatus: 'Unpaid',
    items: [
      { id: '2', name: 'Spanish Latte', quantity: 1, price: 6.00 },
      { id: '6', name: 'Mocha Frappe', quantity: 1, price: 7.00 },
    ],
    totalAmount: 13.00,
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },

  // ═══════════════ 2 BREWING (Preparing) ═══════════════
  {
    id: 'mock-id-1006',
    orderNumber: 'ORD-1006',
    tableId: 'T-7',
    status: 'Preparing',
    paymentStatus: 'Unpaid',
    items: [
      { id: '6', name: 'Mocha Frappe', quantity: 2, price: 7.00 },
      { id: '4', name: 'Iced Latte', quantity: 1, price: 5.50 },
    ],
    totalAmount: 19.50,
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
  {
    id: 'mock-id-1005',
    orderNumber: 'ORD-1005',
    tableId: 'T-2',
    status: 'Preparing',
    paymentStatus: 'Unpaid',
    items: [
      { id: '3', name: 'Cappuccino', quantity: 2, price: 5.00 },
      { id: '8', name: 'Strawberry Milkshake', quantity: 1, price: 6.00 },
    ],
    totalAmount: 16.00,
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },

  // ═══════════════ 2 READY FOR PICKUP ═══════════════
  {
    id: 'mock-id-1004',
    orderNumber: 'ORD-1004',
    tableId: 'T-1',
    status: 'Ready',
    paymentStatus: 'Unpaid',
    items: [
      { id: '1', name: 'Espresso', quantity: 3, price: 3.50 },
      { id: '7', name: 'Oreo Milkshake', quantity: 2, price: 6.50 },
    ],
    totalAmount: 23.50,
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    id: 'mock-id-1003',
    orderNumber: 'ORD-1003',
    tableId: 'T-4',
    status: 'Ready',
    paymentStatus: 'Unpaid',
    items: [
      { id: '5', name: 'Iced Caramel Macchiato', quantity: 2, price: 6.50 },
      { id: '7', name: 'Oreo Milkshake', quantity: 1, price: 6.50 },
    ],
    totalAmount: 19.50,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },

  // ═══════════════ 2 COMPLETED (Paid via Payment screen) ═══════════════
  {
    id: 'mock-id-1002',
    orderNumber: 'ORD-1002',
    tableId: 'T-6',
    status: 'Completed',
    paymentStatus: 'Paid',
    items: [
      { id: '2', name: 'Spanish Latte', quantity: 1, price: 6.00 },
      { id: '3', name: 'Cappuccino', quantity: 1, price: 5.00 },
      { id: '8', name: 'Strawberry Milkshake', quantity: 1, price: 6.00 },
    ],
    totalAmount: 17.00,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'mock-id-1001',
    orderNumber: 'ORD-1001',
    tableId: 'T-8',
    status: 'Completed',
    paymentStatus: 'Paid',
    items: [
      { id: '4', name: 'Iced Latte', quantity: 2, price: 5.50 },
      { id: '6', name: 'Mocha Frappe', quantity: 1, price: 7.00 },
    ],
    totalAmount: 18.00,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
];
