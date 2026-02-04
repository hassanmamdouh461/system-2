import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { MobileNav } from './MobileNav';
import { Outlet } from 'react-router-dom';

export function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Header */}
      <MobileHeader onMenuClick={() => setMobileMenuOpen(true)} />
      
      {/* Sidebar - Desktop/Mobile Drawer */}
      <Sidebar 
        mobileOpen={mobileMenuOpen} 
        onMobileClose={() => setMobileMenuOpen(false)} 
      />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8 pt-20 md:pt-8 pb-20 md:pb-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
