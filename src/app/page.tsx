
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart, ChefHat } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-var(--header-height)-var(--footer-height))] flex-col">
      <div 
        className="relative flex flex-grow flex-col items-center justify-center p-4 sm:p-8 bg-cover bg-center"
        style={{ backgroundImage: "url('https://www.helpguide.org/wp-content/uploads/2023/02/Cooking-at-Home-1200x800.jpeg')" }}
        data-ai-hint="home cooking"
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
                <Link href="/auth/signin">Find a Meal</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/auth/signup">Sign Up to Explore</Link>
              </Button>
            </div>
             <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>
             <Button asChild variant="secondary" className="w-full">
                <Link href="/auth/signin?type=seller">
                  <ChefHat className="mr-2 h-4 w-4" />
                  Sign In or Register as a Seller
                </Link>
              </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
