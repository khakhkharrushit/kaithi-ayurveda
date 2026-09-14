import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, token } = useAuth();

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('kaithi_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const isInitialMount = useRef(true);

  // Sync / Load cart from backend when user logs in
  useEffect(() => {
    if (token && user) {
      const localCart = items.length > 0 ? items : (() => {
        try {
          const s = localStorage.getItem('kaithi_cart');
          return s ? JSON.parse(s) : [];
        } catch { return []; }
      })();

      if (localCart.length > 0) {
        // Sync local guest items into user account
        fetch('/api/cart/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            items: localCart.map(i => ({ id: i.id, quantity: i.quantity }))
          })
        })
          .then(res => res.json())
          .then(data => {
            if (data.items) {
              setItems(data.items);
            }
          })
          .catch(err => console.error('Failed to sync cart on login', err));
      } else {
        // Fetch saved user cart from database
        fetch('/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            if (data.items && data.items.length > 0) {
              setItems(data.items);
            }
          })
          .catch(err => console.error('Failed to load user cart', err));
      }
    }
  }, [token, user?.id]);

  // Persist to localStorage and sync to DB when items change
  useEffect(() => {
    try {
      localStorage.setItem('kaithi_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }

    // If logged in and not the initial render, sync to backend
    if (!isInitialMount.current && token && user) {
      fetch('/api/cart/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: items.map(i => ({ id: i.id, quantity: i.quantity }))
        })
      }).catch(err => console.error('Background cart sync error', err));
    } else {
      isInitialMount.current = false;
    }
  }, [items, token, user]);

  const addToCart = (product, quantity = 1) => {
    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(i => i.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const primaryImage = Array.isArray(product.images) && product.images.length > 0 
          ? product.images[0] 
          : (typeof product.images === 'string' ? product.images : '');

        return [...prevItems, {
          id: product.id,
          name: product.name,
          price: product.price,
          weight: product.weight,
          image: primaryImage,
          category: product.category,
          quantity: quantity
        }];
      }
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setItems(prevItems => {
      return prevItems
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    if (token) {
      fetch(`/api/cart/item/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => console.error('Failed to delete item from backend cart', err));
    }
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    setCouponError('');
    localStorage.removeItem('kaithi_cart');
    if (token) {
      fetch('/api/cart', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => console.error('Failed to clear cart on backend', err));
    }
  };

  // Called specifically upon logout to clear client UI while retaining user's backend cart
  const resetClientCartOnLogout = () => {
    setItems([]);
    setCoupon(null);
    setCouponError('');
    localStorage.removeItem('kaithi_cart');
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const shippingFee = subtotal >= 499 || subtotal === 0 ? 0 : 49;
  const discountAmount = coupon ? coupon.discount_amount : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  const applyCoupon = async (code) => {
    if (!code || !code.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), subtotal })
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || 'Invalid coupon code');
        return false;
      }
      setCoupon(data);
      return true;
    } catch (e) {
      setCouponError('Failed to apply coupon');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError('');
  };

  return (
    <CartContext.Provider value={{
      items,
      totalItemsCount,
      subtotal,
      shippingFee,
      discountAmount,
      totalAmount,
      coupon,
      couponError,
      isCartOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      resetClientCartOnLogout,
      openCart,
      closeCart,
      toggleCart,
      applyCoupon,
      removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
