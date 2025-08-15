
"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { Order } from '@/lib/types';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  setInitialOrders: (orders: Order[]) => void;
  isLoading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true); // To handle initial loading state

  // Function to add a new order (from SSE)
  const addOrder = useCallback((newOrder: Order) => {
    setOrders(prevOrders => [newOrder, ...prevOrders]);
  }, []);

  // Function to update an existing order (e.g., status change from SSE)
  const updateOrder = useCallback((updatedOrder: Order) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
  }, []);
  
  // Function to set the initial batch of orders (e.g., on login)
  const setInitialOrders = useCallback((initialOrders: Order[]) => {
      setOrders(initialOrders);
      setIsLoading(false);
  }, []);

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrder, setInitialOrders, isLoading }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
