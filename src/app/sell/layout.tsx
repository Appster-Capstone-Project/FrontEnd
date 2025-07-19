
"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  PlusCircle,
  ListOrdered,
  DollarSign,
  Package,
  Heart,
  LogOut,
  User,
  ExternalLink,
  Menu,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const name = localStorage.getItem("userName");
    const role = localStorage.getItem('userRole');

    if (!name || role !== 'seller') {
      router.push('/auth/signin?type=seller');
      return;
    }

    setUserName(name);
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("sellerId");
    router.push("/auth/signin?type=seller");
  };

  const navItems = [
    {
      href: "/sell",
      label: "Dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/sell/add",
      label: "Add New Dish",
      icon: PlusCircle,
    },
    {
      href: "/sell/orders",
      label: "Recent Orders",
      icon: ListOrdered,
    },
    {
      href: "/sell/earnings",
      label: "Earnings",
      icon: DollarSign,
    },
     {
      href: "/profile",
      label: "My Profile",
      icon: User,
    },
  ];

  const DesktopNav = () => (
     <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/welcome" className="flex items-center gap-2 font-semibold" passHref>
                <div className="relative flex items-center justify-center">
                  <Package className="h-7 w-7 text-primary" />
                  <Heart className="absolute top-0 right-0 h-3.5 w-3.5 text-accent fill-accent transform translate-x-1/4 -translate-y-1/4" />
                </div>
                <span className="font-headline text-xl">HomePalate</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      isActive && "bg-muted text-primary"
                    )}
                    passHref
                  >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card>
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>
                  Contact support for any issues with your seller account.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )

  const MobileNav = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          <Link
            href="/welcome"
            className="flex items-center gap-2 text-lg font-semibold mb-4"
            passHref
          >
             <div className="relative flex items-center justify-center">
                <Package className="h-7 w-7 text-primary" />
                <Heart className="absolute top-0 right-0 h-3.5 w-3.5 text-accent fill-accent transform translate-x-1/4 -translate-y-1/4" />
              </div>
              <span className="font-headline text-xl">HomePalate</span>
          </Link>
          {navItems.map((item) => {
             const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                  isActive && "bg-muted text-foreground"
                )}
                passHref
              >
                  <item.icon className="h-5 w-5" />
                  {item.label}
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <DesktopNav />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <MobileNav />
          <div className="w-full flex-1">
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{userName || "My Account"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
               <DropdownMenuItem asChild>
                 <Link href="/profile" passHref>
                      <Settings className="mr-2 h-4 w-4" />
                      Profile Settings
                 </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/welcome" passHref>
                    <ExternalLink className="mr-2 h-4 w-4" />
                   View Site
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-grow bg-background overflow-auto">
            {children}
        </main>
      </div>
    </div>
  );
}
