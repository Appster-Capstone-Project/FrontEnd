
"use client";

import Image from 'next/image';
import type { Dish } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, Users } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface DishCardProps {
  dish: Dish;
}

const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(dish);
  };

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
            variant={dish.available ? "default" : "destructive"} 
            className="absolute top-2 right-2 text-xs"
        >
            <Package className="h-3 w-3 mr-1" />
            {dish.available ? 'Available' : 'Sold out'}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-lg mb-1">{dish.title}</CardTitle>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{dish.description}</p>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-base bg-accent text-accent-foreground">${dish.price.toFixed(2)}</Badge>
          {dish.portionSize && (
             <div className="flex items-center text-xs text-muted-foreground">
                <Users className="h-3 w-3 mr-1" />
                <span>Serves {dish.portionSize}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
          disabled={!dish.available || (dish.leftSize !== undefined && dish.leftSize <= 0)}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {dish.available ? `Add to Cart (${dish.leftSize} left)` : 'Unavailable'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DishCard;
