import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_PRODUCTS } from './constants';
import { Product, CartItem, Order, ShippingAddress, User } from './types';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import CheckoutView from './components/CheckoutView';
import AIHelpDesk from './components/AIHelpDesk';
import { 
  Sparkles, Package, ChevronRight, ArrowRight, Zap, Trophy, Clock, Search, ShoppingBag, Heart, Trash2, Plus, Minus, User as UserIcon
} from 'lucide-react';
import { getSmartSearch } from './services/geminiService';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User>({
    id: 'u-1',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    role: 'customer',
    points: 450,
    tier: 'Gold',
    walletBalance: 250.00
  });
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Derive cart data
  const cartWithProducts = useMemo(() => {
    return cart.map(item => ({
      ...item,
      product: MOCK_PRODUCTS.find(p => p.id === item.productId)!
    }));
  }, [cart]);

  const cartTotal = cartWithProducts.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // AI Semantic Search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 2) {
      setIsAiLoading(true);
      const results = await getSmartSearch(query, MOCK_PRODUCTS);
      setFilteredProducts(results);
      setIsAiLoading(false);
    } else {
      setFilteredProducts(MOCK_PRODUCTS);
    }
  };

  const handleAddToCart = (productId: string, size?: string, color?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId && item.selectedSize === size && item.selectedColor === color);
      if (existing) {
        return prev.map(item => (item.productId === productId && item.selectedSize === size && item.selectedColor === color) ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId, quantity: 1, selectedSize: size, selectedColor: color }];
    });
  };

  const updateCartQuantity = (productId: string, delta: number, size?: string, color?: string) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId && item.selectedSize === size && item.selectedColor === color) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    setCart(prev => prev.filter(item => !(item.productId === productId && item.selectedSize === size && item.selectedColor === color)));
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const placeOrder = (address: ShippingAddress, paymentMethod: string, fraudScore: number) => {
    const earnedPoints = Math.floor(cartTotal * 0.1);
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: user.id,
      items: [...cart],
      totalAmount: cartTotal,
      status: 'Placed',
      date: new Date().toISOString(),
      trackingNumber: `LM-${Math.floor(Math.random() * 1000000)}`,
      paymentMethod,
      shippingAddress: address,
      fraudScore: fraudScore
    };
    setOrders([newOrder, ...orders]);
    setUser(prev => ({ ...prev, points: prev.points + earnedPoints }));
    setCart([]);
    setActivePage('orders');
    window.scrollTo(0, 0);
  };

  const renderHome = () => (
    <div className="pb-20">
      <section className="relative h-[400px] sm:h-[500px] rounded-[32px] sm:rounded-[48px] overflow-hidden mt-6 mx-4 sm:mx-0 group bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600" 
          alt="Hero"
          className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center px-6 sm:px-12">
          <div className="max-w-2xl space-y-4 sm:space-y-6">
            <div className="flex gap-3">
              <div className="bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2">
                <Zap size={14} /> Flash Drop
              </div>
              <div className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                Tier: {user.tier} Elite
              </div>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-white leading-tight sm:leading-none">The Future of <br/> <span className="text-indigo-400">Personal Style.</span></h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-md">Experience a new standard of luxury curated by our neural network.</p>
            <div className="flex gap-6 pt-4">
              <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} className="bg-white text-slate-900 px-8 py-3.5 sm:px-10 sm:py-4 rounded-[20px] font-black hover:bg-indigo-500 hover:text-white transition-all shadow-2xl flex items-center gap-3">
                Explore The Drop <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 mt-16 sm:mt-20 grid grid-cols-1 lg:grid-cols-4 gap-12 sm:gap-16">
        <aside className="space-y-12">
          <div className="bg-white p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border border-slate-100 shadow-xl">
             <div className="flex justify-between items-center mb-6">
               <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Tier Status</h4>
               <Trophy size={20} className="text-amber-500" />
             </div>
             <p className="text-2xl font-black text-slate-900 mb-2">{user.tier}</p>
             <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: '65%' }} />
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">350 Points to Platinum</p>
          </div>

          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-2">Marketplace Filters</h4>
            <div className="space-y-2">
              {['All', 'Clothes', 'Shoes', 'Toys', 'Accessories'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center justify-between w-full px-5 py-3 rounded-2xl text-sm font-bold transition-all ${selectedCategory === cat ? 'bg-slate-900 text-white shadow-xl translate-x-1' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  {cat}
                  {selectedCategory === cat && <ChevronRight size={14} />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3 space-y-16">
          <section>
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-100 text-slate-900 rounded-2xl"><Search size={24} /></div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">
                      {searchQuery ? `Search: "${searchQuery}"` : 'Global Marketplace'}
                    </h2>
                    <p className="text-sm text-slate-400 font-medium">{filteredProducts.length} items discovered</p>
                  </div>
                </div>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts
                  .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
                  .map(p => (
                    <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onViewDetails={(id) => { setSelectedProductId(id); setActivePage('product'); }} onToggleWishlist={toggleWishlist} isWishlisted={wishlist.includes(p.id)} />
                ))}
                {filteredProducts.length === 0 && (
                  <div className="col-span-full py-20 text-center">
                    <p className="text-slate-400 font-bold italic">No matches found in the Lumina matrix.</p>
                  </div>
                )}
             </div>
          </section>
        </div>
      </div>
    </div>
  );

  const renderCart = () => (
    <div className="max-w-4xl mx-auto py-12 sm:py-20 px-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-4 bg-indigo-100 text-indigo-600 rounded-3xl">
          <ShoppingBag size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900">Shopping Bag</h1>
          <p className="text-slate-500 font-medium">{cart.length} items ready for dispatch</p>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[40px] p-20 text-center">
          <ShoppingBag size={48} className="mx-auto text-slate-200 mb-6" />
          <p className="text-xl font-bold text-slate-400 mb-6">Your bag is currently empty.</p>
          <button onClick={() => setActivePage('home')} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg">Start Exploring</button>
        </div>
      ) : (
        <div className="space-y-6">
          {cartWithProducts.map((item, idx) => (
            <div key={`${item.productId}-${idx}`} className="bg-white border border-slate-100 rounded-[32px] p-6 flex flex-col sm:flex-row gap-6 items-center shadow-sm">
              <img src={item.product.images[0]} className="w-24 h-24 object-cover rounded-2xl" />
              <div className="flex-1">
                <h4 className="font-black text-slate-900 text-lg">{item.product.title}</h4>
                <p className="text-xs font-bold text-slate-400 uppercase">{item.selectedSize} • {item.selectedColor || 'Standard'}</p>
                <p className="font-black text-indigo-600 mt-1">₹{item.product.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl">
                <button onClick={() => updateCartQuantity(item.productId, -1, item.selectedSize, item.selectedColor)} className="p-2 hover:bg-white rounded-xl transition-colors"><Minus size={16} /></button>
                <span className="font-black w-4 text-center">{item.quantity}</span>
                <button onClick={() => updateCartQuantity(item.productId, 1, item.selectedSize, item.selectedColor)} className="p-2 hover:bg-white rounded-xl transition-colors"><Plus size={16} /></button>
              </div>
              <button onClick={() => removeFromCart(item.productId, item.selectedSize, item.selectedColor)} className="p-3 text-red-400 hover:bg-red-50 rounded-2xl transition-colors">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          <div className="mt-12 bg-slate-900 text-white p-8 rounded-[40px] flex flex-col sm:flex-row justify-between items-center gap-8">
            <div>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-1">Subtotal</p>
              <h3 className="text-4xl font-black">₹{cartTotal.toFixed(2)}</h3>
            </div>
            <button onClick={() => setActivePage('checkout')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-5 rounded-3xl font-black text-lg shadow-2xl transition-all active:scale-95">
              Begin Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderWishlist = () => (
    <div className="max-w-7xl mx-auto py-20 px-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-4 bg-red-50 text-red-500 rounded-3xl">
          <Heart size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900">Your Wishlist</h1>
          <p className="text-slate-500 font-medium">{wishlist.length} curated pieces</p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[40px] p-20 text-center">
          <Heart size={48} className="mx-auto text-slate-200 mb-6" />
          <p className="text-xl font-bold text-slate-400 mb-6">No pieces saved yet.</p>
          <button onClick={() => setActivePage('home')} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black">Continue Browsing</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_PRODUCTS.filter(p => wishlist.includes(p.id)).map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onViewDetails={(id) => { setSelectedProductId(id); setActivePage('product'); }} onToggleWishlist={toggleWishlist} isWishlisted={true} />
          ))}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <div className="bg-white rounded-[48px] p-12 shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-12">
        <div className="w-48 h-48 rounded-[32px] bg-slate-900 flex items-center justify-center text-white relative">
          <UserIcon size={80} strokeWidth={1} />
          <div className="absolute -bottom-4 -right-4 bg-amber-400 text-slate-900 p-4 rounded-3xl shadow-lg border-4 border-white">
            <Trophy size={24} />
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
             <h1 className="text-4xl font-black text-slate-900">{user.name}</h1>
             <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{user.tier} Member</span>
          </div>
          <p className="text-slate-400 font-bold mb-8">{user.email}</p>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lumina Credits</p>
               <p className="text-2xl font-black text-indigo-600">{user.points}</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Orders</p>
               <p className="text-2xl font-black text-slate-900">{orders.length}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 space-y-4">
        <button onClick={() => setActivePage('orders')} className="w-full bg-white p-6 rounded-3xl border border-slate-100 flex justify-between items-center group hover:border-indigo-600 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-2xl text-slate-900"><Clock size={20} /></div>
            <span className="font-bold text-slate-900">Order History</span>
          </div>
          <ChevronRight className="text-slate-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="max-w-4xl mx-auto py-12 sm:py-20 px-4">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-4 bg-indigo-100 text-indigo-600 rounded-[24px] sm:rounded-[28px]">
          <Clock size={32} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Order History</h1>
          <p className="text-slate-500 font-medium">Track and manage your Lumina orders</p>
        </div>
      </div>

      <div className="space-y-8">
        {orders.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[32px] sm:rounded-[40px] p-12 sm:p-20 text-center">
            <Package size={48} className="mx-auto text-slate-300 mb-6" />
            <p className="text-xl font-bold text-slate-900">No orders placed yet</p>
            <button onClick={() => setActivePage('home')} className="mt-4 text-indigo-600 font-black hover:underline uppercase text-xs tracking-widest">Start Shopping</button>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white border border-slate-100 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all">
              <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 pb-8 border-b border-slate-50">
                <div className="flex gap-6 overflow-x-auto pb-2 custom-scrollbar">
                  <div className="flex-shrink-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order #</p>
                    <p className="font-black text-slate-900">{order.id}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Placed On</p>
                    <p className="font-bold text-slate-900">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {order.status}
                    </div>
                  </div>
                </div>
                <div className="md:text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Paid</p>
                  <p className="text-2xl font-black text-indigo-600">₹{(order.totalAmount * 1.08).toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex -space-x-4">
                  {order.items.slice(0, 3).map((item, idx) => {
                    const product = MOCK_PRODUCTS.find(p => p.id === item.productId);
                    return (
                      <div key={idx} className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-slate-100">
                        <img src={product?.images[0]} className="w-full h-full object-cover" alt="" />
                      </div>
                    );
                  })}
                  {order.items.length > 3 && (
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl border-4 border-white shadow-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-black">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <button className="flex items-center gap-2 text-indigo-600 font-black uppercase text-xs tracking-widest hover:translate-x-1 transition-transform">
                  View Order Details <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100">
      <Navbar 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        userPoints={user.points} 
        onNavigate={setActivePage} 
        onSearch={handleSearch} 
      />
      <main className="max-w-7xl mx-auto px-4">
        {activePage === 'home' && renderHome()}
        {activePage === 'cart' && renderCart()}
        {activePage === 'wishlist' && renderWishlist()}
        {activePage === 'profile' && renderProfile()}
        {activePage === 'product' && selectedProductId && (
          <ProductDetail 
            product={MOCK_PRODUCTS.find(p => p.id === selectedProductId)!} 
            isWishlisted={wishlist.includes(selectedProductId)} 
            onAddToCart={handleAddToCart} 
            onBack={() => setActivePage('home')} 
            onToggleWishlist={toggleWishlist} 
            onViewProduct={setSelectedProductId} 
          />
        )}
        {activePage === 'checkout' && <CheckoutView total={cartTotal} items={cartWithProducts} onBack={() => setActivePage('home')} onPlaceOrder={placeOrder} />}
        {activePage === 'orders' && renderOrders()}
      </main>
      <AIHelpDesk />
      <footer className="bg-slate-900 text-white pt-24 sm:pt-32 pb-10 mt-32">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 sm:gap-20">
          <div className="sm:col-span-2">
            <h2 className="text-3xl sm:text-4xl font-black italic tracking-tighter mb-8 text-indigo-400">LUMINA GLOBAL</h2>
            <p className="text-slate-400 max-w-sm leading-relaxed mb-8">Empowering modern consumers with ethical AI curation and premium logistics.</p>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-8">Ecosystem</h4>
            <ul className="space-y-4 text-sm font-bold">
               <li className="hover:text-indigo-400 cursor-pointer" onClick={() => setActivePage('orders')}>My Orders</li>
               <li className="hover:text-indigo-400 cursor-pointer" onClick={() => setActivePage('profile')}>Account</li>
               <li className="hover:text-indigo-400 cursor-pointer">Returns Portal</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-8">Legal</h4>
            <ul className="space-y-4 text-sm font-bold">
               <li className="hover:text-indigo-400 cursor-pointer">Privacy Matrix</li>
               <li className="hover:text-indigo-400 cursor-pointer">Terms of Curation</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;