
import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { MOCK_PRODUCTS } from './constants';
import { Product, CartItem, Order, ShippingAddress, User, Gender, Theme, Category } from './types';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import CheckoutView from './components/CheckoutView';
import AIHelpDesk from './components/AIHelpDesk';
import AdminDashboard from './components/AdminDashboard';
import { Sparkles, Command, ArrowRight, ArrowDown, Zap, Trophy, ShoppingBag, Fingerprint, Globe, ShieldCheck, Star, Package, ChevronRight, LayoutDashboard, Home, Search, Heart, User as UserIcon } from 'lucide-react';
import { getSmartSearch, getSmartRecommendations } from './services/geminiService';

// --- AUTH CONTEXT ---
const AuthContext = createContext<any>(null);
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('lux_session_token');
    if (saved) { 
      const u = JSON.parse(saved);
      setUser(u); 
      setIsAuthenticated(true); 
    }
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const login = (u: User) => { setUser(u); setIsAuthenticated(true); localStorage.setItem('lux_session_token', JSON.stringify(u)); };
  const logout = () => { setUser(null); setIsAuthenticated(false); localStorage.removeItem('lux_session_token'); };
  const toggleMembership = () => {
    if (user) {
      const updated = { ...user, isMember: !user.isMember };
      setUser(updated);
      localStorage.setItem('lux_session_token', JSON.stringify(updated));
    }
  };

  return <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading, toggleMembership }}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

