import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Home';
import BlogDetail from './components/BlogDetail';
import OrderStatus from './components/OrderStatus';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCartItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          <Home
            cartItems={cartItems}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
            cartCount={cartCount}
          />
        } />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/status" element={<OrderStatus />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
