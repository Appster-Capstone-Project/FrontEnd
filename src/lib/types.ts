
import type { LucideIcon } from 'lucide-react';

// Base type for any item on a vendor's menu
interface BaseMenuItem {
  id: string;
  sellerId: string;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  dataAiHint?: string;
  available: boolean;
  postedAt?: string; // ISO date string for when the item was listed
}

// Specific type for a single, pre-orderable dish from a Home Cook
export interface Dish extends BaseMenuItem {
  category?: string;
  cookingDate: string; // ISO date string for when the meal is prepared
  slotsTotal: number; // The target number of portions
  slotsFilled: number; // The number of portions already claimed
}

// Specific type for a subscription plan from a Tiffin Service
export interface TiffinPlan extends BaseMenuItem {
  planType: 'Weekly' | 'Monthly' | 'Annually'; // The duration of the subscription
  mealsPerWeek: number; // e.g., 5 meals per week
  features: string[]; // e.g., ["Veg & Non-Veg option", "Free delivery"]
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
  menu: (Dish[] | TiffinPlan[]);
  reviews: Review[];
  specialty?: string;
  operatingHours?: string;
  deliveryOptions?: string[];
  Icon?: LucideIcon;
  postedAt?: string; // ISO date string
}

export interface CartItem extends Dish {
  quantity: number;
}

export interface Buyer {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface Message {
  id: string;
  sender: 'buyer' | 'seller';
  text: string;
  timestamp: string; // ISO Date String
}

export interface Order {
  id: string;
  date: string; // ISO date string
  vendorName: string;
  buyer: Buyer;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Delivered' | 'Declined';
  items: CartItem[];
  comments?: string;
  messages?: Message[];
}
