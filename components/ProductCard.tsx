
import React from 'react';
import { Star, ShoppingCart, Heart, ArrowUpRight, Plus, Eye, Trophy } from 'lucide-react';
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
    <div className="group relative flex flex-col bg-white rounded-[48px] p-4 transition-all duration-700 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-50">
      <div 
        className="relative aspect-[4/5] rounded-[40px] overflow-hidden bg-slate-100 cursor-pointer"
        onClick={() => onViewDetails(product.id)}
      >
        <img 
          src={product.images[0]} 
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
        />
        
        {/* FANDOM TAG */}
        <div className="absolute top-6 left-6 z-10">
           <span className="bg-slate-950/80 backdrop-blur-md text-white text-[8px] font-black px-4 py-2 rounded-full uppercase tracking-widest">{product.theme}</span>
        </div>

        <div className="absolute top-5 right-5 flex flex-col gap-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
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

        <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-all">
           <div className="glass px-4 py-2 rounded-2xl flex items-center gap-2">
              <Star size={10} className="fill-slate-900" />
              <span className="text-[9px] font-black tracking-widest">{product.rating}</span>
           </div>
           <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-xl">
              <Eye size={20} />
           </div>
        </div>
      </div>
      
      <div className="pt-8 px-4 pb-4 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">{product.gender} • {product.category}</span>
        </div>
        
        <h3 className="text-2xl font-display italic font-black text-slate-900 mb-6 tracking-tighter leading-none group-hover:text-rose-600 transition-colors">
          {product.title}
        </h3>
        
        <div className="mt-auto border-t border-slate-50 pt-6">
          <div className="flex items-end justify-between">
             <div>
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em] mb-1">Standard</p>
                <p className="text-3xl font-black text-slate-950 tracking-tighter">₹{product.price}</p>
             </div>
             {product.membershipPrice && (
                <div className="text-right">
                   <p className="text-[8px] font-black text-amber-500 uppercase tracking-[0.4em] mb-1 flex items-center gap-1 justify-end"><Trophy size={10} /> Member</p>
                   <p className="text-3xl font-black text-amber-500 tracking-tighter">₹{product.membershipPrice}</p>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
