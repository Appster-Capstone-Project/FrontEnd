
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
import { Heart, Package } from "lucide-react";

// Helper to extract a more detailed error message from an API response
async function getApiErrorMessage(response: Response): Promise<string> {
    try {
        const errorData = await response.json();
        // Backend could return error in 'error' or 'message' field
        return errorData.error || errorData.message || `API error: ${JSON.stringify(errorData)}`;
    } catch (e) {
        // If the response is not JSON, return the raw text
        const textError = await response.text();
        if (textError) {
            return textError;
        }
        return `Request failed with status ${response.status}`;
    }
}


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
    
    try {
      let endpoint = '';
      let payload = {};
      let successMessage = '';
      let redirectPath = '';

      if (isSeller) {
        endpoint = '/api/sellers/register';
        payload = { name, email, phone, password };
        successMessage = "Seller Registration Successful!";
        redirectPath = '/auth/signin?type=seller';
      } else {
        endpoint = '/api/users/register';
        payload = { name, email, password };
        successMessage = "Registration Successful!";
        redirectPath = '/auth/signin';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: successMessage,
          description: "You can now sign in with your credentials.",
        });
        router.push(redirectPath);
      } else {
        const errorMessage = await getApiErrorMessage(response);
        throw new Error(errorMessage);
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
  };

  const title = isSeller ? 'Create a Seller Account' : 'Create an Account';
  const description = isSeller ? 'Start selling your homemade food today.' : 'Join TiffinBox to discover amazing food.';
  const signInLink = isSeller ? '/auth/signin?type=seller' : '/auth/signin';

  return (
      <Card className="w-full max-w-md shadow-xl border-2 border-primary/20">
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
