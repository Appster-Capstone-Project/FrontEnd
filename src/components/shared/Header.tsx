import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Package, Heart, UserCircle, ShoppingBag, Search, ChefHat } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative flex items-center justify-center">
            <Package className="h-7 w-7 text-primary" />
            <Heart className="absolute top-0 right-0 h-3.5 w-3.5 text-accent fill-accent transform translate-x-1/4 -translate-y-1/4" />
          </div>
          <span className="font-headline text-2xl font-bold text-foreground">Tiffin Box</span>
        </Link>
        <nav className="flex items-center space-x-2 md:space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/vendors" className="flex items-center space-x-1">
              <Search className="h-4 w-4 md:mr-1" />
              <span className="hidden md:inline">Browse Food</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/auth/signin?type=seller" className="flex items-center space-x-1">
              <ChefHat className="h-4 w-4 md:mr-1" />
              <span className="hidden md:inline">Become / Sign In as Seller</span>
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/auth/signin" className="flex items-center space-x-2">
              <UserCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
              <span className="hidden md:inline"> / Sign Up</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
