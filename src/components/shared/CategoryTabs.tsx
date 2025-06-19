"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Vendor } from "@/lib/types";
import { ChefHat, Utensils } from "lucide-react";

interface CategoryTabsProps {
  categories: { name: string; value: Vendor['type'] | 'all' }[];
  activeCategory: Vendor['type'] | 'all';
  onCategoryChange: (category: Vendor['type'] | 'all') => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, activeCategory, onCategoryChange }) => {
  const getIcon = (value: Vendor['type'] | 'all') => {
    if (value === 'Home Cook') return <ChefHat className="mr-2 h-5 w-5" />;
    if (value === 'Tiffin Service') return <Utensils className="mr-2 h-5 w-5" />;
    return null;
  }
  
  return (
    <Tabs value={activeCategory} onValueChange={(value) => onCategoryChange(value as Vendor['type'] | 'all')} className="mb-8">
      <TabsList className="grid w-full grid-cols-1 sm:w-auto sm:grid-cols-3 bg-background p-1 rounded-lg shadow-inner">
        {categories.map((category) => (
          <TabsTrigger 
            key={category.value} 
            value={category.value} 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md px-4 py-2 transition-all duration-200 ease-in-out flex items-center justify-center"
          >
            {getIcon(category.value)}
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default CategoryTabs;
