
"use client";

import * as React from "react";
import { DollarSign, Package, ListOrdered, Calendar } from "lucide-react";
import SectionTitle from "@/components/shared/SectionTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';

const StatCard = ({ title, value, icon: Icon, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const StatCardSkeleton = () => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-3 w-3/4 mt-1" />
        </CardContent>
    </Card>
);

export default function SellerEarningsPage() {
  const { toast } = useToast();
  const router = useRouter();
  
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchOrdersForSeller = React.useCallback(async (token: string) => {
    setIsLoading(true);
    try {
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

  const completedOrders = React.useMemo(() => orders.filter(o => o.status === 'completed'), [orders]);
  
  const totalRevenue = React.useMemo(() => 
    completedOrders.reduce((acc, order) => acc + order.total, 0),
    [completedOrders]
  );
  
  const totalItemsSold = React.useMemo(() => 
    completedOrders.reduce((acc, order) => acc + order.listingIds.length, 0),
    [completedOrders]
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <SectionTitle
        title="Your Earnings"
        subtitle="Track your sales from completed orders."
      />
      
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard 
                title="Total Revenue"
                value={`$${totalRevenue.toFixed(2)}`}
                description="Earnings from all completed sales."
                icon={DollarSign}
            />
             <StatCard 
                title="Items Sold"
                value={totalItemsSold}
                description="Total number of items sold."
                icon={Package}
            />
             <StatCard 
                title="Completed Orders"
                value={completedOrders.length}
                description="Total number of completed orders."
                icon={ListOrdered}
            />
        </div>
      )}

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Completed Transactions</CardTitle>
            <CardContent className="pt-6 px-0">
                {isLoading ? (
                    <div className="space-y-2">
                        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                    </div>
                ) : completedOrders.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-center">Items</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {completedOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-xs">{order.id.substring(0, 8)}...</TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                            {format(new Date(order.createdAt * 1000), 'PPP')}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">{order.listingIds.length}</TableCell>
                                    <TableCell className="text-right font-medium">${order.total.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-center text-muted-foreground py-8">No completed orders yet. Your earnings will appear here once you complete an order.</p>
                )}
            </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
