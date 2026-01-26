
import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, Heart, ChevronLeft, CheckCircle, X, Sparkles, Zap, Package, Info, ArrowUpRight, Trophy } from 'lucide-react';
import { Product } from '../types';
import { getCompleteTheLook } from '../services/geminiService';
import { MOCK_PRODUCTS } from '../constants';
import ProductCard from './ProductCard';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (id: string, size?: string, color?: string) => void;
  onBack: () => void;
  onToggleWishlist: (id: string) => void;
  onViewProduct: (id: string) => void;
  isWishlisted: boolean;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  onAddToCart, 
  onBack, 
  onToggleWishlist,
  onViewProduct,
  isWishlisted 
}) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [showToast, setShowToast] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<Product[]>([]);

  useEffect(() => {
    setMainImage(product.images[0]);
    window.scrollTo(0, 0);
    
    const fetchAI = async () => {
      const recs = await getCompleteTheLook(product, MOCK_PRODUCTS);
      setAiRecommendations(recs);
    };
    fetchAI();
  }, [product.id]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative animate-in">
      <button onClick={onBack} className="flex items-center gap-3 text-slate-400 hover:text-rose-600 font-black text-[10px] uppercase tracking-[0.4em] mb-16 transition-all group">
        <div className="p-2 rounded-full border border-slate-200 group-hover:border-rose-600 transition-colors"><ChevronLeft size={16} /></div>
        Artifact Matrix
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        <div className="space-y-8 sticky top-32">
          <div className="aspect-[4/5] rounded-[64px] overflow-hidden bg-white border border-slate-100 shadow-3xl group">
            <img src={mainImage} alt={product.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2s]" />
          </div>
        </div>

        <div className="flex flex-col pt-10">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.5em]">{product.category}</span>
              {product.collectionName && (
                <>
                  <div className="w-1 h-1 bg-slate-200 rounded-full" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Official {product.collectionName} Shard</span>
                </>
              )}
            </div>
            <h1 className="text-7xl font-display italic font-black text-slate-900 mb-8 leading-tight">{product.title}</h1>
          </div>

          <div className="mb-12 border-b border-slate-100 pb-12">
            <div className="flex items-end gap-8 mb-4">
              <p className="text-6xl font-black text-slate-900 tracking-tighter">₹{product.price}</p>
              {product.membershipPrice && (
                <div className="flex flex-col mb-1">
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2"><Trophy size={12} /> Member Price</span>
                  <span className="text-3xl font-black text-amber-500 tracking-tighter">₹{product.membershipPrice}</span>
                </div>
              )}
            </div>
            <p className="text-xl text-slate-500 font-medium italic font-display">"{product.description}"</p>
          </div>

          <div className="space-y-12 mb-16">
            {product.sizes && (
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-6">Select Shard Size</h4>
                <div className="flex flex-wrap gap-4">
                  {product.sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)} className={`min-w-[70px] h-16 flex items-center justify-center rounded-[20px] font-black text-sm transition-all border-2 ${selectedSize === size ? 'border-slate-950 bg-slate-950 text-white shadow-2xl scale-105' : 'border-slate-100 text-slate-400 hover:border-slate-300'}`}>{size}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button onClick={() => onAddToCart(product.id, selectedSize)} className="w-full bg-rose-600 text-white py-7 rounded-[32px] font-black text-xl flex items-center justify-center gap-4 hover:bg-rose-700 transition-all shadow-3xl">
            <ShoppingCart size={28} /> Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
