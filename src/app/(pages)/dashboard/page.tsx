
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SectionTitle from '@/components/shared/SectionTitle';
import VendorCard from '@/components/shared/VendorCard';
import type { Vendor } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

// Helper to augment API data with placeholder UI data
const augmentSellerData = (seller): Vendor => ({
  id: seller.id,
  name: seller.name,
  phone: seller.phone,
  type: 'Home Cook', // Default type
  description: `Authentic meals from ${seller.name}.`, // Placeholder
  rating: 4.5, // Placeholder
  address: 'Location not specified', // Placeholder
  city: 'City', // Placeholder
  imageUrl: 'https://placehold.co/400x250.png',
  dataAiHint: 'food vendor',
  menu: [],
  reviews: [],
  specialty: 'Delicious Home Food',
  operatingHours: '10 AM - 10 PM',
  deliveryOptions: ['Pickup', 'Delivery'],
});


export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string | null>(null);
  const [suggestedVendors, setSuggestedVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/signin');
      return;
    }

    const nameFromStorage = localStorage.getItem('userName');
    setUserName(nameFromStorage);

    const fetchVendors = async () => {
      try {
        const response = await fetch('/api/sellers');
        if (!response.ok) {
          throw new Error('Failed to fetch vendors');
        }
        const sellers = await response.json();
        const augmentedVendors = sellers.map(augmentSellerData);
        // Show first 3 as suggestions
        setSuggestedVendors(augmentedVendors.slice(0, 3));
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        toast({
          variant: "destructive",
          title: "Could not load suggestions",
          description: (error as Error).message,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVendors();
  }, [router, toast]);

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
        subtitle={"Here are some popular suggestions for you:"}
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
          No vendors found at the moment. Please check back later!
        </p>
      )}
      
      <div className="mt-12 text-center">
        <Button onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          localStorage.removeItem('userId');
          localStorage.removeItem('userRole');
          localStorage.removeItem('sellerId'); // Clear sellerId on logout
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
