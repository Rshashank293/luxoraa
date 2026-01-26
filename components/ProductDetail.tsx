import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, Heart, ChevronLeft, CheckCircle, X, Sparkles, Zap, Package, Info, ArrowUpRight } from 'lucide-react';
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

  const handleAddToCart = () => {
    setIsAdding(true);
    onAddToCart(product.id, selectedSize, selectedColor);
    setTimeout(() => {
      setIsAdding(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative animate-in">
      {/* Toast Notification */}
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] transition-all duration-700 transform ${
        showToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      }`}>
        <div className="glass-dark text-white px-8 py-5 rounded-[32px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] flex items-center gap-6 min-w-[380px] border border-white/10">
          <div className="bg-emerald-500 p-2.5 rounded-full shadow-lg">
            <CheckCircle size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-black text-sm uppercase tracking-widest">Added to Bag</p>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{product.title} • {selectedSize}</p>
          </div>
          <button onClick={() => setShowToast(false)} className="text-white/20 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      <button 
        onClick={onBack}
        className="flex items-center gap-3 text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em] mb-16 transition-all group"
      >
        <div className="p-2 rounded-full border border-slate-200 group-hover:border-indigo-600 transition-colors">
          <ChevronLeft size={16} />
        </div>
        Collection Discovery
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start mb-40">
        {/* Gallery Section */}
        <div className="space-y-8 sticky top-32">
          <div className="aspect-[4/5] rounded-[64px] overflow-hidden bg-white border border-slate-100 shadow-3xl group">
            <img src={mainImage} alt={product.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2s]" />
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
            {product.images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setMainImage(img)} 
                className={`flex-shrink-0 w-28 h-28 rounded-3xl overflow-hidden border-[3px] transition-all transform ${
                  mainImage === img 
                  ? 'border-indigo-600 scale-95 shadow-2xl' 
                  : 'border-transparent opacity-40 hover:opacity-100'
                }`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col pt-10">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.5em]">{product.category}</span>
              <div className="w-1 h-1 bg-slate-200 rounded-full" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Identity 0x{product.id}</span>
            </div>
            <h1 className="text-7xl font-display italic font-black text-slate-900 mb-8 leading-tight">{product.title}</h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">{product.rating} / 5.0 Global Rating</span>
            </div>
          </div>

          <div className="mb-12 border-b border-slate-100 pb-12">
            <p className="text-6xl font-black text-slate-900 mb-10 tracking-tighter">${product.price.toFixed(2)}</p>
            <p className="text-xl text-slate-500 leading-relaxed font-medium italic font-display">
              "{product.description}"
            </p>
          </div>

          <div className="space-y-12 mb-16">
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Select Variant</h4>
                  <button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1 border-b border-indigo-600/20">Sizing Intelligence <Info size={10} /></button>
                </div>
                <div className="flex flex-wrap gap-4">
                  {product.sizes.map(size => (
                    <button 
                      key={size} 
                      onClick={() => setSelectedSize(size)} 
                      className={`min-w-[70px] h-16 flex items-center justify-center rounded-[20px] font-black text-sm transition-all border-2 ${
                        selectedSize === size 
                        ? 'border-slate-950 bg-slate-950 text-white shadow-2xl scale-105' 
                        : 'border-slate-100 text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <button 
              onClick={handleAddToCart} 
              disabled={isAdding} 
              className={`flex-1 w-full text-white py-7 rounded-[32px] font-black text-xl flex items-center justify-center gap-4 transition-all shadow-3xl transform active:scale-95 ${
                isAdding ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isAdding ? (
                <div className="w-8 h-8 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><ShoppingCart size={28} /> Confirm for Bag</>
              )}
            </button>
            <button 
              onClick={() => onToggleWishlist(product.id)} 
              className={`p-7 rounded-[32px] border-2 transition-all transform active:scale-90 ${
                isWishlisted 
                ? 'bg-rose-600 text-white border-rose-600 shadow-2xl shadow-rose-600/20' 
                : 'bg-white border-slate-100 text-slate-300 hover:border-rose-100 hover:text-rose-500 shadow-xl'
              }`}
            >
              <Heart size={28} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 pt-10 border-t border-slate-100">
             <div className="flex items-center gap-4">
               <div className="p-3 bg-slate-50 text-slate-900 rounded-2xl"><Zap size={20} /></div>
               <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Priority Delivery</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Within 48h</p>
               </div>
             </div>
             <div className="flex items-center gap-4">
               <div className="p-3 bg-slate-50 text-slate-900 rounded-2xl"><Package size={20} /></div>
               <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Neural Sourcing</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Eco-Certified</p>
               </div>
             </div>
          </div>
        </div>
      </div>

      {aiRecommendations.length > 0 && (
        <section className="mt-40 pt-24 border-t border-slate-100">
          <div className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-indigo-600/5 text-indigo-600 rounded-[32px] border border-indigo-600/10"><Sparkles size={32} /></div>
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Complete the Aesthetic</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.5em]">AI Curated Pairings for this drop</p>
              </div>
            </div>
            <button className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 hover:text-slate-950 transition-colors flex items-center gap-2">Explore Lookbook <ArrowUpRight size={14} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {aiRecommendations.map(p => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onAddToCart={(id) => onAddToCart(id)} 
                onViewDetails={onViewProduct} 
                onToggleWishlist={onToggleWishlist} 
                isWishlisted={false} 
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;