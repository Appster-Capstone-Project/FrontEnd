
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SectionTitle from '@/components/shared/SectionTitle';
import VendorCard from '@/components/shared/VendorCard';
import { mockVendors } from '@/lib/data';
import type { Vendor } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [userCity, setUserCity] = useState<string | null>(null);
  const [suggestedVendors, setSuggestedVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // In a real app, you might want to verify the token or redirect if not found
    // if (!token) {
    //   router.push('/auth/signin');
    //   return;
    // }

    const nameFromStorage = localStorage.getItem('userName');
    const cityFromStorage = localStorage.getItem('userCity');
    
    setUserName(nameFromStorage);
    setUserCity(cityFromStorage);

    if (cityFromStorage) {
      const nearby = mockVendors.filter(vendor => vendor.city.toLowerCase() === cityFromStorage.toLowerCase());
      setSuggestedVendors(nearby.length > 0 ? nearby : mockVendors.slice(0, 3));
    } else {
      setSuggestedVendors(mockVendors.slice(0, 3)); // Default suggestions
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="container py-12 md:py-16">
        <Skeleton className="h-10 w-1/2 mb-4" />
        <Skeleton className="h-6 w-3/4 mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }
  
  if (!userName) {
     // Fallback if user name is somehow not set after loading, or user is not "logged in"
    return (
        <div className="container py-12 text-center">
            <p className="text-lg text-muted-foreground mb-4">Please sign in to view your dashboard.</p>
            <Button onClick={() => router.push('/auth/signin')}>Go to Sign In</Button>
        </div>
    );
  }

  return (
    <div className="container py-12 md:py-16">
      <SectionTitle
        title={`Welcome back, ${userName}!`}
        subtitle={userCity ? `Here are some suggestions in ${userCity}:` : "Here are some popular suggestions for you:"}
        className="mb-10 text-center md:text-left"
      />

      {suggestedVendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {suggestedVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-12 text-lg">
          We couldn't find specific suggestions {userCity ? `for ${userCity}` : 'for you'} at the moment. Please check back later!
        </p>
      )}
      
      <div className="mt-12 text-center">
        <Button onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          localStorage.removeItem('userCity');
          router.push('/auth/signin');
        }} variant="outline">
          Log Out
        </Button>
      </div>
    </div>
  );
}

const CardSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[125px] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
    </div>
  </div>
);
