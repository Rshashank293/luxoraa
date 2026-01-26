
import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  // --- MEN: OVERSIZED ---
  {
    id: 'm-ot-1',
    title: 'Spider-Man: Beyond Stealth',
    description: 'Heavyweight oversized tee with 3D embossed Spider-logo.',
    price: 1299,
    membershipPrice: 999,
    category: 'Oversized Tees',
    gender: 'Men',
    theme: 'Marvel',
    collection: ['Trending', 'Bestsellers'],
    images: ['https://images.unsplash.com/photo-1576871333020-2219d51cca94?auto=format&fit=crop&q=80&w=800'],
    stock: 150,
    rating: 4.9,
    reviewsCount: 1240,
    tags: ['marvel', 'spiderman', 'oversized'],
    colors: ['Midnight Black'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sellerId: 's-1'
  },
  {
    id: 'm-ot-2',
    title: 'Akatsuki: Red Cloud',
    description: 'Minimalist red cloud embroidery on premium white drop-shoulder tee.',
    price: 1499,
    membershipPrice: 1199,
    category: 'Oversized Tees',
    gender: 'Men',
    theme: 'Anime',
    collection: ['New Arrivals', 'Trending'],
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'],
    stock: 80,
    rating: 4.8,
    reviewsCount: 450,
    tags: ['naruto', 'anime', 'akatsuki'],
    colors: ['White'],
    sizes: ['M', 'L', 'XL'],
    sellerId: 's-1'
  },

  // --- WOMEN: TOPS & DRESSES ---
  {
    id: 'w-d-1',
    title: 'Wonder Woman: Amazonian Grace',
    description: 'Elegant wrap dress featuring subtle gold tiara embroidery.',
    price: 2499,
    membershipPrice: 1999,
    category: 'Dresses',
    gender: 'Women',
    theme: 'DC Comics',
    collection: ['Trending'],
    images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800'],
    stock: 45,
    rating: 5.0,
    reviewsCount: 112,
    tags: ['dc', 'wonderwoman', 'dress'],
    colors: ['Deep Red', 'Royal Blue'],
    sizes: ['XS', 'S', 'M', 'L'],
    sellerId: 's-2'
  },
  {
    id: 'w-ot-1',
    title: 'Mickey: Vintage Pop',
    description: 'Retro 90s aesthetic oversized tee for the ultimate Disney fan.',
    price: 1199,
    membershipPrice: 899,
    category: 'Oversized Tees',
    gender: 'Women',
    theme: 'Disney',
    collection: ['Bestsellers'],
    images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800'],
    stock: 120,
    rating: 4.7,
    reviewsCount: 890,
    tags: ['disney', 'mickey', 'retro'],
    colors: ['Vintage Blue', 'Sand'],
    sizes: ['S', 'M', 'L'],
    sellerId: 's-1'
  },

  // --- KIDS ---
  {
    id: 'k-ct-1',
    title: 'Batman: Little Knight',
    description: 'Soft bio-washed classic tee for the smallest vigilantes.',
    price: 699,
    membershipPrice: 499,
    category: 'Classic T-Shirts',
    gender: 'Kids',
    theme: 'DC Comics',
    collection: ['Trending'],
    images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=800'],
    stock: 200,
    rating: 4.9,
    reviewsCount: 560,
    tags: ['kids', 'dc', 'batman'],
    colors: ['Black', 'Yellow'],
    sizes: ['2Y', '4Y', '6Y', '8Y'],
    sellerId: 's-1'
  },

  // --- ACCESSORIES ---
  {
    id: 'a-b-1',
    title: 'Hogwarts Express Backpack',
    description: 'Multi-compartment travel backpack with Platform 9¾ detailing.',
    price: 3499,
    membershipPrice: 2799,
    category: 'Bags',
    gender: 'Unisex',
    theme: 'Harry Potter',
    collection: ['Bestsellers', 'Trending'],
    images: ['https://images.unsplash.com/photo-1553062407-98eeb94c6a62?auto=format&fit=crop&q=80&w=800'],
    stock: 30,
    rating: 4.8,
    reviewsCount: 230,
    tags: ['hp', 'backpack', 'travel'],
    sellerId: 's-3'
  },
  {
    id: 'a-mc-1',
    title: 'Jujutsu Kaisen: Domain Expansion',
    description: 'Impact-resistant mobile cover with Gojo Satoru artwork.',
    price: 599,
    membershipPrice: 399,
    category: 'Mobile Covers',
    gender: 'Unisex',
    theme: 'Anime',
    collection: ['New Arrivals'],
    images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800'],
    stock: 300,
    rating: 4.9,
    reviewsCount: 1560,
    tags: ['anime', 'jjk', 'mobile'],
    sellerId: 's-3'
  }
];

export const THEME_COLORS = {
  primary: '#e11d48',
  secondary: '#0f172a',
  accent: '#fbbf24',
};
