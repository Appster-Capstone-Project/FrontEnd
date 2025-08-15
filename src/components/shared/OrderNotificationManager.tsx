
"use client";

import { useEffect } from 'react';
import { useOrder } from '@/context/OrderContext';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/lib/types';

// This component is responsible for connecting to the SSE stream and updating the order context.
// It should be placed in a layout that is active when a seller is logged in.
const OrderNotificationManager = () => {
  const { addOrder, updateOrder } = useOrder();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    // Only connect if the user is a logged-in seller
    if (userRole !== 'seller' || !token) {
      return;
    }
    
    // The EventSource API is used for Server-Sent Events (SSE)
    // The token is passed as a query parameter because EventSource doesn't support auth headers.
    // The backend must be configured to accept the token from the 'token' query parameter.
    const eventSource = new EventSource(`/api/events/stream?token=${token}`);
    
    // Handler for when the connection opens
    eventSource.onopen = () => {
      console.log('SSE connection established for order notifications.');
    };
    
    // Handler for 'OrderPlaced' events from the server
    eventSource.addEventListener('OrderPlaced', (event) => {
      try {
        const newOrder = JSON.parse(event.data) as Order;
        addOrder(newOrder); // Add the new order to our global context
        toast({
          title: 'New Order Received!',
          description: `Order #${newOrder.id.substring(0, 8)} from ${newOrder.user_email}`,
        });
      } catch (error) {
        console.error('Failed to parse OrderPlaced event data:', error);
      }
    });

    // Handler for 'OrderAccepted' events from the server
    eventSource.addEventListener('OrderAccepted', (event) => {
        try {
            const updatedOrder = JSON.parse(event.data) as Order;
            updateOrder(updatedOrder); // Update the order in our global context
            // Optionally, you could toast here as well, but it might be redundant
            // if the seller themself triggered the action.
        } catch (error) {
            console.error('Failed to parse OrderAccepted event data:', error);
        }
    });

    // Handler for any errors with the SSE connection
    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      // Do not close the connection here. The browser's EventSource implementation
      // will automatically attempt to reconnect. Closing it would prevent recovery.
    };

    // Cleanup function: close the connection when the component unmounts
    return () => {
      if (eventSource) {
        eventSource.close();
        console.log('SSE connection closed.');
      }
    };
  }, [addOrder, updateOrder, toast]);

  // This component doesn't render anything itself, it just manages the connection.
  return null;
};

export default OrderNotificationManager;
