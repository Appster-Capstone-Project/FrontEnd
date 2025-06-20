
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-var(--header-height)-var(--footer-height))] flex-col">
      <div 
        className="relative flex flex-grow flex-col items-center justify-center p-4 sm:p-8 bg-cover bg-center"
        style={{ backgroundImage: "url('https://placehold.co/1200x800.png')" }}
        data-ai-hint="delicious food variety"
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        <Card className="relative z-10 w-full max-w-md bg-card/80 text-card-foreground shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl text-primary flex items-center justify-center">
              <Heart className="mr-3 h-8 w-8" />
              Discover Delicious Homemade Meals
            </CardTitle>
            <CardDescription className="text-lg text-card-foreground/90 pt-2">
              Explore a world of authentic flavors from talented home cooks and reliable tiffin services near you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Find your next favorite meal, support local cooks, and enjoy the convenience of fresh, home-style food.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/auth/signin?type=user">Sign In to Order</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/auth/signup?type=user">Sign Up to Explore</Link>
              </Button>
            </div>
             <p className="mt-6 text-sm text-muted-foreground text-center">
              <Link href="/auth/signin?type=seller" className="font-medium text-primary hover:underline">Login as Seller</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
