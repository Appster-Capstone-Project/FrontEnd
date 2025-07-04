
import type { Vendor } from './types';

// This file contains mock data for demo purposes.
// In a real application, this data would be fetched from a backend API.

export const mockVendors: Vendor[] = [
  {
    id: '1',
    name: "Auntie's Kitchen",
    type: 'Home Cook',
    description: 'Authentic home-style Indian curries and breads, made with love and traditional spices.',
    rating: 4.8,
    address: '123 Spice Lane',
    city: 'Curryville',
    imageUrl: 'https://placehold.co/400x250.png',
    dataAiHint: 'indian food platter',
    specialty: 'Butter Chicken, Naan',
    operatingHours: '5 PM - 10 PM, Tue-Sun',
    deliveryOptions: ['Pickup', 'Local Delivery'],
    menu: [
      { id: 'd1-1', title: 'Butter Chicken', sellerId: '1', description: 'Creamy and rich tomato-based curry with tender chicken pieces.', price: 14.99, category: 'Main Course', available: true, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'butter chicken' },
      { id: 'd1-2', title: 'Palak Paneer', sellerId: '1', description: 'Soft paneer cheese in a smooth, creamy spinach gravy.', price: 12.99, category: 'Main Course', available: true, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'palak paneer' },
      { id: 'd1-3', title: 'Garlic Naan', sellerId: '1', description: 'Soft and fluffy flatbread topped with garlic and butter.', price: 3.50, category: 'Breads', available: true, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'garlic naan' },
      { id: 'd1-4', title: 'Samosas (2 pcs)', sellerId: '1', description: 'Crispy pastry filled with spiced potatoes and peas.', price: 5.00, category: 'Appetizer', available: false, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'samosas' },
    ],
    reviews: [
      { id: 'r1-1', userName: 'Raj K.', rating: 5, comment: 'Best butter chicken I\'ve had in ages!', date: '2024-07-15T10:00:00Z', userImageUrl: 'https://placehold.co/40x40.png', dataAiHintUser: 'man smiling' },
      { id: 'r1-2', userName: 'Anita S.', rating: 4, comment: 'Paneer was delicious, a bit spicy for me though.', date: '2024-07-14T18:30:00Z', userImageUrl: 'https://placehold.co/40x40.png', dataAiHintUser: 'woman portrait' },
    ],
  },
  {
    id: '2',
    name: 'Daily Bites Tiffin',
    type: 'Tiffin Service',
    description: 'Healthy and wholesome daily meals, perfect for students and professionals. New menu every day!',
    rating: 4.5,
    address: '456 Wellness St',
    city: 'Curryville',
    imageUrl: 'https://placehold.co/400x250.png',
    dataAiHint: 'indian thali tiffin',
    specialty: 'North Indian Thali',
    operatingHours: '11 AM - 2 PM, 6 PM - 9 PM, Mon-Sat',
    deliveryOptions: ['Subscription Delivery'],
    menu: [
      { id: 'd2-1', title: 'Weekly Veg Tiffin', sellerId: '2', description: 'A week of delicious vegetarian meals, delivered daily. Includes roti, sabzi, dal, and rice.', price: 85.00, category: 'Subscription', available: true, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'veg thali' },
      { id: 'd2-2', title: 'Monthly Non-Veg Tiffin', sellerId: '2', description: 'A full month of veg and non-veg meals. Chicken/fish twice a week.', price: 350.00, category: 'Subscription', available: true, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'tiffin box meal' },
      { id: 'd2-3', title: 'Trial Meal (Veg)', sellerId: '2', description: 'Try one of our wholesome vegetarian thalis for a day.', price: 12.00, category: 'Trial', available: true, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'vegetarian meal' },
    ],
    reviews: [
      { id: 'r2-1', userName: 'Priya D.', rating: 5, comment: 'Such a lifesaver! The food is healthy and feels like home.', date: '2024-07-16T12:00:00Z', userImageUrl: 'https://placehold.co/40x40.png', dataAiHintUser: 'professional woman' },
      { id: 'r2-2', userName: 'Amit G.', rating: 4, comment: 'Good variety and always on time. Wish they had more non-veg options.', date: '2024-07-15T13:00:00Z', userImageUrl: 'https://placehold.co/40x40.png', dataAiHintUser: 'man office' },
    ],
  },
  {
    id: '3',
    name: "Mama Rosa's Pasta",
    type: 'Home Cook',
    description: 'Handmade pasta and authentic Italian sauces, just like nonna used to make.',
    rating: 4.9,
    address: '789 Vineyard Ave',
    city: 'Grand City',
    imageUrl: 'https://placehold.co/400x250.png',
    dataAiHint: 'italian pasta dish',
    specialty: 'Lasagna, Fresh Pasta',
    operatingHours: '6 PM - 9 PM, Fri-Sun',
    deliveryOptions: ['Pickup'],
    menu: [
      { id: 'd3-1', title: 'Classic Beef Lasagna', sellerId: '3', description: 'Layers of fresh pasta, rich bolognese sauce, and creamy béchamel.', price: 18.00, category: 'Main Course', available: true, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'lasagna slice' },
      { id: 'd3-2', title: 'Fettuccine Alfredo', sellerId: '3', description: 'Silky fettuccine in a classic parmesan and cream sauce.', price: 15.50, category: 'Main Course', available: true, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'fettuccine alfredo' },
      { id: 'd3-3', title: 'Tiramisu', sellerId: '3', description: 'The perfect pick-me-up. Coffee-soaked ladyfingers and mascarpone cream.', price: 7.50, category: 'Dessert', available: true, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'tiramisu dessert' },
    ],
    reviews: [
      { id: 'r3-1', userName: 'Jessica B.', rating: 5, comment: 'The lasagna was absolutely divine! So authentic.', date: '2024-07-12T20:00:00Z', userImageUrl: 'https://placehold.co/40x40.png', dataAiHintUser: 'woman smiling' },
    ],
  },
];

export const getVendorById = (id: string): Vendor | undefined => {
  return mockVendors.find((vendor) => vendor.id === id);
};
