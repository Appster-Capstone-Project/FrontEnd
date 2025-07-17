
"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Heart, 
  UserCircle, 
  ShoppingBag, 
  Search, 
  ChefHat, 
  LogOut, 
  LayoutDashboard, 
  TicketPercent,
  ListOrdered
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartSheet from './CartSheet';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from '@/components/ui/skeleton';

const Header = () => {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const router = useRouter();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect runs on the client and checks the login status.
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    const role = localStorage.getItem('userRole');
    if (token && name && role) {
      setIsLoggedIn(true);
      setUserName(name);
      setUserRole(role);
    } else {
      setIsLoggedIn(false);
      setUserName('');
      setUserRole(null);
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    setIsLoading(true);
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('sellerId'); // Clear sellerId on logout
    setIsLoggedIn(false);
    setUserName('');
    setUserRole(null);
    router.push('/auth/signin');
    // A small delay to ensure state updates before the loading indicator is removed on the next page
    setTimeout(() => setIsLoading(false), 50); 
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative flex items-center justify-center">
            <Package className="h-7 w-7 text-primary" />
            <Heart className="absolute top-0 right-0 h-3.5 w-3.5 text-accent fill-accent transform translate-x-1/4 -translate-y-1/4" />
          </div>
          <span className="font-headline text-2xl font-bold text-foreground">HomePalate</span>
        </Link>
        
        <nav className="flex items-center space-x-2 md:space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/vendors" className="flex items-center space-x-1">
              <Search className="h-4 w-4 md:mr-1" />
              <span className="hidden md:inline">Browse Food</span>
            </Link>
          </Button>

          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          ) : isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <UserCircle className="h-5 w-5" />
                   <span className="hidden sm:inline">{userName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {userRole === 'seller' ? (
                   <DropdownMenuItem asChild>
                     <Link href="/sell">
                       <ChefHat className="mr-2 h-4 w-4" />
                       <span>Seller Dashboard</span>
                     </Link>
                   </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                     <Link href="/dashboard">
                       <LayoutDashboard className="mr-2 h-4 w-4" />
                       <span>Dashboard</span>
                     </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/orders">
                    <ListOrdered className="mr-2 h-4 w-4" />
                    <span>My Orders</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/promotions">
                    <TicketPercent className="mr-2 h-4 w-4" />
                    <span>Promotions</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
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
            </>
          )}

          <CartSheet>
            <Button variant="ghost" size="icon" aria-label="Cart" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 justify-center rounded-full p-0 text-xs">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </CartSheet>
        </nav>
      </div>
    </header>
  );
};

export default Header;
