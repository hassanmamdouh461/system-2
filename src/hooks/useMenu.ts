import { useState, useEffect, useCallback } from 'react';
import { MenuItem } from '../types/menu';
import { menuService } from '../services/menuService';

interface UseMenuReturn {
  items: MenuItem[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  addItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateItem: (id: string, data: Partial<Omit<MenuItem, 'id'>>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  toggleAvailability: (id: string) => Promise<void>;
}

/**
 * Custom Hook for Menu State Management with Appwrite
 * Handles loading, error states, and CRUD operations
 */
export function useMenu(): UseMenuReturn {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch menu items from Appwrite
   */
  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await menuService.getAll();
      setItems(data);
      console.log('[useMenu] ✅ Loaded', data.length, 'items from Appwrite');
    } catch (err) {
      setError(err as Error);
      console.error('[useMenu] ❌ Error loading menu:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Initial load on mount
   */
  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  /**
   * Add new menu item (Optimistic UI Update)
   */
  const addItem = useCallback(async (item: Omit<MenuItem, 'id'>) => {
    try {
      // Create in Appwrite first
      const newItem = await menuService.create(item);
      
      // Update local state
      setItems(prev => [newItem, ...prev]);
      console.log('[useMenu] ✅ Added item:', newItem.name);
    } catch (err) {
      console.error('[useMenu] ❌ Error adding item:', err);
      throw err;
    }
  }, []);

  /**
   * Update menu item (Optimistic UI Update with rollback)
   */
  const updateItem = useCallback(async (id: string, data: Partial<Omit<MenuItem, 'id'>>) => {
    // Store old state for rollback
    const oldItems = [...items];
    
    try {
      // Optimistic update
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...data } : item
      ));
      
      // Update in Appwrite
      await menuService.update(id, data);
      console.log('[useMenu] ✅ Updated item:', id);
    } catch (err) {
      // Rollback on error
      setItems(oldItems);
      console.error('[useMenu] ❌ Error updating item, rolled back:', err);
      throw err;
    }
  }, [items]);

  /**
   * Delete menu item (Optimistic UI Update with rollback)
   */
  const deleteItem = useCallback(async (id: string) => {
    // Store old state for rollback
    const oldItems = [...items];
    
    try {
      // Optimistic delete
      setItems(prev => prev.filter(item => item.id !== id));
      
      // Delete from Appwrite
      await menuService.delete(id);
      console.log('[useMenu] ✅ Deleted item:', id);
    } catch (err) {
      // Rollback on error
      setItems(oldItems);
      console.error('[useMenu] ❌ Error deleting item, rolled back:', err);
      throw err;
    }
  }, [items]);

  /**
   * Toggle item availability (convenience method)
   */
  const toggleAvailability = useCallback(async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    
    await updateItem(id, { available: !item.available });
  }, [items, updateItem]);

  return {
    items,
    loading,
    error,
    refetch: fetchMenu,
    addItem,
    updateItem,
    deleteItem,
    toggleAvailability,
  };
}
