import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_PRODUCTS } from './constants';
import { Product, CartItem, Order, ShippingAddress, User, Seller } from './types';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import CheckoutView from './components/CheckoutView';
import AIHelpDesk from './components/AIHelpDesk';
import AdminDashboard from './components/AdminDashboard';
import SellerDashboard from './components/SellerDashboard';
import LoginPage from './components/LoginPage';
import { 
  Sparkles, Package, ChevronRight, ArrowRight, Zap, Trophy, Clock, Search, ShoppingBag, Heart, Trash2, Plus, Minus, User as UserIcon, ShieldAlert, Settings, LogOut, Store, ArrowDown
} from 'lucide-react';
import { getSmartSearch, getSmartRecommendations } from './services/geminiService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<Product[]>([]);
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const cartWithProducts = useMemo(() => {
    return cart.map(item => ({
      ...item,
      product: MOCK_PRODUCTS.find(p => p.id === item.productId)!
    }));
  }, [cart]);

  const cartTotal = cartWithProducts.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'customer') {
      const fetchAI = async () => {
        const recs = await getSmartRecommendations("luxury urban style, high-end lifestyle, global vanguard", MOCK_PRODUCTS);
        setAiRecommendations(recs);
      };
      fetchAI();
    }
  }, [isAuthenticated, user?.role]);

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
    setIsAuthenticated(true);
    if (loggedUser.role === 'admin') setActivePage('admin');
    else if (loggedUser.role === 'seller') setActivePage('seller');
    else setActivePage('home');
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCart([]);
    setWishlist([]);
    setActivePage('home');
  };

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

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const placeOrder = (address: ShippingAddress, paymentMethod: string, fraudScore: number) => {
    const earnedPoints = Math.floor(cartTotal * 0.1);
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: user?.id || 'guest',
      items: [...cart],
      totalAmount: cartTotal,
      status: 'Placed',
      date: new Date().toISOString(),
      trackingNumber: `LX-${Math.floor(Math.random() * 1000000)}`,
      paymentMethod,
      shippingAddress: address,
      fraudScore: fraudScore
    };
    setOrders([newOrder, ...orders]);
    if (user) setUser(prev => prev ? ({ ...prev, points: prev.points + earnedPoints }) : null);
    setCart([]);
    setActivePage('orders');
    window.scrollTo(0, 0);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        userPoints={user?.points || 0} 
        onNavigate={setActivePage} 
        onSearch={handleSearch} 
        userRole={user?.role}
      />
      
      <main className="pt-32 max-w-7xl mx-auto px-6">
        {activePage === 'admin' && user?.role === 'admin' && (
          <AdminDashboard products={MOCK_PRODUCTS} orders={orders} />
        )}
        
        {activePage === 'seller' && user?.role === 'seller' && (
          <SellerDashboard seller={{ id: 's-1', name: 'Rivera Designs', rating: 4.8, joinedDate: '2024', isVerified: true, commissionRate: 0.1, totalSales: 4500, balance: 1250 }} products={MOCK_PRODUCTS} orders={orders} />
        )}

        {(user?.role === 'customer' || (activePage !== 'admin' && activePage !== 'seller')) && (
          <div className="animate-in">
            {activePage === 'home' && (
              <div className="pb-24 space-y-32">
                {/* Hero Redesign */}
                <section className="relative h-[650px] rounded-[64px] overflow-hidden shadow-[0_60px_100px_-20px_rgba(0,0,0,0.15)] group">
                  <img 
                    src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?auto=format&fit=crop&q=80&w=2000" 
                    className="w-full h-full object-cover transition-transform duration-[6s] group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/30 to-transparent flex items-center px-12 sm:px-24">
                    <div className="max-w-4xl space-y-10">
                       <div className="flex gap-4">
                         <span className="glass border border-white/20 text-indigo-700 text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.4em] shadow-xl">Spring/Summer 2025</span>
                         <span className="bg-indigo-600 text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.4em] shadow-xl">Pre-Order Now</span>
                       </div>
                       <h2 className="text-9xl font-display italic text-white leading-none tracking-tighter">The Art of <br/> <span className="opacity-40 font-sans tracking-tight not-italic">Refinement.</span></h2>
                       <p className="text-xl text-white/70 max-w-lg leading-relaxed font-medium">Global curation powered by neural intelligence. Redefining high-fidelity commerce for the elite vanguard.</p>
                       <div className="flex gap-6 items-center">
                         <button onClick={() => window.scrollTo({ top: 850, behavior: 'smooth' })} className="bg-white text-black px-12 py-5 rounded-[28px] font-black text-lg hover:bg-indigo-600 hover:text-white transition-all shadow-3xl flex items-center gap-4 group/btn">
                           Shop Collection <ArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
                         </button>
                         <button className="text-white font-black uppercase text-[10px] tracking-widest flex items-center gap-2 group/scroll">
                            Scroll Down <ArrowDown size={14} className="group-hover/scroll:translate-y-1 transition-transform" />
                         </button>
                       </div>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-24">
                  <aside className="space-y-20">
                    <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-3xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-10 opacity-5 text-indigo-600 group-hover:scale-110 transition-transform"><Trophy size={120} /></div>
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-10">Elite Identity</h4>
                       <p className="text-4xl font-display italic font-black text-slate-900 mb-2">{user?.tier}</p>
                       <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden mb-6"><div className="h-full bg-indigo-600 rounded-full" style={{ width: '65%' }} /></div>
                       <div className="flex items-center gap-2">
                         <div className="p-1 bg-amber-400 rounded-full"><Zap size={10} fill="currentColor" /></div>
                         <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">350 pts to Platinum rank</p>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-10 px-4">Market Nodes</h4>
                       <div className="grid grid-cols-1 gap-4">
                         {['All', 'Clothes', 'Shoes', 'Toys', 'Accessories'].map(cat => (
                           <button 
                             key={cat} 
                             onClick={() => setSelectedCategory(cat)} 
                             className={`flex items-center justify-between w-full px-10 py-5 rounded-[28px] text-sm font-black transition-all ${
                               selectedCategory === cat 
                               ? 'bg-slate-950 text-white shadow-3xl scale-[1.05] z-10' 
                               : 'text-slate-400 hover:bg-white hover:text-slate-950 hover:shadow-xl'
                             }`}
                           >
                             {cat} <ChevronRight size={16} />
                           </button>
                         ))}
                       </div>
                    </div>
                  </aside>

                  <div className="lg:col-span-3 space-y-32">
                    {!searchQuery && selectedCategory === 'All' && aiRecommendations.length > 0 && (
                      <section className="animate-in">
                         <div className="flex items-center justify-between mb-16">
                           <div className="flex items-center gap-5">
                             <div className="p-5 bg-indigo-600/5 text-indigo-600 rounded-[32px] border border-indigo-600/10 shadow-xl shadow-indigo-600/5"><Sparkles size={32} /></div>
                             <div>
                               <h2 className="text-4xl font-black tracking-tighter text-slate-900">Neural Selection</h2>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Optimized for your aesthetic</p>
                             </div>
                           </div>
                           <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-slate-950 transition-colors flex items-center gap-2">
                             Refresh AI Agent <Zap size={14} />
                           </button>
                         </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                           {aiRecommendations.map(p => (
                             <ProductCard 
                               key={`ai-${p.id}`} 
                               product={p} 
                               onAddToCart={handleAddToCart} 
                               onViewDetails={(id) => { setSelectedProductId(id); setActivePage('product'); }} 
                               onToggleWishlist={toggleWishlist} 
                               isWishlisted={wishlist.includes(p.id)} 
                             />
                           ))}
                         </div>
                      </section>
                    )}

                    <section>
                       <div className="flex items-center gap-5 mb-20">
                         <div className="p-5 bg-slate-100 text-slate-950 rounded-[32px] shadow-xl"><Search size={32} /></div>
                         <div>
                           <h2 className="text-5xl font-black tracking-tighter text-slate-900">
                             {searchQuery ? `"${searchQuery}"` : 'Market Catalog'}
                           </h2>
                           <p className="text-sm text-slate-400 font-medium tracking-wide">
                             {filteredProducts.length} premium artifacts discovered
                           </p>
                         </div>
                       </div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
                         {filteredProducts
                           .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
                           .map(p => (
                             <ProductCard 
                               key={p.id} 
                               product={p} 
                               onAddToCart={handleAddToCart} 
                               onViewDetails={(id) => { setSelectedProductId(id); setActivePage('product'); }} 
                               onToggleWishlist={toggleWishlist} 
                               isWishlisted={wishlist.includes(p.id)} 
                             />
                           ))}
                       </div>
                    </section>
                  </div>
                </div>
              </div>
            )}
            
            {/* Cart, Profile, etc. pages are wrapped in the same grid/spacing as above for a unified feel */}
            {activePage === 'cart' && (
              <div className="max-w-5xl mx-auto py-12 px-4 animate-in">
                <div className="flex items-center gap-8 mb-20">
                  <div className="p-8 bg-indigo-600/5 text-indigo-600 rounded-[40px] shadow-2xl border border-indigo-600/10"><ShoppingBag size={48} /></div>
                  <div><h1 className="text-6xl font-black text-slate-900 tracking-tighter">Shopping Bag</h1><p className="text-slate-400 font-black uppercase tracking-[0.5em] text-xs">{cart.length} Identity Artifacts Selected</p></div>
                </div>
                {cart.length === 0 ? (
                  <div className="bg-white border-2 border-dashed border-slate-200 rounded-[80px] p-40 text-center shadow-3xl">
                    <p className="text-3xl font-black text-slate-300 mb-10 uppercase tracking-[0.3em]">Selection is Empty</p>
                    <button onClick={() => setActivePage('home')} className="bg-slate-950 text-white px-16 py-6 rounded-[32px] font-black uppercase text-sm tracking-[0.4em] hover:bg-indigo-600 transition-all shadow-3xl">Begin Discovery</button>
                  </div>
                ) : (
                  <div className="space-y-12">
                    {cartWithProducts.map((item, idx) => (
                      <div key={idx} className="bg-white border border-slate-100 rounded-[48px] p-10 flex items-center gap-12 shadow-sm hover:shadow-2xl transition-all group">
                        <img src={item.product.images[0]} className="w-48 h-48 object-cover rounded-[32px] shadow-2xl group-hover:scale-105 transition-transform duration-700" />
                        <div className="flex-1">
                          <h4 className="text-2xl font-black text-slate-900 mb-2">{item.product.title}</h4>
                          <p className="text-sm font-black text-indigo-600 uppercase tracking-[0.4em] mb-6">${item.product.price.toFixed(2)}</p>
                          <div className="flex items-center gap-8 bg-slate-50 w-fit p-3 rounded-[24px] border border-slate-100">
                             <button onClick={() => updateCartQuantity(item.productId, -1)} className="p-3 hover:bg-white rounded-xl transition-all shadow-sm"><Minus size={18} /></button>
                             <span className="font-black text-xl w-10 text-center">{item.quantity}</span>
                             <button onClick={() => updateCartQuantity(item.productId, 1)} className="p-3 hover:bg-white rounded-xl transition-all shadow-sm"><Plus size={18} /></button>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.productId)} className="text-slate-200 hover:text-rose-500 p-6 transition-colors group/trash"><Trash2 size={32} className="group-hover/trash:scale-110 transition-transform" /></button>
                      </div>
                    ))}
                    <div className="mt-24 bg-slate-950 text-white p-16 rounded-[80px] flex justify-between items-center shadow-[0_60px_100px_-20px_rgba(2,6,23,0.4)]">
                      <div><p className="text-slate-500 font-black uppercase tracking-[0.6em] text-[10px] mb-6">Total Payout Projection</p><h3 className="text-8xl font-black tracking-tighter">${cartTotal.toFixed(2)}</h3></div>
                      <button onClick={() => setActivePage('checkout')} className="bg-white text-slate-950 px-20 py-8 rounded-[40px] font-black text-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-2xl transform hover:scale-105 active:scale-95">Initiate Checkout</button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activePage === 'profile' && (
              <div className="max-w-5xl mx-auto py-12 animate-in">
                <div className="bg-white rounded-[80px] p-20 shadow-3xl border border-white flex flex-col md:flex-row items-center gap-20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-24 opacity-5 text-indigo-600 group-hover:rotate-12 transition-transform duration-1000"><Sparkles size={300} /></div>
                  <div className="w-72 h-72 rounded-[64px] bg-slate-950 flex items-center justify-center text-white relative shadow-[0_40px_80px_-20px_rgba(2,6,23,0.3)]">
                    <UserIcon size={140} strokeWidth={1} />
                    <div className="absolute -bottom-8 -right-8 bg-amber-400 text-slate-950 p-8 rounded-[40px] shadow-3xl border-[10px] border-white"><Trophy size={48} /></div>
                  </div>
                  <div className="flex-1 text-center md:text-left relative z-10">
                    <div className="flex items-center gap-6 justify-center md:justify-start mb-6">
                      <h1 className="text-7xl font-black text-slate-900 tracking-tighter">{user?.name}</h1>
                      <span className="bg-indigo-600 text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-xl">Rank: {user?.tier}</span>
                    </div>
                    <p className="text-2xl text-slate-400 font-medium mb-16 uppercase tracking-[0.4em]">{user?.email}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                      <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em] mb-6">Available Credits</p><p className="text-6xl font-black text-indigo-600 tracking-tighter">{user?.points}</p></div>
                      <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em] mb-6">Identity Wallet</p><p className="text-6xl font-black text-slate-950 tracking-tighter">${user?.walletBalance.toFixed(2)}</p></div>
                    </div>
                  </div>
                </div>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                   <button onClick={() => setActivePage('orders')} className="bg-white p-10 rounded-[48px] border border-slate-100 flex justify-between items-center group hover:bg-slate-950 hover:text-white transition-all shadow-lg hover:shadow-2xl">
                     <div className="flex items-center gap-8">
                       <div className="p-5 bg-indigo-50 text-indigo-600 rounded-[28px] group-hover:bg-white/10 group-hover:text-white transition-colors"><Clock size={32} /></div>
                       <span className="text-2xl font-black tracking-tight">Access Logbook</span>
                     </div>
                     <ChevronRight className="group-hover:translate-x-3 transition-transform" size={32} />
                   </button>
                   <button onClick={handleLogout} className="bg-rose-50 p-10 rounded-[48px] border border-rose-100 flex justify-between items-center group hover:bg-rose-600 hover:text-white transition-all shadow-lg hover:shadow-2xl">
                     <div className="flex items-center gap-8">
                       <div className="p-5 bg-white rounded-[28px] text-rose-600 group-hover:bg-white/20 group-hover:text-white transition-colors"><LogOut size={32} /></div>
                       <span className="text-2xl font-black tracking-tight text-rose-600 group-hover:text-white">Close Session</span>
                     </div>
                     <ChevronRight className="group-hover:translate-x-3 transition-transform" size={32} />
                   </button>
                </div>
              </div>
            )}
            
            {activePage === 'wishlist' && <div className="py-12"><div className="flex items-center gap-8 mb-20"><div className="p-8 bg-rose-50 text-rose-500 rounded-[40px] shadow-2xl"><Heart size={48} fill="currentColor" /></div><h1 className="text-6xl font-black tracking-tighter">Curated Desires</h1></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">{MOCK_PRODUCTS.filter(p => wishlist.includes(p.id)).map(p => (<ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onViewDetails={(id) => { setSelectedProductId(id); setActivePage('product'); }} onToggleWishlist={toggleWishlist} isWishlisted={true} />))}</div></div>}
            {activePage === 'product' && selectedProductId && (<ProductDetail product={MOCK_PRODUCTS.find(p => p.id === selectedProductId)!} isWishlisted={wishlist.includes(selectedProductId)} onAddToCart={handleAddToCart} onBack={() => setActivePage('home')} onToggleWishlist={toggleWishlist} onViewProduct={setSelectedProductId} />)}
            {activePage === 'checkout' && <CheckoutView total={cartTotal} items={cartWithProducts} onBack={() => setActivePage('home')} onPlaceOrder={placeOrder} />}
            {activePage === 'orders' && <div className="py-12 max-w-5xl mx-auto"><div className="flex items-center gap-8 mb-20"><div className="p-8 bg-indigo-600/5 text-indigo-600 rounded-[40px] shadow-2xl border border-indigo-600/10"><Package size={48} /></div><h1 className="text-6xl font-black tracking-tighter">Archive History</h1></div><div className="space-y-10">{orders.map(o => (<div key={o.id} className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-xl hover:shadow-2xl transition-all flex justify-between items-center"><div><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-3">Serial ID: {o.id}</p><p className="font-black text-2xl text-slate-900">{new Date(o.date).toLocaleDateString()}</p></div><div className="bg-emerald-100 text-emerald-700 px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-sm">{o.status}</div><div className="text-right"><p className="text-4xl font-black text-indigo-600 tracking-tighter">${o.totalAmount.toFixed(2)}</p></div></div>))}</div></div>}
          </div>
        )}
      </main>
      
      {user?.role === 'customer' && <AIHelpDesk />}
      
      <footer className="bg-slate-950 text-white pt-64 pb-20 mt-64 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-32">
          <div className="md:col-span-2 space-y-16">
            <h2 className="text-8xl font-black italic tracking-tighter text-indigo-600 leading-none">LUXORAA</h2>
            <p className="text-3xl text-white/40 max-w-xl font-medium leading-relaxed italic font-display">
              Neural curation for the modern global vanguard. Re-defining high-fidelity commerce at every scale.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 mb-12">Architecture</h4>
            <ul className="space-y-8 text-sm font-black uppercase tracking-widest text-white/60">
              <li className="hover:text-white cursor-pointer transition-all flex items-center gap-2" onClick={() => setActivePage('home')}><ChevronRight size={14} className="text-indigo-600" /> Marketplace Nodes</li>
              <li className="hover:text-white cursor-pointer transition-all flex items-center gap-2" onClick={() => setActivePage('profile')}><ChevronRight size={14} className="text-indigo-600" /> Identity Management</li>
              <li className="hover:text-rose-500 cursor-pointer transition-all flex items-center gap-2" onClick={handleLogout}><ChevronRight size={14} className="text-rose-600" /> Terminate Session</li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 mb-12">Supply Chain</h4>
            <ul className="space-y-8 text-sm font-black uppercase tracking-widest text-white/60">
              <li className="hover:text-emerald-500 cursor-pointer flex items-center gap-4 transition-all" onClick={() => setActivePage('seller')}><Store size={16} /> Merchant Terminal</li>
              <li className="hover:text-rose-500 cursor-pointer flex items-center gap-4 transition-all" onClick={() => setActivePage('admin')}><ShieldAlert size={16} /> Ops Command</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-64 pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-8 text-[9px] font-black uppercase tracking-[0.8em] text-white/10">
           <span>&copy; 2025 LUXORAA GLOBAL PROTOCOL</span>
           <div className="flex gap-10">
             <span className="hover:text-white/40 cursor-pointer">Privacy System</span>
             <span className="hover:text-white/40 cursor-pointer">Legal Terms</span>
           </div>
           <span>0xNeural Node: Active</span>
        </div>
      </footer>
    </div>
  );
};

export default App;