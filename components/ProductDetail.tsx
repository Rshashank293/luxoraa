import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, Heart, ChevronLeft, CheckCircle, X, Sparkles } from 'lucide-react';
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
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
        <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px] border border-slate-800">
          <div className="bg-green-500 p-1.5 rounded-full">
            <CheckCircle size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">Added to bag</p>
            <p className="text-slate-400 text-xs">{product.title} • {selectedSize}</p>
          </div>
          <button onClick={() => setShowToast(false)} className="text-slate-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-8 transition-colors group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Collection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <div className="space-y-4">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm">
            <img src={mainImage} alt={product.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-4">
            {product.images.map((img, idx) => (
              <button key={idx} onClick={() => setMainImage(img)} className={`w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${mainImage === img ? 'border-indigo-600 scale-95' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-6">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2 block">{product.category}</span>
            <h1 className="text-4xl font-black text-slate-900 mb-4">{product.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />)}
              </div>
              <span className="text-slate-400 font-medium">{product.rating} ({product.reviewsCount} reviews)</span>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-3xl font-black text-slate-900 mb-4">${product.price.toFixed(2)}</p>
            <p className="text-slate-600 leading-relaxed text-lg">{product.description}</p>
          </div>

          <div className="space-y-8 mb-10">
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-wider">Select Size</h4>
                <div className="flex gap-3">
                  {product.sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)} className={`w-14 h-14 flex items-center justify-center rounded-xl font-bold border-2 transition-all ${selectedSize === size ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-600 hover:border-slate-400'}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 mb-12">
            <button onClick={handleAddToCart} disabled={isAdding} className={`flex-1 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl ${isAdding ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {isAdding ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><ShoppingCart size={24} /> Add to Bag</>}
            </button>
            <button onClick={() => onToggleWishlist(product.id)} className={`p-5 rounded-2xl border-2 transition-all ${isWishlisted ? 'bg-red-50 text-red-500 border-red-500' : 'bg-white border-slate-200 text-slate-400'}`}>
              <Heart size={24} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      {aiRecommendations.length > 0 && (
        <section className="mt-20 border-t border-slate-100 pt-16">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Sparkles size={24} /></div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Complete The Look</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">AI Selected Pairings</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
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