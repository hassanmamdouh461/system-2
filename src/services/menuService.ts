import { executeD1Query } from '../lib/cloudflareD1';
import { MenuItem } from '../types/menu';

/**
 * Menu Service - Handle all CRUD operations for Menu Items using Cloudflare D1
 */
export const menuService = {
  /**
   * Fetch all menu items from D1
   */
  async getAll(): Promise<MenuItem[]> {
    try {
      const results = await executeD1Query<any>('SELECT * FROM menu_items ORDER BY category, name');
      return results.map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description || '',
        price: Number(row.price),
        category: row.category,
        image: row.image || '',
        available: Boolean(row.available),
      }));
    } catch (error) {
      console.error('[menuService] Error fetching menu items:', error);
      throw new Error('Failed to fetch menu items');
    }
  },

  /**
   * Create a new menu item in D1
   */
  async create(item: MenuItem): Promise<MenuItem> {
    try {
      await executeD1Query(
        `INSERT INTO menu_items (id, name, description, price, category, image, available, branch_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          String(item.name),
          String(item.description ?? ''),
          Number(item.price),
          String(item.category),
          String(item.image ?? ''),
          item.available ? 1 : 0,
          'default'
        ]
      );

      return item;
    } catch (error) {
      console.error('[menuService] Error creating menu item:', error);
      throw new Error('Failed to create menu item');
    }
  },

  /**
   * Update an existing menu item in D1
   */
  async update(id: string, data: Partial<Omit<MenuItem, 'id'>>): Promise<MenuItem> {
    try {
      const fieldsToUpdate: string[] = [];
      const params: any[] = [];

      if (data.name !== undefined) {
        fieldsToUpdate.push('name = ?');
        params.push(String(data.name));
      }
      if (data.description !== undefined) {
        fieldsToUpdate.push('description = ?');
        params.push(String(data.description));
      }
      if (data.price !== undefined) {
        fieldsToUpdate.push('price = ?');
        params.push(Number(data.price));
      }
      if (data.category !== undefined) {
        fieldsToUpdate.push('category = ?');
        params.push(String(data.category));
      }
      if (data.image !== undefined) {
        fieldsToUpdate.push('image = ?');
        params.push(String(data.image));
      }
      if (data.available !== undefined) {
        fieldsToUpdate.push('available = ?');
        params.push(data.available ? 1 : 0);
      }

      if (fieldsToUpdate.length === 0) {
        // Nothing to update, fetch and return
        const updatedList = await executeD1Query<any>('SELECT * FROM menu_items WHERE id = ?', [id]);
        if (updatedList.length === 0) throw new Error('Menu item not found');
        const row = updatedList[0];
        return {
          id: row.id,
          name: row.name,
          description: row.description || '',
          price: Number(row.price),
          category: row.category,
          image: row.image || '',
          available: Boolean(row.available),
        };
      }

      params.push(id); // for the WHERE clause

      await executeD1Query(
        `UPDATE menu_items SET ${fieldsToUpdate.join(', ')} WHERE id = ?`,
        params
      );

      // Fetch the updated item to return it
      const updatedList = await executeD1Query<any>('SELECT * FROM menu_items WHERE id = ?', [id]);
      if (updatedList.length === 0) {
        throw new Error('Menu item not found after update');
      }

      const row = updatedList[0];
      return {
        id: row.id,
        name: row.name,
        description: row.description || '',
        price: Number(row.price),
        category: row.category,
        image: row.image || '',
        available: Boolean(row.available),
      };
    } catch (error) {
      console.error('[menuService] Error updating menu item:', error);
      throw new Error('Failed to update menu item');
    }
  },

  /**
   * Delete a menu item from D1
   */
  async delete(id: string): Promise<void> {
    try {
      await executeD1Query('DELETE FROM menu_items WHERE id = ?', [id]);
    } catch (error) {
      console.error('[menuService] Error deleting menu item:', error);
      throw new Error('Failed to delete menu item');
    }
  },

  /**
   * Reset menu to default items (delete all + recreate)
   */
  async resetToDefaults(defaultItems: MenuItem[]): Promise<MenuItem[]> {
    try {
      // Delete all existing items
      await executeD1Query('DELETE FROM menu_items');
      
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
