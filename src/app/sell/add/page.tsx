
"use client";

import * as React from "react";
import { PlusCircle, Upload, Calendar as CalendarIcon } from "lucide-react";
import SectionTitle from "@/components/shared/SectionTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function AddListingPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [slotsTotal, setSlotsTotal] = React.useState("");
  const [cookingDate, setCookingDate] = React.useState<Date | undefined>(new Date());
  const [available, setAvailable] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    if (!token || userRole !== 'seller') {
      toast({ variant: "destructive", title: "Unauthorized", description: "You must be logged in as a seller."});
      router.push('/auth/signin?type=seller');
    }
  }, [router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!title || !price || !description || !slotsTotal || !cookingDate) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "All fields are required.",
      });
      setIsSubmitting(false);
      return;
    }
    
    // Simulate API Call
    setTimeout(() => {
      toast({
        title: "Dish Added Successfully!",
        description: `'${title}' has been added to your menu.`,
      });
      setIsSubmitting(false);
      // Redirect to the main seller dashboard to see the new list
      router.push('/sell');
    }, 1000);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <SectionTitle 
        title="Plan a New Meal"
        subtitle="Set up your next meal for the community to pitch in."
      />
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center">
                <PlusCircle className="mr-2 h-5 w-5 text-primary" /> Meal Details
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
                <Input id="title" placeholder="e.g., Weekend Chicken Biryani" value={title} onChange={e => setTitle(e.target.value)} disabled={isSubmitting} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Price per Portion ($)</Label>
                    <Input id="price" type="number" step="0.01" placeholder="12.99" value={price} onChange={e => setPrice(e.target.value)} disabled={isSubmitting} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="slotsTotal">Total Portions</Label>
                    <Input id="slotsTotal" type="number" placeholder="10" value={slotsTotal} onChange={e => setSlotsTotal(e.target.value)} disabled={isSubmitting} required />
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
                          onSelect={setCookingDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe your meal..." value={description} onChange={e => setDescription(e.target.value)} disabled={isSubmitting} required />
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <Switch id="available" checked={available} onCheckedChange={setAvailable} disabled={isSubmitting} />
              <Label htmlFor="available" className="cursor-pointer">
                {available ? "This meal is available for pre-order" : "This meal is currently paused"}
              </Label>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
              {isSubmitting ? "Adding Meal..." : "Add Meal to Menu"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
