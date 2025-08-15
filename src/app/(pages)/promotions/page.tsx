
"use client";

import { useEffect, useState } from "react";
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { TicketPercent, Tag, Loader2, ServerCrash, Utensils } from 'lucide-react';
import type { Dish, Vendor } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface Promotion {
    dish: Dish;
    seller: Vendor;
    discountedPrice: number;
}

const PromotionCard = ({ promotion }: { promotion: Promotion }) => (
    <Card className="shadow-lg overflow-hidden flex flex-col sm:flex-row h-full">
        <div className="w-full sm:w-2/5">
            <img
                src={promotion.dish.imageUrl || 'https://placehold.co/300x200.png'}
                alt={promotion.dish.title}
                className="w-full h-full object-cover"
                data-ai-hint={promotion.dish.dataAiHint || 'food dish'}
            />
        </div>
        <div className="w-full sm:w-3/5 flex flex-col">
            <CardContent className="p-6 flex-grow space-y-3">
                 <h3 className="font-headline text-xl font-bold">{promotion.dish.title}</h3>
                 <p className="text-sm text-muted-foreground flex items-center">
                    <Utensils className="h-4 w-4 mr-2" />
                    From <span className="font-semibold text-foreground ml-1">{promotion.seller.name}</span>
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2">{promotion.dish.description}</p>
                 <div className="flex items-baseline gap-3 pt-2">
                    <span className="text-3xl font-bold text-primary">${promotion.discountedPrice.toFixed(2)}</span>
                    <span className="text-lg text-muted-foreground line-through">${promotion.dish.price.toFixed(2)}</span>
                </div>
                 <p className="text-sm font-semibold text-green-600">20% OFF!</p>
            </CardContent>
            <CardFooter className="bg-muted/50 p-4 mt-auto">
                <Button asChild className="w-full" size="sm">
                    <Link href={`/vendors/${promotion.seller.id}`}>
                        <Tag className="mr-2 h-4 w-4" /> Claim Offer
                    </Link>
                </Button>
            </CardFooter>
        </div>
    </Card>
);

const PromotionSkeleton = () => (
     <Card className="shadow-lg overflow-hidden flex flex-col sm:flex-row">
        <div className="w-full sm:w-2/5">
             <Skeleton className="w-full h-full aspect-[4/3] sm:aspect-auto" />
        </div>
        <div className="w-full sm:w-3/5 flex flex-col">
            <CardContent className="p-6 flex-grow space-y-3">
                 <Skeleton className="h-7 w-4/5" />
                 <Skeleton className="h-5 w-3/5" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-9 w-1/2" />
            </CardContent>
            <CardFooter className="bg-muted/50 p-4 mt-auto">
                <Skeleton className="h-9 w-full" />
            </CardFooter>
        </div>
    </Card>
)

const NoPromotions = () => (
    <Card className="col-span-full">
        <CardContent className="pt-6 text-center">
            <TicketPercent className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">No promotions are available right now.</p>
            <p className="text-sm text-muted-foreground mt-1">Check back later for special deals on delicious food!</p>
        </CardContent>
    </Card>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
    <Card className="col-span-full text-center">
        <CardContent className="pt-6">
            <ServerCrash className="h-12 w-12 mx-auto text-destructive mb-4" />
            <p className="text-lg text-destructive-foreground">Could not load promotions.</p>
            <p className="text-sm text-muted-foreground mt-1">There was an issue fetching data from the server.</p>
            <Button onClick={onRetry} variant="outline" className="mt-4">Try Again</Button>
        </CardContent>
    </Card>
)

export default function PromotionsPage() {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { toast } = useToast();

  const fetchPromotion = async () => {
      setIsLoading(true);
      setError(false);
      try {
        // Step 1: Fetch all listings
        const listingsRes = await fetch('/api/listings');
        if (!listingsRes.ok) throw new Error("Could not fetch dishes.");
        const allDishes: Dish[] = await listingsRes.json();

        // Step 2: Get the most recent dish (assuming last in the array is the latest)
        const latestDish = allDishes.length > 0 ? allDishes[allDishes.length - 1] : null;

        if (!latestDish) {
            setPromotion(null);
            setIsLoading(false);
            return;
        }

        // Step 3: Fetch the seller for that dish
        const sellerRes = await fetch(`/api/sellers/${latestDish.sellerId}`);
        if (!sellerRes.ok) throw new Error(`Could not fetch seller for dish: ${latestDish.title}`);
        const seller: Vendor = await sellerRes.json();
        
        // Add image url to the dish if not present
        if (!latestDish.imageUrl && latestDish.image) {
            latestDish.imageUrl = `/api${latestDish.image}`;
        }

        // Step 4: Create the promotion object
        const finalPromotion: Promotion = {
            dish: latestDish,
            seller,
            discountedPrice: latestDish.price * 0.8,
        };
        
        setPromotion(finalPromotion);

      } catch (err) {
        console.error("Failed to fetch promotion", err);
        setError(true);
        toast({
            variant: "destructive",
            title: "Failed to load promotion",
            description: (err as Error).message,
        });
      } finally {
        setIsLoading(false);
      }
  }

  useEffect(() => {
    fetchPromotion();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container py-12 md:py-16">
      <SectionTitle
        title="Today's Special Offer"
        subtitle="A special discount on our latest featured dish."
        className="text-left"
      />
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {isLoading && <PromotionSkeleton />}
            {!isLoading && error && <ErrorState onRetry={fetchPromotion} />}
            {!isLoading && !error && promotion && <PromotionCard promotion={promotion} />}
            {!isLoading && !error && !promotion && <NoPromotions />}
       </div>
    </div>
  );
}
