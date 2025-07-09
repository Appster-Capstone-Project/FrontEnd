
"use client";

import * as React from "react";
import { UploadCloud, PlusCircle, Star, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionTitle from "@/components/shared/SectionTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ReviewCard from "@/components/shared/ReviewCard";
import type { Review, Dish } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

const mockReviews: Review[] = [
    { id: 'r1-1', userName: 'Raj K.', rating: 5, comment: 'Best butter chicken I\'ve had in ages!', date: '2024-07-15T10:00:00Z', userImageUrl: 'https://placehold.co/40x40.png', dataAiHintUser: 'man smiling' },
    { id: 'r1-2', userName: 'Anita S.', rating: 4, comment: 'Paneer was delicious, a bit spicy for me though.', date: '2024-07-14T18:30:00Z', userImageUrl: 'https://placehold.co/40x40.png', dataAiHintUser: 'woman portrait' },
]

export default function SellPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [available, setAvailable] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const [listings, setListings] = React.useState<Dish[]>([]);
  const [isListingsLoading, setIsListingsLoading] = React.useState(true);
  const sellerReviews = mockReviews; // Replace with API call in future

  const fetchListings = React.useCallback(async () => {
    setIsListingsLoading(true);
    const token = localStorage.getItem('token');
    const sellerId = localStorage.getItem('userId');

    if (!token || !sellerId) {
      setIsListingsLoading(false);
      return;
    }
    try {
      // Use the sellerId from local storage to fetch their specific listings
      const response = await fetch(`/api/listings?sellerId=${sellerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setListings(Array.isArray(data) ? data : []);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to fetch listings",
          description: "Could not load your current dishes.",
        });
        setListings([]);
      }
    } catch (error) {
      console.error("Failed to fetch listings", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while fetching your listings.",
      });
    } finally {
      setIsListingsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/signin?type=seller');
    } else {
      fetchListings();
    }
  }, [router, fetchListings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sellerId = localStorage.getItem("userId");

    if (!title || !price || !description) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Dish Title, Price, and Description are required.",
      });
      return;
    }
    
    if (!sellerId) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Could not identify seller. Please log in again.",
      });
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem('token');

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
          description: `${title} has been added to your menu.`,
        });
        // Reset form
        setTitle("");
        setDescription("");
        setPrice("");
        setAvailable(true);
        // Refetch listings
        fetchListings();
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Failed to Add Dish",
          description: errorData.error || "An unknown error occurred.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Could not connect to the server. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="container py-8 md:py-12">
      <SectionTitle 
        title="Seller Dashboard"
        subtitle="Manage your menu, track orders, and grow your home-cooking business."
        className="mb-10"
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
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
                    <Input id="title" placeholder="e.g., Butter Chicken" value={title} onChange={e => setTitle(e.target.value)} disabled={isLoading} />
                  </div>
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input id="price" type="number" step="0.01" placeholder="12.99" value={price} onChange={e => setPrice(e.target.value)} disabled={isLoading} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe your dish..." value={description} onChange={e => setDescription(e.target.value)} disabled={isLoading} />
                </div>
                <div className="flex items-center space-x-3">
                  <Switch id="available" checked={available} onCheckedChange={setAvailable} disabled={isLoading} />
                  <Label htmlFor="available" className="cursor-pointer">
                    {available ? "This dish is currently available for purchase" : "This dish is currently not available"}
                  </Label>
                </div>
                <div>
                  <Label htmlFor="dishImage">Dish Image (Optional)</Label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-input hover:border-primary transition-colors">
                    <div className="space-y-1 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="flex text-sm text-muted-foreground">
                        <label
                          htmlFor="dishImage"
                          className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                        >
                          <span>Upload a file</span>
                          <Input id="dishImage" name="dishImage" type="file" className="sr-only" disabled={isLoading} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                  {isLoading ? "Adding Dish..." : "Add Dish to Menu"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg">Your Active Listings</CardTitle>
            </CardHeader>
            <CardContent>
              {isListingsLoading ? (
                  <div className="space-y-3">
                      <Skeleton className="h-6 w-4/5" />
                      <Skeleton className="h-6 w-3/5" />
                      <Skeleton className="h-6 w-2/3" />
                  </div>
              ) : listings.length > 0 ? (
                  <ul className="space-y-3 text-sm">
                      {listings.map((listing) => (
                          <li key={listing.id} className="flex justify-between items-center border-b pb-2">
                              <div>
                                <span className="font-medium">{listing.title}</span>
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
                  <p className="text-muted-foreground text-sm text-center py-4">You have no active dishes.</p>
              )}
              <Button variant="link" className="p-0 h-auto mt-2 text-primary">Manage Listings</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">No new orders yet.</p>
              <Button variant="link" className="p-0 h-auto mt-2 text-primary">View All Orders</Button>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center">
                <Star className="mr-2 h-5 w-5 text-yellow-400 fill-yellow-400" />
                Customer Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sellerReviews.length > 0 ? (
                sellerReviews.slice(0, 2).map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No reviews yet.</p>
              )}
              <Button variant="link" className="p-0 h-auto mt-2 text-primary">View All Reviews</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
