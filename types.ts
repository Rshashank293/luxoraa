
export type Gender = 'Men' | 'Women' | 'Kids' | 'Unisex';

export type Category = 
  | 'Oversized Tees' | 'Classic T-Shirts' | 'Polos' | 'Shirts' 
  | 'Sweaters & Hoodies' | 'Joggers' | 'Shorts' | 'Boxers' | 'Pants' 
  | 'Dresses' | 'Tops' | 'Lounge Sets' | 'Socks' | 'Bags' | 'Accessories'
  | 'Mobile Covers' | 'Footwear' | 'Toys' | 'Action Figures' | 'Statues' | 'Sneakers' | 'Sunglasses' | 'Watches';

export type Theme = 
  | 'Marvel' | 'DC Comics' | 'Anime' | 'Disney' | 'Harry Potter' 
  | 'Star Wars' | 'Cartoon Network' | 'Friends' | 'Originals' | 'None';

export type Collection = 
  | 'New Arrivals' | 'Bestsellers' | 'Trending' | 'Minimal Edition' | 'Winter Collection' | 'Elite Exclusive';

export type LoyaltyTier = 'Member' | 'Silver' | 'Gold' | 'Platinum';

export type AdminSubRole = 'Super Admin' | 'Ops Manager' | 'Security Lead' | 'Support Hero';

export type UserStatus = 'Active' | 'Suspended' | 'Pending Verification';

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  membershipPrice?: number;
  category: Category;
  gender: Gender;
  theme: Theme;
  collection: Collection[];
  images: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  tags: string[];
  colors?: string[];
  sizes?: string[];
  material?: string;
  sellerId: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'seller';
  adminRole?: AdminSubRole;
  avatar?: string;
  points: number;
  tier: LoyaltyTier;
  isMember: boolean;
  walletBalance: number;
  status: UserStatus;
  lastLogin: string;
  mfaEnabled: boolean;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Placed' | 'Packed' | 'Shipped' | 'Delivered' | 'Returned';
  date: string;
  trackingNumber: string;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  fraudScore: number;
}
