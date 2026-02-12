import React from 'react';
import { Star, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
  onViewDetails: (id: string) => void;
  onToggleWishlist: (id: string) => void;
  isWishlisted: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onViewDetails, 
  onToggleWishlist,
  isWishlisted
}) => {
  return (
    <div className="group bg-white rounded-none overflow-hidden transition-all duration-700 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] flex flex-col">
      <div 
        className="relative aspect-[4/5] cursor-pointer overflow-hidden bg-slate-50"
        onClick={() => onViewDetails(product.id)}
      >
        <img 
          src={product.images[0]} 
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
        />
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
          className={`absolute top-6 right-6 p-2 transition-all ${isWishlisted ? 'text-[#D4AF37]' : 'text-white/40 hover:text-white'}`}
        >
          <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      <div className="p-8 flex flex-col items-start bg-white">
        <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight font-display">{product.title}</h3>
        <div className="flex items-center gap-3 mb-6">
          <p className="text-xl font-black text-slate-900">₹{product.price.toLocaleString()}</p>
          <div className="flex items-center gap-1">
            {[...Array(4)].map((_, i) => (
              <Star key={i} size={10} className="fill-[#D4AF37] text-[#D4AF37]" />
            ))}
          </div>
        </div>

        <div className="w-full flex gap-2">
          <div className="px-4 py-3 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
            10% Off
          </div>
          <button 
            onClick={() => onAddToCart(product.id)}
            className="flex-1 btn-gold py-3 text-[9px] rounded-none"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;