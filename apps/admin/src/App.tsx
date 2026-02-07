import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Transactions from './pages/Transactions';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Orders from './pages/Orders';
import Blogs from './pages/Blogs';
import { useAuth } from './context/AuthContext';

import React from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-cream"><div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div></div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  // Force Light Theme
  React.useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('theme'); // Optional: clear preference
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="orders" element={<Orders />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="reports" element={<Reports />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Redirect any unmatched routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
