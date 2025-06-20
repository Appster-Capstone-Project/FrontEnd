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
import ReviewCard from "@/components/shared/ReviewCard";
import { mockVendors } from "@/lib/data";

export default function SellPage() {
  const [date, setDate] = React.useState<Date>();
  // Mock data for reviews, taking from the first vendor
  const sellerReviews = mockVendors[0].reviews;

  return (
    <div className="container py-8 md:py-12">
      <SectionTitle 
        title="Seller Dashboard"
        subtitle="Manage your menu, track orders, and grow your home-cooking business."
        className="mb-10"
      />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
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
                <Input id="dishName" placeholder="e.g., Butter Chicken" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe your dish..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" type="number" step="0.01" placeholder="12.99" />
                </div>
                <div>
                  <Label htmlFor="portions">Portions Available</Label>
                  <Input id="portions" type="number" placeholder="10" />
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
                <Label htmlFor="dishImage">Dish Image</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-input hover:border-primary transition-colors">
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="flex text-sm text-muted-foreground">
                      <label
                        htmlFor="dishImage"
                        className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                      >
                        <span>Upload a file</span>
                        <Input id="dishImage" name="dishImage" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Add Dish to Menu</Button>
            </CardContent>
          </Card>
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
