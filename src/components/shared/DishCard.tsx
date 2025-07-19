
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Dish, Vendor } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Users, Calendar, ChefHat } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Progress } from '@/components/ui/progress';
import { format, formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarRating from './StarRating';

interface DishCardProps {
  dish: Dish;
  vendor?: Vendor;
}

const DishCard: React.FC<DishCardProps> = ({ dish, vendor }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(dish);
  };

  const isSoldOut = dish.slotsFilled >= dish.slotsTotal;
  const progress = (dish.slotsFilled / dish.slotsTotal) * 100;
  
  const timeAgo = dish.postedAt ? formatDistanceToNow(new Date(dish.postedAt), { addSuffix: true }) : format(new Date(dish.cookingDate), 'MMM d');

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full bg-card">
      <CardHeader className="p-0 relative">
        <Link href={`/vendors/${dish.sellerId}`} className="block">
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
        <Badge variant="secondary" className="absolute top-2 left-2 text-xs flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            Cooking: {format(new Date(dish.cookingDate), 'MMM d')}
        </Badge>
      </CardHeader>
      
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-xl mb-2 line-clamp-2 leading-tight hover:text-primary transition-colors">
          <Link href={`/vendors/${dish.sellerId}`}>{dish.title}</Link>
        </CardTitle>
        {vendor && (
          <div className="flex items-center gap-2 mb-3">
              <Avatar className="h-6 w-6">
                <AvatarImage src={vendor.profileImageUrl} alt={vendor.name} />
                <AvatarFallback>{vendor.name.substring(0, 1)}</AvatarFallback>
              </Avatar>
              <Link href={`/vendors/${vendor.id}`} className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">By {vendor.name}</Link>
          </div>
        )}
        
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
