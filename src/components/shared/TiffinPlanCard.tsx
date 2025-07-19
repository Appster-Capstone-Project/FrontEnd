
"use client";

import Image from 'next/image';
import type { TiffinPlan } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Check, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface TiffinPlanCardProps {
  plan: TiffinPlan;
}

const TiffinPlanCard: React.FC<TiffinPlanCardProps> = ({ plan }) => {
  // const { addToCart } = useCart();
  
  const handleSubscribe = () => {
    // Note: The cart currently only supports `Dish` items.
    // This would need to be extended to support TiffinPlan subscriptions.
    alert(`Subscribing to ${plan.title}`);
  };

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border-2 border-primary/20">
      <CardHeader className="p-4 bg-muted/50">
         <Badge 
            variant="default"
            className="w-fit text-sm py-1"
        >
            {plan.planType} Plan
        </Badge>
        <CardTitle className="font-headline text-2xl pt-2">{plan.title}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <ul className="space-y-2 text-sm text-muted-foreground">
            {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>{feature}</span>
                </li>
            ))}
        </ul>
      </CardContent>
      <CardFooter className="p-4 border-t flex-col items-start gap-3">
        <div className="flex items-center justify-between w-full">
            <div>
                <p className="text-2xl font-bold text-primary">${plan.price.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">per {plan.planType.toLowerCase()}</p>
            </div>
             <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground" 
              onClick={handleSubscribe}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Subscribe
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TiffinPlanCard;
