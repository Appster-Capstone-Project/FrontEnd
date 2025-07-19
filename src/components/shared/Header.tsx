
"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
  ListOrdered,
  Menu
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';

const Header = () => {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    setIsLoading(true);
    localStorage.clear();
    setIsLoggedIn(false);
    setUserName('');
    setUserRole(null);
    router.push('/auth/signin');
    // A small delay to ensure state updates before the loading indicator is removed on the next page
    setTimeout(() => setIsLoading(false), 50); 
  };
  
  const navLinks = [
    { href: "/dashboard", label: "Browse Food", icon: Search, roles: ['guest', 'user'] },
    { href: "/orders", label: "My Orders", icon: ListOrdered, roles: ['user'] },
    { href: "/profile", label: "My Profile", icon: UserCircle, roles: ['user'] },
    { href: "/sell", label: "Seller Dashboard", icon: ChefHat, roles: ['seller'] },
  ];
  
  const currentRole = isLoggedIn ? userRole : 'guest';
  const visibleNavLinks = navLinks.filter(link => link.roles.includes(currentRole as string));

  const authLinks = (
    <div className="flex flex-col space-y-3 pt-4 border-t">
       <Link href="/auth/signin?type=seller" passHref legacyBehavior>
        <Button asChild variant="ghost">
          <a>
            <ChefHat className="mr-2 h-4 w-4" />
            <span>Become/Sign In as Seller</span>
          </a>
        </Button>
       </Link>
       <Link href="/auth/signin" passHref legacyBehavior>
        <Button asChild variant="outline">
          <a>
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Login / Sign Up</span>
          </a>
        </Button>
       </Link>
    </div>
  );
  
  const UserMenu = () => (
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
             <Link href="/sell" passHref legacyBehavior>
                <a>
                  <ChefHat className="mr-2 h-4 w-4" />
                  <span>Seller Dashboard</span>
                </a>
             </Link>
           </DropdownMenuItem>
        ) : (
          <>
          <DropdownMenuItem asChild>
             <Link href="/dashboard" passHref legacyBehavior>
                <a>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </a>
             </Link>
          </DropdownMenuItem>
           <DropdownMenuItem asChild>
            <Link href="/orders" passHref legacyBehavior>
              <a>
                <ListOrdered className="mr-2 h-4 w-4" />
                <span>My Orders</span>
              </a>
            </Link>
          </DropdownMenuItem>
           <DropdownMenuItem asChild>
             <Link href="/profile" passHref legacyBehavior>
                <a>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </a>
             </Link>
           </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2" passHref legacyBehavior>
          <a>
            <div className="relative flex items-center justify-center">
              <Package className="h-7 w-7 text-primary" />
              <Heart className="absolute top-0 right-0 h-3.5 w-3.5 text-accent fill-accent transform translate-x-1/4 -translate-y-1/4" />
            </div>
            <span className="font-headline text-2xl font-bold text-foreground">TiffinBox</span>
          </a>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-2 md:space-x-4">
          <Link href="/dashboard" passHref legacyBehavior>
            <Button asChild variant="ghost">
              <a>
                <Search className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Browse Food</span>
              </a>
            </Button>
          </Link>

          {isLoading ? (
              <Skeleton className="h-9 w-24 rounded-md" />
          ) : isLoggedIn ? <UserMenu /> : (
             <>
              <Link href="/auth/signin?type=seller" passHref legacyBehavior>
                <Button asChild variant="ghost">
                  <a>
                    <ChefHat className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Become a Seller</span>
                  </a>
                </Button>
              </Link>
              <Link href="/auth/signin" passHref legacyBehavior>
                <Button asChild variant="outline" size="sm">
                  <a>
                    <UserCircle className="h-4 w-4 mr-2" />
                    <span>Login / Sign Up</span>
                  </a>
                </Button>
              </Link>
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
        
        {/* Mobile Nav */}
        <div className="md:hidden flex items-center">
            <CartSheet>
                <Button variant="ghost" size="icon" aria-label="Cart" className="relative mr-2">
                  <ShoppingBag className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 justify-center rounded-full p-0 text-xs">
                      {itemCount}
                    </Badge>
                  )}
                </Button>
            </CartSheet>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                 <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs flex flex-col p-4">
                <nav className="flex-grow flex flex-col space-y-4 pt-8">
                  {visibleNavLinks.map(({ href, label, icon: Icon }) => (
                     <Link key={href} href={href} className={cn("flex items-center text-lg font-medium text-foreground hover:text-primary p-2 rounded-md", pathname === href && "bg-muted")} passHref legacyBehavior>
                       <a>
                         <Icon className="mr-3 h-5 w-5" /> {label}
                       </a>
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto">
                    {isLoading ? <Skeleton className="h-20 w-full" /> : 
                      isLoggedIn ? (
                        <div className="pt-4 border-t">
                           <Button onClick={handleLogout} variant="outline" className="w-full">
                            <LogOut className="mr-2 h-4 w-4" />
                            Log Out ({userName})
                          </Button>
                        </div>
                      ) : (
                        authLinks
                      )}
                  </div>
              </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
