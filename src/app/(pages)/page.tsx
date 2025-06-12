
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { mockVendors } from '@/lib/data';
import type { Vendor } from '@/lib/types';
import VendorCard from '@/components/shared/VendorCard';
import SectionTitle from '@/components/shared/SectionTitle';
import CategoryTabs from '@/components/shared/CategoryTabs';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react'; // Changed from Search to MapPin for hero

export default function HomePage() {
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
    <>
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center py-24 md:py-32 lg:py-40" 
        style={{ backgroundImage: "url('https://placehold.co/1200x600.png')" }}
        data-ai-hint="warm kitchen homemade food"
      >
        <div className="absolute inset-0 bg-black/60"></div> {/* Darker Overlay for better contrast */}
        <div className="container relative z-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl font-headline">
            Fresh Homemade Meals & Tiffin
          </h1>
          <p className="mt-4 text-xl text-gray-200 sm:mt-6">
            Order from talented home cooks and reliable tiffin services near you.
          </p>
          
          <div className="mt-10 mx-auto max-w-2xl"> {/* Increased max-width for search bar container */}
            <div className="relative flex items-center">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" /> {/* Slightly larger icon */}
              <Input 
                type="search"
                placeholder="Enter city, ZIP, cook, or dish..."
                className="pl-14 pr-4 py-3 w-full text-lg rounded-md shadow-lg border-transparent focus:ring-primary focus:border-primary ring-2 ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search for food, cooks, or locations"
              />
            </div>
            <p className="mt-4 text-sm text-gray-300">
              Or <Link href="/auth/signin" className="font-medium text-primary hover:underline">Sign In</Link> to see your saved preferences.
            </p>
          </div>
        </div>
      </div>

      {/* Vendors List Section */}
      <div className="container py-12 md:py-16">
        <SectionTitle 
          title="Featured Cooks & Tiffin Services"
          subtitle="Browse by category or use the search above to find your favorites."
          className="mb-10 text-center" 
        />

        <div className="mb-10 flex justify-center">
          <CategoryTabs 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {filteredVendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Increased gap slightly */}
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
    </>
  );
}
