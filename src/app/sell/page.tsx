"use client";

import * as React from "react";
import { List, PlusCircle, CheckCircle, XCircle, Edit, ImageIcon } from "lucide-react";
import SectionTitle from "@/components/shared/SectionTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Dish } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const fetchSignedUrl = async (imageUrlPath: string): Promise<string> => {
    try {
        const response = await fetch(`/api${imageUrlPath}`);
        if (!response.ok) {
            throw new Error('Failed to get signed URL');
        }
        const data = await response.json();
        // Replace MinIO's internal Docker hostname with the public IP.
        const publicUrl = data.signed_url.replace('minio:9000', '20.185.241.50:9000').replace('localhost:9000', '20.185.241.50:9000');
        return publicUrl;
    } catch (error) {
        console.error("Error fetching signed URL:", error);
        return 'https://placehold.co/100x100.png';
    }
};

export default function SellDashboardPage() {
  const { toast } = useToast();
  const router = useRouter();
  
  const [listings, setListings] = React.useState<Dish[]>([]);
  const [isListingsLoading, setIsListingsLoading] = React.useState(true);
  const [sellerName, setSellerName] = React.useState<string | null>(null);

  const fetchListings = React.useCallback(async (token: string, sellerId: string) => {
    setIsListingsLoading(true);
    try {
      const response = await fetch(`/api/listings?sellerId=${sellerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const augmentedData = Array.isArray(data) ? await Promise.all(data.map(async item => {
          let finalImageUrl = 'https://placehold.co/100x100.png';
          if (item.image) {
             finalImageUrl = await fetchSignedUrl(item.image);
          }
          return {
            ...item,
            imageUrl: finalImageUrl, 
          };
        })) : [];
        setListings(augmentedData);
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
  }, [toast]);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    const sellerId = localStorage.getItem('sellerId');
    setSellerName(name);

    if (!token || userRole !== 'seller' || !sellerId) {
       toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please sign in as a seller to view this page.",
      });
      router.push('/auth/signin?type=seller');
    } else {
      fetchListings(token, sellerId);
    }
  }, [router, fetchListings, toast]);

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
                  <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-16 w-16 rounded-md" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                           <Skeleton className="h-8 w-20" />
                        </div>
                      ))}
                  </div>
              ) : listings.length > 0 ? (
                  <ul className="space-y-3 text-sm">
                      {listings.map((listing) => (
                          <li key={listing.id} className="flex justify-between items-center border-b pb-3 pt-2 last:border-b-0">
                              <div className="flex items-center gap-4">
                                <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted">
                                  {listing.imageUrl && !listing.imageUrl.includes('placehold.co') ? (
                                     <img src={listing.imageUrl} alt={listing.title} className="absolute h-full w-full object-cover" />
                                  ): (
                                    <div className="flex items-center justify-center h-full"><ImageIcon className="h-6 w-6 text-muted-foreground"/></div>
                                  )}
                                </div>
                                <div>
                                    <span className="font-medium text-foreground">{listing.title}</span>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        {listing.available ? (
                                            <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                                        ) : (
                                            <XCircle className="h-4 w-4 mr-1 text-red-500" />
                                        )}
                                        {listing.available ? 'Available' : 'Unavailable'}
                                         <span className="mx-2">|</span> 
                                         <span>{listing.leftSize || 0} portions left</span>
                                    </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="font-mono">${listing.price.toFixed(2)}</Badge>
                                <Button variant="outline" size="icon" asChild>
                                    <Link href={`/sell/edit/${listing.id}`}>
                                        <Edit className="h-4 w-4" />
                                        <span className="sr-only">Edit {listing.title}</span>
                                    </Link>
                                </Button>
                              </div>
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
