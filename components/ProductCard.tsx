import React from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
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
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={product.images[0]} 
          alt={product.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button 
            onClick={() => onToggleWishlist(product.id)}
            className={`p-2 rounded-full shadow-lg transition-all ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white'}`}
          >
            <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
          <button 
            onClick={() => onAddToCart(product.id)}
            className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-indigo-600 transition-colors"
          >
            <ShoppingCart size={18} />
            Quick Add
          </button>
        </div>
      </div>
      
      <div className="p-4" onClick={() => onViewDetails(product.id)}>
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{product.category}</span>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-slate-600">{product.rating}</span>
          </div>
        </div>
        <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1">
          {product.title}
        </h3>
        <p className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;