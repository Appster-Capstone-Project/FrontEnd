
import type { Vendor } from './types';
import { ChefHat, Utensils } from 'lucide-react';

// This file previously contained mock data. It is now being replaced by live API calls
// across the application. This file is kept for type imports and potential future mock data needs.

export const mockVendors: Vendor[] = [];

export const getVendorById = (id: string): Vendor | undefined => {
  // This function is now deprecated in favor of API calls from `src/app/vendors/[id]/page.tsx`.
  return undefined;
};
