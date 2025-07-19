
import type { Vendor, Dish, Review, CartItem } from './types';

// This file contains mock data to simulate a full backend.

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfter = new Date(today);
dayAfter.setDate(dayAfter.getDate() + 2);


export const mockDishes: Dish[] = [
  { id: 'd1-1', sellerId: 'v1', title: 'Butter Chicken Meal', description: 'Creamy tomato curry with tender chicken, served with rice and naan.', price: 14.99, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'butter chicken', available: true, cookingDate: tomorrow.toISOString(), slotsTotal: 10, slotsFilled: 7 },
  { id: 'd1-2', sellerId: 'v1', title: 'Palak Paneer Special', description: 'Fresh spinach puree with soft cottage cheese, includes 2 rotis.', price: 12.99, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'palak paneer', available: true, cookingDate: tomorrow.toISOString(), slotsTotal: 8, slotsFilled: 8 },
  { id: 'd1-3', sellerId: 'v1', title: 'Weekend Biryani', description: 'Aromatic basmati rice cooked with spices and chicken.', price: 15.99, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'chicken biryani', available: true, cookingDate: dayAfter.toISOString(), slotsTotal: 15, slotsFilled: 3 },
  { id: 'd2-1', sellerId: 'v2', title: 'Monthly Tiffin (Veg)', description: 'Daily changing menu of 1 curry, 4 rotis, rice, and salad. 30 meals.', price: 250.00, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'tiffin service', available: true, cookingDate: today.toISOString(), slotsTotal: 50, slotsFilled: 45 },
  { id: 'd2-2', sellerId: 'v2', title: 'Weekly Tiffin (Veg)', description: 'A week of delicious vegetarian meals delivered to your door.', price: 65.00, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'indian thali', available: true, cookingDate: today.toISOString(), slotsTotal: 20, slotsFilled: 11 },
  { id: 'd3-1', sellerId: 'v3', title: 'Homemade Lasagna Dinner', description: 'Classic beef lasagna with ricotta and mozzarella. Feeds 2.', price: 22.00, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'lasagna dish', available: true, cookingDate: tomorrow.toISOString(), slotsTotal: 5, slotsFilled: 1 },
  { id: 'd3-2', sellerId: 'v3', title: 'Pasta Carbonara Kit', description: 'Fresh pasta and ingredients to make your own Carbonara.', price: 18.00, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'pasta carbonara', available: false, cookingDate: today.toISOString(), slotsTotal: 10, slotsFilled: 10 },
  { id: 'd4-1', sellerId: 'v4', title: 'Idli Sambar Breakfast', description: '4 steamed rice cakes served with a flavorful lentil stew.', price: 8.99, imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'idli sambar', available: true, cookingDate: tomorrow.toISOString(), slotsTotal: 20, slotsFilled: 18 },
];

export const mockReviews: Review[] = [
  { id: 'r1-1', userName: 'Raj K.', rating: 5, comment: 'Best butter chicken I\'ve had in ages! So authentic and flavorful.', date: '2024-07-15T10:00:00Z', userImageUrl: 'https://placehold.co/40x40.png', dataAiHintUser: 'man smiling' },
  { id: 'r1-2', userName: 'Anita S.', rating: 4, comment: 'Delicious, a bit spicy for me though, but the quality was excellent.', date: '2024-07-14T18:30:00Z', userImageUrl: 'https://placehold.co/40x40.png', dataAiHintUser: 'woman portrait' },
  { id: 'r2-1', userName: 'Priya M.', rating: 5, comment: 'The tiffin service is a lifesaver! Always on time and the food is healthy and tasty.', date: '2024-07-16T12:00:00Z', userImageUrl: 'https://placehold.co/40x40.png', dataAiHintUser: 'woman happy' },
];

const now = new Date();

