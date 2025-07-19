
"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import SectionTitle from "@/components/shared/SectionTitle";
import VendorCard from "@/components/shared/VendorCard";
import DishCard from "@/components/shared/DishCard";
import type { Vendor, Dish } from "@/lib/types";
import { Card, CardContent, CardHeader, Skeleton } from "@/components/ui/card";
import CategoryTabs from "@/components/shared/CategoryTabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { mockVendors, mockDishes } from "@/lib/data"; 

const categories = [
  { name: 'Dishes', value: 'dishes' as const },
  { name: 'Home Cooks', value: 'Home Cook' as const },
  { name: 'Tiffin Services', value: 'Tiffin Service' as const },
];

type ActiveCategory = Vendor['type'] | 'dishes';

export default function VendorsPage() {
  const router = useRouter();
  const [allVendors, setAllVendors] = useState<Vendor[]>([]);
  const [allDishes, setAllDishes] = useState<Dish[]>([]);
  const [filteredItems, setFilteredItems] = useState<(Vendor | Dish)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>('dishes');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role === 'seller') {
      router.replace('/sell');
      return; 
    }

    const fetchData = () => {
      setIsLoading(true);
      setTimeout(() => {
        const sortedDishes = mockDishes.sort((a, b) => new Date(b.cookingDate).getTime() - new Date(a.cookingDate).getTime());
        setAllVendors(mockVendors);
        setAllDishes(sortedDishes);
        setIsLoading(false);
      }, 500);
    };

    fetchData();
  }, [router]);
  
  useEffect(() => {
    const filterItems = () => {
      let items: (Vendor | Dish)[] = [];

      if (activeCategory === 'dishes') {
        // Show only dishes from home cooks
        items = allDishes;
      } else if (activeCategory === 'Home Cook') {
        // Show all vendors who are Home Cooks
        items = allVendors.filter(vendor => vendor.type === 'Home Cook');
      } else if (activeCategory === 'Tiffin Service') {
        // Show all vendors who are Tiffin Services
        items = allVendors.filter(vendor => vendor.type === 'Tiffin Service');
      }
      
      if (searchTerm) {
        items = items.filter(item => {
          if ('type' in item) { // It's a Vendor
            return item.name.toLowerCase().includes(searchTerm.toLowerCase());
          } else { // It's a Dish
            return item.title.toLowerCase().includes(searchTerm.toLowerCase());
          }
        });
      }

      setFilteredItems(items);
    }
    filterItems();
  }, [searchTerm, activeCategory, allVendors, allDishes]);

  const handleCategoryChange = (category: ActiveCategory) => {
    setActiveCategory(category);
  };
  
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <SectionTitle 
        title="Find Your Next Meal"
        subtitle="Browse our collection of talented home cooks and reliable tiffin services."
      />
      
      <div className="max-w-4xl mx-auto w-full space-y-4">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                placeholder="Search by dish or service name..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex justify-center">
         <CategoryTabs 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange as (c: any) => void}
        />
      </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-6">
            {[...Array(5)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="space-y-6 max-w-4xl mx-auto">
          {filteredItems.map((item) => {
             if ('type' in item) { // It's a Vendor
                return <VendorCard key={`vendor-${item.id}`} vendor={item} />
             } else { // It's a Dish
                const vendor = allVendors.find(v => v.id === item.sellerId);
                return <DishCard key={`dish-${item.id}`} dish={item} vendor={vendor} layout="horizontal" />
             }
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">
            No items found for your search.
          </p>
        </div>
      )}
    </div>
  );
}

const CardSkeleton = () => (
   <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <Skeleton className="h-48 w-full md:w-1/3" />
        <div className="w-full md:w-2/3 p-6 flex flex-col">
          <CardHeader className="p-0">
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-8 w-3/4 mb-2" />
          </CardHeader>
          <CardContent className="p-0 flex-grow">
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-5/6 mb-4" />
          </CardContent>
          <div className="p-0 pt-4">
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    </Card>
);
