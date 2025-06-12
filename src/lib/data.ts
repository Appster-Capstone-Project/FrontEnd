import type { Vendor } from './types';
import { ChefHat, Utensils } from 'lucide-react';

export const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Auntie Priya\'s Kitchen',
    type: 'Home Cook',
    description: 'Authentic North Indian homemade meals, cooked with love and fresh ingredients. Specializing in curries and biryanis.',
    rating: 4.8,
    address: '123 Spice Lane, Curryville',
    city: 'Curryville',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'indian food',
    profileImageUrl: 'https://placehold.co/100x100.png',
    dataAiHintProfile: 'woman cooking',
    Icon: ChefHat,
    specialty: 'Butter Chicken, Paneer Tikka Masala',
    operatingHours: '11:00 AM - 09:00 PM',
    deliveryOptions: ['Self-pickup', 'Local Delivery'],
    menu: [
      { id: 'd1-1', name: 'Butter Chicken', description: 'Creamy tomato-based chicken curry.', price: 12.99, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'butter chicken', category: 'Main Course', portionsAvailable: 5, portionsTotal: 10 },
      { id: 'd1-2', name: 'Paneer Tikka Masala', description: 'Grilled paneer in a spicy gravy.', price: 10.99, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'paneer tikka', category: 'Main Course', portionsAvailable: 3, portionsTotal: 8 },
      { id: 'd1-3', name: 'Garlic Naan', description: 'Soft flatbread with garlic.', price: 3.00, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'naan bread', category: 'Sides' },
    ],
    reviews: [
      { id: 'r1-1', userName: 'Raj K.', rating: 5, comment: 'Best butter chicken I\'ve had in ages!', date: '2024-07-15T10:00:00Z', userImageUrl: 'https://placehold.co/40x40.png', dataAiHintUser: 'man smiling' },
      { id: 'r1-2', userName: 'Anita S.', rating: 4, comment: 'Paneer was delicious, a bit spicy for me though.', date: '2024-07-14T18:30:00Z', userImageUrl: 'https://placehold.co/40x40.png', dataAiHintUser: 'woman portrait' },
    ],
  },
  {
    id: '2',
    name: 'Healthy Bites Tiffin',
    type: 'Tiffin Service',
    description: 'Daily and weekly tiffin plans with balanced and nutritious meals. Perfect for busy professionals and students.',
    rating: 4.5,
    address: '45 Green Street, Healthburg',
    city: 'Healthburg',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'tiffin box',
    profileImageUrl: 'https://placehold.co/100x100.png',
    dataAiHintProfile: 'healthy food',
    Icon: Utensils,
    specialty: 'Vegetarian Thalis, Quinoa Salads',
    operatingHours: '09:00 AM - 06:00 PM (Mon-Fri)',
    deliveryOptions: ['Subscription Delivery'],
    menu: [
      { id: 'd2-1', name: 'Vegetarian Thali', description: 'Dal, 2 sabzis, roti, rice, salad.', price: 8.50, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'veg thali', category: 'Daily Tiffin' },
      { id: 'd2-2', name: 'Quinoa Power Bowl', description: 'Quinoa with roasted vegetables and chickpeas.', price: 9.00, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'quinoa salad', category: 'Healthy Options' },
    ],
    reviews: [
      { id: 'r2-1', userName: 'Vikram P.', rating: 5, comment: 'Reliable and healthy tiffin service. Great variety.', date: '2024-07-16T12:00:00Z', userImageUrl: 'https://placehold.co/40x40.png', dataAiHintUser: 'professional man' },
    ],
  },
  {
    id: '3',
    name: 'Mama Rosa\'s Pasta',
    type: 'Home Cook',
    description: 'Authentic Italian pasta dishes, made from scratch using family recipes passed down through generations.',
    rating: 4.9,
    address: '78 Little Italy, Foodville',
    city: 'Foodville',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'italian pasta',
    profileImageUrl: 'https://placehold.co/100x100.png',
    dataAiHintProfile: 'italian woman',
    Icon: ChefHat,
    specialty: 'Lasagna, Spaghetti Carbonara',
    operatingHours: '05:00 PM - 10:00 PM (Wed-Sun)',
    deliveryOptions: ['Self-pickup'],
    menu: [
      { id: 'd3-1', name: 'Classic Lasagna', description: 'Layers of pasta, meat sauce, and béchamel.', price: 15.00, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'lasagna dish', category: 'Main Course', portionsAvailable: 2, portionsTotal: 5 },
      { id: 'd3-2', name: 'Spaghetti Carbonara', description: 'Spaghetti with eggs, cheese, pancetta.', price: 13.50, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'carbonara pasta', category: 'Main Course' },
    ],
    reviews: [
      { id: 'r3-1', userName: 'Sophia L.', rating: 5, comment: 'Just like my nonna used to make! The lasagna is divine.', date: '2024-07-18T19:00:00Z', userImageUrl: 'https://placehold.co/40x40.png', dataAiHintUser: 'young woman' },
    ],
  },
  {
    id: '4',
    name: 'Green Leaf Tiffins',
    type: 'Tiffin Service',
    description: 'Wholesome and delicious vegetarian tiffin meals delivered to your doorstep. Focus on organic and locally sourced ingredients.',
    rating: 4.7,
    address: '90 Organic Ave, Healthburg',
    city: 'Healthburg',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'salad tiffin',
    profileImageUrl: 'https://placehold.co/100x100.png',
    dataAiHintProfile: 'vegetable basket',
    Icon: Utensils,
    specialty: 'South Indian Thalis, Millet Dishes',
    operatingHours: '10:00 AM - 07:00 PM',
    deliveryOptions: ['Subscription Delivery', 'Bulk Orders'],
    menu: [
      { id: 'd4-1', name: 'South Indian Mini Tiffin', description: 'Idli, Vada, Sambar, Chutney.', price: 7.00, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'idli vada', category: 'Daily Tiffin' },
      { id: 'd4-2', name: 'Millet Upma', description: 'Healthy and filling upma made with foxtail millet.', price: 6.50, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'upma recipe', category: 'Healthy Options' },
    ],
    reviews: [
      { id: 'r4-1', userName: 'Priya G.', rating: 5, comment: 'Absolutely love their tiffins! So fresh and tasty.', date: '2024-07-20T13:00:00Z', userImageUrl: 'https://placehold.co/40x40.png', dataAiHintUser: 'indian woman' },
      { id: 'r4-2', userName: 'Arjun M.', rating: 4, comment: 'Good food, sometimes delivery is a bit late.', date: '2024-07-19T14:00:00Z', userImageUrl: 'https://placehold.co/40x40.png', dataAiHintUser: 'young man' },
    ],
  },
];

export const getVendorById = (id: string): Vendor | undefined => {
  return mockVendors.find(vendor => vendor.id === id);
};
