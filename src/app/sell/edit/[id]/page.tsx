
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
  const id = params.id as string;

  const [listing, setListing] = React.useState<Partial<Dish>>({});
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
        const fetchListing = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/listings/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch dish details.");
                }
                const data = await response.json();
                setListing(data);
            } catch (error) {
                toast({ variant: "destructive", title: "Error", description: (error as Error).message });
                router.push('/sell');
            } finally {
                setIsLoading(false);
            }
        };
        fetchListing();
    }
  }, [id, router, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setListing(prev => ({ ...prev, [id]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setListing(prev => ({ ...prev, available: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!listing.title || !listing.price || !listing.description) {
      toast({ variant: "destructive", title: "Missing Information", description: "All fields are required." });
      return;
    }
    
    setIsSubmitting(true);
    const updatedData = {
      ...listing,
      price: parseFloat(String(listing.price)),
    };

    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        toast({ title: "Dish Updated!", description: `'${listing.title}' has been updated.` });
        router.push('/sell');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "An unknown error occurred.");
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Update Failed", description: (error as Error).message });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <EditFormSkeleton />
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <SectionTitle 
        title="Edit Dish"
        subtitle={`You are currently editing "${listing.title || '...'}"`}
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
                    <Input id="title" value={listing.title || ''} onChange={handleChange} disabled={isSubmitting} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input id="price" type="number" step="0.01" value={listing.price || ''} onChange={handleChange} disabled={isSubmitting} required />
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={listing.description || ''} onChange={handleChange} disabled={isSubmitting} required />
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <Switch id="available" checked={listing.available} onCheckedChange={handleSwitchChange} disabled={isSubmitting} />
              <Label htmlFor="available" className="cursor-pointer">
                {listing.available ? "This dish is currently available" : "This dish is currently unavailable"}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
