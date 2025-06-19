import type { LucideIcon } from 'lucide-react';

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string; // e.g., 'Main Course', 'Dessert'
  portionsAvailable?: number;
  portionsTotal?: number;
}

export interface Review {
  id: string;
  userName: string;
  userImageUrl?: string;
  rating: number; // 1-5
  comment: string;
  date: string; // ISO date string
}

export interface Vendor {
  id: string;
  name: string;
  type: 'Home Cook' | 'Tiffin Service';
  description: string;
  rating: number; // Average rating
  address: string;
  city: string;
  imageUrl: string;
  profileImageUrl?: string;
  menu: Dish[];
  reviews: Review[];
  specialty?: string;
  operatingHours?: string;
  deliveryOptions?: string[];
  Icon?: LucideIcon; // For category icon
}
