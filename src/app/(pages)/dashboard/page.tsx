
"use client";

import * as React from "react";
import { DollarSign, ListOrdered, Utensils } from "lucide-react";
import SectionTitle from "@/components/shared/SectionTitle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Order, Dish } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

export default function UserDashboardPage() {
  const { toast } = useToast();
  const router = useRouter();
  
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [userName, setUserName] = React.useState<string | null>(null);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    setUserName(name);

    if (!token) {
      toast({ variant: "destructive", title: "Authentication Error", description: "Please sign in." });
      router.push('/auth/signin');
      return;
    }

    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(Array.isArray(data) ? data : []);
        } else {
          setOrders([]); // Assume no orders if there's an error
        }
      } catch (error) {
        console.error("Failed to fetch orders for dashboard", error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [router, toast]);
  
  const totalSpent = React.useMemo(() => 
    orders.reduce((acc, order) => acc + order.total, 0),
    [orders]
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <SectionTitle
        title={`Welcome, ${userName || 'User'}!`}
        subtitle="Here's a quick look at your TiffinBox activity."
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
              title="Total Spent"
              value={`$${totalSpent.toFixed(2)}`}
              icon={DollarSign}
              description="Total amount spent on all orders."
          />
          <StatCard 
              title="Total Orders"
              value={orders.length}
              icon={ListOrdered}
              description="Number of orders you've placed."
          />
           <Card className="flex flex-col items-center justify-center text-center">
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Ready for a new meal?</CardTitle>
                    <CardDescription>Explore dishes from local cooks.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/vendors"><Utensils className="mr-2 h-4 w-4"/> Browse Food</Link>
                    </Button>
                </CardContent>
           </Card>
        </div>
      )}
    </div>
  );
}
