
"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import SectionTitle from "@/components/shared/SectionTitle";
import VendorCard from "@/components/shared/VendorCard";
import type { Vendor } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import CategoryTabs from "@/components/shared/CategoryTabs";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { mockVendors } from "@/lib/data";


const categories = [
  { name: 'All', value: 'all' as const },
  { name: 'Home Cooks', value: 'Home Cook' as const },
  { name: 'Tiffin Services', value: 'Tiffin Service' as const },
];

export default function VendorsPage() {
  const router = useRouter();
  const [allVendors, setAllVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false); // State to control rendering after role check
  const [activeCategory, setActiveCategory] = useState<Vendor['type'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);

    if (role === 'seller') {
      router.replace('/sell');
      return; 
    }

    setIsReady(true);

    const fetchVendors = () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setAllVendors(mockVendors);
        setFilteredVendors(mockVendors);
        setIsLoading(false);
      }, 500);
    };

    fetchVendors();
  }, [router]);

  const filterVendors = () => {
    let vendors = allVendors;

    if (activeCategory !== 'all') {
      vendors = vendors.filter(vendor => vendor.type === activeCategory);
    }

    if (searchTerm) {
      vendors = vendors.filter(vendor =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredVendors(vendors);
  }

  useEffect(() => {
    filterVendors();
  }, [searchTerm, activeCategory, allVendors]);

  const handleCategoryChange = (category: Vendor['type'] | 'all') => {
    setActiveCategory(category);
  };
  
  if (!isReady) {
    return (
      <div className="container py-12 md:py-16">
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-16">
      <SectionTitle 
        title="Find Your Next Meal"
        subtitle="Browse our collection of talented home cooks and reliable tiffin services."
        className="text-center"
      />
      
      <div className="max-w-2xl mx-auto w-full space-y-4 mb-12">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                placeholder="Search by vendor name..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex justify-center">
            <CategoryTabs 
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
            />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filteredVendors.length > 0 ? (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          {filteredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">
            No vendors found.
          </p>
        </div>
      )}
    </div>
  );
}

const CardSkeleton = () => (
  <div className="flex flex-col md:flex-row space-x-0 md:space-x-6 space-y-4 md:space-y-0">
    <Skeleton className="h-[200px] w-full md:w-[250px] rounded-xl" />
    <div className="space-y-3 flex-1">
      <Skeleton className="h-6 w-2/5" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
       <Skeleton className="h-10 w-1/3 mt-4" />
    </div>
  </div>
);
