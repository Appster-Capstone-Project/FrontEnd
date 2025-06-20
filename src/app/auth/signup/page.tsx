
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    const { name, email, password, confirmPassword } = formData;
    const userType = searchParams.get('type') || 'user';

    if (!name || !email || !password || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all fields.",
      });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "Passwords do not match.",
      });
      setIsLoading(false);
      return;
    }

    // DEMO: Bypassing API call for demonstration purposes
    setTimeout(() => {
      toast({
        title: "Registration Successful!",
        description: "You can now sign in with your credentials.",
      });
      router.push(`/auth/signin?type=${userType}`);
      setIsLoading(false);
    }, 1000);

    /*
    // REAL API CALL (currently disabled for demo)
    try {
       const response = await fetch("/api/register", { // Using the rewrite path
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role: userType }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Registration Successful!",
          description: "You can now sign in with your credentials.",
        });
        router.push(`/auth/signin?type=${userType}`);
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: data.error || "An unknown error occurred.",
        });
      }
    } catch (err) {
      console.error("Error during registration:", err);
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
    */
  };

  const userType = searchParams.get('type');
  const isSeller = userType === 'seller';
  const title = isSeller ? 'Create a Seller Account' : 'Start selling your homemade food today.';
  const description = isSeller ? 'Start selling your homemade food today.' : 'Join Tiffin Box to discover amazing food.';
  const signInLink = isSeller ? '/auth/signin?type=seller' : '/auth/signin';

  return (
    <div className="container flex min-h-[calc(100vh-var(--header-height)-var(--footer-height))] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" type="text" placeholder="Your Name" onChange={handleChange} disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" onChange={handleChange} disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" onChange={handleChange} disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" placeholder="••••••••" onChange={handleChange} disabled={isLoading} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href={signInLink} className="font-medium text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
