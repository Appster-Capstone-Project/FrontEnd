
"use client";

import Image from 'next/image';
import type { Dish } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Users, Calendar } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';

interface DishCardProps {
  dish: Dish;
}

const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(dish);
  };

  const isSoldOut = dish.slotsFilled >= dish.slotsTotal;
  const progress = (dish.slotsFilled / dish.slotsTotal) * 100;

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <Image
          src={dish.imageUrl || 'https://placehold.co/300x200.png'}
          alt={dish.title}
          width={300}
          height={200}
          className="w-full h-40 object-cover"
          data-ai-hint={dish.dataAiHint || 'food dish'}
        />
         <Badge 
            variant={isSoldOut ? "destructive" : "default"} 
            className="absolute top-2 right-2 text-xs"
        >
            {isSoldOut ? 'Sold Out' : 'Available'}
        </Badge>
        <Badge variant="secondary" className="absolute top-2 left-2 text-xs flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {format(new Date(dish.cookingDate), 'MMM d')}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-lg mb-2">{dish.title}</CardTitle>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{dish.description}</p>
        
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
      <CardFooter className="p-4 border-t flex-col items-start gap-3">
        <div className="flex items-center justify-between w-full">
            <p className="text-xl font-bold text-primary">${dish.price.toFixed(2)}</p>
             <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground" 
              disabled={isSoldOut}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {isSoldOut ? 'Fully Claimed' : 'Pitch In & Pay'}
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DishCard;
