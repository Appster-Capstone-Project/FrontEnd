
"use client";

import * as React from 'react';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Dish, Vendor } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';
import Link from 'next/link';

// Combined data structure for the promotion
interface Promotion extends Dish {
  seller: Vendor;
}

const PromotionCardSkeleton = () => (
    <Card className="overflow-hidden shadow-lg">
        <div className="p-4">
            <div className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="pt-2">
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
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
        const listingsRes = await fetch('/api/listings');
        if (!listingsRes.ok) {
            throw new Error('Could not fetch dishes.');
        }

        const listings: Dish[] = await listingsRes.json();
        const latestDish = listings[0];

        if (!latestDish) {
          setPromotion(null);
          return;
        }

        const sellerRes = await fetch(`/api/sellers/${latestDish.sellerId}`);
        if (!sellerRes.ok) {
           throw new Error(`Could not fetch seller details.`);
        }
        
        const seller: Vendor = await sellerRes.json();

        const augmentedSeller = {
          ...seller,
          type: 'Home Cook' as const,
          imageUrl: 'https://www.themanual.com/wp-content/uploads/sites/9/2021/03/learning-to-cook.jpg?fit=800%2C533&p=1',
          dataAiHint: 'home cooking',
        };

        const finalPromotion = { 
          ...latestDish, 
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
  
  const originalPrice = promotion ? promotion.price : 0;
  const discountedPrice = originalPrice * 0.8;

  return (
    <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
      <SectionTitle
        title="Special Promotions"
        subtitle="Exclusive discounts on freshly added meals"
      />
      {isLoading ? (
        <PromotionCardSkeleton />
      ) : error ? (
        <Card className="text-center p-8">
          <CardContent>
            <h3 className="text-destructive">Something went wrong</h3>
            <p className="mt-2">{error}</p>
          </CardContent>
        </Card>
      ) : promotion ? (
        <Card className="overflow-hidden shadow-lg border-2 border-primary/20 max-w-4xl mx-auto">
            <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <img
                        src={promotion.imageUrl}
                        alt={promotion.title}
                        className="w-24 h-24 object-cover rounded-md"
                        data-ai-hint={promotion.dataAiHint}
                    />
                    <div>
                        <h3 className="font-headline text-xl font-bold text-primary">{promotion.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Offered by <span className="font-semibold text-foreground">{promotion.seller.name}</span>
                        </p>
                        <div className="flex items-baseline space-x-2 mt-2">
                            <p className="text-md font-semibold text-muted-foreground line-through">${originalPrice.toFixed(2)}</p>
                            <p className="text-xl font-bold text-foreground">${discountedPrice.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                 <div className="flex flex-col items-end gap-2">
                     <Badge variant="destructive">
                        <Tag className="mr-2 h-4 w-4" /> 20% OFF
                    </Badge>
                    <Button asChild size="sm" className="mt-2">
                        <Link href={`/vendors/${promotion.sellerId}`}>Claim Offer</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
      ) : (
        <Card className="text-center p-12">
            <CardContent>
                <h3>No Promotions Available</h3>
                <p className="mt-2">Please check back later for new offers.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
