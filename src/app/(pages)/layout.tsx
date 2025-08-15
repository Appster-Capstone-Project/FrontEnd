
"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  ListOrdered,
  TicketPercent,
  Package,
  Heart,
  LogOut,
  User,
  ExternalLink,
  ShoppingBag,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import CartSheet from "@/components/shared/CartSheet";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";

// This layout is for user-specific pages like dashboard, orders, promotions
export default function UserAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  useEffect(() => {
    const name = localStorage.getItem("userName");
    // Removed the redirect logic here. We will handle auth on a page-by-page basis if needed.
    // This allows public access to pages within this layout group.
    setUserName(name);
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const navItems = [
    {
      href: "/dashboard",
      label: "Browse Food",
      icon: Search,
      exact: true,
    },
    {
      href: "/orders",
      label: "Order History",
      icon: ListOrdered,
    },
    {
      href: "/promotions",
      label: "Promotions",
      icon: TicketPercent,
    },
  ];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="relative flex items-center justify-center">
                <Package className="h-7 w-7 text-primary" />
                <Heart className="absolute top-0 right-0 h-3.5 w-3.5 text-accent fill-accent transform translate-x-1/4 -translate-y-1/4" />
              </div>
              <span className="font-headline text-xl">TiffinBox</span>
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
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center justify-end gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-8">
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
              <DropdownMenuItem onClick={() => router.push("/")}>
                 <ExternalLink className="mr-2 h-4 w-4" />
                View Site
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
