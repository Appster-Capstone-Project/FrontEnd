
import type { Vendor, Dish, Review, TiffinPlan } from '@/lib/types';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import StarRating from '@/components/shared/StarRating';
import DishCard from '@/components/shared/DishCard';
import TiffinPlanCard from '@/components/shared/TiffinPlanCard';
import ReviewCard from '@/components/shared/ReviewCard';
import SectionTitle from '@/components/shared/SectionTitle';
import { MapPin, Clock, Truck, Phone, MessageSquare, Utensils, ChefHat, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getVendorById, mockVendors } from '@/lib/data';

async function submitReview(formData: FormData) {
  "use server";
  const rawFormData = {
    rating: formData.get('rating'),
    comment: formData.get('comment'),
    vendorId: formData.get('vendorId'),
  };
  
  console.log("Review Submitted (Server Action Demo):", rawFormData);
  // This is where you would POST to a /reviews endpoint
  // For now, this is for demonstration.
}

async function getVendorDetails(id: string): Promise<Vendor | null> {
  const vendor = getVendorById(id);
  if (vendor) {
    return Promise.resolve(vendor);
  }
  return Promise.resolve(null);
}

export default async function VendorDetailPage({ params }: { params: { id: string } }) {
  const vendor = await getVendorDetails(params.id);

  if (!vendor) {
    notFound();
  }

  const VendorIcon = vendor.type === 'Home Cook' ? ChefHat : Utensils;
  const isTiffinService = vendor.type === 'Tiffin Service';

  return (
    <div className="container py-8 md:py-12">
      {/* Vendor Hero Section */}
      <Card className="mb-8 overflow-hidden shadow-xl">
        <div className="md:flex">
          <div className="md:w-1/3 relative">
            <Image
              src={vendor.imageUrl || 'https://placehold.co/600x400.png'}
              alt={vendor.name}
              width={600}
              height={400}
              className="w-full h-64 md:h-full object-cover"
              priority
              data-ai-hint={vendor.dataAiHint || "food vendor"}
            />
          </div>
          <div className="md:w-2/3 p-6 md:p-8">
            <div className="flex flex-wrap items-center mb-2 gap-2">
              <Badge variant={vendor.type === 'Home Cook' ? 'secondary' : 'outline'} className="capitalize mr-2">
                <VendorIcon className="mr-1 h-4 w-4" />
                {vendor.type}
              </Badge>
              {vendor.verified && (
                  <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                      <ShieldCheck className="mr-1 h-4 w-4" />
                      Verified Seller
                  </Badge>
              )}
              <StarRating rating={vendor.rating || 0} size={20} showText />
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
            {vendor.phone && (
                <Button size="sm" variant="outline" asChild>
                    <a href={`tel:${vendor.phone}`}>
                        <Phone className="h-4 w-4 mr-2"/> Contact Seller
                    </a>
                </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Menu and Reviews Tabs */}
      <Tabs defaultValue="menu" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 lg:w-1/3 mx-auto mb-6">
          <TabsTrigger value="menu" className="text-base py-2.5">
            <Utensils className="mr-2 h-5 w-5" /> {isTiffinService ? 'Subscription Plans' : 'Menu'}
          </TabsTrigger>
          <TabsTrigger value="reviews" className="text-base py-2.5">
            <MessageSquare className="mr-2 h-5 w-5" /> Reviews ({vendor.reviews ? vendor.reviews.length : 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="menu">
          <SectionTitle 
            title={isTiffinService ? 'Our Subscription Plans' : 'Our Menu'} 
            className="text-center mb-6" 
          />
          {vendor.menu && vendor.menu.length > 0 ? (
            isTiffinService ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {(vendor.menu as TiffinPlan[]).map((plan: TiffinPlan) => (
                  <TiffinPlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(vendor.menu as Dish[]).map((dish: Dish) => (
                  <DishCard key={dish.id} dish={dish} vendor={vendor} layout="vertical" />
                ))}
              </div>
            )
          ) : (
            <p className="text-center text-muted-foreground py-8">This vendor hasn't added any dishes to their menu yet.</p>
          )}
        </TabsContent>

        <TabsContent value="reviews">
          <SectionTitle title="Customer Reviews" className="text-center mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {vendor.reviews && vendor.reviews.length > 0 ? (
                vendor.reviews.map((review: Review) => (
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
                  <input type="hidden" name="vendorId" value={vendor.id} />
                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-foreground mb-1">Your Rating</label>
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
