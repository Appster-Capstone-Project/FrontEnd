
"use client";

import { useState, useEffect } from 'react';
import type { Vendor } from '@/lib/types';
import VendorCard from '@/components/shared/VendorCard';
import SectionTitle from '@/components/shared/SectionTitle';
import CategoryTabs from '@/components/shared/CategoryTabs';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function AllVendorsPage() {
  const [allVendors, setAllVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<Vendor['type'] | 'all'>('all');
  const { toast } = useToast();

  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/sellers');
        if (!response.ok) {
          throw new Error('Failed to fetch vendors');
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
            setAllVendors([]);
            return;
        }
        // The backend returns a minimal Seller object. We map it to the richer Vendor type our UI expects.
        const vendors = data.map((seller: any) => ({
          id: seller.id,
          name: seller.name,
          phone: seller.phone,
          type: 'Home Cook', // Defaulting type
          description: `A passionate cook from your neighborhood. Contact them for more details!`, // Placeholder
          rating: 4.5, // Placeholder
          address: 'Location not provided', // Placeholder
          city: 'Community', // Placeholder city
          imageUrl: 'https://placehold.co/400x250.png',
          dataAiHint: 'food vendor',
          menu: [], // Menu will be fetched on the detail page
          reviews: [], // Reviews will be fetched on the detail page
          specialty: 'Local Delicacies', // Placeholder
        }));
        setAllVendors(vendors);
      } catch (error) {
        toast({
            variant: "destructive",
            title: "Failed to load vendors",
            description: (error as Error).message,
        })
        setAllVendors([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVendors();
  }, [toast]);

  const categories = [
    { name: 'All Vendors', value: 'all' as const },
    { name: 'Home Cooks', value: 'Home Cook' as const },
    { name: 'Tiffin Services', value: 'Tiffin Service' as const },
  ];
  
  const filteredVendors = allVendors.filter(vendor => {
    const matchesCategory = activeCategory === 'all' || vendor.type === activeCategory;
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = 
      vendor.name.toLowerCase().includes(searchTermLower) ||
      vendor.description.toLowerCase().includes(searchTermLower) ||
      (vendor.specialty && vendor.specialty.toLowerCase().includes(searchTermLower));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container py-12 md:py-16">
      <SectionTitle 
        title="Discover Cooks & Tiffin Services"
        subtitle="Browse by category or use the search to find your favorites."
        className="mb-10 text-center" 
      />
      
      <div className="mb-8 mx-auto max-w-xl">
        <div className="relative flex items-center">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
            type="search"
            placeholder="Search by cook, or specialty..."
            className="pl-12 pr-4 py-3 w-full text-md rounded-md shadow-sm border-input focus:ring-primary focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search for food, cooks, or locations"
            />
        </div>
      </div>

      <div className="mb-10 flex justify-center">
        <CategoryTabs 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredVendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-12 text-lg">
          No vendors found. Check back later for new cooks in your area!
        </p>
      )}
    </div>
  );
}

const CardSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[192px] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
    </div>
  </div>
);
