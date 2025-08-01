
import type { Vendor, Dish, Review } from '@/lib/types';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import StarRating from '@/components/shared/StarRating';
import DishCard from '@/components/shared/DishCard';
import ReviewCard from '@/components/shared/ReviewCard';
import SectionTitle from '@/components/shared/SectionTitle';
import { MapPin, Clock, Truck, Phone, MessageSquare, Utensils, ChefHat } from 'lucide-react';
import { Badge } from '@/components/ui/badge';


async function submitReview(formData: FormData) {
  "use server";
  const rawFormData = {
    rating: formData.get('rating'),
    comment: formData.get('comment'),
    vendorId: formData.get('vendorId'),
  };
  
  console.log("Review Submitted (Server Action Demo):", rawFormData);
  // This is where you would POST to a /reviews endpoint
  // Since there is no review endpoint, this is for demonstration.
}

const fetchSignedUrl = async (imageUrlPath: string): Promise<string> => {
    try {
        // Use absolute URL for server-side fetching
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${imageUrlPath}`;

        const response = await fetch(apiUrl, { cache: 'no-store' });
        
        if (!response.ok) {
            throw new Error(`Failed to get signed URL for ${imageUrlPath}: ${response.statusText}`);
        }
        const data = await response.json();

        if (!data.signed_url) {
            throw new Error('Signed URL not found in response');
        }

        // Replace localhost from the backend with the public IP.
        const publicUrl = data.signed_url.replace('localhost:9000', '20.185.241.50:9000');
        return publicUrl;
    } catch (error) {
        console.error("Error fetching signed URL:", error);
        return 'https://placehold.co/300x200.png'; // Fallback URL
    }
};

async function getVendorDetails(id: string): Promise<Vendor | null> {
  try {
    const sellerRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sellers/${id}`);
    
    if (!sellerRes.ok) {
      if (sellerRes.status === 404) {
        console.log(`Vendor with ID ${id} not found.`);
        return null;
      }
      throw new Error(`Failed to fetch seller: ${sellerRes.statusText}`);
    }

    const seller = await sellerRes.json();
    let listings: Dish[] = [];
    
    try {
        const listingsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/listings?sellerId=${id}`);

        if (listingsRes.ok) {
            const rawListings = await listingsRes.json();
            
            if (Array.isArray(rawListings)) {
                 listings = await Promise.all(
                   rawListings.map(async (listing) => {
                     let finalImageUrl = 'https://placehold.co/300x200.png';
                     if (listing.image) {
                       finalImageUrl = await fetchSignedUrl(listing.image);
                     }
                     return {
                       ...listing,
                       imageUrl: finalImageUrl,
                       dataAiHint: 'food dish',
                     };
                   })
                 );
            }
        } else {
            console.warn(`Could not fetch listings for seller ${id}. Status: ${listingsRes.status}`);
        }
    } catch (e) {
        console.error(`An error occurred fetching listings for seller ${id}`, e);
    }

    // Placeholder reviews as there is no API endpoint for it
    const mockReviews: Review[] = [
      { id: 'r1-1', userName: 'Raj K.', rating: 5, comment: 'Best food I\'ve had in ages!', date: '2024-07-15T10:00:00Z', userImageUrl: 'https://placehold.co/40x40.png', dataAiHintUser: 'man smiling' },
      { id: 'r1-2', userName: 'Anita S.', rating: 4, comment: 'Delicious, a bit spicy for me though.', date: '2024-07-14T18:30:00Z', userImageUrl: 'https://placehold.co/40x40.png', dataAiHintUser: 'woman portrait' },
    ];
    
    return {
      id: seller.id,
      name: seller.name,
      phone: seller.phone,
      type: 'Home Cook', // Default type
      description: `Authentic meals from ${seller.name}. Browse the menu below.`,
      rating: 4.7, // Placeholder rating
      address: 'Location not specified',
      city: 'City',
      verified: seller.verified,
      imageUrl: 'https://placehold.co/600x400.png',
      dataAiHint: 'food vendor',
      specialty: 'Delicious Home Food',
      operatingHours: '10 AM - 10 PM',
      deliveryOptions: ['Pickup', 'Delivery'],
      menu: listings,
      reviews: mockReviews,
    };
  } catch (error) {
    console.error("Failed to fetch vendor details:", error);
    if (error instanceof Error) {
        throw new Error(`Network request failed: ${error.message}`);
    }
    throw new Error('An unknown network error occurred.');
  }
}

export default async function VendorDetailPage({ params }: { params: { id: string } }) {
  const vendor = await getVendorDetails(params.id);

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
            <div className="flex items-center mb-2">
              <Badge variant={vendor.type === 'Home Cook' ? 'secondary' : 'outline'} className="capitalize mr-2">
                <VendorIcon className="mr-1 h-4 w-4" />
                {vendor.type}
              </Badge>
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
            <Utensils className="mr-2 h-5 w-5" /> Menu
          </TabsTrigger>
          <TabsTrigger value="reviews" className="text-base py-2.5">
            <MessageSquare className="mr-2 h-5 w-5" /> Reviews ({vendor.reviews ? vendor.reviews.length : 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="menu">
          <SectionTitle title="Our Menu" className="text-center mb-6" />
          {vendor.menu && vendor.menu.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vendor.menu.map((dish: Dish) => (
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
