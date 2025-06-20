
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, UploadCloud, PlusCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionTitle from "@/components/shared/SectionTitle";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ReviewCard from "@/components/shared/ReviewCard";
import type { Review } from "@/lib/types";

const mockReviews: Review[] = [
    { id: 'r1-1', userName: 'Raj K.', rating: 5, comment: 'Best butter chicken I\'ve had in ages!', date: '2024-07-15T10:00:00Z', userImageUrl: 'https://placehold.co/40x40.png', dataAiHintUser: 'man smiling' },
    { id: 'r1-2', userName: 'Anita S.', rating: 4, comment: 'Paneer was delicious, a bit spicy for me though.', date: '2024-07-14T18:30:00Z', userImageUrl: 'https://placehold.co/40x40.png', dataAiHintUser: 'woman portrait' },
]

export default function SellPage() {
  const { toast } = useToast();
  const [dishName, setDishName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [portions, setPortions] = React.useState("");
  const [date, setDate] = React.useState<Date>();
  const [isLoading, setIsLoading] = React.useState(false);
  const sellerReviews = mockReviews; // Replace with API call in future

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!dishName || !description || !price || !portions || !date) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill out all fields to add a dish.",
      });
      setIsLoading(false);
      return;
    }
    
    // DEMO: Bypassing API call for demonstration purposes
    setTimeout(() => {
        toast({
          title: "Dish Added!",
          description: `${dishName} has been added to your menu.`
        });
        // Reset form
        setDishName("");
        setDescription("");
        setPrice("");
        setPortions("");
        setDate(undefined);
        setIsLoading(false);
    }, 1000);


    /*
    // REAL API CALL (currently disabled for demo)
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Assuming backend requires JWT
        },
        body: JSON.stringify({
          name: dishName,
          description,
          price: parseFloat(price),
          portionsAvailable: parseInt(portions),
          cookingDate: date.toISOString(),
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Dish Added!",
          description: `${dishName} has been added to your menu.`
        });
        // Reset form
        setDishName("");
        setDescription("");
        setPrice("");
        setPortions("");
        setDate(undefined);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to Add Dish",
          description: data.error || "An unknown error occurred."
        });
      }
    } catch (error) {
      console.error("Failed to add dish:", error);
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Could not add dish. Please check your connection."
      });
    } finally {
      setIsLoading(false);
    }
    */
  };

  return (
    <div className="container py-8 md:py-12">
      <SectionTitle 
        title="Seller Dashboard"
        subtitle="Manage your menu, track orders, and grow your home-cooking business."
        className="mb-10"
      />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center">
                  <PlusCircle className="mr-2 h-5 w-5 text-primary" /> Add New Dish
                </CardTitle>
                <CardDescription>Fill in the details to add a new item to your menu.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="dishName">Dish Name</Label>
                  <Input id="dishName" placeholder="e.g., Butter Chicken" value={dishName} onChange={e => setDishName(e.target.value)} disabled={isLoading} />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe your dish..." value={description} onChange={e => setDescription(e.target.value)} disabled={isLoading} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input id="price" type="number" step="0.01" placeholder="12.99" value={price} onChange={e => setPrice(e.target.value)} disabled={isLoading} />
                  </div>
                  <div>
                    <Label htmlFor="portions">Portions Available</Label>
                    <Input id="portions" type="number" placeholder="10" value={portions} onChange={e => setPortions(e.target.value)} disabled={isLoading} />
                  </div>
                   <div>
                    <Label htmlFor="cookingDate">Cooking Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                          disabled={isLoading}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
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
              <p className="text-muted-foreground text-sm">You have 3 active dishes.</p>
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
