
"use client";

import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, PackageSearch, HandCoins, Bell, Check, Clock, X, CheckCheck } from 'lucide-react';
import { mockOrders } from '@/lib/data';
import type { Order, CartItem } from '@/lib/types';
import { format, formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChatDialog } from '@/components/shared/ChatDialog';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  React.useEffect(() => {
    // Simulate fetching user's orders
    const userId = localStorage.getItem('userId');
    setIsLoading(true);
    setTimeout(() => {
        // In a real app, this would be an API call `GET /api/users/${userId}/orders`
        const userOrders = mockOrders.filter(o => o.buyer.id === userId);
        userOrders.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setOrders(userOrders);
        setIsLoading(false);
    }, 500);

  }, []);
  
  const handleStatusChange = (orderId: string, status: Order['status']) => {
        setOrders(prevOrders => 
            prevOrders.map(o => o.id === orderId ? { ...o, status } : o)
        );
        if (status === 'Completed') {
            toast({
                title: 'Order Completed!',
                description: 'Thank you for confirming. The seller has been paid.'
            })
        }
    };

  const getStatusConfig = (status: Order['status']) => {
    const config = {
        'Pending': { variant: 'outline', icon: <Clock className="h-4 w-4" /> },
        'Confirmed': { variant: 'secondary', icon: <Check className="h-4 w-4" /> },
        'Ready for Pickup': { variant: 'default', icon: <Bell className="h-4 w-4 animate-pulse" /> },
        'Delivered': { variant: 'secondary', icon: <CheckCheck className="h-4 w-4" /> }, // For tiffin services
        'Completed': { variant: 'default', icon: <HandCoins className="h-4 w-4" /> },
        'Declined': { variant: 'destructive', icon: <X className="h-4 w-4" /> },
    };
    return config[status] || config.Pending;
  }

  return (
    <div className="container py-8 md:py-12">
      <SectionTitle
        title="My Orders"
        subtitle="Track your past and current orders here."
      />
       {orders.length > 0 ? (
        <div className="max-w-4xl mx-auto space-y-6">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            return (
                <Card key={order.id} className="shadow-md">
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <div>
                    <CardTitle className="font-headline text-xl">
                        Order from {order.vendorName}
                    </CardTitle>
                    <CardDescription>
                        {format(new Date(order.date), 'MMMM d, yyyy')} • Order ID: {order.id.slice(-6)}
                    </CardDescription>
                    </div>
                    <Badge variant={statusConfig.variant} className="capitalize self-start sm:self-center flex items-center gap-2">
                        {statusConfig.icon}
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
                <CardFooter className="flex-col sm:flex-row justify-end gap-2 items-stretch sm:items-center">
                    {(order.status === 'Confirmed' || order.status === 'Ready for Pickup' || order.status === 'Completed') && (
                        <ChatDialog order={order}>
                            <Button variant="ghost">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Contact Seller
                            </Button>
                        </ChatDialog>
                    )}
                    {order.status === 'Ready for Pickup' && order.pickupDeadline && (
                        <div className="flex-1 text-left">
                            <Button className="w-full sm:w-auto" onClick={() => handleStatusChange(order.id, 'Completed')}>
                                <HandCoins className="mr-2 h-4 w-4" />
                                Confirm Pickup
                            </Button>
                            <p className="text-xs text-muted-foreground mt-1">
                                Please pickup within {formatDistanceToNow(new Date(order.pickupDeadline), { addSuffix: true })}.
                            </p>
                        </div>
                    )}
                </CardFooter>
                </Card>
            )
        })}
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
