
"use client";

import * as React from 'react';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, Package, ListOrdered, MessageSquare } from 'lucide-react';
import { mockOrders } from '@/lib/data';
import type { Order } from '@/lib/types';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatDialog } from '@/components/shared/ChatDialog';

const OrderCard: React.FC<{ order: Order; onStatusChange: (id: string, status: Order['status']) => void }> = ({ order, onStatusChange }) => {
  const { toast } = useToast();

  const handleStatusChange = (status: Order['status']) => {
    onStatusChange(order.id, status);
    toast({
      title: `Order ${status}`,
      description: `Order #${order.id.slice(-6)} has been marked as ${status.toLowerCase()}.`,
    });
  };
  
  const statusConfig = {
    Pending: { variant: 'secondary', icon: <Clock className="h-4 w-4 mr-2" />, text: 'Pending Confirmation' },
    Confirmed: { variant: 'default', icon: <Check className="h-4 w-4 mr-2" />, text: 'Confirmed' },
    Delivered: { variant: 'outline', icon: <Package className="h-4 w-4 mr-2" />, text: 'Delivered' },
    Declined: { variant: 'destructive', icon: <X className="h-4 w-4 mr-2" />, text: 'Declined' },
  };
  
  const currentStatus = statusConfig[order.status];

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
            <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border">
                    <AvatarImage src={order.buyer.imageUrl} alt={order.buyer.name} />
                    <AvatarFallback>{order.buyer.name.substring(0,2)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="font-headline text-lg">{order.buyer.name}</CardTitle>
                    <CardDescription>Order ID: {order.id.slice(-6)}</CardDescription>
                </div>
            </div>
            <Badge variant={currentStatus.variant} className="flex items-center self-start sm:self-center mt-2 sm:mt-0">
                {currentStatus.icon}
                <span>{currentStatus.text}</span>
            </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {order.items.map(item => (
            <li key={item.id} className="py-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">{item.quantity} x {item.title}</span>
                <span className="font-mono">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground">Ready by: {format(new Date(item.cookingDate), 'MMM d, p')}</p>
            </li>
          ))}
        </ul>
        {order.comments && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-sm font-medium">Buyer Comments:</p>
            <p className="text-sm text-muted-foreground italic">"{order.comments}"</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {order.status === 'Pending' && (
            <>
                <Button variant="destructive" size="sm" onClick={() => handleStatusChange('Declined')}>
                    <X className="mr-2 h-4 w-4" /> Decline
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleStatusChange('Confirmed')}>
                    <Check className="mr-2 h-4 w-4" /> Confirm
                </Button>
            </>
        )}
        {order.status === 'Confirmed' && (
            <ChatDialog order={order}>
              <Button variant="outline" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" /> Message Buyer
              </Button>
            </ChatDialog>
        )}
      </CardFooter>
    </Card>
  )
}

const OrderSkeleton = () => (
    <Card>
        <CardHeader>
             <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>
                <Skeleton className="h-6 w-28" />
            </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </CardContent>
    </Card>
)

export default function SellerOrdersPage() {
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        // Simulate fetching orders for the logged-in seller
        const sellerId = localStorage.getItem('sellerId');
        if (sellerId) {
            setIsLoading(true);
            setTimeout(() => {
                const sellerOrders = mockOrders.filter(o => o.items.some(item => item.sellerId === sellerId));
                setOrders(sellerOrders);
                setIsLoading(false);
            }, 500);
        }
    }, []);

    const handleStatusChange = (orderId: string, status: Order['status']) => {
        setOrders(prevOrders => 
            prevOrders.map(o => o.id === orderId ? { ...o, status } : o)
        );
    };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <SectionTitle
          title="Incoming Orders"
          subtitle="Review and manage your new meal requests."
      />

      {isLoading ? (
        <div className="max-w-4xl mx-auto w-full space-y-4">
            <OrderSkeleton />
            <OrderSkeleton />
        </div>
      ) : orders.length > 0 ? (
        <div className="max-w-4xl mx-auto w-full space-y-4">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
          ))}
        </div>
      ) : (
        <Card className="max-w-4xl mx-auto w-full">
            <CardContent className="pt-6 text-center">
                <ListOrdered className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">No orders yet.</p>
                <p className="text-sm text-muted-foreground mt-1">New orders from customers will appear here.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
