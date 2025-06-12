import { getVendorById } from '@/lib/data';
import type { Vendor } from '@/lib/types';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import StarRating from '@/components/shared/StarRating';
import DishCard from '@/components/shared/DishCard';
import ReviewCard from '@/components/shared/ReviewCard';
import SectionTitle from '@/components/shared/SectionTitle';
import { MapPin, Clock, Truck, Phone, MessageSquare, Utensils, ChefHat } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
// Placeholder for a form component if we were to use react-hook-form
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Dummy submit review action
async function submitReview(formData: FormData) {
  "use server";
  // In a real app, you'd process this data, save to DB, etc.
  console.log("Review Submitted:");
  console.log("Rating:", formData.get("rating"));
  console.log("Comment:", formData.get("comment"));
  // Potentially revalidatePath or redirect
}


export default async function VendorDetailPage({ params }: { params: { id: string } }) {
  const vendor = getVendorById(params.id);

  if (!vendor) {
    notFound();
  }

  const VendorIcon = vendor.type === 'Home Cook' ? ChefHat : Utensils;

  return (
    <div className="container py-8 md:py-12">
      {/* Vendor Hero Section */}
      <Card className="mb-8 overflow-hidden shadow-xl">
        <div className="md:flex">
          <div className="md:w-1/3 relative">
            <Image
              src={vendor.imageUrl}
              alt={vendor.name}
              width={600}
              height={400}
              className="w-full h-64 md:h-full object-cover"
              priority
              data-ai-hint={vendor.dataAiHint || "food vendor"}
            />
          </div>
          <div className="md:w-2/3 p-6 md:p-8">
            <div className="flex items-center mb-2">
              <Badge variant={vendor.type === 'Home Cook' ? 'secondary' : 'outline'} className="capitalize mr-2">
                <VendorIcon className="mr-1 h-4 w-4" />
                {vendor.type}
              </Badge>
              <StarRating rating={vendor.rating} size={20} showText />
            </div>
            <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-2">{vendor.name}</h1>
            <p className="text-muted-foreground mb-4">{vendor.description}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm mb-4">
              {vendor.specialty && (
                <div className="flex items-center">
                  <Utensils className="h-4 w-4 mr-2 text-accent" />
                  <span className="font-medium">Specialty:</span>&nbsp;{vendor.specialty}
                </div>
              )}
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-accent" />
                <span className="font-medium">Location:</span>&nbsp;{vendor.address}, {vendor.city}
              </div>
              {vendor.operatingHours && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-accent" />
                   <span className="font-medium">Hours:</span>&nbsp;{vendor.operatingHours}
                </div>
              )}
              {vendor.deliveryOptions && vendor.deliveryOptions.length > 0 && (
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-2 text-accent" />
                  <span className="font-medium">Delivery:</span>&nbsp;{vendor.deliveryOptions.join(', ')}
                </div>
              )}
            </div>
            <Button size="sm" variant="outline">
              <Phone className="h-4 w-4 mr-2"/> Contact Seller
            </Button>
          </div>
        </div>
      </Card>

      {/* Menu and Reviews Tabs */}
      <Tabs defaultValue="menu" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 lg:w-1/3 mx-auto mb-6">
          <TabsTrigger value="menu" className="text-base py-2.5">
            <Utensils className="mr-2 h-5 w-5" /> Menu
          </TabsTrigger>
          <TabsTrigger value="reviews" className="text-base py-2.5">
            <MessageSquare className="mr-2 h-5 w-5" /> Reviews ({vendor.reviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="menu">
          <SectionTitle title="Our Menu" className="text-center mb-6" />
          {vendor.menu.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vendor.menu.map((dish) => (
                <DishCard key={dish.id} dish={dish} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">This vendor hasn't added any dishes to their menu yet.</p>
          )}
        </TabsContent>

        <TabsContent value="reviews">
          <SectionTitle title="Customer Reviews" className="text-center mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {vendor.reviews.length > 0 ? (
                vendor.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No reviews yet. Be the first to leave one!</p>
              )}
            </div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl">Write a Review</CardTitle>
                <CardDescription>Share your experience with {vendor.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={submitReview} className="space-y-4">
                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-foreground mb-1">Your Rating</label>
                    {/* Basic select for rating, can be replaced with a star input component */}
                    <select 
                      id="rating" 
                      name="rating"
                      required
                      className="w-full p-2 border rounded-md bg-background border-input focus:ring-primary focus:border-primary"
                    >
                      <option value="">Select rating</option>
                      <option value="5">5 Stars - Excellent</option>
                      <option value="4">4 Stars - Very Good</option>
                      <option value="3">3 Stars - Good</option>
                      <option value="2">2 Stars - Fair</option>
                      <option value="1">1 Star - Poor</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-foreground mb-1">Your Comment</label>
                    <Textarea id="comment" name="comment" rows={4} placeholder="Tell us about your experience..." required />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Submit Review</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
