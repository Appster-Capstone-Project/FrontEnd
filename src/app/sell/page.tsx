
"use client";

import * as React from "react";
import { List, PlusCircle, CheckCircle, XCircle } from "lucide-react";
import SectionTitle from "@/components/shared/SectionTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Dish } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function SellDashboardPage() {
  const { toast } = useToast();
  const router = useRouter();
  
  const [listings, setListings] = React.useState<Dish[]>([]);
  const [isListingsLoading, setIsListingsLoading] = React.useState(true);
  const [sellerName, setSellerName] = React.useState<string | null>(null);

  const fetchListings = React.useCallback(async () => {
    setIsListingsLoading(true);
    const token = localStorage.getItem('token');
    const sellerId = localStorage.getItem('sellerId');

    if (!token || !sellerId) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please sign in as a seller to view this page.",
      });
      router.push('/auth/signin?type=seller');
      return;
    }

    try {
      const response = await fetch(`/api/listings?sellerId=${sellerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setListings(Array.isArray(data) ? data : []);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Could not load your current dishes.");
      }
    } catch (error) {
      console.error("Failed to fetch listings", error);
      toast({
        variant: "destructive",
        title: "Failed to Fetch Listings",
        description: (error as Error).message,
      });
      setListings([]);
    } finally {
      setIsListingsLoading(false);
    }
  }, [toast, router]);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    setSellerName(name);

    if (!token || userRole !== 'seller') {
      router.push('/auth/signin?type=seller');
    } else {
      fetchListings();
    }
  }, [router, fetchListings]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
       <SectionTitle 
        title={`Welcome, ${sellerName || 'Seller'}!`}
        subtitle="Here's an overview of your menu."
      />
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline text-xl flex items-center">
                    <List className="mr-2 h-5 w-5" /> Your Menu
                </CardTitle>
                <CardDescription>
                    A list of all the dishes you are currently offering.
                </CardDescription>
              </div>
              <Button asChild>
                <Link href="/sell/add">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Dish
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isListingsLoading ? (
                  <div className="space-y-3">
                      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
                  </div>
              ) : listings.length > 0 ? (
                  <ul className="space-y-3 text-sm">
                      {listings.map((listing) => (
                          <li key={listing.id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                              <div>
                                <span className="font-medium text-foreground">{listing.title}</span>
                                <div className="flex items-center text-xs text-muted-foreground">
                                    {listing.available ? (
                                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                                    ) : (
                                        <XCircle className="h-4 w-4 mr-1 text-red-500" />
                                    )}
                                    {listing.available ? 'Available' : 'Unavailable'}
                                </div>
                              </div>
                              <span className="font-mono text-foreground">${listing.price.toFixed(2)}</span>
                          </li>
                      ))}
                  </ul>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold">Your menu is empty</h3>
                  <p className="text-muted-foreground mt-2 mb-4">You haven't added any dishes yet. Let's add the first one!</p>
                  <Button asChild>
                    <Link href="/sell/add">
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Dish
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
    </div>
  );
}
