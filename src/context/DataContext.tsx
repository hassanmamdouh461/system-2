import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { MenuItem } from '../types/menu';
import { Order, OrderStatus } from '../types/order';
import { menuService } from '../services/menuService';
import { ordersService } from '../services/ordersService';
import { client, APPWRITE_CONFIG } from '../lib/appwrite';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MenuState {
  items: MenuItem[];
  loading: boolean;
  error: Error | null;
  addItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateItem: (id: string, data: Partial<Omit<MenuItem, 'id'>>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  toggleAvailability: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: Error | null;
  addOrder: (order: Omit<Order, 'id'>) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  completeWithPayment: (id: string, method?: 'Cash' | 'Card') => Promise<void>;
  updateOrder: (id: string, data: Partial<Omit<Order, 'id'>>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

interface DataContextValue {
  menu: MenuState;
  orders: OrdersState;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const DataContext = createContext<DataContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Menu state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState<Error | null>(null);

  // Orders state
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<Error | null>(null);

  // Track if already fetched (prevent double-fetch in StrictMode)
  const menuFetched = useRef(false);
  const ordersFetched = useRef(false);

  // ── Menu fetching ────────────────────────────────────────────────────────────

  const fetchMenu = useCallback(async () => {
    try {
      setMenuLoading(true);
      setMenuError(null);
      const data = await menuService.getAll();
      setMenuItems(data);
    } catch (err) {
      setMenuError(err as Error);
    } finally {
      setMenuLoading(false);
    }
  }, []);

  // ── Orders fetching ──────────────────────────────────────────────────────────

  const fetchOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);
      const data = await ordersService.getAll();
      setOrdersList(data);
    } catch (err) {
      setOrdersError(err as Error);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  // Fetch once on mount + setup realtime
  useEffect(() => {
    if (!menuFetched.current) {
      menuFetched.current = true;
      fetchMenu();
    }
    if (!ordersFetched.current) {
      ordersFetched.current = true;
      fetchOrders();
    }

    // Realtime subscription - refetch when orders or menu change externally
    const ordersChannel = `databases.${APPWRITE_CONFIG.DB_ID}.collections.${APPWRITE_CONFIG.COLLECTIONS.ORDERS}.documents`;
    const menuChannel = `databases.${APPWRITE_CONFIG.DB_ID}.collections.${APPWRITE_CONFIG.COLLECTIONS.MENU}.documents`;

    const unsubscribe = client.subscribe([ordersChannel, menuChannel], (response) => {
      const channels = response.channels as string[];
      if (channels.some(c => c.includes(APPWRITE_CONFIG.COLLECTIONS.ORDERS))) {
        fetchOrders();
      }
      if (channels.some(c => c.includes(APPWRITE_CONFIG.COLLECTIONS.MENU))) {
        fetchMenu();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [fetchMenu, fetchOrders]);

  // ── Refs for rollback — always point to latest state ─────────────────────────
  const menuItemsRef = useRef(menuItems);
  menuItemsRef.current = menuItems;
  const ordersListRef = useRef(ordersList);
  ordersListRef.current = ordersList;

  // ── Menu mutations ────────────────────────────────────────────────────────────

  const addItem = useCallback(async (item: Omit<MenuItem, 'id'>) => {
    const newItem = await menuService.create(item);
    setMenuItems(prev => [newItem, ...prev]);
  }, []);

  const updateItem = useCallback(async (id: string, data: Partial<Omit<MenuItem, 'id'>>) => {
    const snapshot = menuItemsRef.current;
    setMenuItems(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
    try {
      await menuService.update(id, data);
    } catch (err) {
      setMenuItems(snapshot);
      throw err;
    }
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    const snapshot = menuItemsRef.current;
    setMenuItems(prev => prev.filter(i => i.id !== id));
    try {
      await menuService.delete(id);
    } catch (err) {
      setMenuItems(snapshot);
      throw err;
    }
  }, []);

  const toggleAvailability = useCallback(async (id: string) => {
    const item = menuItemsRef.current.find(i => i.id === id);
    if (!item) return;
    const snapshot = menuItemsRef.current;
    setMenuItems(prev => prev.map(i => i.id === id ? { ...i, available: !i.available } : i));
    try {
      await menuService.update(id, { available: !item.available });
    } catch (err) {
      setMenuItems(snapshot);
      throw err;
    }
  }, []);

  // ── Orders mutations ──────────────────────────────────────────────────────────

  const addOrder = useCallback(async (order: Omit<Order, 'id'>) => {
    const newOrder = await ordersService.create(order);
    setOrdersList(prev => [newOrder, ...prev]);
  }, []);

  const updateOrderStatus = useCallback(async (id: string, status: OrderStatus) => {
    const snapshot = ordersListRef.current;
    setOrdersList(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    try {
      await ordersService.updateStatus(id, status);
    } catch (err) {
      setOrdersList(snapshot);
      throw err;
    }
  }, []);

  const completeWithPayment = useCallback(async (id: string, method: 'Cash' | 'Card' = 'Cash') => {
    const snapshot = ordersListRef.current;
    // Optimistic update: only flip paymentStatus — kitchen status is unchanged.
    // An order paid while still 'New' or 'Preparing' stays in its Kanban column.
    setOrdersList(prev => prev.map(o =>
      o.id === id ? { ...o, paymentStatus: 'Paid' } : o
    ));
    try {
      await ordersService.completeWithPayment(id, method);
    } catch (err) {
      setOrdersList(snapshot);
      throw err;
    }
  }, []);

  const updateOrder = useCallback(async (id: string, data: Partial<Omit<Order, 'id'>>) => {
    const snapshot = ordersListRef.current;
    setOrdersList(prev => prev.map(o => o.id === id ? { ...o, ...data } : o));
    try {
      await ordersService.update(id, data);
    } catch (err) {
      setOrdersList(snapshot);
      throw err;
    }
  }, []);

  const deleteOrder = useCallback(async (id: string) => {
    const snapshot = ordersListRef.current;
    setOrdersList(prev => prev.filter(o => o.id !== id));
    try {
      await ordersService.delete(id);
    } catch (err) {
      setOrdersList(snapshot);
      throw err;
    }
  }, []);

  // ── Context value ─────────────────────────────────────────────────────────────

  const value: DataContextValue = {
    menu: {
      items: menuItems,
      loading: menuLoading,
      error: menuError,
      addItem,
      updateItem,
      deleteItem,
      toggleAvailability,
      refetch: fetchMenu,
    },
    orders: {
      orders: ordersList,
      loading: ordersLoading,
      error: ordersError,
      addOrder,
      updateOrderStatus,
      completeWithPayment,
      updateOrder,
      deleteOrder,
      refetch: fetchOrders,
    },
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useMenuContext(): MenuState {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useMenuContext must be used within DataProvider');
  return ctx.menu;
}

export function useOrdersContext(): OrdersState {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useOrdersContext must be used within DataProvider');
  return ctx.orders;
}
