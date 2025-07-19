
"use client";

import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, PackageSearch } from 'lucide-react';
import { mockOrders } from '@/lib/data';
import type { Order, CartItem } from '@/lib/types';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChatDialog } from '@/components/shared/ChatDialog';

interface OrderItemProps {
  item: CartItem;
}

const OrderItem: React.FC<OrderItemProps> = ({ item }) => (
    <div className="flex justify-between items-center text-sm">
        <p>{item.quantity} x {item.title}</p>
        <p>${(item.price * item.quantity).toFixed(2)}</p>
    </div>
)

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate fetching user's orders
    const userId = localStorage.getItem('userId');
    setIsLoading(true);
    setTimeout(() => {
        // In a real app, this would be an API call `GET /api/users/${userId}/orders`
        const userOrders = mockOrders.filter(o => o.buyer.id === userId);
        setOrders(userOrders);
        setIsLoading(false);
    }, 500);

  }, []);

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
        case 'Delivered': return 'default';
        case 'Confirmed': return 'secondary';
        case 'Pending': return 'outline';
        case 'Declined': return 'destructive';
        default: return 'secondary';
    }
  }

  return (
    <div className="container py-12 md:py-16">
      <SectionTitle
        title="My Orders"
        subtitle="Track your past and current orders here."
      />
       {orders.length > 0 ? (
        <div className="max-w-4xl mx-auto space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="shadow-md">
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="font-headline text-xl">
                    Order from {order.vendorName}
                  </CardTitle>
                  <CardDescription>
                    {format(new Date(order.date), 'MMMM d, yyyy')} • Order ID: {order.id.slice(-6)}
                  </CardDescription>
                </div>
                <Badge variant={getStatusVariant(order.status)} className="capitalize">
                    {order.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                    {order.items.map((item) => (
                        <OrderItem key={item.id} item={item} />
                    ))}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-bold">
                    <p>Total</p>
                    <p>${order.total.toFixed(2)}</p>
                </div>
              </CardContent>
              {(order.status === 'Confirmed' || order.status === 'Delivered') && (
                  <CardFooter className="justify-end">
                      <ChatDialog order={order}>
                         <Button variant="outline">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Contact Seller
                         </Button>
                      </ChatDialog>
                  </CardFooter>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6 text-center">
              <PackageSearch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">You have no orders yet.</p>
              <p className="text-sm text-muted-foreground mt-1">Start browsing to find your next delicious meal!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
