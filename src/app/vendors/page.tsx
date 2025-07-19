
"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import SectionTitle from "@/components/shared/SectionTitle";
import VendorCard from "@/components/shared/VendorCard";
import DishCard from "@/components/shared/DishCard";
import type { Vendor, Dish } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import CategoryTabs from "@/components/shared/CategoryTabs";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { mockVendors, mockDishes } from "@/lib/data";

const categories = [
  { name: 'All', value: 'all' as const },
  { name: 'Home Cooks', value: 'Home Cook' as const },
  { name: 'Tiffin Services', value: 'Tiffin Service' as const },
];

export default function VendorsPage() {
  const router = useRouter();
  const [allVendors, setAllVendors] = useState<Vendor[]>([]);
  const [allDishes, setAllDishes] = useState<Dish[]>([]);
  const [filteredItems, setFilteredItems] = useState<(Vendor | Dish)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
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

    const fetchData = () => {
      setIsLoading(true);
      setTimeout(() => {
        const sortedDishes = mockDishes.sort((a, b) => new Date(b.cookingDate).getTime() - new Date(a.cookingDate).getTime());
        setAllVendors(mockVendors);
        setAllDishes(sortedDishes);
        setFilteredItems([...sortedDishes, ...mockVendors.filter(v => v.type === 'Tiffin Service')]);
        setIsLoading(false);
      }, 500);
    };

    fetchData();
  }, [router]);
  
  const filterItems = () => {
    let items: (Vendor | Dish)[] = [];

    if (activeCategory === 'all') {
      // Show all dishes and all tiffin services
      items = [...allDishes, ...allVendors.filter(v => v.type === 'Tiffin Service')];
    } else if (activeCategory === 'Home Cook') {
      // Show only dishes from home cooks
      items = allDishes;
    } else if (activeCategory === 'Tiffin Service') {
      // Show only tiffin service vendors
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

    // Sort combined list so Tiffin services appear after dishes
    items.sort((a, b) => {
        const aIsVendor = 'type' in a;
        const bIsVendor = 'type' in b;
        if (aIsVendor && !bIsVendor) return 1;
        if (!aIsVendor && bIsVendor) return -1;
        return 0;
    });


    setFilteredItems(items);
  }

  useEffect(() => {
    filterItems();
  }, [searchTerm, activeCategory, allVendors, allDishes]);

  const handleCategoryChange = (category: Vendor['type'] | 'all') => {
    setActiveCategory(category);
  };
  
  if (!isReady) {
    return (
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
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
      
      <div className="max-w-4xl mx-auto w-full space-y-4 mb-12">
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
            onCategoryChange={handleCategoryChange}
        />
      </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
             if ('type' in item) { // It's a Vendor
                return <VendorCard key={item.id} vendor={item} />
             } else { // It's a Dish
                const vendor = allVendors.find(v => v.id === item.sellerId);
                return <DishCard key={item.id} dish={item} vendor={vendor} />
             }
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">
            No items found.
          </p>
        </div>
      )}
    </div>
  );
}

const CardSkeleton = () => (
    <Card>
      <CardHeader className="p-0 relative">
        <Skeleton className="w-full h-40" />
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="h-4 w-1/3 mb-2" />
        <Skeleton className="h-6 w-3/4 mb-1" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-9 w-full mt-2" />
      </CardContent>
    </Card>
);

    