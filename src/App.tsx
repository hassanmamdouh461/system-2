import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { AuthProvider } from './context/AuthContext';

import { DashboardLayout } from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu';
import Orders from './pages/Orders';
import Payment from './pages/Payment';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        {/* Add future routes here */}
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading (e.g., waiting for assets/auth)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Reduced from 2500ms to 1500ms for faster startup
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppRoutes />
        </Router>
      )}
    </AuthProvider>
  );
}

export default App;
