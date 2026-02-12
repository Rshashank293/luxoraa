
import React from 'react';
import { Star, Plus, Eye, Trophy, Heart } from 'lucide-react';
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
  isWishlisted
}) => {
  return (
    <div className="group bg-white rounded-none p-0 transition-all duration-700 hover:shadow-2xl border-none overflow-hidden">
      {/* Image Node */}
      <div 
        className="relative aspect-[4/5] cursor-pointer overflow-hidden"
        onClick={() => onViewDetails(product.id)}
      >
        <img 
          src={product.images[0]} 
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Floating Icons */}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${isWishlisted ? 'text-[#D4AF37]' : 'text-white/60 hover:text-white'}`}
        >
          <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-6 bg-white">
        <h3 className="text-lg font-black text-slate-900 mb-1 tracking-tight font-display">{product.title}</h3>
        <div className="flex items-center gap-2 mb-4">
          <p className="text-xl font-black text-slate-900">₹{product.price.toLocaleString()}</p>
          <div className="flex items-center gap-1">
            <Star size={10} className="fill-[#D4AF37] text-[#D4AF37]" />
            <Star size={10} className="fill-[#D4AF37] text-[#D4AF37]" />
            <Star size={10} className="fill-[#D4AF37] text-[#D4AF37]" />
            <Star size={10} className="fill-[#D4AF37] text-[#D4AF37]" />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-300 border border-slate-100 px-3 py-2">
            10% Off
          </div>
          <button 
            onClick={() => onAddToCart(product.id)}
            className="flex-1 btn-gold py-3 text-[9px] rounded-none hover:opacity-90"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
