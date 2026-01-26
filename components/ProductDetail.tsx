
import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, Heart, ChevronLeft, CheckCircle, X, Sparkles, Zap, Package, Info, ArrowUpRight, Trophy, Ruler } from 'lucide-react';
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
        Return to Shop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        <div className="space-y-8 sticky top-32">
          <div className="aspect-[4/5] rounded-[64px] overflow-hidden bg-white border border-slate-100 shadow-3xl group relative">
             <img src={mainImage} alt={product.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2s]" />
             {product.theme !== 'None' && (
                <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-2xl border border-white/20">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Official {product.theme} Shard</p>
                </div>
             )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setMainImage(img)} className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${mainImage === img ? 'border-rose-600 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col pt-10">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.5em]">{product.category}</span>
              {product.collection && product.collection.length > 0 && (
                <>
                  <div className="w-1 h-1 bg-slate-200 rounded-full" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">{product.collection[0]}</span>
                </>
              )}
            </div>
            <h1 className="text-7xl font-display italic font-black text-slate-900 mb-8 leading-tight tracking-tighter">{product.title}</h1>
            <div className="flex items-center gap-6 mb-8">
               <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'fill-rose-500 text-rose-500' : 'text-slate-200'} />)}
               </div>
               <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{product.reviewsCount} Reviews</span>
            </div>
          </div>

          <div className="mb-12 border-b border-slate-100 pb-12">
            <div className="flex items-end gap-8 mb-4">
              <p className="text-6xl font-black text-slate-900 tracking-tighter">₹{product.price}</p>
              {product.membershipPrice && (
                <div className="flex flex-col mb-1 p-4 bg-amber-50 rounded-3xl border border-amber-100">
                  <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2"><Trophy size={12} /> Membership Price</span>
                  <span className="text-3xl font-black text-amber-500 tracking-tighter">₹{product.membershipPrice}</span>
                </div>
              )}
            </div>
            <p className="text-xl text-slate-500 font-medium italic font-display leading-relaxed">"{product.description}"</p>
          </div>

          <div className="space-y-12 mb-16">
            {product.sizes && (
              <div>
                <div className="flex justify-between items-center mb-6">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Select Size</h4>
                   <button className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-2 hover:underline"><Ruler size={14} /> Size Chart</button>
                </div>
                <div className="flex flex-wrap gap-4">
                  {product.sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)} className={`min-w-[75px] h-18 flex items-center justify-center rounded-[24px] font-black text-sm transition-all border-2 ${selectedSize === size ? 'border-slate-950 bg-slate-950 text-white shadow-2xl scale-105' : 'border-slate-100 text-slate-400 hover:border-slate-300'}`}>{size}</button>
                  ))}
                </div>
              </div>
            )}
            
            {product.colors && (
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-6">Available Shards</h4>
                <div className="flex gap-4">
                   {product.colors.map(color => (
                     <button key={color} onClick={() => setSelectedColor(color)} className={`w-12 h-12 rounded-full border-4 transition-all ${selectedColor === color ? 'border-rose-600 scale-125' : 'border-transparent shadow-inner'}`} style={{ backgroundColor: color.toLowerCase() }} title={color} />
                   ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-6 mb-16">
            <button onClick={() => onAddToCart(product.id, selectedSize)} className="flex-1 bg-rose-600 text-white py-7 rounded-[32px] font-black text-xl flex items-center justify-center gap-4 hover:bg-rose-700 transition-all shadow-3xl hover:scale-[1.02] active:scale-95">
              <ShoppingCart size={28} /> Add to Bag
            </button>
            <button onClick={() => onToggleWishlist(product.id)} className={`w-24 h-24 rounded-[32px] flex items-center justify-center border-2 transition-all ${isWishlisted ? 'bg-rose-50 border-rose-600 text-rose-600 shadow-xl' : 'border-slate-100 text-slate-300 hover:border-slate-300'}`}>
              <Heart size={32} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Additional Info Tabs */}
          <div className="space-y-6">
             <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 group cursor-pointer hover:bg-white transition-all">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-4 text-slate-900"><Info size={20} /><span className="font-black text-xs uppercase tracking-widest">Product Intelligence</span></div>
                   <ArrowUpRight size={20} className="text-slate-300 group-hover:text-rose-600" />
                </div>
                <div className="mt-6 space-y-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                   <p>• 100% Bio-Washed Cotton Shard</p>
                   <p>• High-Density Print Resilience</p>
                   <p>• Sustainable Fabrication Matrix</p>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* Recommendations */}
      {aiRecommendations.length > 0 && (
        <section className="mt-48 pt-24 border-t border-slate-100">
           <div className="flex items-center gap-6 mb-20">
              <Sparkles className="text-amber-500" />
              <h2 className="text-6xl font-display italic font-black tracking-tighter uppercase">Complete the <br/> <span className="text-rose-600">Sync Matrix.</span></h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {aiRecommendations.map(p => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  onAddToCart={() => onAddToCart(p.id)} 
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
