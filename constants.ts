
import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  // --- LUXURY ESSENTIALS (AS SEEN IN UI) ---
  {
    id: 'lux-bag-1',
    title: 'Black Quilted Handbag',
    description: 'Italian leather with gold-tone hardware and signature quilting.',
    price: 98599,
    membershipPrice: 85000,
    category: 'Bags',
    gender: 'Women',
    theme: 'None',
    collection: ['Bestsellers', 'Minimal Edition'],
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1200'],
    stock: 12,
    rating: 4.9,
    reviewsCount: 124,
    tags: ['luxury', 'bag', 'leather'],
    sellerId: 's-1'
  },
  {
    id: 'lux-coat-1',
    title: 'Minimalist Trench Coat',
    description: 'Precision-tailored trench in premium beige wool blend.',
    price: 45000,
    membershipPrice: 38000,
    category: 'Tops',
    gender: 'Women',
    theme: 'None',
    collection: ['New Arrivals'],
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1200'],
    stock: 8,
    rating: 5.0,
    reviewsCount: 45,
    tags: ['outerwear', 'classic'],
    sellerId: 's-1'
  },
  {
    id: 'lux-suit-1',
    title: 'Modern Heritage Suit',
    description: 'Slim-fit silhouette in lightweight Italian wool.',
    price: 82000,
    membershipPrice: 72000,
    category: 'Pants',
    gender: 'Men',
    theme: 'None',
    collection: ['Elite Exclusive'],
    images: ['https://images.unsplash.com/photo-1594932224491-9941966bba58?auto=format&fit=crop&q=80&w=1200'],
    stock: 5,
    rating: 4.8,
    reviewsCount: 12,
    tags: ['suit', 'formal'],
    sellerId: 's-1'
  },
  {
    id: 'lux-watch-1',
    title: 'Heritage Chronograph',
    description: 'Mechanical timepiece with sapphire crystal and leather strap.',
    price: 145000,
    membershipPrice: 125000,
    category: 'Watches',
    gender: 'Unisex',
    theme: 'None',
    collection: ['Elite Exclusive'],
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200'],
    stock: 3,
    rating: 5.0,
    reviewsCount: 8,
    tags: ['watch', 'luxury'],
    sellerId: 's-1'
  },
  // Adding more to fill grid
  ...Array.from({ length: 6 }).map((_, i) => ({
    id: `lux-auto-${i}`,
    title: `Luxury Artifact ${i + 5}`,
    description: 'Handcrafted precision for the discerning individual.',
    price: 25000 + i * 5000,
    membershipPrice: 20000 + i * 4000,
    category: 'Accessories' as const,
    gender: 'Unisex' as const,
    theme: 'None' as const,
    collection: ['Trending' as const],
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1200'],
    stock: 20,
    rating: 4.7,
    reviewsCount: 30,
    tags: ['luxury', 'exclusive'],
    sellerId: 's-1'
  }))
];

export const THEME_COLORS = {
  primary: '#0F172A',
  accent: '#D4AF37',
  background: '#F8F7F4'
};
