
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

function SignUpCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const userType = searchParams.get('type');
  const isSeller = userType === 'seller';

  const handleSignUp = async () => {
    setIsLoading(true);
    const { name, email, password, confirmPassword, phone } = formData;

    if (!name || !email || !password || !confirmPassword || (isSeller && !phone)) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
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
    
    if (isSeller) {
      // Seller registration is a two-step process
      try {
        // 1. Register the user for authentication purposes
        const userPayload = { name, email, password };
        const userResponse = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userPayload),
        });

        if (userResponse.status !== 201) {
          const errorData = await userResponse.json();
          throw new Error(errorData.error || "Failed to create user account. The email might already be in use.");
        }

        // 2. Register the seller profile
        const sellerPayload = { name, email, phone };
        const sellerResponse = await fetch('/api/sellers/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sellerPayload),
        });

        if (sellerResponse.status !== 201) {
          const errorData = await sellerResponse.json();
          // In a real-world scenario, you might want to handle the orphaned user account here
          throw new Error(errorData.error || "User account created, but failed to create seller profile.");
        }

        toast({
          title: "Seller Registration Successful!",
          description: "You can now sign in with your credentials.",
        });
        router.push(`/auth/signin?type=seller`);

      } catch (error) {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: (error as Error).message,
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Regular user registration
      const payload = { name, email, password };
      try {
        const response = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.status === 201) {
          toast({
            title: "Registration Successful!",
            description: "You can now sign in with your credentials.",
          });
          router.push(`/auth/signin`);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Registration failed. The email might already be in use.");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: (error as Error).message,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const title = isSeller ? 'Create a Seller Account' : 'Create an Account';
  const description = isSeller ? 'Start selling your homemade food today.' : 'Join HomePalate to discover amazing food.';
  const signInLink = isSeller ? '/auth/signin?type=seller' : '/auth/signin';

  return (
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
           {isSeller && (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="Your phone number" onChange={handleChange} disabled={isLoading} />
            </div>
          )}
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
             <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
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

export default function SignUpPage() {
  return (
    <div className="container flex min-h-[calc(100vh-var(--header-height)-var(--footer-height))] items-center justify-center py-12">
       <Suspense fallback={<AuthCardSkeleton />}>
        <SignUpCard />
      </Suspense>
    </div>
  );
}
