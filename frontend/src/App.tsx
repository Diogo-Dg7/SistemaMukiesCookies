import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CartDrawer } from './components/CartDrawer';
import { Navbar } from './components/Navbar';
import { ManageCookies } from './pages/Admin/ManageCookies';
import { Login } from './pages/Admin/Login';
import { SalesHistory } from './pages/Admin/SalesHistory';
import { Cart } from './pages/Customer/Cart';
import { Landing } from './pages/Customer/Landing';
import { Showcase } from './pages/Customer/Showcase';
import { trackPageView } from './services/analytics';
import './App.css';

const LoadingScreen = () => <div className="app-loading">{'Carregando sua experi\u00eancia Mukies...'}</div>;

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  return null;
};

const CustomerRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) return <LoadingScreen />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
};

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

const StoreLayout = () => (
  <div className="app-shell">
    <Navbar />
    <main className="app-shell__content"><Outlet /></main>
    <CartDrawer />
  </div>
);

export const App: React.FC = () => (
  <AuthProvider>
    <CartProvider>
      <BrowserRouter>
        <AnalyticsTracker />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />
          <Route path="/" element={<Landing />} />
          <Route path="/cardapio/convidado" element={<Showcase isGuest />} />
          <Route element={<CustomerRoute />}>
            <Route element={<StoreLayout />}>
              <Route path="/cardapio" element={<Showcase />} />
              <Route path="/cart" element={<Cart />} />
            </Route>
          </Route>
          <Route element={<AdminRoute />}>
            <Route element={<StoreLayout />}>
              <Route path="/admin/cookies" element={<ManageCookies />} />
              <Route path="/admin/sales" element={<SalesHistory />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </AuthProvider>
);

export default App;
