import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, UtensilsCrossed, CreditCard, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export function MobileNav() {
  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: ShoppingBag, label: 'Orders', path: '/orders' },
    { icon: UtensilsCrossed, label: 'Menu', path: '/menu' },
    { icon: CreditCard, label: 'Payment', path: '/payment' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 pb-safe-bottom">
      {/* Glassmorphism container with gradient border */}
      <div className="relative mx-2 mb-2 rounded-2xl overflow-hidden">
        {/* Gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Main navigation */}
        <div className="relative bg-white/80 backdrop-blur-xl border-t border-gray-200/50 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-around px-2 py-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 mobile-touch-target tap-highlight-none ${
                    isActive 
                      ? 'text-orange-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active background with gradient */}
                    {isActive && (
                      <motion.div
                        layoutId="mobile-nav-indicator"
                        className="absolute inset-0 bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl border border-orange-200/50"
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      />
                    )}
                    
                    {/* Icon with scale animation */}
                    <motion.div
                      className="relative z-10"
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <item.icon 
                        size={22} 
                        strokeWidth={isActive ? 2.5 : 2}
                        className="transition-all"
                      />
                    </motion.div>
                    
                    {/* Label */}
                    <span 
                      className={`relative z-10 text-xs font-medium transition-all ${
                        isActive ? 'font-semibold' : ''
                      }`}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
