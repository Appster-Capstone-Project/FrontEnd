import Image from 'next/image';
import type { Dish } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package } from 'lucide-react';

interface DishCardProps {
  dish: Dish;
}

const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  const portionsText = dish.portionsAvailable !== undefined && dish.portionsTotal !== undefined
    ? dish.portionsAvailable > 0
      ? `${dish.portionsAvailable} portion${dish.portionsAvailable > 1 ? 's' : ''} left`
      : 'Sold out'
    : null;

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <Image
          src={dish.imageUrl}
          alt={dish.name}
          width={300}
          height={200}
          className="w-full h-40 object-cover"
          data-ai-hint={dish.dataAiHint || 'food dish'}
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-lg mb-1">{dish.name}</CardTitle>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{dish.description}</p>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="default" className="text-base bg-accent text-accent-foreground">${dish.price.toFixed(2)}</Badge>
          {portionsText && (
            <Badge variant={dish.portionsAvailable === 0 ? "destructive" : "outline"} className="text-xs">
              <Package className="h-3 w-3 mr-1" />
              {portionsText}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
          disabled={dish.portionsAvailable === 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {dish.portionsAvailable === 0 ? 'Unavailable' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DishCard;
