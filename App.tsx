
import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { MOCK_PRODUCTS } from './constants';
import { Product, CartItem, Order, ShippingAddress, User, Gender, Theme, Category } from './types';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import CheckoutView from './components/CheckoutView';
import AIHelpDesk from './components/AIHelpDesk';
import AdminDashboard from './components/AdminDashboard';
import { Sparkles, Command, ArrowRight, ArrowDown, Zap, Trophy, ShoppingBag, Fingerprint, Globe, ShieldCheck, Star, Package, ChevronRight, LayoutDashboard } from 'lucide-react';
import { getSmartSearch, getSmartRecommendations } from './services/geminiService';

// --- AUTH CONTEXT ---
const AuthContext = createContext<any>(null);
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('lux_session_token');
    if (saved) { setUser(JSON.parse(saved)); setIsAuthenticated(true); }
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const login = (u: User) => { setUser(u); setIsAuthenticated(true); localStorage.setItem('lux_session_token', JSON.stringify(u)); };
  const logout = () => { setUser(null); setIsAuthenticated(false); localStorage.removeItem('lux_session_token'); };

  return <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

// --- MAIN APP ---
const LuxoraaApp: React.FC = () => {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [activePage, setActivePage] = useState<string>('home');
  const [filters, setFilters] = useState<{ gender?: Gender; category?: Category; theme?: Theme }>({});
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(MOCK_PRODUCTS);

  useEffect(() => {
    let result = MOCK_PRODUCTS;
    if (filters.gender) result = result.filter(p => p.gender === filters.gender || p.gender === 'Unisex');
    if (filters.category) result = result.filter(p => p.category === filters.category);
    if (filters.theme) result = result.filter(p => p.theme === filters.theme);
    if (searchQuery) result = result.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    setFilteredProducts(result);
  }, [filters, searchQuery]);

  const handleNavigate = (page: string, gender?: string, category?: string, theme?: string) => {
    setActivePage(page);
    setFilters({ gender: gender as Gender, category: category as Category, theme: theme as Theme });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (id: string, size?: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === id && i.selectedSize === size);
      if (existing) return prev.map(i => (i.productId === id && i.selectedSize === size) ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { productId: id, quantity: 1, selectedSize: size }];
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
      <Command size={60} className="text-white animate-pulse mb-8" />
      <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">Initializing Matrix...</h1>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col selection:bg-rose-600/10">
      <Navbar 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        userPoints={user?.points || 0} 
        onNavigate={handleNavigate} 
        onSearch={q => setSearchQuery(q)} 
        userRole={user?.role} 
      />
      
      <main className="flex-1 pt-40">
        {activePage === 'home' && (
          <div className="space-y-48 pb-40">
            {/* TSS STYLE HERO CAROUSEL */}
            <section className="max-w-7xl mx-auto px-6">
              <div className="relative h-[85vh] rounded-[80px] overflow-hidden bg-slate-950 group shadow-3xl">
                <img 
                  src="https://images.unsplash.com/photo-1576871333020-2219d51cca94?auto=format&fit=crop&q=80&w=2000" 
                  className="w-full h-full object-cover opacity-60 transition-transform duration-[20s] group-hover:scale-110"
                  alt="Hero"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-24 text-white">
                  <div className="max-w-5xl space-y-12 animate-reveal">
                    <div className="flex items-center gap-4">
                       <span className="px-8 py-3 bg-rose-600 rounded-full text-[10px] font-black uppercase tracking-[0.5em] shadow-2xl">Official Licensing Partner</span>
                       <div className="w-12 h-[1px] bg-white/20" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Drop 042 / 2025</span>
                    </div>
                    <h2 className="text-[12rem] font-display italic font-black leading-[0.7] tracking-tighter">Wear Your <br/> <span className="opacity-30 font-sans tracking-tight not-italic">Fandom.</span></h2>
                    <div className="flex items-center gap-16">
                       <p className="text-3xl text-white/50 max-w-lg italic font-display leading-relaxed">The ultimate collection of high-density pop culture shards.</p>
                       <button onClick={() => handleNavigate('shop', 'Men', 'Oversized Tees')} className="bg-white text-slate-950 px-20 py-10 rounded-[48px] font-black text-2xl hover:bg-rose-600 hover:text-white transition-all shadow-4xl flex items-center gap-8 group/btn hover:scale-105">
                          Explore Matrix <ArrowRight className="group-hover/btn:translate-x-4 transition-transform" size={28} />
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CATEGORY TILES */}
            <section className="max-w-7xl mx-auto px-6">
               <div className="flex items-end justify-between mb-24">
                  <h3 className="text-8xl font-display italic font-black tracking-tighter uppercase leading-none">Nodes.</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em] pb-2">Synchronize by Category</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div onClick={() => handleNavigate('shop', 'Men')} className="relative h-[600px] rounded-[64px] overflow-hidden group cursor-pointer shadow-2xl">
                     <img src="https://images.unsplash.com/photo-1491336477066-31156b5e4f35?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" />
                     <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-all flex flex-col justify-end p-16 text-white">
                        <h3 className="text-6xl font-display italic font-black tracking-tighter uppercase">Men.</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-60 flex items-center gap-3">Initialize Wardrobe <ArrowRight size={14} /></p>
                     </div>
                  </div>
                  <div onClick={() => handleNavigate('shop', 'Women')} className="relative h-[600px] rounded-[64px] overflow-hidden group cursor-pointer shadow-2xl">
                     <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" />
                     <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-all flex flex-col justify-end p-16 text-white">
                        <h3 className="text-6xl font-display italic font-black tracking-tighter uppercase">Women.</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-60 flex items-center gap-3">Initialize Identity <ArrowRight size={14} /></p>
                     </div>
                  </div>
                  <div onClick={() => handleNavigate('shop', 'Kids')} className="relative h-[600px] rounded-[64px] overflow-hidden group cursor-pointer shadow-2xl">
                     <img src="https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" />
                     <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-all flex flex-col justify-end p-16 text-white">
                        <h3 className="text-6xl font-display italic font-black tracking-tighter uppercase">Kids.</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-60 flex items-center gap-3">Node Entry <ArrowRight size={14} /></p>
                     </div>
                  </div>
               </div>
            </section>

            {/* LICENSING TILES (MARVEL, DC, ETC) */}
            <section className="bg-slate-950 py-48 overflow-hidden">
               <div className="max-w-7xl mx-auto px-6">
                  <div className="flex justify-between items-end mb-24">
                     <div>
                        <h2 className="text-8xl font-display italic font-black text-white tracking-tighter uppercase leading-[0.8] mb-6">Cluster <br/> <span className="text-rose-600">Thematic.</span></h2>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.8em]">Browse Official Licensed Shards</p>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
                     {['Marvel', 'DC Comics', 'Anime', 'Harry Potter'].map(theme => (
                        <div key={theme} onClick={() => handleNavigate('shop', undefined, undefined, theme)} className="bg-white/5 border border-white/10 rounded-[56px] p-12 group hover:bg-white/10 transition-all cursor-pointer shadow-2xl">
                           <div className="w-20 h-20 bg-rose-600 rounded-[28px] flex items-center justify-center text-white mb-10 group-hover:rotate-12 transition-transform">
                              <Star fill="currentColor" size={32} />
                           </div>
                           <h4 className="text-3xl font-black text-white italic tracking-tighter mb-4 uppercase">{theme}</h4>
                           <div className="w-12 h-[2px] bg-rose-600 rounded-full group-hover:w-full transition-all duration-700" />
                           <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.5em] mt-10 flex items-center gap-2 group-hover:text-white transition-all">Explore Merchandise <ChevronRight size={14} /></p>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* BESTSELLERS CAROUSEL */}
            <section className="max-w-7xl mx-auto px-6">
               <div className="flex items-center justify-between mb-24">
                  <div className="flex items-center gap-8">
                     <div className="w-20 h-20 bg-slate-900 rounded-[32px] flex items-center justify-center text-white shadow-xl"><ShoppingBag size={32} /></div>
                     <h2 className="text-8xl font-display italic font-black tracking-tighter uppercase leading-none">Bestsellers.</h2>
                  </div>
                  {user?.isMember && (
                    <div className="bg-amber-400 text-slate-950 px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl animate-reveal">
                      <Trophy size={16} /> Exclusive Member Sync Active
                    </div>
                  )}
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                  {MOCK_PRODUCTS.slice(0, 4).map(p => (
                    <ProductCard 
                      key={p.id} 
                      product={p} 
                      onAddToCart={handleAddToCart} 
                      onViewDetails={id => { setSelectedProductId(id); setActivePage('product'); }} 
                      onToggleWishlist={() => {}}
                      isWishlisted={false}
                    />
                  ))}
               </div>
            </section>

            {/* OFFER BANNERS */}
            <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
               <div className="bg-rose-600 p-20 rounded-[80px] shadow-3xl text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-20 opacity-10 group-hover:scale-125 transition-transform duration-1000"><Zap size={300} /></div>
                  <div className="relative z-10">
                     <span className="text-[10px] font-black uppercase tracking-[1em] opacity-60 mb-8 block">Limited Phase</span>
                     <h3 className="text-7xl font-display italic font-black tracking-tighter leading-none mb-10">BOGO <br/> LIVE.</h3>
                     <p className="text-2xl font-display italic opacity-60 mb-12">On all official Anime shards. Sync 2 for price of 1.</p>
                     <button className="bg-white text-slate-950 px-12 py-5 rounded-[32px] font-black text-sm uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all">Claim Protocol</button>
                  </div>
               </div>
               <div className="bg-indigo-600 p-20 rounded-[80px] shadow-3xl text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-20 opacity-10 group-hover:rotate-12 transition-transform duration-1000"><Trophy size={300} /></div>
                  <div className="relative z-10">
                     <span className="text-[10px] font-black uppercase tracking-[1em] opacity-60 mb-8 block">Member Exclusive</span>
                     <h3 className="text-7xl font-display italic font-black tracking-tighter leading-none mb-10">FLAT <br/> 50% OFF.</h3>
                     <p className="text-2xl font-display italic opacity-60 mb-12">For identity holders with 1000+ credits.</p>
                     <button className="bg-white text-slate-950 px-12 py-5 rounded-[32px] font-black text-sm uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all">Access Matrix</button>
                  </div>
               </div>
            </section>
          </div>
        )}

        {activePage === 'shop' && (
          <div className="max-w-7xl mx-auto px-6 pb-48 animate-reveal">
            <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
               <div>
                  <h1 className="text-[10rem] font-display italic font-black tracking-tighter leading-none mb-6 uppercase text-slate-900">
                    {filters.theme || filters.category || filters.gender || 'Matrix.'}
                  </h1>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[1em] pl-2">Parsing {filteredProducts.length} Neural Matches</p>
               </div>
               <div className="flex gap-4 p-3 bg-white rounded-[32px] border border-slate-100 shadow-xl">
                  <button className="px-8 py-3 bg-slate-950 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest shadow-2xl">Sort: Popular</button>
                  <button className="px-8 py-3 hover:bg-slate-50 text-slate-500 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all">Filters</button>
               </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
               {filteredProducts.map(p => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    onAddToCart={handleAddToCart} 
                    onViewDetails={id => { setSelectedProductId(id); setActivePage('product'); }} 
                    onToggleWishlist={() => {}}
                    isWishlisted={false}
                  />
               ))}
            </div>
          </div>
        )}

        {activePage === 'product' && selectedProductId && (
          <ProductDetail 
            product={MOCK_PRODUCTS.find(p => p.id === selectedProductId)!} 
            onBack={() => setActivePage('home')} 
            onAddToCart={handleAddToCart} 
            onToggleWishlist={() => {}} 
            onViewProduct={setSelectedProductId}
            isWishlisted={false}
          />
        )}
        
        {activePage === 'admin' && user?.role === 'admin' && (
          <div className="max-w-[1600px] mx-auto px-6">
            <AdminDashboard products={MOCK_PRODUCTS} orders={[]} />
          </div>
        )}
      </main>

      <footer className="bg-slate-950 text-white pt-80 pb-32 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-48">
            <div className="md:col-span-2 space-y-20">
              <h2 className="text-[18rem] font-display italic font-black tracking-tighter text-rose-600 leading-[0.5] opacity-90">LUX.</h2>
              <p className="text-5xl text-white/20 font-medium italic font-display leading-tight max-w-xl">A decentralized fandom matrix for the global vanguard.</p>
              <div className="flex gap-8 pt-12">
                 {['Instagram', 'Twitter', 'Node-Net', 'Matrix'].map(social => (
                   <span key={social} className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 hover:text-white cursor-pointer transition-colors">{social}</span>
                 ))}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[1em] text-white/20 mb-16">Nodes</h4>
              <ul className="space-y-10 text-[11px] font-black uppercase tracking-[0.4em] text-white/40">
                <li className="hover:text-white cursor-pointer transition-all" onClick={() => handleNavigate('shop', 'Men')}>Men's Shard</li>
                <li className="hover:text-white cursor-pointer transition-all" onClick={() => handleNavigate('shop', 'Women')}>Women's Shard</li>
                <li className="hover:text-white cursor-pointer transition-all" onClick={() => handleNavigate('shop', 'Kids')}>Kids' Cluster</li>
                <li className="hover:text-white cursor-pointer transition-all">Mobile Matrix</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[1em] text-white/20 mb-16">Distribution</h4>
              <ul className="space-y-10 text-[11px] font-black uppercase tracking-[0.4em] text-white/40">
                <li className="hover:text-white cursor-pointer transition-all">Tracking Ledger</li>
                <li className="hover:text-white cursor-pointer transition-all">Privacy protocol</li>
                <li className="hover:text-white cursor-pointer transition-all">Identity Core</li>
                <li className="hover:text-white cursor-pointer transition-all">Node Directory</li>
              </ul>
            </div>
          </div>
          <div className="mt-80 pt-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black uppercase tracking-[1.5em] text-white/10">
             <span>&copy; 2025 LUXORAA GLOBAL SYSTEMS • IDENTITY SYNC'D</span>
             <div className="flex items-center gap-12">
                <div className="flex items-center gap-4"><Globe size={14} /> RSA-4096</div>
                <div className="flex items-center gap-4"><ShieldCheck size={14} /> DECENTRALIZED</div>
             </div>
          </div>
        </div>
        {/* Abstract shapes for footer aesthetic */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rose-600/5 rounded-full blur-[180px] -translate-y-1/2 translate-x-1/2" />
      </footer>

      {activePage !== 'admin' && <AIHelpDesk />}
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <LuxoraaApp />
  </AuthProvider>
);

export default App;
