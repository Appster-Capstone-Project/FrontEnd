
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import Link from "next/link";
import { Package, Heart } from 'lucide-react';

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
    // Always clear previous session data on a new login attempt
    localStorage.clear();

    const endpoint = isSellerView ? '/api/sellers/login' : '/api/users/login';
    const body = JSON.stringify({ email, password });

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Invalid credentials");
      }

      const { token } = await response.json();
      if (!token) {
        throw new Error("Login failed: No token received.");
      }
      
      localStorage.setItem("token", token);
      
      // Store a flag to show splash screen
      localStorage.setItem('showSplash', 'true');

      if (isSellerView) {
        // For sellers, we fetch their details from the /sellers list
        const sellersResponse = await fetch('/api/sellers', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!sellersResponse.ok) {
            throw new Error("Failed to fetch seller profile.");
        }
        
        const sellers = await sellersResponse.json();
        const sellerProfile = Array.isArray(sellers) ? sellers.find(s => s.email === email) : null;

        if (!sellerProfile) {
            throw new Error("Could not find seller profile for the given email.");
        }

        localStorage.setItem("userName", sellerProfile.name);
        localStorage.setItem("sellerId", sellerProfile.id);
        localStorage.setItem("userRole", "seller");
        
        router.push('/loading');
      } else {
        // For users, we fetch their details from the /users/profile endpoint
        const profileResponse = await fetch('/api/users/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!profileResponse.ok) {
            throw new Error("Failed to fetch user profile.");
        }
        
        const user = await profileResponse.json();

        localStorage.setItem("userName", user.name);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userRole", "user");

        router.push("/loading");
      }

    } catch (error) {
      // Clear any partial login data on failure
      localStorage.clear();
      
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const title = isSellerView ? 'Seller Sign In' : 'Welcome Back!';
  const description = isSellerView ? 'Sign in to your seller dashboard.' : 'Sign in to continue to TiffinBox.';
  const signupLink = isSellerView ? '/auth/signup?type=seller' : '/auth/signup';
  const signupHint = isSellerView ? "Not a seller yet? " : "Don't have an account? ";
  const signupActionText = isSellerView ? "Sign up as a seller and start earning!" : "Sign Up";

  return (
      <Card className="w-full max-w-md shadow-xl border-4 border-primary/20">
        <CardHeader className="text-center">
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
          <div className="w-full text-center text-sm text-muted-foreground space-y-2">
            <p>
              {signupHint}
              <Link
                href={signupLink}
                className="font-medium text-primary hover:underline"
              >
                {signupActionText}
              </Link>
            </p>
             <p>
                <Link
                  href={isSellerView ? "/auth/signin" : "/auth/signin?type=seller"}
                  className="font-medium text-primary hover:underline text-xs"
                >
                  {isSellerView ? "Not a seller? Sign in as a customer." : "Are you a seller? Sign in here."}
                </Link>
              </p>
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
    <div className="container flex min-h-[calc(100vh-var(--header-height)-var(--footer-height))] items-center justify-center py-12">
      <Suspense fallback={<AuthCardSkeleton />}>
        <SignInCard />
      </Suspense>
    </div>
  );
}
