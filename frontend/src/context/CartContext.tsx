import React, { createContext, useContext, useState } from 'react';
import type { Cookie } from '../components/CookieCard';

export interface CartItem {
  cookie: Cookie;
  quantity: number;
}

interface CartContextData {
  cart: CartItem[];
  addToCart: (cookie: Cookie) => void;
  removeFromCart: (cookieId: string) => void;
  updateQuantity: (cookieId: string, delta: number) => void;
  clearCart: () => void;
  total: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (cookie: Cookie) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.cookie.id === cookie.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.cookie.id === cookie.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { cookie, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (cookieId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.cookie.id !== cookieId));
  };

  const updateQuantity = (cookieId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.cookie.id === cookieId) {
            const newQuantity = item.quantity + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + item.cookie.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
