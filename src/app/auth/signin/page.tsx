
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
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("demopassword");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);

    if (!email || !password) {
       toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Please enter email and password.",
       });
       setIsLoading(false);
       return;
    }
    
    // DEMO: Bypassing API call for demonstration purposes
    setTimeout(() => {
      const userName = email.split('@')[0] || "Demo User";
      const userCity = "Curryville";
      const userRole = searchParams.get('type') === 'seller' ? 'seller' : 'user';

      localStorage.setItem("token", "mock-demo-token");
      localStorage.setItem("userName", userName); 
      localStorage.setItem("userCity", userCity);
      
      toast({
        title: "Login Successful!",
        description: `Welcome back, ${userName}! Redirecting...`,
      });

      if (userRole === 'seller') {
        router.push('/sell');
      } else {
        router.push("/dashboard");
      }
      setIsLoading(false);
    }, 1000);

    /*
    // REAL API CALL (currently disabled for demo)
    try {
      const response = await fetch("/api/login", { // Using rewrite path
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Assuming API returns token and an optional user object
        localStorage.setItem("token", data.token);
        
        // Safely access user data if it exists
        const userName = data.user?.name || "User";
        const userCity = data.user?.city || "Curryville";
        const userRole = data.user?.role;

        localStorage.setItem("userName", userName); 
        localStorage.setItem("userCity", userCity);
        
        toast({
          title: "Login Successful!",
          description: `Welcome back, ${userName}! Redirecting...`,
        });
        
        if (userRole === 'seller') {
          router.push('/sell');
        } else {
          router.push("/dashboard");
        }
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: data.error || "Invalid credentials. Please try again.",
        });
      }
    } catch (err) { 
      console.error("Login error:", err);
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "An unexpected error occurred. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
    */
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
