import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, UserCircle, ShoppingBag } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <UtensilsCrossed className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-bold text-foreground">HomePalate</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/">Browse Food</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/sell">Become a Seller</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/auth/signin" className="flex items-center space-x-2">
              <UserCircle className="h-4 w-4" />
              <span>Login / Sign Up</span>
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
