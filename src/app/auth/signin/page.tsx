
"use client";

import { useState } from "react";
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


export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      if (!email || !password) {
         toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Please enter email and password.",
         });
         setIsLoading(false);
         return;
      }

      // Mock data that would typically come from your API response
      const mockToken = "mock-jwt-token-for-tiffinbox"; 
      const userType = searchParams.get('type');
      const mockUserName = email.split('@')[0] || (userType === 'seller' ? "Super Chef" : "Tiffin Fan");
      const mockUserCity = "Curryville"; // Default city for suggestions

      localStorage.setItem("token", mockToken);
      localStorage.setItem("userName", mockUserName); 
      localStorage.setItem("userCity", mockUserCity);
      
      console.log("Mock Login Successful. User:", mockUserName, "City:", mockUserCity, "Type:", userType);
      toast({
        title: "Login Successful!",
        description: "Welcome back! Redirecting...",
      });
      
      if (userType === 'seller') {
        router.push('/sell');
      } else {
        router.push("/dashboard");
      }

    } catch (err: any) { 
      console.error("Login error during mock setup:", err);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "An unexpected error occurred during the mock login process.",
      });
      setIsLoading(false);
    }
  };

  const userType = searchParams.get('type');
  const title = userType === 'seller' ? 'Seller Sign In' : 'Welcome Back!';
  const description = userType === 'seller' ? 'Sign in to your seller dashboard.' : 'Sign in to continue to Tiffin Box.';
  const signupLink = userType === 'seller' ? '/auth/signup?type=seller' : '/auth/signup';

  return (
    <div className="container flex min-h-[calc(100vh-var(--header-height)-var(--footer-height))] items-center justify-center py-12">
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
              placeholder="you@example.com"
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
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href={signupLink}
              className="font-medium text-primary hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
