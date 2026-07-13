import React, { useState, useEffect } from 'react';
import { Coffee, Search, Globe, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { menuService } from '../services/menuService';
import { MenuItem } from '../types/menu';

const TRANSLATIONS = {
  en: {
    title: 'BrewMaster',
    subtitle: 'Premium Coffee & Treats Menu',
    searchPlaceholder: 'Search for coffee, shakes...',
    available: 'Available',
    outOfStock: 'Out of Stock',
    all: 'All',
    hotCoffee: 'Hot Coffee',
    icedCoffee: 'Iced Coffee',
    frappe: 'Frappe',
    milkshakes: 'Milkshakes',
    noItems: 'No items found',
    tryAgain: 'Try searching for something else.',
    loading: 'Brewing your menu...',
    errorMsg: 'Could not load the menu. Please try again.',
  },
  ar: {
    title: 'بروماستر',
    subtitle: 'قائمة القهوة والحلويات الفاخرة',
    searchPlaceholder: 'ابحث عن قهوة، ميلك شيك...',
    available: 'متوفر',
    outOfStock: 'غير متوفر حالياً',
    all: 'الكل',
    hotCoffee: 'قهوة ساخنة',
    icedCoffee: 'قهوة باردة',
    frappe: 'فرابيه',
    milkshakes: 'ميلك شيك',
    noItems: 'لم يتم العثور على أصناف',
    tryAgain: 'جرب البحث عن صنف آخر.',
    loading: 'جاري تحضير القائمة...',
    errorMsg: 'تعذر تحميل القائمة. يرجى المحاولة مرة أخرى.',
  }
};

const CATEGORY_TRANSLATIONS: Record<string, { en: string; ar: string }> = {
  'All': { en: 'All', ar: 'الكل' },
  'Bar': { en: 'Bar / Drinks', ar: 'المشروبات' },
  'Kitchen': { en: 'Kitchen / Food', ar: 'المأكولات' }
};

export default function PublicMenu() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar'); // Default to Arabic as requested by user's context
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const t = TRANSLATIONS[lang];
  const isRtl = lang === 'ar';

  useEffect(() => {
    async function loadMenu() {
      try {
        setLoading(true);
        const fetchedItems = await menuService.getAll();
        setItems(fetchedItems);
      } catch (err) {
        console.error('Error fetching public menu:', err);
        setError(t.errorMsg);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, [t.errorMsg]);

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Bar', 'Kitchen'];

  if (loading) {
    return (
      <div className="min-h-screen bg-mocha-50 flex flex-col items-center justify-center p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="mb-4"
        >
          <Coffee className="w-12 h-12 text-mocha-600" />
        </motion.div>
        <p className="text-mocha-800 font-medium animate-pulse">{t.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-mocha-50 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">{t.errorMsg}</h2>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2.5 bg-mocha-700 text-white rounded-xl font-medium shadow-md hover:bg-mocha-800 transition-colors"
        >
          {lang === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pb-12 font-sans overflow-hidden text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Background Image & Overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center z-0 scale-105 transition-transform duration-1000"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1000&auto=format&fit=crop&q=80')` 
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-stone-950/90 via-stone-900/85 to-stone-950/90 backdrop-blur-[3px] z-0" />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-md mx-auto px-4">
        {/* Top Banner / Hero */}
        <header className="py-12 flex flex-col items-center text-center relative">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(prev => prev === 'ar' ? 'en' : 'ar')}
            className="absolute top-4 right-0 bg-white/5 hover:bg-white/15 backdrop-blur text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all text-stone-200 border border-white/10 shadow-lg"
          >
            <Globe size={14} className="text-amber-400" />
            {lang === 'ar' ? 'English' : 'العربية'}
          </button>

          {/* Logo */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/30 rounded-full flex items-center justify-center mb-4 shadow-xl shadow-amber-950/20 backdrop-blur-md"
          >
            <Coffee className="w-10 h-10 text-amber-400" />
          </motion.div>

          <h1 className="text-3xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-white via-stone-100 to-amber-200 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-amber-400/80 text-xs font-semibold tracking-wider uppercase">
            {t.subtitle}
          </p>
        </header>

        {/* Search */}
        <div className="relative mb-6 shadow-2xl">
          <div className={`absolute inset-y-0 ${isRtl ? 'right-3.5' : 'left-3.5'} flex items-center pointer-events-none`}>
            <Search className="h-5 w-5 text-stone-400" />
          </div>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm shadow-inner transition-all text-white placeholder-stone-400 backdrop-blur-md ${
              isRtl ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'
            }`}
          />
        </div>

        {/* Categories Carousel */}
        <div className="flex items-center gap-2.5 overflow-x-auto hide-scrollbar pb-3 mb-6 scroll-smooth">
          {categories.map(category => {
            const label = CATEGORY_TRANSLATIONS[category]?.[lang] || category;
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/25 scale-105 border border-amber-400'
                    : 'bg-white/5 text-stone-300 border border-white/5 hover:bg-white/10 backdrop-blur-sm'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Menu Items List */}
        <motion.div layout className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={`bg-stone-900/40 border border-white/5 rounded-3xl p-4.5 shadow-xl relative overflow-hidden backdrop-blur-md flex flex-col justify-between transition-all ${
                  !item.available ? 'opacity-50 saturate-50' : 'hover:border-white/15 hover:bg-stone-900/60'
                }`}
              >
                {/* Glowing subtle accent line inside card */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="font-bold text-white text-base tracking-wide">
                    {item.name}
                  </h3>
                  <span className="font-black text-amber-400 text-base flex-shrink-0">
                    {item.price.toFixed(2)} {lang === 'ar' ? 'ج.م' : 'EGP'}
                  </span>
                </div>

                {item.description && (
                  <p className="text-stone-300 text-xs leading-relaxed mb-4">
                    {item.description}
                  </p>
                )}

                {/* Badges */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-[10px] text-amber-400/90 font-bold px-2.5 py-1 bg-amber-400/10 rounded-lg border border-amber-400/10">
                    {CATEGORY_TRANSLATIONS[item.category]?.[lang] || item.category}
                  </span>

                  {item.available ? (
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg font-bold border border-emerald-500/10 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {t.available}
                    </span>
                  ) : (
                    <span className="text-[10px] text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg font-bold border border-rose-500/10">
                      {t.outOfStock}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 px-4"
          >
            <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10 backdrop-blur-md">
              <Search className="w-8 h-8 text-stone-400" />
            </div>
            <p className="text-base font-bold text-stone-200">{t.noItems}</p>
            <p className="text-xs text-stone-400 mt-1.5">{t.tryAgain}</p>
          </motion.div>
        )}

        {/* Footer / Powered by */}
        <footer className="text-center mt-16 pb-4">
          <p className="text-xs text-stone-500 font-medium">
            {lang === 'ar' ? 'بروماستر © ٢٠٢٦ - تم الصنع بحب ☕' : 'BrewMaster © 2026 - Made with Love ☕'}
          </p>
        </footer>
      </div>
    </div>
  );
}
