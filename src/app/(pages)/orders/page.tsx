
"use client";

import * as React from "react";
import { ListOrdered, Eye, Loader2 } from "lucide-react";
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
import { format } from 'date-fns';

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


export default function OrdersPage() {
  const { toast } = useToast();
  const router = useRouter();
  
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [detailedDishes, setDetailedDishes] = React.useState<Record<string, Dish[]>>({});
  
  const fetchOrders = React.useCallback(async (token: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        let data = await response.json();
        // The /api/orders endpoint for a user returns their orders directly
        setOrders(Array.isArray(data) ? data : []);
      } else if (response.status === 404) {
        // 404 means no orders found for this user
        setOrders([]);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Could not load your orders.");
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
      toast({
        variant: "destructive",
        title: "Failed to Fetch Orders",
        description: (error as Error).message,
      });
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token || userRole !== 'user') {
       toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please sign in to view your orders.",
      });
      router.push('/auth/signin');
    } else {
      fetchOrders(token);
    }
  }, [router, fetchOrders, toast]);

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
        title="My Orders"
        subtitle="Track your past and current orders."
      />
      <Card className="max-w-6xl mx-auto w-full shadow-lg">
        <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>Review and track all your orders here.</CardDescription>
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
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">{order.id.substring(0, 8)}...</TableCell>
                        <TableCell>{format(new Date(order.createdAt * 1000), 'PPP')}</TableCell>
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
                                                <Badge variant="outline">{dish.portionSize} Serving(s)</Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : <Loader2 className="mx-auto my-4 h-6 w-6 animate-spin" />}
                                </ScrollArea>
                            </DialogContent>
                            </Dialog>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
                <ListOrdered className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">You haven't placed any orders yet.</h3>
                <p className="text-muted-foreground mt-2">Start browsing to find your next delicious meal!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    