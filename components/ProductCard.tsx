
import React from 'react';
import { Star, ShoppingCart, Heart, Plus, Eye, Trophy, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
  onViewDetails: (id: string) => void;
  onToggleWishlist: (id: string) => void;
  isWishlisted: boolean;
  isUserMember?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onViewDetails, 
  onToggleWishlist,
  isWishlisted,
  isUserMember
}) => {
  return (
    <div className="group relative flex flex-col bg-white rounded-[40px] p-2 transition-all duration-700 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-50">
      {/* Zoom Image Container */}
      <div 
        className="zoom-container relative aspect-[4/5] rounded-[34px] cursor-pointer"
        onClick={() => onViewDetails(product.id)}
      >
        <img 
          src={product.images[0]} 
          alt={product.title}
          className="zoom-image w-full h-full object-cover"
        />
        
        {/* Luxury Tags */}
        <div className="absolute top-5 left-5 z-10">
           {product.collection.includes('Elite Exclusive') && (
             <span className="bg-slate-900 text-white text-[8px] font-black px-4 py-2 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg">
               <Trophy size={10} className="text-[#D4AF37]" /> Elite Selection
             </span>
           )}
        </div>

        {/* Hover Quick Actions */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
           <button 
             onClick={(e) => { e.stopPropagation(); onAddToCart(product.id); }}
             className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-2xl hover:bg-slate-900 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500"
           >
             <Plus size={20} />
           </button>
           <button 
             onClick={(e) => { e.stopPropagation(); onViewDetails(product.id); }}
             className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-2xl hover:bg-slate-900 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75"
           >
             <Eye size={20} />
           </button>
        </div>

        {/* Wishlist Toggle */}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
          className={`absolute top-5 right-5 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${isWishlisted ? 'bg-rose-500 text-white scale-110 shadow-lg' : 'bg-white/80 backdrop-blur-md text-slate-900 opacity-0 group-hover:opacity-100'}`}
        >
          <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      {/* Product Info */}
      <div className="pt-6 px-4 pb-4">
        <div className="flex justify-between items-start mb-2">
           <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">{product.category}</span>
           <div className="flex items-center gap-1">
             <Star size={10} className="fill-[#D4AF37] text-[#D4AF37]" />
             <span className="text-[9px] font-bold">{product.rating}</span>
           </div>
        </div>
        
        <h3 className="text-xl font-display italic font-black text-slate-900 mb-6 tracking-tighter leading-none truncate">
          {product.title}
        </h3>
        
        <div className="flex items-end justify-between border-t border-slate-50 pt-4">
          <div>
             <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Standard Rate</p>
             <p className="text-2xl font-black text-slate-900 tracking-tighter">₹{product.price.toLocaleString()}</p>
          </div>
          {isUserMember && product.membershipPrice && (
            <div className="text-right">
              <p className="text-[8px] font-black text-[#D4AF37] uppercase tracking-widest mb-1 flex items-center gap-1 justify-end">Elite Sync</p>
              <p className="text-2xl font-black text-[#D4AF37] tracking-tighter">₹{product.membershipPrice.toLocaleString()}</p>
            </div>
          )}
          <ArrowUpRight size={20} className="text-slate-200 group-hover:text-slate-900 transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
