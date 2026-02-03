export type OrderStatus = 'New' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';
export type SortingOption = 'Newest' | 'Oldest';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  tableId: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string; // ISO string
}

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-1025',
    tableId: 'T-4',
    status: 'New',
    items: [
      { id: '1', name: 'Classic Cheeseburger', quantity: 2, price: 12.99 },
      { id: '5', name: 'Strawberry Milkshake', quantity: 1, price: 6.50 },
    ],
    totalAmount: 32.48,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ORD-1024',
    tableId: 'T-8',
    status: 'Preparing',
    items: [
      { id: '3', name: 'Margherita Pizza', quantity: 1, price: 14.00 },
      { id: '53', name: 'Coke', quantity: 2, price: 2.50 },
    ],
    totalAmount: 19.00,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
  },
  {
    id: 'ORD-1023',
    tableId: 'T-2',
    status: 'Ready',
    items: [
      { id: '4', name: 'Pepperoni Feast', quantity: 1, price: 16.00 },
    ],
    totalAmount: 16.00,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
  },
  {
    id: 'ORD-1022',
    tableId: 'Takeout',
    status: 'Completed',
    items: [
      { id: '2', name: 'Double Bacon Blast', quantity: 1, price: 16.50 },
    ],
    totalAmount: 16.50,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
];
