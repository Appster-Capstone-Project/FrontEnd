
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Dish, Vendor } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Users, Calendar, MapPin, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

interface DishCardProps {
  dish: Dish;
  vendor?: Vendor;
  layout?: 'vertical' | 'horizontal';
}

const DishCard: React.FC<DishCardProps> = ({ dish, vendor, layout = 'vertical' }) => {
  const { addToCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // This check runs on the client and won't cause hydration errors.
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (token && role === 'user') {
      setIsLoggedIn(true);
    }
  }, []);
  
  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast({
        title: "Please Log In",
        description: "You need to be logged in as a user to pitch in.",
        variant: "destructive"
      });
      router.push('/auth/signin');
      return;
    }
    addToCart(dish);
  };

  const isSoldOut = dish.slotsFilled >= dish.slotsTotal;
  const progress = (dish.slotsFilled / dish.slotsTotal) * 100;
  
  const cookingDate = new Date(dish.cookingDate);
  const readyByTime = format(cookingDate, 'p'); // e.g., 5:00 PM
  const cookingDay = format(cookingDate, 'MMM d'); // e.g., Jul 23

  if (layout === 'horizontal') {
    return (
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 w-full">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 relative">
            <Link href={`/vendors/${dish.sellerId}`} className="block cursor-pointer">
                <Image
                  src={dish.imageUrl || 'https://placehold.co/400x300.png'}
                  alt={dish.title}
                  width={400}
                  height={300}
                  className="w-full h-48 md:h-full object-cover"
                  data-ai-hint={dish.dataAiHint || 'food dish'}
                />
            </Link>
          </div>
          <div className="md:w-2/3 flex flex-col">
            <CardContent className="p-6 flex-grow">
              <CardTitle className="font-headline text-2xl mb-2 line-clamp-2 leading-tight hover:text-primary transition-colors">
                <Link href={`/vendors/${dish.sellerId}`}>{dish.title}</Link>
              </CardTitle>
              {vendor && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3 text-sm">
                    <Link href={`/vendors/${vendor.id}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={vendor.profileImageUrl} alt={vendor.name} />
                        <AvatarFallback>{vendor.name.substring(0, 1)}</AvatarFallback>
                      </Avatar>
                      <span>By {vendor.name}</span>
                    </Link>
                    {vendor.verified && (
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-xs">
                          <ShieldCheck className="mr-1 h-3 w-3" />
                          Verified Seller
                      </Badge>
                    )}
                    <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1 text-accent" />
                        <span>{vendor.city}</span>
                    </div>
                </div>
              )}
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4 mr-2 text-accent" />
                  <span>Ready {cookingDay} by {readyByTime}</span>
              </div>
              <div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                      <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{dish.slotsFilled} / {dish.slotsTotal} claimed</span>
                      </div>
                      <span className="font-semibold">{progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex items-center justify-between">
              <p className="text-xl font-bold text-primary">${dish.price.toFixed(2)}</p>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground" 
                size="sm"
                disabled={isSoldOut}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {isSoldOut ? 'Fully Claimed' : 'Pitch In'}
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>
    );
  }

  // Default vertical layout
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full bg-card">
      <CardHeader className="p-0 relative">
        <Link href={`/vendors/${dish.sellerId}`} className="block cursor-pointer">
              <Image
                src={dish.imageUrl || 'https://placehold.co/300x200.png'}
                alt={dish.title}
                width={300}
                height={200}
                className="w-full h-40 object-cover"
                data-ai-hint={dish.dataAiHint || 'food dish'}
              />
        </Link>
         <Badge 
            variant={isSoldOut ? "destructive" : "default"} 
            className="absolute top-2 right-2 text-xs"
        >
            {isSoldOut ? 'Sold Out' : 'Available'}
        </Badge>
      </CardHeader>
      
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-lg mb-2 line-clamp-2 leading-tight hover:text-primary transition-colors">
          <Link href={`/vendors/${dish.sellerId}`}>{dish.title}</Link>
        </CardTitle>
        {vendor && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
              <Link href={`/vendors/${vendor.id}`} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={vendor.profileImageUrl} alt={vendor.name} />
                  <AvatarFallback>{vendor.name.substring(0, 1)}</AvatarFallback>
                </Avatar>
                By {vendor.name}
              </Link>
              {vendor.verified && (
                  <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-xs py-0.5">
                      <ShieldCheck className="mr-1 h-3 w-3" />
                      Verified
                  </Badge>
              )}
          </div>
        )}
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
            <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-accent" />
                <span>Ready {cookingDay} by {readyByTime}</span>
            </div>
            {vendor && (
                 <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-accent" />
                    <span>{vendor.city}</span>
                </div>
            )}
        </div>
        
        <div>
            <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    <span>{dish.slotsFilled} / {dish.slotsTotal} claimed</span>
                </div>
                <span className="font-semibold">{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
        </div>
      </CardContent>

      <CardFooter className="p-4 border-t flex flex-col items-start gap-3 bg-muted/30">
        <div className="flex items-center justify-between w-full">
            <p className="text-xl font-bold text-primary">${dish.price.toFixed(2)}</p>
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground" 
              size="sm"
              disabled={isSoldOut}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {isSoldOut ? 'Fully Claimed' : 'Pitch In'}
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DishCard;
