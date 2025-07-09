"use client";

import { useEffect, useState } from "react";
import SectionTitle from "@/components/shared/SectionTitle";
import VendorCard from "@/components/shared/VendorCard";
import type { Vendor } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import CategoryTabs from "@/components/shared/CategoryTabs";
import { useToast } from "@/hooks/use-toast";

// Helper to augment seller data from the API with placeholder data for the UI
const augmentSellerData = (seller): Vendor => ({
  id: seller.id,
  name: seller.name,
  phone: seller.phone,
  verified: seller.verified,
  // Add placeholder data for fields not in the API response
  type: 'Home Cook', // Default type, can be enhanced if API provides it
  description: `Authentic meals from ${seller.name}. Explore a variety of delicious home-cooked food.`,
  rating: 4.5, // Placeholder rating
  address: 'Location not available',
  city: 'Online',
  imageUrl: 'https://placehold.co/400x250.png',
  dataAiHint: 'food vendor',
  menu: [],
  reviews: [],
  specialty: 'Home-style Cooking',
});

const categories = [
  { name: 'All', value: 'all' as const },
  { name: 'Home Cooks', value: 'Home Cook' as const },
  { name: 'Tiffin Services', value: 'Tiffin Service' as const },
];

export default function VendorsPage() {
  const [allVendors, setAllVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Vendor['type'] | 'all'>('all');
  const { toast } = useToast();

  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/sellers');
        if (!response.ok) {
          throw new Error('Failed to fetch vendors from API.');
        }
        const sellers = await response.json();
        
        // Use helper to augment data
        const augmentedData = Array.isArray(sellers) ? sellers.map(augmentSellerData) : [];
        
        setAllVendors(augmentedData);
        setFilteredVendors(augmentedData);
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
        toast({
            variant: "destructive",
            title: "Error fetching vendors",
            description: (error as Error).message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, [toast]);

  const handleCategoryChange = (category: Vendor['type'] | 'all') => {
    setActiveCategory(category);
    if (category === 'all') {
      setFilteredVendors(allVendors);
    } else {
      setFilteredVendors(allVendors.filter(vendor => vendor.type === category));
    }
  };
  
  return (
    <div className="container py-12 md:py-16">
      <SectionTitle 
        title="Find Your Next Meal"
        subtitle="Browse our collection of talented home cooks and reliable tiffin services."
        className="text-center"
      />
      <div className="flex justify-center">
         <CategoryTabs 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
        />
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filteredVendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">
            No vendors found for the category "{activeCategory}".
          </p>
        </div>
      )}
    </div>
  );
}

const CardSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[225px] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
    </div>
  </div>
);