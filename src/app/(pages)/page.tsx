
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Utensils, ShoppingBag, TrendingUp, Heart } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-var(--header-height)-var(--footer-height))] flex-col">
      <div className="grid flex-grow md:grid-cols-2">
        {/* Seller Section */}
        <div 
          className="relative flex flex-col items-center justify-center p-8 text-center bg-cover bg-center"
          style={{ backgroundImage: "url('https://placehold.co/800x600.png')" }}
          data-ai-hint="kitchen cooking"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <Card className="relative z-10 w-full max-w-md bg-card/80 text-card-foreground shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-primary flex items-center justify-center">
                <TrendingUp className="mr-3 h-8 w-8" />
                Share Your Culinary Creations
              </CardTitle>
              <CardDescription className="text-lg text-card-foreground/90 pt-2">
                Join Tiffin Box as a seller and reach hungry customers in your neighborhood. Turn your passion for cooking into a thriving business.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Showcase your unique dishes, manage orders easily, and grow your brand with our supportive platform.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button asChild size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/auth/signin?type=seller">Sign In as Seller</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link href="/auth/signup?type=seller">Sign Up as Seller</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User/Buyer Section */}
        <div 
          className="relative flex flex-col items-center justify-center p-8 text-center bg-cover bg-center"
          style={{ backgroundImage: "url('https://placehold.co/800x600.png')" }}
          data-ai-hint="delicious food variety"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <Card className="relative z-10 w-full max-w-md bg-card/80 text-card-foreground shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-primary flex items-center justify-center">
                <Heart className="mr-3 h-8 w-8" />
                Discover Delicious Homemade Meals
              </CardTitle>
              <CardDescription className="text-lg text-card-foreground/90 pt-2">
                Explore a world of authentic flavors from talented home cooks and reliable tiffin services near you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
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
               <p className="mt-6 text-sm text-muted-foreground">
                Or, <Link href="/vendors" className="font-medium text-primary hover:underline">browse all listings</Link> as a guest.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
