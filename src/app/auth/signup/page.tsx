
"use client";

import { useState, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Package, User, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper to extract a more detailed error message from an API response
async function getApiErrorMessage(response: Response): Promise<string> {
    try {
        const errorData = await response.json();
        // Backend could return error in 'error' or 'message' field
        if (typeof errorData === 'object' && errorData !== null) {
            if ('error' in errorData && typeof errorData.error === 'string') {
                return errorData.error;
            }
            if ('message' in errorData && typeof errorData.message === 'string') {
                return errorData.message;
            }
            return `An unknown API error occurred: ${JSON.stringify(errorData)}`;
        }
    } catch (e) {
        // The response was not valid JSON. Return the raw text if possible.
        try {
            const textError = await response.text();
            if (textError) {
                return `An error occurred: ${textError}`;
            }
        } catch (textErr) {
            // Failed to even get text from the response body.
        }
    }
    // Fallback for non-JSON responses or other issues
    return `Request failed with status ${response.status} (${response.statusText})`;
}

function AuthToggle({ isSellerView }: { isSellerView: boolean }) {
  const baseClass = "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors";
  const activeClass = "bg-primary/20 text-primary border-b-2 border-primary font-semibold";
  const inactiveClass = "text-muted-foreground hover:bg-muted/50";

  return (
    <div className="flex w-full mb-4 rounded-t-lg overflow-hidden border-b">
        <Link href="/auth/signup" className={cn(baseClass, !isSellerView ? activeClass : inactiveClass)}>
            <User className="h-4 w-4" />
            Customer
        </Link>
        <Link href="/auth/signup?type=seller" className={cn(baseClass, isSellerView ? activeClass : inactiveClass)}>
            <Briefcase className="h-4 w-4" />
            Seller
        </Link>
    </div>
  )
}

function SignUpCard({ isSeller, onSignUp, isLoading }: { isSeller: boolean, onSignUp: (data: any) => void, isLoading: boolean }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const title = isSeller ? 'Create a Seller Account' : 'Create an Account';
  const description = isSeller ? 'Start selling your homemade food today.' : 'Join TiffinBox to discover amazing food.';
  const signInLink = isSeller ? '/auth/signin?type=seller' : '/auth/signin';

  return (
      <Card className="w-full max-w-md shadow-xl border-4 border-primary/20 overflow-hidden">
        <AuthToggle isSellerView={isSeller} />
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
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" type="text" placeholder="Your Name" value={formData.name} onChange={handleChange} disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} disabled={isLoading} />
          </div>
           {isSeller && (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="Your phone number" value={formData.phone} onChange={handleChange} disabled={isLoading} />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} disabled={isLoading} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => onSignUp(formData)}
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

function SignUpPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const userType = searchParams.get('type');
  const isSeller = userType === 'seller';

  const handleSignUp = useCallback(async (formData) => {
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
  }, [isSeller, router, toast]);

  return (
    <SignUpCard 
      isSeller={isSeller}
      onSignUp={handleSignUp}
      isLoading={isLoading}
    />
  );
}


export default function SignUpPage() {
  return (
    <div className="container flex min-h-[calc(100vh-var(--header-height)-var(--footer-height))] items-center justify-center py-12">
       <Suspense fallback={<AuthCardSkeleton />}>
        <SignUpPageContent />
      </Suspense>
    </div>
  );
}
