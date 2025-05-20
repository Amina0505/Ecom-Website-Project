import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export interface WishlistItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating: {
    rate: number;
    count: number;
  };
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (product: WishlistItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const { isAuthenticated, user } = useAuth();

  // Load wishlist when user logs in
  useEffect(() => {
    const loadWishlist = async () => {
      if (isAuthenticated && user) {
        try {
          const token = localStorage.getItem('userToken');
          const response = await axios.get('http://localhost:5000/api/wishlist', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data && response.data.items) {
            setItems(response.data.items);
          }
        } catch (error) {
          console.error('Error loading wishlist:', error);
        }
      } else {
        setItems([]);
      }
    };

    loadWishlist();
  }, [isAuthenticated, user]);

  const addToWishlist = async (product: WishlistItem) => {
    if (!isAuthenticated) {
      throw new Error('Please log in to add items to wishlist');
    }

    try {
      const token = localStorage.getItem('userToken');
      await axios.post(
        'http://localhost:5000/api/wishlist',
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          category: product.category,
          description: product.description,
          rating: product.rating
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setItems(currentItems => [...currentItems, product]);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!isAuthenticated) return;

    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`http://localhost:5000/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(currentItems => currentItems.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}; 