
"use client";

import * as React from "react";
import { Edit, Upload } from "lucide-react";
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

export default function EditListingPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const { id: listingId } = params;

  const [listing, setListing] = React.useState<Dish | null>(null);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [available, setAvailable] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    if (!token || userRole !== 'seller') {
      toast({ variant: "destructive", title: "Unauthorized", description: "You must be logged in as a seller."});
      router.push('/auth/signin?type=seller');
      return;
    }
    
    if (listingId) {
        const fetchListing = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/listings/${listingId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data: Dish = await response.json();
                    setListing(data);
                    setTitle(data.title);
                    setDescription(data.description || "");
                    setPrice(data.price.toString());
                    setAvailable(data.available);
                } else {
                    throw new Error("Failed to fetch listing details.");
                }
            } catch (error) {
                toast({ variant: "destructive", title: "Error", description: (error as Error).message });
                router.push('/sell');
            } finally {
                setIsLoading(false);
            }
        };
        fetchListing();
    }
  }, [listingId, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!title || !price || !description) {
      toast({ variant: "destructive", title: "Missing Information", description: "All fields are required." });
      return;
    }
    
    setIsSubmitting(true);
    
    // NOTE: This is a placeholder. The API documentation does not specify a
    // PUT or PATCH endpoint for /listings/{id}. This needs to be implemented
    // in the backend before this functionality will work.
    
    // const updatedData = {
    //   title,
    //   description,
    //   price: parseFloat(price),
    //   available,
    // };

    try {
      // Example of what the fetch call would look like:
      // const response = await fetch(`/api/listings/${listingId}`, {
      //   method: 'PUT', // or 'PATCH'
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(updatedData),
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to update listing.");
      // }
      
      // For demonstration purposes, we'll simulate a successful update.
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Update Successful (DEMO)",
        description: "Your dish has been updated. This is a demo as the backend endpoint is not ready.",
      });
      router.push('/sell');

    } catch (error) {
      toast({ variant: "destructive", title: "Update Failed", description: (error as Error).message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <SectionTitle title="Edit Dish" subtitle="Loading dish details..." />
        <Card className="shadow-lg max-w-2xl mx-auto w-full">
            <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
            <CardContent className="space-y-6">
                <Skeleton className="h-32 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <SectionTitle 
        title="Edit Dish"
        subtitle={`Update the details for '${listing?.title || 'your dish'}'`}
      />
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center">
                <Edit className="mr-2 h-5 w-5 text-primary" /> Dish Details
              </CardTitle>
            </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-2">
                <Label htmlFor="image">Dish Image (Optional)</Label>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Dish Title</Label>
                    <Input id="title" placeholder="e.g., Butter Chicken" value={title} onChange={e => setTitle(e.target.value)} disabled={isSubmitting} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input id="price" type="number" step="0.01" placeholder="12.99" value={price} onChange={e => setPrice(e.target.value)} disabled={isSubmitting} required />
                </div>
            </div>
            <div className="space-y-2">
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
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
