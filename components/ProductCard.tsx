import React from 'react';
import { Star, ShoppingCart, Heart, ArrowUpRight, Plus } from 'lucide-react';
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
    <div className="group bg-white rounded-[40px] overflow-hidden border border-slate-100 hover-lift shadow-[0_4px_20px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-700">
      <div className="relative aspect-[4/5] overflow-hidden cursor-pointer" onClick={() => onViewDetails(product.id)}>
        <img 
          src={product.images[0]} 
          alt={product.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.5s]"
        />
        
        {/* Floating Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          {product.stock < 10 && product.stock > 0 && (
            <span className="bg-rose-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-xl">Low Stock</span>
          )}
          {product.rating > 4.8 && (
            <span className="bg-amber-400 text-slate-950 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-1">
              <Star size={8} fill="currentColor" /> Top Rated
            </span>
          )}
        </div>

        <div className="absolute top-6 right-6 flex flex-col gap-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
            className={`p-3.5 rounded-full shadow-2xl transition-all ${isWishlisted ? 'bg-rose-600 text-white' : 'glass text-slate-600 hover:bg-white'}`}
          >
            <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(product.id); }}
            className="p-3.5 rounded-full glass shadow-2xl transition-all hover:bg-indigo-600 hover:text-white"
          >
            <Plus size={18} />
          </button>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end p-8">
           <div className="w-full flex justify-between items-center text-white">
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Explore Drop</span>
              <ArrowUpRight size={20} />
           </div>
        </div>
      </div>
      
      <div className="p-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] uppercase tracking-[0.4em] text-indigo-600 font-black">{product.category}</span>
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-full">
            <Star size={10} className="text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-black text-slate-900">{product.rating}</span>
          </div>
        </div>
        <h3 
          className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1" 
          onClick={() => onViewDetails(product.id)}
        >
          {product.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 mb-6 font-medium leading-relaxed">
          {product.description}
        </p>
        <div className="flex items-baseline justify-between pt-4 border-t border-slate-100">
           <div className="flex flex-col">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">MSRP</p>
              <p className="text-2xl font-black text-slate-900 tracking-tighter">${product.price.toFixed(2)}</p>
           </div>
           <button 
             onClick={() => onViewDetails(product.id)}
             className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-slate-900 transition-colors flex items-center gap-1"
           >
             Specs <ArrowUpRight size={14} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;