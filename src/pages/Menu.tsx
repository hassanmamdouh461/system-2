import React, { useState } from 'react';
import { Plus, Search, Filter, Coffee, Snowflake, Wine, IceCream } from 'lucide-react';
import { MenuItem, CATEGORIES, INITIAL_MENU_ITEMS } from '../types/menu';
import { MenuItemCard } from '../components/menu/MenuItemCard';
import { MenuModal } from '../components/menu/MenuModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Menu() {
  // Use localStorage to persist menu items - fallback to INITIAL_MENU_ITEMS on first load
  const [items, setItems] = useLocalStorage<MenuItem[]>('brewmaster_menu', INITIAL_MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggleStatus = (id: string) => {
    // Use functional update to avoid stale closures
    setItems(prevItems => prevItems.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleSave = (itemData: MenuItem | Omit<MenuItem, 'id'>) => {
    if ('id' in itemData) {
      // Edit existing
      setItems(prevItems => prevItems.map(item => 
        item.id === itemData.id ? itemData as MenuItem : item
      ));
    } else {
      // Add new
      const newItem = {
        ...itemData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      } as MenuItem;
      setItems(prevItems => [newItem, ...prevItems]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-3 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-xs md:text-base text-gray-500">Manage your coffee beverages, categories, and availability.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="mobile-touch-target bg-mocha-700 hover:bg-mocha-800 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-mocha-500/20 transition-all active:scale-95 tap-highlight-none w-full md:w-auto text-sm md:text-base"
        >
          <Plus size={18} />
          Add New Item
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-2 md:p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2 md:gap-3 sticky top-0 z-10 backdrop-blur-xl bg-white/95">
        {/* Categories - Horizontal scroll on mobile */}
        <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto hide-scrollbar pb-1">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`mobile-touch-target px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-colors tap-highlight-none ${
                selectedCategory === category
                  ? 'bg-mocha-700 text-white'
                  : 'bg-mocha-100 text-mocha-800 hover:bg-mocha-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 md:py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-caramel focus:border-transparent text-base"
          />
        </div>
      </div>

      {/* Menu Grid - 1 col on mobile, 2 on tablet, 4 on desktop */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
      >
        <AnimatePresence>
          {filteredItems.map(item => (
            <MenuItemCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 md:py-20 text-gray-500">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-base md:text-lg font-medium">No items found</p>
          <p className="text-sm">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Modal */}
      <MenuModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingItem}
      />
    </div>
  );
}
