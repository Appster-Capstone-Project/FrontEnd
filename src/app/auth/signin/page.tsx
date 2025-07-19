
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import Link from "next/link";
import { Package, Heart, User, Briefcase } from 'lucide-react';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function AuthToggle({ isSellerView }: { isSellerView: boolean }) {
  const baseClass = "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors";
  const activeClass = "bg-primary/20 text-primary border-b-2 border-primary font-semibold";
  const inactiveClass = "text-muted-foreground hover:bg-muted/50";

  return (
    <div className="flex w-full mb-4 rounded-t-lg overflow-hidden border-b">
      <Link href="/auth/signin" passHref className={cn(baseClass, !isSellerView ? activeClass : inactiveClass, "rounded-none")}>
        <User className="h-4 w-4" />
        Customer
      </Link>
      <Link href="/auth/signin?type=seller" passHref className={cn(baseClass, isSellerView ? activeClass : inactiveClass, "rounded-none")}>
        <Briefcase className="h-4 w-4" />
        Seller
      </Link>
    </div>
  )
}

function SignInCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const userType = searchParams.get('type');
  const isSellerView = userType === 'seller';
  
  const handleSignIn = async () => {
    setIsLoading(true);
    localStorage.clear();

    // Simulate API call
    setTimeout(() => {
      // Mock successful login
      localStorage.setItem("token", "mock-jwt-token-string");
      localStorage.setItem('showSplash', 'true');

      if (isSellerView) {
        localStorage.setItem("userName", "Priya's Kitchen");
        localStorage.setItem("sellerId", "v1");
        localStorage.setItem("userRole", "seller");
      } else {
        localStorage.setItem("userName", "Alex Doe");
        localStorage.setItem("userId", "u1");
        localStorage.setItem("userRole", "user");
      }

      toast({
        title: "Login Successful!",
        description: isSellerView ? "Redirecting to your seller dashboard." : "Welcome back!",
      });
      
      router.push('/loading');
      setIsLoading(false);
    }, 1000);
  };
  
  const title = isSellerView ? 'Seller Sign In' : 'Welcome Back!';
  const description = isSellerView ? 'Access your dashboard to manage listings and orders.' : 'Sign in to continue to TiffinBox.';
  const signupLink = isSellerView ? '/auth/signup?type=seller' : '/auth/signup';
  const signupHint = isSellerView ? "Don't have a seller account? " : "Don't have an account? ";
  const signupActionText = "Sign Up";

  return (
      <Card className="w-full max-w-md shadow-xl border-4 border-primary/20 overflow-hidden">
        <AuthToggle isSellerView={isSellerView} />
        <CardHeader className="text-center pt-2">
            <div className="relative mx-auto flex items-center justify-center mb-4">
              <Package className="h-14 w-14 text-primary" />
              <Heart className="absolute top-0 right-0 h-7 w-7 text-accent fill-accent transform translate-x-1/4 -translate-y-1/4" />
            </div>
          <CardTitle className="font-headline text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder={isSellerView ? "seller@example.com" : "user@example.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
          <div className="w-full text-center text-sm text-muted-foreground">
              {signupHint}
              <Link href={signupLink} passHref legacyBehavior>
                <a className="font-medium text-primary hover:underline">
                  {signupActionText}
                </a>
              </Link>
          </div>
        </CardFooter>
      </Card>
  );
}

const AuthCardSkeleton = () => (
    <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
            <Skeleton className="h-7 w-48 mx-auto" />
            <Skeleton className="h-5 w-64 mx-auto" />
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
            </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-5 w-48" />
        </CardFooter>
    </Card>
)

export default function SignInPage() {
  return (
    <div className="container flex min-h-[calc(100vh-var(--header-height)-var(--footer-height))] items-center justify-center py-12 px-4">
      <Suspense fallback={<AuthCardSkeleton />}>
        <SignInCard />
      </Suspense>
    </div>
  );
}
