
import type { LucideIcon } from 'lucide-react';

export interface Dish {
  id: string;
  title: string;
  sellerId: string;
  description?: string;
  price: number;
  imageUrl?: string;
  dataAiHint?: string;
  category?: string;
  available: boolean;
  portionSize?: number;
  leftSize?: number;
  image?: string; // To hold the image path from API
}

export interface Review {
  id: string;
  userName: string;
  userImageUrl?: string;
  dataAiHintUser?: string;
  rating: number; // 1-5
  comment: string;
  date: string; // ISO date string
}

export interface Vendor {
  id: string;
  name: string;
  type: 'Home Cook' | 'Tiffin Service';
  description?: string;
  rating?: number; // Average rating
  address?: string;
  city?: string;
  phone?: string;
  verified?: boolean;
  imageUrl?: string;
  dataAiHint?: string;
  profileImageUrl?: string;
  dataAiHintProfile?: string;
  menu: Dish[];
  reviews: Review[];
  specialty?: string;
  operatingHours?: string;
  deliveryOptions?: string[];
  Icon?: LucideIcon;
}

export interface CartItem extends Dish {
  quantity: number;
}
