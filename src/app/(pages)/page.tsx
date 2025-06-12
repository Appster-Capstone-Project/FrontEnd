"use client";

import { useState } from 'react';
import { mockVendors } from '@/lib/data';
import type { Vendor } from '@/lib/types';
import VendorCard from '@/components/shared/VendorCard';
import SectionTitle from '@/components/shared/SectionTitle';
import CategoryTabs from '@/components/shared/CategoryTabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

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
    const matchesSearch = 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vendor.specialty && vendor.specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
      vendor.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container py-8 md:py-12">
      <SectionTitle 
        title="Discover Local Flavors"
        subtitle="Fresh homemade meals and tiffin services, delivered to your doorstep or ready for pickup."
        className="mb-10"
      />

      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="search"
            placeholder="Search by name, specialty, or city..."
            className="pl-10 w-full shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <CategoryTabs 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      {filteredVendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-10 text-lg">
          No vendors found matching your criteria. Try adjusting your search or filters.
        </p>
      )}
    </div>
  );
}
