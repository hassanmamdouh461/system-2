import React from 'react';
import { MenuItem } from '../../types/menu';
import { Edit, Trash2, Power } from 'lucide-react';
import { motion } from 'framer-motion';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function MenuItemCard({ item, onEdit, onDelete, onToggleStatus }: MenuItemCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group relative h-auto ${!item.available ? 'opacity-75 grayscale-[0.5]' : ''}`}
    >
      {/* Image Container - No Fixed Height */}
      <div className="relative overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(item)} 
            className="p-2 bg-white/90 backdrop-blur rounded-full text-blue-600 hover:bg-blue-50 transition-colors shadow-sm"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => onDelete(item.id)}
            className="p-2 bg-white/90 backdrop-blur rounded-full text-red-600 hover:bg-red-50 transition-colors shadow-sm"
          >
            <Trash2 size={16} />
          </button>
        </div>
        {!item.available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">Sold Out</span>
          </div>
        )}
      </div>

      {/* Text Content Below Image */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-gray-900 line-clamp-1">{item.name}</h3>
            <span className="text-xs text-gray-500 font-medium px-2 py-0.5 bg-gray-100 rounded-full">
              {item.category}
            </span>
          </div>
          <span className="font-bold text-lg text-mocha-700">${item.price.toFixed(2)}</span>
        </div>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">{item.description}</p>
        
        <button
          onClick={() => onToggleStatus(item.id)}
          className={`w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            item.available 
              ? 'bg-green-50 text-green-600 hover:bg-green-100' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Power size={16} />
          {item.available ? 'Available' : 'Unavailable'}
        </button>
      </div>
    </motion.div>
  );
}
