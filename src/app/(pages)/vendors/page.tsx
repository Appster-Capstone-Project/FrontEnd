
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { mockVendors } from '@/lib/data';
import type { Vendor } from '@/lib/types';
import VendorCard from '@/components/shared/VendorCard';
import SectionTitle from '@/components/shared/SectionTitle';
import CategoryTabs from '@/components/shared/CategoryTabs';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';

export default function AllVendorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<Vendor['type'] | 'all'>('all');

  const categories = [
    { name: 'All Vendors', value: 'all' as const },
    { name: 'Home Cooks', value: 'Home Cook' as const },
    { name: 'Tiffin Services', value: 'Tiffin Service' as const },
  ];
  
  const filteredVendors = mockVendors.filter(vendor => {
    const matchesCategory = activeCategory === 'all' || vendor.type === activeCategory;
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = 
      vendor.name.toLowerCase().includes(searchTermLower) ||
      vendor.description.toLowerCase().includes(searchTermLower) ||
      (vendor.specialty && vendor.specialty.toLowerCase().includes(searchTermLower)) ||
      vendor.city.toLowerCase().includes(searchTermLower);
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
            placeholder="Search by city, cook, or dish..."
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

      {filteredVendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-12 text-lg">
          No vendors found matching your criteria. Try a different search or category.
        </p>
      )}
    </div>
  );
}
