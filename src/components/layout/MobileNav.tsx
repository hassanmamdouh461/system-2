import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  UtensilsCrossed, 
  CreditCard, 
  BarChart3 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
}

const navItems: NavItem[] = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/orders', icon: ClipboardList, label: 'Orders' },
  { to: '/menu', icon: UtensilsCrossed, label: 'Menu' },
  { to: '/payment', icon: CreditCard, label: 'Payment' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
];

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 mobile-safe-area">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center gap-1 tap-highlight-none transition-colors ${
                  isActive ? 'text-orange-500' : 'text-gray-500'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="mobile-nav-indicator"
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-orange-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  {/* Icon */}
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  
                  {/* Label */}
                  <span
                    className={`text-xs font-medium ${
                      isActive ? 'font-semibold' : 'font-normal'
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