export const mockVendors: Vendor[] = [
  {
    id: 'v1',
    name: 'Priya\'s Kitchen',
    type: 'Home Cook',
    description: 'Authentic North Indian dishes made with love, just like mom used to make. Pre-order for tomorrow!',
    rating: 4.8,
    address: '123 Spice Lane',
    city: 'Maple Creek',
    phone: '555-123-4567',
    verified: true,
    imageUrl: 'https://placehold.co/400x250.png',
    dataAiHint: 'indian food cooking',
    menu: mockDishes.filter(d => d.sellerId === 'v1'),
    reviews: mockReviews.filter(r => r.id.startsWith('r1')),
    specialty: 'North Indian Curries',
    operatingHours: '5 PM - 10 PM',
    deliveryOptions: ['Pickup', 'Delivery'],
    postedAt: new Date(now.getTime() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
  },
  {
    id: 'v2',
    name: 'Daily Tiffins',
    type: 'Tiffin Service',
    description: 'Healthy and wholesome vegetarian meals delivered daily to your doorstep. Subscriptions available.',
    rating: 4.6,
    address: '456 Health Ave',
    city: 'Oakwood',
    phone: '555-987-6543',
    verified: true,
    imageUrl: 'https://placehold.co/400x250.png',
    dataAiHint: 'tiffin box meal',
    menu: mockDishes.filter(d => d.sellerId === 'v2'),
    reviews: mockReviews.filter(r => r.id.startsWith('r2')),
    specialty: 'Vegetarian Thalis',
    operatingHours: '11 AM - 8 PM',
    deliveryOptions: ['Delivery'],
    postedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: 'v3',
    name: 'Mama Maria\'s',
    type: 'Home Cook',
    description: 'Traditional Italian recipes passed down through generations. Pre-order our famous Lasagna for tomorrow.',
    rating: 4.9,
    address: '789 Pasta Place',
    city: 'Maple Creek',
    phone: '555-555-5555',
    verified: false,
    imageUrl: 'https://placehold.co/400x250.png',
    dataAiHint: 'italian kitchen',
    menu: mockDishes.filter(d => d.sellerId === 'v3'),
    reviews: [],
    specialty: 'Handmade Pasta & Pizza',
    operatingHours: '6 PM - 11 PM',
    deliveryOptions: ['Pickup'],
    postedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
   {
    id: 'v4',
    name: 'Southern Spice',
    type: 'Home Cook',
    description: 'Bringing the authentic taste of South India to your plate. Pre-order fresh dosas for tomorrow\'s breakfast!',
    rating: 4.5,
    address: '321 Dosa Drive',
    city: 'Oakwood',
    phone: '555-111-2222',
    verified: true,
    imageUrl: 'https://placehold.co/400x250.png',
    dataAiHint: 'south indian food',
    menu: mockDishes.filter(d => d.sellerId === 'v4'),
    reviews: [],
    specialty: 'Dosas and Idlis',
    operatingHours: '8 AM - 2 PM',
    deliveryOptions: ['Pickup', 'Delivery'],
    postedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
];

export const getVendorById = (id: string): Vendor | undefined => {
  return mockVendors.find(v => v.id === id);
};

export const getDishById = (id: string): Dish | undefined => {
  return mockDishes.find(d => d.id === id);
}

export const mockOrders = [
    {
        id: 'ord-1',
        date: '2024-07-18T14:30:00Z',
        vendorName: 'Priya\'s Kitchen',
        total: 18.98,
        status: 'Delivered',
        items: [
            {...mockDishes.find(d => d.id === 'd1-1'), quantity: 1} as CartItem,
            {...mockDishes.find(d => d.id === 'd1-3'), quantity: 1} as CartItem
        ].filter(i => i.id)
    },
    {
        id: 'ord-2',
        date: '2024-07-20T18:00:00Z',
        vendorName: 'Daily Tiffins',
        total: 65.00,
        status: 'Preparing',
        items: [
             {...mockDishes.find(d => d.id === 'd2-2'), quantity: 1} as CartItem
        ].filter(i => i.id)
    }
].filter(o => o.items.every(item => item && item.id)); // Filter out orders with missing items
