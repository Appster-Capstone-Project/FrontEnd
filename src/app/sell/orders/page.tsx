
"use client";

import * as React from "react";
import { ListOrdered, Check, Eye, Loader2 } from "lucide-react";
import SectionTitle from "@/components/shared/SectionTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Order, Dish } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

async function fetchOrderDetails(orderIds: string[], token: string): Promise<Dish[]> {
    const dishPromises = orderIds.map(async (id) => {
        const response = await fetch(`/api/listings/${id}`, {
             headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            console.error(`Failed to fetch dish with id ${id}`);
            return null;
        }
        return response.json();
    });

    const dishes = await Promise.all(dishPromises);
    return dishes.filter((dish): dish is Dish => dish !== null);
}

export default function SellerOrdersPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUpdating, setIsUpdating] = React.useState<string | null>(null);
  const [detailedDishes, setDetailedDishes] = React.useState<Record<string, Dish[]>>({});
  
  const fetchOrdersForSeller = React.useCallback(async (token: string) => {
    setIsLoading(true);
    try {
      // The backend needs to know to return orders FOR a seller.
      // Based on the docs, a seller calling /api/orders should return their orders.
      const response = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to fetch orders.");
      }
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error fetching orders",
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token || userRole !== 'seller') {
       toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You must be a seller to view this page.",
      });
      router.push('/auth/signin?type=seller');
    } else {
        fetchOrdersForSeller(token);
    }
  }, [router, toast, fetchOrdersForSeller]);

  const handleUpdateStatus = async (orderId: string, action: 'accept' | 'complete') => {
    const token = localStorage.getItem('token');
    if (!token) {
        toast({ variant: "destructive", title: "Authentication Error" });
        return;
    }
    
    setIsUpdating(orderId);

    try {
        const response = await fetch(`/api/orders/${orderId}/${action}`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to ${action} order.`);
        }
        
        toast({
            title: `Order ${action === 'accept' ? 'Accepted' : 'Completed'}`,
            description: "The order status has been updated.",
        });
        
        // Refetch orders to show the updated status
        fetchOrdersForSeller(token);

    } catch (error) {
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: (error as Error).message,
        });
    } finally {
        setIsUpdating(null);
    }
  };

  const handleFetchDetails = async (order: Order) => {
    if (detailedDishes[order.id]) return; // Already fetched
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const dishes = await fetchOrderDetails(order.listingIds, token);
    setDetailedDishes(prev => ({...prev, [order.id]: dishes}));
  }

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'default';
      case 'accepted':
        return 'secondary';
      case 'completed':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <SectionTitle
        title="Recent Orders"
        subtitle="Manage incoming orders from customers."
      />
      <Card className="max-w-6xl mx-auto w-full shadow-lg">
        <CardHeader>
            <CardTitle>Incoming Orders</CardTitle>
            <CardDescription>Review and manage all orders placed for your items.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => ( <Skeleton key={i} className="h-12 w-full" /> ))}
            </div>
          ) : orders.length > 0 ? (
             <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">{order.id.substring(0, 8)}...</TableCell>
                        <TableCell>{order.user_email}</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(order.status)} className="capitalize">{order.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                           <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => handleFetchDetails(order)}>
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">View Details</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                                <DialogHeader>
                                <DialogTitle>Order Details ({order.id.substring(0,8)}...)</DialogTitle>
                                </DialogHeader>
                                <ScrollArea className="max-h-[60vh] pr-4">
                                {detailedDishes[order.id] ? (
                                    <div className="space-y-4 my-4">
                                        {detailedDishes[order.id].map(dish => (
                                            <div key={dish.id} className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold">{dish.title}</p>
                                                    <p className="text-sm text-muted-foreground">${dish.price.toFixed(2)}</p>
                                                </div>
                                                <Badge variant="outline">{dish.portionSize || 1} Serving(s)</Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : <Loader2 className="mx-auto h-6 w-6 animate-spin" />}
                                </ScrollArea>
                            </DialogContent>
                            </Dialog>

                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleUpdateStatus(order.id, 'accept')}
                                disabled={isUpdating === order.id || order.status !== 'pending'}
                            >
                                {isUpdating === order.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                                Accept
                            </Button>
                            <Button 
                                size="sm" 
                                onClick={() => handleUpdateStatus(order.id, 'complete')}
                                disabled={isUpdating === order.id || order.status !== 'accepted'}
                            >
                                {isUpdating === order.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                                Complete
                            </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
                <ListOrdered className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">No orders yet</h3>
                <p className="text-muted-foreground mt-2">New orders from customers will appear here automatically.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
