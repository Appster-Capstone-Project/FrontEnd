
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import Link from "next/link";

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
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
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

      // After getting token, fetch profile
      const profileResponse = await fetch('/api/users/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!profileResponse.ok) {
          throw new Error("Failed to fetch user profile.");
      }
      
      const user = await profileResponse.json();

      localStorage.setItem("userName", user.name);
      localStorage.setItem("userId", user.id);
      
      // Now, determine if the user is a seller to redirect correctly
      const sellerCheckResponse = await fetch(`/api/sellers/${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
      });

      let userRole = 'user';
      if (sellerCheckResponse.ok) {
          const sellerData = await sellerCheckResponse.json();
          // Additional check to be sure
          if(sellerData && sellerData.id === user.id){
              userRole = 'seller';
          }
      }
      
      localStorage.setItem("userRole", userRole);
      // City is not available from the backend, so we remove it or handle it gracefully
      localStorage.removeItem("userCity"); 

      toast({
        title: "Login Successful!",
        description: `Welcome back, ${user.name}! Redirecting...`,
      });
      
      if (userRole === 'seller') {
        router.push('/sell');
      } else {
        router.push("/dashboard");
      }

    } catch (error) {
      localStorage.removeItem('token'); // Clear token on failure
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
  const description = isSellerView ? 'Sign in to your seller dashboard.' : 'Sign in to continue to Tiffin Box.';
  const signupLink = isSellerView ? '/auth/signup?type=seller' : '/auth/signup';

  return (
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
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
              Don&apos;t have an account?{" "}
              <Link
                href={signupLink}
                className="font-medium text-primary hover:underline"
              >
                Sign Up
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
