
import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  // --- OVERSIZED TEES ---
  {
    id: 'ot-1',
    title: 'Spider-Man: Across the Web',
    description: 'Heavyweight oversized tee featuring an exclusive Miles Morales graphic print.',
    price: 999,
    membershipPrice: 799,
    category: 'Oversized Tees',
    collectionName: 'Marvel',
    images: ['https://images.unsplash.com/photo-1576871333020-2219d51cca94?auto=format&fit=crop&q=80&w=800'],
    stock: 120,
    rating: 4.9,
    reviewsCount: 850,
    tags: ['marvel', 'spider-man', 'oversized', 'trending'],
    colors: ['Midnight Black', 'Slate Grey'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sellerId: 's-1'
  },
  {
    id: 'ot-2',
    title: 'Akatsuki Cloud Pattern',
    description: 'Minimalist red cloud embroidery on a premium white oversized fit.',
    price: 1299,
    membershipPrice: 999,
    category: 'Oversized Tees',
    collectionName: 'Naruto',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'],
    stock: 50,
    rating: 4.8,
    reviewsCount: 420,
    tags: ['anime', 'naruto', 'minimalist'],
    colors: ['White'],
    sizes: ['M', 'L', 'XL'],
    sellerId: 's-1'
  },
  {
    id: 'ot-3',
    title: 'Mickey: Vintage Pop',
    description: 'Official Disney merchandise. Relaxed fit with a retro 90s aesthetic.',
    price: 899,
    membershipPrice: 699,
    category: 'Oversized Tees',
    collectionName: 'Disney',
    images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800'],
    stock: 80,
    rating: 4.7,
    reviewsCount: 215,
    tags: ['disney', 'retro', 'mickey'],
    colors: ['Vintage Blue', 'Off-White'],
    sizes: ['S', 'M', 'L'],
    sellerId: 's-1'
  },

  // --- HOODIES ---
  {
    id: 'h-1',
    title: 'Hogwarts Alumni Fleece',
    description: 'Super-soft inner fleece hoodie with the iconic crest. Perfect for winter magic.',
    price: 1999,
    membershipPrice: 1599,
    category: 'Hoodies & Sweatshirts',
    collectionName: 'Harry Potter',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800'],
    stock: 35,
    rating: 4.9,
    reviewsCount: 610,
    tags: ['harry potter', 'fleece', 'winter'],
    colors: ['Maroon', 'Deep Green'],
    sizes: ['S', 'M', 'L', 'XL'],
    sellerId: 's-2'
  },
  {
    id: 'h-2',
    title: 'Batman: The Dark Knight',
    description: 'Official DC Merchandise. Stealth black hoodie with embroidered chest logo.',
    price: 2499,
    membershipPrice: 1999,
    category: 'Hoodies & Sweatshirts',
    collectionName: 'DC Comics',
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800'],
    stock: 20,
    rating: 5.0,
    reviewsCount: 150,
    tags: ['batman', 'dc', 'stealth'],
    colors: ['Obsidian Black'],
    sizes: ['M', 'L', 'XL'],
    sellerId: 's-2'
  },

  // --- CLASSIC TEES ---
  {
    id: 'ct-1',
    title: 'Central Perk Classic',
    description: '100% bio-washed cotton. The perfect tee for coffee and friends.',
    price: 699,
    membershipPrice: 499,
    category: 'Classic T-Shirts',
    collectionName: 'FRIENDS',
    images: ['https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80&w=800'],
    stock: 200,
    rating: 4.8,
    reviewsCount: 2400,
    tags: ['friends', 'sitcom', 'classic'],
    colors: ['Black', 'White'],
    sizes: ['S', 'M', 'L', 'XL'],
    sellerId: 's-1'
  },

  // --- JOGGERS ---
  {
    id: 'j-1',
    title: 'Uchiha Clan Pajamas',
    description: 'Comfort-first lounge wear for late night anime marathons.',
    price: 1499,
    membershipPrice: 1199,
    category: 'Joggers & Pajamas',
    collectionName: 'Naruto',
    images: ['https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=800'],
    stock: 60,
    rating: 4.7,
    reviewsCount: 180,
    tags: ['anime', 'loungewear', 'naruto'],
    sellerId: 's-1'
  },

  // --- ACCESSORIES ---
  {
    id: 'a-1',
    title: 'Shield of Justice Socks',
    description: 'Premium cotton socks with reinforced heel and toe.',
    price: 299,
    membershipPrice: 199,
    category: 'Accessories',
    collectionName: 'Marvel',
    images: ['https://images.unsplash.com/photo-1521316730702-829ad88e7ff7?auto=format&fit=crop&q=80&w=800'],
    stock: 500,
    rating: 4.9,
    reviewsCount: 1200,
    tags: ['captain america', 'marvel', 'socks'],
    sellerId: 's-1'
  }
];

export const THEME_COLORS = {
  primary: '#e11d48', // TSS Red
  secondary: '#0f172a',
  accent: '#fbbf24',
};
