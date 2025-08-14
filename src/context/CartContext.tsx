
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { CartItem, Dish } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (dish: Dish) => void;
  removeFromCart: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  getSellerId: () => string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const item = window.localStorage.getItem('cartItems');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.log(error);
      return [];
    }
  });
  const { toast } = useToast();

  useEffect(() => {
    try {
        window.localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
        console.log(error);
    }
  }, [cartItems]);


  const addToCart = (dish: Dish) => {
    // Check if the new dish is from the same seller
    if (cartItems.length > 0 && cartItems[0].sellerId !== dish.sellerId) {
      toast({
        variant: "destructive",
        title: "Cannot Mix Sellers",
        description: "You can only order from one seller at a time. Please clear your cart to add items from this seller.",
      });
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === dish.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...dish, quantity: 1 }];
    });
    toast({
      title: "Added to Cart!",
      description: `You've added ${dish.title} to your cart.`,
    });
  };

  const removeFromCart = (dishId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== dishId));
  };

  const updateQuantity = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(dishId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === dishId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getSellerId = (): string | null => {
    return cartItems.length > 0 ? cartItems[0].sellerId : null;
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getItemCount, getSellerId }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
