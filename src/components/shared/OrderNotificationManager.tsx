
"use client";

import { useEffect, useRef } from 'react';
import { useOrder } from '@/context/OrderContext';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/lib/types';
import { fetchEventSource } from '@microsoft/fetch-event-source';

// This component is responsible for connecting to the SSE stream and updating the order context.
// It should be placed in a layout that is active when a seller is logged in.
const OrderNotificationManager = () => {
  const { addOrder, updateOrder } = useOrder();
  const { toast } = useToast();
  const ctrl = useRef<AbortController | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    // Only connect if the user is a logged-in seller
    if (userRole !== 'seller' || !token) {
      return;
    }

    ctrl.current = new AbortController();

    const connect = async () => {
        await fetchEventSource(`/api/events/stream`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'text/event-stream',
            },
            signal: ctrl.current?.signal,
            onopen(response) {
                if (response.ok && response.headers.get('content-type') === 'text/event-stream') {
                    console.log('SSE connection established for order notifications.');
                    return; // Everything's good
                } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
                    console.error(`Client-side error connecting to SSE: ${response.status} ${response.statusText}`);
                    throw new Error("SSE Client Error"); // This will stop retries
                } else {
                    console.error(`Server-side error connecting to SSE: ${response.status} ${response.statusText}`);
                    // Let the library retry
                }
            },
            onmessage(event) {
                if (event.event === 'OrderPlaced') {
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
                } else if (event.event === 'OrderAccepted') {
                    try {
                        const updatedOrder = JSON.parse(event.data) as Order;
                        updateOrder(updatedOrder); // Update the order in our global context
                    } catch (error) {
                        console.error('Failed to parse OrderAccepted event data:', error);
                    }
                }
            },
            onclose() {
                console.log('SSE connection closed by server.');
                 // Do not retry on close
                if (ctrl.current) {
                    ctrl.current.abort();
                }
            },
            onerror(err) {
                console.error('SSE Error:', err);
                // The library will automatically retry on network errors.
                // If we throw an error here, it will stop retrying.
                // We re-throw the error only if it's a specific "stop" signal.
                if (err && err.message === "SSE Client Error") {
                    throw err; 
                }
            },
        });
    }

    connect();

    // Cleanup function: close the connection when the component unmounts
    return () => {
      if (ctrl.current) {
        ctrl.current.abort();
        console.log('SSE connection aborted on component unmount.');
      }
    };
  }, [addOrder, updateOrder, toast]);

  // This component doesn't render anything itself, it just manages the connection.
  return null;
};

export default OrderNotificationManager;
