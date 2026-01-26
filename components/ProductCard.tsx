
import React from 'react';
import { Star, ShoppingCart, Heart, ArrowUpRight, Plus, Eye } from 'lucide-react';
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
    <div className="group relative flex flex-col bg-white rounded-[48px] p-4 transition-all duration-700 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)]">
      {/* Media Shard */}
      <div 
        className="relative aspect-[4/5] rounded-[40px] overflow-hidden bg-slate-100 cursor-pointer"
        onClick={() => onViewDetails(product.id)}
      >
        <img 
          src={product.images[0]} 
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 group-hover:rotate-1"
        />
        
        {/* Interaction Layer */}
        <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/10 transition-colors duration-700" />
        
        <div className="absolute top-5 right-5 flex flex-col gap-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-75">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
            className={`p-4 rounded-3xl shadow-2xl transition-all ${isWishlisted ? 'bg-rose-500 text-white' : 'glass text-slate-900 hover:bg-white'}`}
          >
            <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(product.id); }}
            className="p-4 rounded-3xl glass shadow-2xl transition-all hover:bg-slate-900 hover:text-white"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Metadata Badges */}
        <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-y-4 group-hover:translate-y-0 transition-all">
           <div className="glass px-4 py-2 rounded-2xl flex items-center gap-2">
              <Star size={10} className="fill-slate-900" />
              <span className="text-[9px] font-black tracking-widest">{product.rating}</span>
           </div>
           <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-xl">
              <Eye size={20} />
           </div>
        </div>
      </div>
      
      {/* Editorial Content Shard */}
      <div className="pt-8 px-4 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">{product.category}</span>
        </div>
        
        <h3 
          className="text-2xl font-display italic font-black text-slate-900 mb-3 tracking-tighter leading-none cursor-pointer group-hover:text-slate-600 transition-colors"
          onClick={() => onViewDetails(product.id)}
        >
          {product.title}
        </h3>
        
        <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed mb-8">
          {product.description}
        </p>
        
        <div className="flex items-end justify-between border-t border-slate-50 pt-8 mt-auto">
          <div>
            <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em] mb-1">Exchange Value</p>
            <p className="text-3xl font-black text-slate-950 tracking-tighter">${product.price.toFixed(2)}</p>
          </div>
          
          <button 
            onClick={() => onViewDetails(product.id)}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-900 group/btn"
          >
            Details <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