// --- MAIN APP ---
const LuxoraaApp: React.FC = () => {
  const { user, toggleMembership, loading } = useAuth();
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

  // Removed the "Initializing Matrix..." loading animation block to satisfy user request.

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col selection:bg-rose-600/10">
      <Navbar 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        userPoints={user?.points || 0} 
        onNavigate={handleNavigate} 
        onSearch={q => setSearchQuery(q)} 
        userRole={user?.role} 
        isMember={user?.isMember}
      />
      
      <main className="flex-1 pt-32 sm:pt-40 pb-24 sm:pb-0">
        {activePage === 'home' && (
          <div className="space-y-24 sm:space-y-48 pb-40 px-4 sm:px-0">
            {/* TSS STYLE HERO CAROUSEL */}
            <section className="max-w-[1400px] mx-auto">
              <div className="relative h-[60vh] sm:h-[85vh] rounded-[40px] sm:rounded-[80px] overflow-hidden bg-slate-950 group shadow-3xl">
                <img 
                  src="https://images.unsplash.com/photo-1576871333020-2219d51cca94?auto=format&fit=crop&q=80&w=2000" 
                  className="w-full h-full object-cover opacity-60 transition-transform duration-[20s] group-hover:scale-110"
                  alt="Hero"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-8 sm:p-24 text-white">
                  <div className="max-w-5xl space-y-6 sm:space-y-12 animate-reveal">
                    <div className="flex items-center gap-4">
                       <span className="px-6 py-2 sm:px-8 sm:py-3 bg-rose-600 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl">Elite Drop Live</span>
                       <div className="hidden sm:block w-12 h-[1px] bg-white/20" />
                       <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-white/40">Statue Collection '25</span>
                    </div>
                    <h2 className="text-6xl sm:text-[12rem] font-display italic font-black leading-[0.8] sm:leading-[0.7] tracking-tighter">Beyond <br className="sm:hidden" /> Wearable <br/> <span className="opacity-30 font-sans tracking-tight not-italic">Identity.</span></h2>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-16">
                       <p className="text-xl sm:text-3xl text-white/50 max-w-lg italic font-display leading-relaxed">The ultimate collection of high-density fandom shards.</p>
                       <button onClick={() => handleNavigate('shop')} className="w-full sm:w-auto bg-white text-slate-950 px-12 py-6 sm:px-20 sm:py-10 rounded-full font-black text-xl hover:bg-rose-600 hover:text-white transition-all shadow-4xl flex items-center justify-center gap-6 group/btn">
                          Explore Hub <ArrowRight className="group-hover/btn:translate-x-4 transition-transform" size={28} />
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* QUICK CATEGORY NAV (FOR MOBILE UX) */}
            <section className="sm:hidden grid grid-cols-4 gap-4 px-4">
              {[
                { label: 'Toys', icon: Zap, cat: 'Toys' },
                { label: 'Shoes', icon: ShoppingBag, cat: 'Sneakers' },
                { label: 'Apparel', icon: Command, cat: 'Oversized Tees' },
                { label: 'Acc', icon: Trophy, cat: 'Accessories' }
              ].map(item => (
                <div key={item.label} onClick={() => handleNavigate('shop', undefined, item.cat)} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-white border border-slate-100 rounded-3xl flex items-center justify-center text-slate-900 shadow-sm">
                    <item.icon size={24} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </section>

            {/* TRENDING FOOTWEAR */}
            <section className="max-w-[1400px] mx-auto px-4 sm:px-0">
               <div className="flex items-center justify-between mb-12 sm:mb-24">
                  <div className="flex items-center gap-4 sm:gap-8">
                     <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900 rounded-[28px] sm:rounded-[32px] flex items-center justify-center text-white shadow-xl"><ShoppingBag size={32} /></div>
                     <h2 className="text-4xl sm:text-8xl font-display italic font-black tracking-tighter uppercase leading-none">Elite Footwear.</h2>
                  </div>
                  <button onClick={() => handleNavigate('shop', undefined, 'Sneakers')} className="hidden sm:flex items-center gap-2 text-rose-600 font-black text-[10px] uppercase tracking-widest hover:underline">View All Shards <ChevronRight size={14} /></button>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
                  {MOCK_PRODUCTS.filter(p => p.category === 'Sneakers').slice(0, 4).map(p => (
                    <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onViewDetails={id => { setSelectedProductId(id); setActivePage('product'); }} onToggleWishlist={() => {}} isWishlisted={false} isUserMember={user?.isMember} />
                  ))}
               </div>
            </section>

            {/* LICENSING TILES */}
            <section className="bg-slate-950 py-24 sm:py-48 overflow-hidden rounded-[40px] sm:rounded-none">
               <div className="max-w-7xl mx-auto px-6">
                  <div className="flex justify-between items-end mb-16 sm:mb-24">
                     <div>
                        <h2 className="text-5xl sm:text-8xl font-display italic font-black text-white tracking-tighter uppercase leading-[0.8] mb-6">Cluster <br/> <span className="text-rose-600">Thematic.</span></h2>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.8em]">Browse Official Licensed Shards</p>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
                     {['Marvel', 'DC Comics', 'Anime', 'Harry Potter'].map(theme => (
                        <div key={theme} onClick={() => handleNavigate('shop', undefined, undefined, theme as any)} className="bg-white/5 border border-white/10 rounded-[40px] sm:rounded-[56px] p-8 sm:p-12 group hover:bg-white/10 transition-all cursor-pointer shadow-2xl">
                           <div className="w-16 h-16 sm:w-20 sm:h-20 bg-rose-600 rounded-3xl flex items-center justify-center text-white mb-6 sm:mb-10 group-hover:rotate-12 transition-transform">
                              <Star fill="currentColor" size={32} />
                           </div>
                           <h4 className="text-xl sm:text-3xl font-black text-white italic tracking-tighter mb-4 uppercase">{theme}</h4>
                           <div className="w-8 h-[2px] bg-rose-600 rounded-full group-hover:w-full transition-all duration-700" />
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* TOYS & COLLECTIBLES GRID */}
            <section className="max-w-[1400px] mx-auto px-4 sm:px-0">
               <div className="flex items-center justify-between mb-16 sm:mb-24">
                  <div className="flex items-center gap-4 sm:gap-8">
                     <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl"><Zap size={32} /></div>
                     <h2 className="text-4xl sm:text-8xl font-display italic font-black tracking-tighter uppercase leading-none">Vault Items.</h2>
                  </div>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
                  {MOCK_PRODUCTS.filter(p => ['Toys', 'Action Figures', 'Statues'].includes(p.category)).slice(0, 4).map(p => (
                    <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onViewDetails={id => { setSelectedProductId(id); setActivePage('product'); }} onToggleWishlist={() => {}} isWishlisted={false} isUserMember={user?.isMember} />
                  ))}
               </div>
            </section>
          </div>
        )}

        {activePage === 'membership' && (
          <div className="max-w-5xl mx-auto px-6 py-24 animate-reveal">
            <div className="bg-slate-950 rounded-[64px] p-12 sm:p-24 text-white relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none"><Trophy size={400} /></div>
              <span className="text-rose-600 font-black text-[12px] uppercase tracking-[1em] mb-12 block">Identity Upgrade Protocol</span>
              <h1 className="text-6xl sm:text-[10rem] font-display italic font-black tracking-tighter leading-none mb-12">LUX <br className="sm:hidden" /> ELITE.</h1>
              <p className="text-2xl sm:text-4xl text-white/40 font-medium italic font-display mb-20 max-w-2xl mx-auto leading-relaxed">Unlock the neural tier of fandom access. Exclusive pricing, early shards, and priority sync.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-20 text-left">
                {[
                  { title: 'Elite Pricing', desc: 'Up to 40% reduction on all artifacts.' },
                  { title: 'Early Sync', desc: 'Access drops 24h before standard nodes.' },
                  { title: 'Zero Fee', desc: 'Free express shipping on all matrix moves.' }
                ].map((perk, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[40px] hover:bg-white/10 transition-all">
                    <Trophy className="text-amber-500 mb-6" size={32} />
                    <h4 className="text-xl font-black mb-4 uppercase">{perk.title}</h4>
                    <p className="text-sm text-white/40 leading-relaxed">{perk.desc}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={toggleMembership}
                className={`w-full sm:w-auto px-24 py-10 rounded-full font-black text-2xl uppercase tracking-[0.2em] transition-all shadow-4xl ${user?.isMember ? 'bg-white text-slate-950 hover:bg-rose-600 hover:text-white' : 'bg-rose-600 text-white hover:bg-rose-700'}`}
              >
                {user?.isMember ? 'Terminate Protocol' : 'Initialize Elite (₹999/yr)'}
              </button>
            </div>
          </div>
        )}

        {activePage === 'shop' && (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-12 pb-48 animate-reveal">
            <div className="flex flex-col xl:flex-row justify-between items-end gap-12 mb-24">
               <div>
                  <h1 className="text-6xl sm:text-[10rem] font-display italic font-black tracking-tighter leading-none mb-6 uppercase text-slate-900">
                    {filters.theme || filters.category || filters.gender || 'Matrix.'}
                  </h1>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[1em] pl-2">Parsing {filteredProducts.length} Neural Matches</p>
               </div>
               <div className="flex gap-4 p-3 bg-white rounded-full border border-slate-100 shadow-xl w-full sm:w-auto overflow-x-auto whitespace-nowrap">
                  {['Popular', 'Elite Exclusive', 'Newest', 'Price: Low'].map(opt => (
                    <button key={opt} className="px-8 py-3 bg-slate-50 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all">{opt}</button>
                  ))}
               </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 sm:gap-12">
               {filteredProducts.map(p => (
                  <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onViewDetails={id => { setSelectedProductId(id); setActivePage('product'); }} onToggleWishlist={() => {}} isWishlisted={false} isUserMember={user?.isMember} />
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
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="sm:hidden fixed bottom-6 left-6 right-6 z-[100] h-20 bg-slate-950/90 backdrop-blur-xl rounded-[32px] border border-white/10 flex items-center justify-around px-8 shadow-3xl">
        {[
          { icon: Home, page: 'home' },
          { icon: Search, page: 'shop' },
          { icon: Trophy, page: 'membership' },
          { icon: ShoppingBag, page: 'cart' },
          { icon: UserIcon, page: 'profile' }
        ].map(item => (
          <button 
            key={item.page} 
            onClick={() => handleNavigate(item.page)} 
            className={`p-3 transition-all ${activePage === item.page ? 'text-rose-600 scale-125' : 'text-white/40'}`}
          >
            <item.icon size={24} />
          </button>
        ))}
      </nav>

      <footer className="hidden sm:block bg-slate-950 text-white pt-80 pb-32 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-[18rem] font-display italic font-black tracking-tighter text-rose-600 leading-[0.5] opacity-90 mb-40">LUXORAA.</h2>
          <div className="flex justify-center gap-24 text-[11px] font-black uppercase tracking-[1em] text-white/30">
            <span>© 2025 Global Systems</span>
            <span>RSA-4096 Secure</span>
            <span>Identity Decentralized</span>
          </div>
        </div>
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
