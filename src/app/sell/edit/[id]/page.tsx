
"use client";

import * as React from "react";
import { Edit, Upload, Calendar as CalendarIcon } from "lucide-react";
import SectionTitle from "@/components/shared/SectionTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import type { Dish } from "@/lib/types";
import { getDishById } from "@/lib/data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function EditListingPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [listing, setListing] = React.useState<Partial<Dish>>({});
  const [cookingDate, setCookingDate] = React.useState<Date | undefined>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({ variant: "destructive", title: "Unauthorized", description: "You must be logged in." });
      router.push('/auth/signin?type=seller');
      return;
    }

    if (id) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const dish = getDishById(id);
        if (dish) {
          setListing(dish);
          if (dish.cookingDate) {
            setCookingDate(new Date(dish.cookingDate));
          }
        } else {
          toast({ variant: "destructive", title: "Error", description: "Dish not found." });
          router.push('/sell');
        }
        setIsLoading(false);
      }, 500);
    }
  }, [id, router, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setListing(prev => ({ ...prev, [id]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setListing(prev => ({ ...prev, available: checked }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setCookingDate(date);
    if(date) {
      setListing(prev => ({...prev, cookingDate: date.toISOString()}));
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!listing.title || !listing.price || !listing.description || !listing.slotsTotal || !listing.cookingDate) {
      toast({ variant: "destructive", title: "Missing Information", description: "All fields are required." });
      setIsSubmitting(false);
      return;
    }
    
    // Simulate API Call
    setTimeout(() => {
      toast({ title: "Dish Updated!", description: `'${listing.title}' has been updated.` });
      setIsSubmitting(false);
      router.push('/sell');
    }, 1000);
  };
  
  if (isLoading) {
    return <EditFormSkeleton />
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <SectionTitle 
        title="Edit Meal"
        subtitle={`You are currently editing "${listing.title || '...'}"`}
      />
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center">
                <Edit className="mr-2 h-5 w-5 text-primary" /> Meal Details
              </CardTitle>
            </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-2">
                <Label htmlFor="image">Meal Image (Optional)</Label>
                <div className="flex items-center justify-center w-full">
                    <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, or GIF (MAX. 800x400px)</p>
                        </div>
                        <Input id="dropzone-file" type="file" className="hidden" disabled />
                    </Label>
                </div> 
                <p className="text-xs text-muted-foreground text-center">Image upload is not functional yet.</p>
             </div>
             <div className="space-y-2">
                <Label htmlFor="title">Meal Title</Label>
                <Input id="title" value={listing.title || ''} onChange={handleChange} disabled={isSubmitting} required />
              </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Price per Portion ($)</Label>
                    <Input id="price" type="number" step="0.01" value={listing.price || ''} onChange={handleChange} disabled={isSubmitting} required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="slotsTotal">Total Portions</Label>
                    <Input id="slotsTotal" type="number" value={listing.slotsTotal || ''} onChange={handleChange} disabled={isSubmitting} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cookingDate">Cooking Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !cookingDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {cookingDate ? format(cookingDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={cookingDate}
                          onSelect={handleDateChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={listing.description || ''} onChange={handleChange} disabled={isSubmitting} required />
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <Switch id="available" checked={listing.available} onCheckedChange={handleSwitchChange} disabled={isSubmitting} />
              <Label htmlFor="available" className="cursor-pointer">
                {listing.available ? "This meal is available for pre-order" : "This meal is currently paused"}
              </Label>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

const EditFormSkeleton = () => (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mb-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-6 w-72 mt-2" />
        </div>
        <Card className="mx-auto w-full max-w-2xl">
          <CardHeader>
             <Skeleton className="h-8 w-40" />
            </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-20 w-full" />
            </div>
            <div className="flex items-center space-x-3 pt-2">
                <Skeleton className="h-6 w-11" />
                <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
    </div>
);
