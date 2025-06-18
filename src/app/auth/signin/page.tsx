
"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
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
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // --- Start of MOCK SUCCESS ---
      // For demonstration, we'll simulate a successful login.
      // In a real application, you would validate credentials against a backend.
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
      const mockUserName = email.split('@')[0] || "Tiffin Fan"; // Use part of email or a default
      const mockUserCity = "Curryville"; // Default city for suggestions

      localStorage.setItem("token", mockToken);
      localStorage.setItem("userName", mockUserName); 
      localStorage.setItem("userCity", mockUserCity);
      
      console.log("Mock Login Successful. User:", mockUserName, "City:", mockUserCity);
      toast({
        title: "Login Successful!",
        description: "Welcome back! Redirecting to your dashboard...",
      });
      router.push("/dashboard"); // Redirect to dashboard
      // Note: setIsLoading(false) is not explicitly called here on success
      // because the component will unmount upon navigation.
      // --- End of MOCK SUCCESS ---

    } catch (err: any) { 
      // This catch block would handle errors if a real API call was made and failed unexpectedly
      console.error("Login error during mock setup:", err);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "An unexpected error occurred during the mock login process.",
      });
      setIsLoading(false);
    }
    // setIsLoading(false) is handled in the error cases or implied by navigation
  };

  return (
    <div className="container flex min-h-[calc(100vh-var(--header-height)-var(--footer-height))] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">Welcome Back!</CardTitle>
          <CardDescription>Sign in to continue to Tiffin Box.</CardDescription>
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
              href="/auth/signup"
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
