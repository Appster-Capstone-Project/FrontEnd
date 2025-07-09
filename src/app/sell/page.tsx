
"use client";

import * as React from "react";
import { PlusCircle, Star, CheckCircle, XCircle, List } from "lucide-react";
import SectionTitle from "@/components/shared/SectionTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Dish } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";


export default function SellPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [available, setAvailable] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const [listings, setListings] = React.useState<Dish[]>([]);
  const [isListingsLoading, setIsListingsLoading] = React.useState(true);

  const fetchListings = React.useCallback(async () => {
    setIsListingsLoading(true);
    const token = localStorage.getItem('token');
    const sellerId = localStorage.getItem('userId');

    if (!token || !sellerId) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please sign in to view your dashboard.",
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
    if (!token || userRole !== 'seller') {
      router.push('/auth/signin?type=seller');
    } else {
      fetchListings();
    }
  }, [router, fetchListings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sellerId = localStorage.getItem("userId");
    const token = localStorage.getItem('token');

    if (!title || !price || !description) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Dish Title, Price, and Description are required.",
      });
      return;
    }
    
    if (!sellerId || !token) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Could not identify seller. Please log in again.",
      });
      return;
    }

    setIsSubmitting(true);
    const listingData = {
      title,
      price: parseFloat(price),
      description,
      available,
      sellerId,
    };

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(listingData),
      });

      if (response.status === 201) {
        toast({
          title: "Dish Added Successfully!",
          description: `'${title}' has been added to your menu.`,
        });
        // Reset form and refetch listings
        setTitle("");
        setDescription("");
        setPrice("");
        setAvailable(true);
        fetchListings();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "An unknown error occurred on the server.");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to Add Dish",
        description: (error as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="container py-8 md:py-12 bg-background">
      <SectionTitle 
        title="Seller Dashboard"
        subtitle="Manage your menu and grow your home-cooking business."
        className="mb-10"
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form for adding a new dish */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center">
                  <PlusCircle className="mr-2 h-5 w-5 text-primary" /> Add New Dish
                </CardTitle>
                <CardDescription>Fill in the details to add a new item to your menu.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Dish Title</Label>
                    <Input id="title" placeholder="e.g., Butter Chicken" value={title} onChange={e => setTitle(e.target.value)} disabled={isSubmitting} required />
                  </div>
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input id="price" type="number" step="0.01" placeholder="12.99" value={price} onChange={e => setPrice(e.target.value)} disabled={isSubmitting} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe your dish..." value={description} onChange={e => setDescription(e.target.value)} disabled={isSubmitting} required />
                </div>
                <div className="flex items-center space-x-3 pt-2">
                  <Switch id="available" checked={available} onCheckedChange={setAvailable} disabled={isSubmitting} />
                  <Label htmlFor="available" className="cursor-pointer">
                    {available ? "This dish is currently available" : "This dish is currently unavailable"}
                  </Label>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
                  {isSubmitting ? "Adding Dish..." : "Add Dish to Menu"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Section for active listings and other info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center">
                <List className="mr-2 h-5 w-5" /> Your Menu
              </CardTitle>
              <CardDescription>
                A list of all the dishes you are currently offering.
              </CardDescription>
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
                  <p className="text-muted-foreground text-sm text-center py-4">You haven't added any dishes yet. Use the form to get started!</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg">Recent Orders & Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm text-center py-2">Order and review features are coming soon!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
