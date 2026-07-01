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
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group relative ${!item.available ? 'opacity-75 grayscale-[0.5]' : ''}`}
    >
      {/* Image Container - grows naturally with the image, no cropping */}
      <div className="relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-auto object-contain block"
        />

        {/* Action buttons — always visible on mobile, hover only on desktop */}
        <div className="absolute top-2 right-2 flex gap-1.5 md:opacity-0 md:group-hover:opacity-100 md:transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(item); }}
            className="p-2 bg-white/90 backdrop-blur rounded-full text-blue-600 hover:bg-blue-50 transition-colors shadow-sm"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
            className="p-2 bg-white/90 backdrop-blur rounded-full text-red-600 hover:bg-red-50 transition-colors shadow-sm"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Sold Out overlay */}
        {!item.available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Text Content */}
      <div className="p-3">
        <div className="flex justify-between items-start mb-1.5">
          <div className="flex-1 min-w-0 mr-2">
            <h3 className="font-bold text-sm text-gray-900 truncate">{item.name}</h3>
            <span className="text-[10px] text-gray-500 font-medium px-1.5 py-0.5 bg-gray-100 rounded-full">
              {item.category}
            </span>
          </div>
          <span className="font-bold text-sm text-mocha-700 shrink-0">${item.price.toFixed(2)}</span>
        </div>

        <p className="text-gray-500 text-xs line-clamp-2 mb-2.5 h-8">{item.description}</p>
        
        <button
          onClick={() => onToggleStatus(item.id)}
          className={`w-full py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
            item.available 
              ? 'bg-green-50 text-green-600 hover:bg-green-100' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Power size={12} />
          {item.available ? 'Available' : 'Unavailable'}
        </button>
      </div>
    </motion.div>
  );
}
