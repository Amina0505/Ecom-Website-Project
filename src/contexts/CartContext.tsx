import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user, isAuthenticated } = useAuth();

  // Load cart data when user logs in
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated && user) {
        try {
          const token = localStorage.getItem('userToken');
          const response = await axios.get('http://localhost:5000/api/cart', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data && response.data.items) {
            setItems(response.data.items);
          }
        } catch (error) {
          console.error('Error loading cart:', error);
        }
      } else {
        // Clear cart when user logs out
        setItems([]);
      }
    };

    loadCart();
  }, [isAuthenticated, user]);

  // Sync cart with backend when it changes
  useEffect(() => {
    const syncCartWithBackend = async () => {
      if (isAuthenticated && user) {
        try {
          const token = localStorage.getItem('userToken');
          await axios.put(
            'http://localhost:5000/api/cart',
            { items },
            { headers: { Authorization: `Bearer ${token}` }}
          );
        } catch (error) {
          console.error('Error syncing cart:', error);
        }
      }
    };

    if (items.length > 0) {
      syncCartWithBackend();
    }
  }, [items, isAuthenticated, user]);

  const addToCart = async (product: CartItem) => {
    if (!isAuthenticated) {
      // Show login prompt or handle unauthorized state
      alert('Please log in to add items to cart');
      return;
    }

    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return currentItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = async (productId: string) => {
    if (!isAuthenticated) return;

    setItems(currentItems => currentItems.filter(item => item.id !== productId));
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!isAuthenticated) return;

    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;

    try {
      const token = localStorage.getItem('userToken');
      await axios.delete('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 