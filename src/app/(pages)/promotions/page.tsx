
"use client";

import * as React from 'react';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Dish, Vendor } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tag, Utensils, ChefHat } from 'lucide-react';
import Link from 'next/link';

// Combined data structure for the promotion
interface Promotion extends Dish {
  seller: Vendor;
}

const PromotionCardSkeleton = () => (
    <Card className="overflow-hidden shadow-lg">
        <div className="grid md:grid-cols-2">
            <div className="p-6 flex flex-col justify-between">
                <div className="space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-5/6" />
                     <div className="flex items-center space-x-2 pt-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                </div>
                <div className="pt-4">
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
            <Skeleton className="w-full h-64 md:h-full min-h-[250px]" />
        </div>
    </Card>
)

export default function PromotionsPage() {
  const [promotion, setPromotion] = React.useState<Promotion | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchPromotion = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Step 1: Fetch all listings to find the latest one
        const listingsRes = await fetch('/api/listings');
        if (!listingsRes.ok) {
            throw new Error('Could not fetch dishes from the server.');
        }

        const listings: Dish[] = await listingsRes.json();
        
        // Let's assume the API returns listings in a consistent order,
        // and we'll pick the first one as our "latest" or "featured" dish.
        const latestDish = listings[0];

        if (!latestDish) {
          // No dishes available to promote
          setIsLoading(false);
          setPromotion(null);
          return;
        }

        // Step 2: Fetch the seller details for the latest dish
        const sellerRes = await fetch(`/api/sellers/${latestDish.sellerId}`);
        if (!sellerRes.ok) {
           throw new Error(`Could not fetch seller details for the featured dish.`);
        }
        
        const seller: Vendor = await sellerRes.json();

        // Augment seller with placeholder data for UI consistency
        const augmentedSeller = {
          ...seller,
          type: 'Home Cook' as const, // Assuming default
          imageUrl: 'https://www.themanual.com/wp-content/uploads/sites/9/2021/03/learning-to-cook.jpg?fit=800%2C533&p=1',
          dataAiHint: 'home cooking',
        };

        const finalPromotion = { 
          ...latestDish, 
          // Ensure image path is correct
          imageUrl: latestDish.image ? `/api${latestDish.image}` : 'https://placehold.co/600x400.png',
          seller: augmentedSeller
        };
        
        setPromotion(finalPromotion);

      } catch (err) {
        const errorMessage = (err as Error).message;
        console.error("Promotion page error:", errorMessage);
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Failed to load promotions",
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotion();
  }, [toast]);
  
  const SellerIcon = promotion?.seller.type === 'Home Cook' ? ChefHat : Utensils;
  const originalPrice = promotion ? promotion.price : 0;
  const discountedPrice = originalPrice * 0.8;

  return (
    <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
      <SectionTitle
        title="Special Promotions"
        subtitle="Exclusive discounts on freshly added meals"
        className="mb-8"
      />
      {isLoading ? (
        <PromotionCardSkeleton />
      ) : error ? (
        <Card className="text-center p-8">
          <CardTitle className="text-destructive">Something went wrong</CardTitle>
          <CardDescription className="mt-2">{error}</CardDescription>
        </Card>
      ) : promotion ? (
        <Card className="overflow-hidden shadow-lg border-2 border-primary/20">
            <div className="grid md:grid-cols-2">
                <div className="p-6 flex flex-col justify-between">
                    <div>
                        <Badge variant="secondary" className="mb-4">
                            <Tag className="mr-2 h-4 w-4" /> 20% OFF
                        </Badge>
                        <h3 className="font-headline text-3xl font-bold text-primary">{promotion.title}</h3>
                        <p className="text-muted-foreground mt-2">{promotion.description}</p>
                        <div className="flex items-center space-x-2 mt-4">
                            <p className="text-xl font-semibold text-muted-foreground line-through">${originalPrice.toFixed(2)}</p>
                            <p className="text-3xl font-bold text-foreground">${discountedPrice.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-3 pt-6">
                            <img src={promotion.seller.imageUrl} alt={promotion.seller.name} className="h-12 w-12 rounded-full object-cover" data-ai-hint={promotion.seller.dataAiHint} />
                            <div>
                                <p className="text-sm text-muted-foreground">Offered by</p>
                                <p className="font-semibold text-foreground">{promotion.seller.name}</p>
                            </div>
                        </div>
                    </div>
                    <Button asChild size="lg" className="w-full mt-6">
                        <Link href={`/vendors/${promotion.sellerId}`}>View Offer</Link>
                    </Button>
                </div>
                <div className="bg-muted">
                    <img
                    src={promotion.imageUrl}
                    alt={promotion.title}
                    className="w-full h-64 md:h-full object-cover"
                    data-ai-hint={promotion.dataAiHint}
                    />
                </div>
            </div>
        </Card>
      ) : (
        <Card className="text-center p-12">
            <CardTitle>No Promotions Available</CardTitle>
            <CardDescription className="mt-2">Please check back later for new offers.</CardDescription>
        </Card>
      )}
    </div>
  );
}
