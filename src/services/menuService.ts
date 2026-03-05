import { databases, directCreate, directUpdate, directDelete, APPWRITE_CONFIG } from '../lib/appwrite';
import { MenuItem } from '../types/menu';
import { ID, Query } from 'appwrite';

/**
 * Menu Service - Handle all CRUD operations for Menu Items using Appwrite
 */
export const menuService = {
  /**
   * Fetch all menu items from Appwrite
   */
  async getAll(): Promise<MenuItem[]> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.DB_ID,
        APPWRITE_CONFIG.COLLECTIONS.MENU
      );

      return response.documents.map((doc: any) => ({
        id: doc.$id,
        name: doc.name,
        description: doc.description,
        price: doc.price,
        category: doc.category,
        image: doc.image,
        available: doc.available,
      }));
    } catch (error) {
      console.error('[menuService] Error fetching menu items:', error);
      throw new Error('Failed to fetch menu items');
    }
  },

  /**
   * Create a new menu item in Appwrite
   */
  async create(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    try {
      const response = await directCreate(APPWRITE_CONFIG.COLLECTIONS.MENU, ID.unique(), {
        name: String(item.name),
        description: String(item.description ?? ''),
        price: Number(item.price),
        category: String(item.category),
        image: String(item.image ?? ''),
        available: Boolean(item.available),
      });

      return {
        id: response.$id,
        name: response.name,
        description: response.description,
        price: response.price,
        category: response.category,
        image: response.image,
        available: response.available,
      };
    } catch (error) {
      console.error('[menuService] Error creating menu item:', error);
      throw new Error('Failed to create menu item');
    }
  },

  /**
   * Update an existing menu item in Appwrite
   */
  async update(id: string, data: Partial<Omit<MenuItem, 'id'>>): Promise<MenuItem> {
    try {
      const cleanData: Record<string, unknown> = {};
      if (data.name !== undefined) cleanData.name = data.name;
      if (data.description !== undefined) cleanData.description = data.description;
      if (data.price !== undefined) cleanData.price = Number(data.price);
      if (data.category !== undefined) cleanData.category = data.category;
      if (data.image !== undefined) cleanData.image = data.image;
      if (data.available !== undefined) cleanData.available = Boolean(data.available);

      const response = await directUpdate(APPWRITE_CONFIG.COLLECTIONS.MENU, id, cleanData);

      return {
        id: response.$id,
        name: response.name,
        description: response.description,
        price: response.price,
        category: response.category,
        image: response.image,
        available: response.available,
      };
    } catch (error) {
      console.error('[menuService] Error updating menu item:', error);
      throw new Error('Failed to update menu item');
    }
  },

  /**
   * Delete a menu item from Appwrite
   */
  async delete(id: string): Promise<void> {
    try {
      await directDelete(APPWRITE_CONFIG.COLLECTIONS.MENU, id);
    } catch (error) {
      console.error('[menuService] Error deleting menu item:', error);
      throw new Error('Failed to delete menu item');
    }
  },

  /**
   * Reset menu to default items (delete all + recreate)
   */
  async resetToDefaults(defaultItems: Omit<MenuItem, 'id'>[]): Promise<MenuItem[]> {
    try {
      // Get all existing items
      const existing = await this.getAll();
      
      // Delete all existing items
      await Promise.all(existing.map(item => this.delete(item.id)));
      
      // Create new default items
      const created = await Promise.all(
        defaultItems.map(item => this.create(item))
      );
      
      return created;
    } catch (error) {
      console.error('[menuService] Error resetting menu:', error);
      throw new Error('Failed to reset menu');
    }
  },
};
