
"use client";

import * as React from "react";
import { List, PlusCircle, CheckCircle, XCircle, Edit, Trash2, Send } from "lucide-react";
import SectionTitle from "@/components/shared/SectionTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Dish } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { mockDishes } from "@/lib/data";
import { BroadcastDialog } from "@/components/shared/BroadcastDialog";

export default function SellDashboardPage() {
  const { toast } = useToast();
  const router = useRouter();
  
  const [listings, setListings] = React.useState<Dish[]>([]);
  const [isListingsLoading, setIsListingsLoading] = React.useState(true);
  const [sellerName, setSellerName] = React.useState<string | null>(null);

  const fetchListings = React.useCallback(async () => {
    setIsListingsLoading(true);
    const sellerId = localStorage.getItem('sellerId');

    // Simulate API call
    setTimeout(() => {
        // In a real app, you would filter by sellerId from an API call
        // Here, we'll just show all dishes from a specific mock seller for demo
        const sellerDishes = mockDishes.filter(d => d.sellerId === sellerId);
        setListings(sellerDishes);
        setIsListingsLoading(false);
    }, 500);

  }, []);

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

  const handleDelete = async (listingId: string) => {
    // Simulate API call
    setTimeout(() => {
        toast({ title: "Dish Deleted", description: "The dish has been removed from your menu." });
        // Refresh the list after deletion by filtering out the deleted dish
        setListings(prevListings => prevListings.filter(l => l.id !== listingId));
    }, 500);
  };
  
  const handleBroadcast = (message: string, dishTitle: string) => {
    toast({
        title: "Broadcast Sent!",
        description: `Your message about "${dishTitle}" has been sent.`,
    });
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
       <SectionTitle 
        title={`Welcome, ${sellerName || 'Seller'}!`}
        subtitle="Here's an overview of your menu."
      />
        <Card>
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
                      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
              ) : listings.length > 0 ? (
                  <ul className="divide-y divide-border">
                      {listings.map((listing) => (
                          <li key={listing.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 gap-3">
                              <div className="flex-1">
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
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-mono text-foreground mr-4">${listing.price.toFixed(2)}</span>
                                <BroadcastDialog 
                                    onBroadcast={(message) => handleBroadcast(message, listing.title)}
                                    dishTitle={listing.title}
                                >
                                    <Button variant="outline" size="icon">
                                        <Send className="h-4 w-4" />
                                        <span className="sr-only">Broadcast to buyers</span>
                                    </Button>
                                </BroadcastDialog>
                                <Link href={`/sell/edit/${listing.id}`} passHref>
                                  <Button asChild variant="outline" size="icon">
                                    <a>
                                      <Edit className="h-4 w-4" />
                                      <span className="sr-only">Edit</span>
                                    </a>
                                  </Button>
                                </Link>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon">
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the dish
                                        "{listing.title}" from your menu.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(listing.id)}>
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
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
