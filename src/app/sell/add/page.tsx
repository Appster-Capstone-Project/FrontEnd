
"use client";

import * as React from "react";
import { PlusCircle, Upload, Image as ImageIcon } from "lucide-react";
import SectionTitle from "@/components/shared/SectionTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import Image from 'next/image';


export default function AddListingPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [portionSize, setPortionSize] = React.useState("10"); // This will now represent total initial portions
  const [available, setAvailable] = React.useState(true);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    if (!token || userRole !== 'seller') {
      toast({ variant: "destructive", title: "Unauthorized", description: "You must be logged in as a seller."});
      router.push('/auth/signin?type=seller');
    }
  }, [router, toast]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const sellerId = localStorage.getItem("sellerId");
    const token = localStorage.getItem('token');

    if (!title || !price || !description || !portionSize) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "All fields are required.",
      });
      setIsSubmitting(false);
      return;
    }
    
    if (!sellerId || !token) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Could not identify seller. Please log in again.",
      });
      setIsSubmitting(false);
      return;
    }

    const listingData = {
      title,
      description,
      price: parseFloat(price),
      available,
      sellerId,
      portionSize: parseInt(portionSize, 10),
      leftSize: parseInt(portionSize, 10), // Set leftSize to initial portionSize
    };

    try {
      // Step 1: Create the listing
      const listingResponse = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(listingData),
      });

      if (listingResponse.status !== 201) {
        const errorData = await listingResponse.json();
        throw new Error(errorData.error || "An unknown error occurred while creating the listing.");
      }
      
      const { id: newListingId } = await listingResponse.json();

      // Step 2: Upload image if one is selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);

        const imageResponse = await fetch(`/api/listings/${newListingId}/image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!imageResponse.ok) {
           const errorData = await imageResponse.json();
           // Toast a warning but don't fail the whole process
           toast({
             variant: "destructive",
             title: "Image Upload Failed",
             description: errorData.error || "The dish was created, but the image could not be uploaded.",
           });
        }
      }

      toast({
        title: "Dish Added Successfully!",
        description: `'${title}' has been added to your menu.`,
      });
      router.push('/sell');

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
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <SectionTitle 
        title="Add New Dish"
        subtitle="Fill in the details to add a new item to your menu."
      />
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center">
                <PlusCircle className="mr-2 h-5 w-5 text-primary" /> Dish Details
              </CardTitle>
            </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="image">Dish Image</Label>
              <div className="flex items-center justify-center w-full">
                <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted relative">
                  {imagePreview ? (
                    <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="cover" className="rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-muted-foreground">PNG or JPG (MAX. 800x400px)</p>
                    </div>
                  )}
                  <Input id="dropzone-file" type="file" className="hidden" onChange={handleImageChange} accept="image/png, image/jpeg" disabled={isSubmitting}/>
                </Label>
              </div> 
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
                <Label htmlFor="portionSize">Total Portions to Sell</Label>
                <Input id="portionSize" type="number" placeholder="e.g., 10" value={portionSize} onChange={e => setPortionSize(e.target.value)} disabled={isSubmitting} required />
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
              {isSubmitting ? "Adding Dish..." : "Add Dish to Menu"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
