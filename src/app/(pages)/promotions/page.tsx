
import type { Dish, Vendor } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/shared/SectionTitle';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Tag, Utensils } from 'lucide-react';
import Link from 'next/link';

// Simplified data fetching in a single function for clarity
async function getLatestPromotion() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("API base URL is not configured.");
  }

  try {
    // 1. Fetch all listings
    const listingsRes = await fetch(`${baseUrl}/listings`, { cache: 'no-store' });
    if (!listingsRes.ok) {
      throw new Error(`Failed to fetch listings: ${listingsRes.statusText}`);
    }
    const listings: Dish[] = await listingsRes.json();

    // 2. Find the most recent dish (assuming the last in the array is the newest)
    if (!listings || listings.length === 0) {
      return null; // No dishes available
    }
    const latestDish = listings[listings.length - 1];

    // 3. Fetch the seller of that dish
    const sellerRes = await fetch(`${baseUrl}/sellers/${latestDish.sellerId}`);
    if (!sellerRes.ok) {
      throw new Error(`Failed to fetch seller: ${sellerRes.statusText}`);
    }
    const seller: Vendor = await sellerRes.json();

    // 4. Combine and return the data
    return {
      dish: latestDish,
      seller: seller,
    };

  } catch (error) {
    console.error("Error fetching promotion:", error);
    // Return null or throw a more specific error to be handled by an error boundary
    // For now, we will let it be caught by the page's error boundary
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("An unknown error occurred while fetching promotions.");
  }
}


export default async function PromotionsPage() {
  const promotion = await getLatestPromotion();

  const renderPromotionCard = (dish: Dish, seller: Vendor) => {
    const originalPrice = dish.price;
    const discount = 0.20; // 20% off
    const discountedPrice = originalPrice * (1 - discount);
    const imageUrl = dish.image ? `/api${dish.image}` : 'https://placehold.co/600x400.png';

    return (
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 w-full">
        <div className="flex flex-col sm:flex-row h-full">
          <div className="sm:w-1/3 relative flex-shrink-0">
             <img
              src={imageUrl}
              alt={dish.title}
              className="w-full h-48 sm:h-full object-cover"
              data-ai-hint="delicious food"
            />
          </div>
          <div className="p-6 flex flex-col justify-between flex-grow">
            <div>
              <Badge variant="secondary" className="mb-2">
                <Tag className="mr-1 h-4 w-4"/>
                Special Offer
              </Badge>
              <CardTitle className="font-headline text-2xl mb-2">{dish.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mb-3">
                Enjoy a 20% discount on this delicious dish from <span className="font-semibold text-primary">{seller.name}</span>!
              </CardDescription>
              <div className="flex items-center gap-3 my-4">
                  <span className="text-xl font-bold text-destructive line-through">${originalPrice.toFixed(2)}</span>
                  <span className="text-2xl font-bold text-primary">${discountedPrice.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-xs text-muted-foreground">
                    <Utensils className="h-4 w-4 mr-2"/>
                    From {seller.name}
                </div>
                <Button asChild>
                    <Link href={`/vendors/${seller.id}`}>
                        View Dish <ArrowRight className="ml-2 h-4 w-4"/>
                    </Link>
                </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="container py-12 md:py-16">
       <SectionTitle 
        title="Today's Special Promotions"
        subtitle="Exclusive discounts on freshly added meals from our best cooks."
        className="mb-8 text-left"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {promotion ? (
            renderPromotionCard(promotion.dish, promotion.seller)
        ) : (
          <div className="lg:col-span-2">
            <Card className="py-12 text-center">
                <CardHeader>
                    <CardTitle>No Promotions Available</CardTitle>
                    <CardDescription>Please check back later for new offers.</CardDescription>
                </CardHeader>
            </Card>
          </div>
        )}
         {/* You can add more promotion cards here in the future */}
      </div>
    </div>
  );
}
