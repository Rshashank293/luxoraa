
export type Category = 'Classic T-Shirts' | 'Oversized Tees' | 'Hoodies & Sweatshirts' | 'Joggers & Pajamas' | 'Shoes' | 'Accessories';

export type LoyaltyTier = 'Member' | 'Silver' | 'Gold' | 'Platinum';

export type UserStatus = 'Active' | 'Suspended' | 'Pending Verification';

export interface Seller {
  id: string;
  name: string;
  rating: number;
  joinedDate: string;
  isVerified: boolean;
  commissionRate: number;
  totalSales: number;
  balance: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  sentiment?: 'Positive' | 'Neutral' | 'Negative';
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  membershipPrice?: number; // TSS specific
  category: Category;
  collectionName?: string; // e.g., "Marvel", "Naruto"
  images: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  tags: string[];
  colors?: string[];
  sizes?: string[];
  material?: string;
  sellerId: string;
  seller?: Seller;
  aiDescription?: string;
  dynamicPrice?: number;
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
  avatar?: string;
  points: number;
  tier: LoyaltyTier;
  isMember: boolean; // TSS specific
  walletBalance: number;
  status: UserStatus;
  lastLogin: string;
  mfaEnabled: boolean;
}

export type OrderStatus = 'Placed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Returned';

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  latLng?: { lat: number; lng: number };
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  date: string;
  trackingNumber: string;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  fraudScore: number;
  isAIGeneratedRecovery?: boolean;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
  severity: 'Info' | 'Warning' | 'Critical';
}

export interface AnalyticsData {
  salesVolume: number[];
  labels: string[];
  roi: number;
  cac: number;
  churnRate: number;
}
