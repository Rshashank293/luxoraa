
import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
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
  Sparkles, Package, ChevronRight, ChevronLeft, ArrowRight, Zap, Trophy, Clock, 
  Search, ShoppingBag, Heart, Trash2, Plus, Minus, User as UserIcon, 
  ShieldAlert, Settings, LogOut, Store, ArrowDown, ShieldCheck, 
  LayoutDashboard, Bell, Globe, Fingerprint, Activity, Menu, X, Terminal,
  CreditCard, BarChart4, Users, Layers, Command, MousePointer2
} from 'lucide-react';
import { getSmartSearch, getSmartRecommendations } from './services/geminiService';

// --- PRODUCTION AUTH SYSTEM ---
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = () => {
      const savedSession = localStorage.getItem('lux_session_token');
      if (savedSession) {
        try {
          const decoded = JSON.parse(savedSession);
          setUser(decoded);
          setIsAuthenticated(true);
        } catch (e) {
          localStorage.removeItem('lux_session_token');
        }
      }
      setLoading(false);
    };
    setTimeout(verifySession, 2000); // Extended slightly for the new logo animation to shine
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('lux_session_token', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('lux_session_token');
    window.location.hash = ''; 
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// --- GLOBAL NOTIFICATION SYSTEM ---
const Toaster: React.FC<{ message: string | null; type: 'success' | 'error' | 'info'; onClose: () => void }> = ({ message, type, onClose }) => {
  if (!message) return null;
  const colors = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    info: 'bg-indigo-600 text-white'
  };
  return (
    <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-[300] px-8 py-5 rounded-[32px] shadow-2xl flex items-center gap-6 animate-reveal ${colors[type]}`}>
      <p className="font-black text-xs uppercase tracking-[0.2em]">{message}</p>
      <button onClick={onClose} className="opacity-40 hover:opacity-100"><X size={16} /></button>
    </div>
  );
};

// --- MAIN APPLICATION NODE ---
const LuxoraaApp: React.FC = () => {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('lux_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('lux_cart', JSON.stringify(cart));
  }, [cart]);

  const cartWithProducts = useMemo(() => {
    return cart.map(item => ({
      ...item,
      product: MOCK_PRODUCTS.find(p => p.id === item.productId)!
    }));
  }, [cart]);

  const cartTotal = cartWithProducts.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated) {
      if (user?.role === 'admin' && activePage === 'home') setActivePage('admin');
      if (user?.role === 'seller' && activePage === 'home') setActivePage('seller');
    }
  }, [isAuthenticated, user?.role, loading, activePage]);

  useEffect(() => {
    const fetchCuration = async () => {
      const recs = await getSmartRecommendations("luxury urban minimalist aesthetic high-end", MOCK_PRODUCTS);
      setAiRecommendations(recs);
    };
    fetchCuration();
  }, [isAuthenticated, activePage]);

  const handleAddToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => (item.productId === productId) ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId, quantity: 1 }];
    });
    setToast({ message: 'Identity Shard Acquired', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const results = await getSmartSearch(query, MOCK_PRODUCTS);
      setFilteredProducts(results);
    } else {
      setFilteredProducts(MOCK_PRODUCTS);
    }
  };

  const categories = [
    { name: 'Clothes', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200', color: 'bg-indigo-600', count: MOCK_PRODUCTS.filter(p => p.category === 'Clothes').length },
    { name: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1200', color: 'bg-emerald-600', count: MOCK_PRODUCTS.filter(p => p.category === 'Shoes').length },
    { name: 'Toys', image: 'https://images.unsplash.com/photo-1558685913-d9198f62e711?auto=format&fit=crop&q=80&w=1200', color: 'bg-amber-500', count: MOCK_PRODUCTS.filter(p => p.category === 'Toys').length },
    { name: 'Accessories', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=1200', color: 'bg-rose-600', count: MOCK_PRODUCTS.filter(p => p.category === 'Accessories').length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px]" />
        
        <div className="relative z-10 flex flex-col items-center gap-12">
          {/* Animated Icon Core */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Rotating Rings */}
            <div className="absolute inset-0 border-[1px] border-white/5 rounded-3xl animate-[spin_8s_linear_infinite]" />
            <div className="absolute inset-2 border-[1px] border-indigo-500/20 rounded-2xl animate-[spin_6s_linear_infinite_reverse]" />
            
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] animate-reveal">
              <Command size={40} className="text-slate-950" />
            </div>
            
            {/* Shimmer line */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" style={{ transform: 'rotate(45deg)' }} />
          </div>

          {/* Typography Reveal */}
          <div className="flex flex-col items-center">
            <h1 className="text-6xl font-display italic font-black text-white tracking-[-0.05em] uppercase relative">
              <span className="inline-block animate-[reveal_1s_ease-out_forwards] opacity-0">L</span>
              <span className="inline-block animate-[reveal_1s_ease-out_0.1s_forwards] opacity-0">U</span>
              <span className="inline-block animate-[reveal_1s_ease-out_0.2s_forwards] opacity-0">X</span>
              <span className="inline-block animate-[reveal_1s_ease-out_0.3s_forwards] opacity-0">O</span>
              <span className="inline-block animate-[reveal_1s_ease-out_0.4s_forwards] opacity-0">R</span>
              <span className="inline-block animate-[reveal_1s_ease-out_0.5s_forwards] opacity-0 text-indigo-500">A</span>
              <span className="inline-block animate-[reveal_1s_ease-out_0.6s_forwards] opacity-0 text-indigo-500">A</span>
              
              {/* Shine effect across text */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite_1.5s]" />
            </h1>
            
            <div className="mt-6 flex items-center gap-4 animate-reveal stagger-3 opacity-0 [animation-fill-mode:forwards]">
               <div className="h-[1px] w-12 bg-white/10" />
               <span className="text-[10px] font-black uppercase tracking-[1em] text-white/30">Curation Matrix</span>
               <div className="h-[1px] w-12 bg-white/10" />
            </div>
          </div>
        </div>

        {/* Global Progress Bar Minimalist */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64 h-[2px] bg-white/5 rounded-full overflow-hidden">
           <div className="h-full bg-white/20 animate-[loading_2s_ease-in-out_infinite]" />
        </div>
        
        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); width: 30%; }
            50% { transform: translateX(0%); width: 60%; }
            100% { transform: translateX(100%); width: 30%; }
          }
          @keyframes shimmer {
            0% { transform: translateX(-150%) rotate(45deg); }
            100% { transform: translateX(150%) rotate(45deg); }
          }
        `}</style>
      </div>
    );
  }

  // Handle protected pages for guests
  const isProtectedPage = ['profile', 'orders', 'admin', 'seller'].includes(activePage);
  if (isProtectedPage && !isAuthenticated) {
    return <LoginPage onLogin={(u) => { useAuth().login(u); setActivePage('home'); }} />;
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col selection:bg-indigo-600/10 hero-gradient">
      <Toaster message={toast?.message || null} type={toast?.type || 'info'} onClose={() => setToast(null)} />
      <Navbar 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        userPoints={user?.points || 0} 
        onNavigate={setActivePage} 
        onSearch={handleSearch} 
        userRole={user?.role} 
      />
      
      <main className="flex-1 pt-40 w-full animate-reveal">
        {activePage === 'home' && (
          <div className="pb-40 space-y-48">
            {/* Cinematic Editorial Hero */}
            <div className="max-w-7xl mx-auto px-6">
              <section className="relative h-[85vh] rounded-[80px] overflow-hidden shadow-[0_120px_200px_-60px_rgba(0,0,0,0.3)] group bg-slate-950">
                <img 
                  src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?auto=format&fit=crop&q=80&w=2000" 
                  className="w-full h-full object-cover transition-transform duration-[15s] group-hover:scale-105 opacity-50 blur-[2px] group-hover:blur-0" 
                  alt="Luxury Scene"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end justify-start p-16 sm:p-24">
                  <div className="max-w-5xl space-y-16 animate-reveal">
                      <div className="flex items-center gap-4">
                        <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black px-10 py-4 rounded-full uppercase tracking-[0.5em] shadow-2xl">Collection '25 Node</span>
                      </div>
                      <h2 className="text-[12rem] font-display italic text-white leading-[0.7] tracking-tighter">Editorial <br/> <span className="opacity-30 font-sans tracking-tight not-italic">Vanguard.</span></h2>
                      <div className="flex flex-col sm:flex-row gap-12 items-start sm:items-center">
                        <p className="text-3xl text-white/50 max-w-lg font-medium leading-relaxed italic font-display">
                          A curated intersection of neural intelligence and artisan craftsmanship.
                        </p>
                        <button onClick={() => window.scrollTo({ top: 1000, behavior: 'smooth' })} className="bg-white text-slate-950 px-20 py-10 rounded-[48px] font-black text-2xl hover:bg-slate-100 transition-all shadow-3xl flex items-center gap-8 group/btn hover:scale-105 active:scale-95">
                          Explore Artifacts <ArrowDown className="group-hover/btn:translate-y-2 transition-transform" />
                        </button>
                      </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Curated Identity Shards (Categories) */}
            <section className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col sm:flex-row items-end justify-between mb-24 gap-8">
                <div className="animate-reveal">
                  <h3 className="text-7xl font-display italic font-black tracking-tighter text-slate-950 uppercase mb-4">Shards.</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em]">Departmental Intelligence Nodes</p>
                </div>
                <div className="flex gap-4 p-2 bg-slate-100 rounded-3xl">
                   <button className="px-10 py-4 bg-white shadow-xl rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-950">Overview</button>
                   <button className="px-10 py-4 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-950">Matrix View</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {categories.map((cat, idx) => (
                  <div 
                    key={cat.name}
                    onClick={() => { setSelectedCategory(cat.name); window.scrollTo({ top: 2200, behavior: 'smooth' }); }}
                    className={`relative h-[550px] rounded-[64px] overflow-hidden group shadow-[0_40px_100px_-30px_rgba(0,0,0,0.1)] hover:scale-[1.03] transition-all duration-700 cursor-pointer animate-reveal stagger-${idx+1}`}
                  >
                    <img src={cat.image} className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110 opacity-100 group-hover:opacity-90" alt={cat.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                    <div className="absolute inset-0 p-12 flex flex-col justify-end items-start text-white">
                      <div className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest mb-6 ${cat.color} shadow-2xl`}>{cat.count} Artifacts</div>
                      <h4 className="text-5xl font-display italic font-black mb-4 tracking-tighter">{cat.name}.</h4>
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 group-hover:opacity-100 group-hover:translate-x-3 transition-all">Synchronise <ArrowRight className="inline ml-2" size={14} /></p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Neural Recommendations Showcase */}
            {!searchQuery && selectedCategory === 'All' && aiRecommendations.length > 0 && (
              <section className="bg-slate-950 py-48 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-indigo-600/5 rounded-full blur-[200px] -translate-y-1/2 translate-x-1/2" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                  <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-12">
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-6 mb-10">
                        <div className="p-5 bg-white/5 rounded-[32px] border border-white/10 text-indigo-400"><Sparkles size={32} /></div>
                        <span className="text-[10px] font-black uppercase tracking-[1em] text-white/30">Neural Engine v3.0</span>
                      </div>
                      <h2 className="text-8xl font-display italic font-black tracking-tighter leading-none mb-10">Curated by <br/> <span className="text-indigo-500">Intelligence.</span></h2>
                      <p className="text-2xl text-white/40 font-medium leading-relaxed italic font-display">
                        Artifacts identified as perfect extensions of your current aesthetic frequency.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
                    {aiRecommendations.map(p => (
                      <ProductCard 
                        key={`ai-${p.id}`} 
                        product={p} 
                        onAddToCart={handleAddToCart} 
                        onViewDetails={(id) => { setSelectedProductId(id); setActivePage('product'); }} 
                        onToggleWishlist={() => {}} 
                        isWishlisted={false} 
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Main Marketplace Control Center */}
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
                {/* Control Shard (Sidebar) */}
                <aside className="lg:col-span-3 space-y-20 sticky top-40 h-fit">
                  <div className="bg-white p-12 rounded-[64px] border border-slate-100 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 text-indigo-600 group-hover:scale-110 transition-transform"><Trophy size={160} /></div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.8em] mb-12">Identity State</h4>
                    <p className="text-6xl font-display italic font-black text-slate-900 mb-4">{isAuthenticated ? user?.tier : 'Guest Visitor'}</p>
                    <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden mb-8 shadow-inner">
                      <div className="h-full bg-slate-900 rounded-full transition-all duration-1000" style={{ width: isAuthenticated ? '65%' : '0%' }} />
                    </div>
                    <p className="text-[9px] font-black text-slate-950 uppercase tracking-[0.3em] flex items-center gap-3">
                      <Activity size={14} className="text-indigo-600" /> {isAuthenticated ? `${user?.points} Credits Sync'd` : 'Authenticate to sync'}
                    </p>
                  </div>

                  <div className="space-y-12">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.8em] mb-10 px-8">Active Nodes</h4>
                    <div className="flex flex-col gap-4">
                      {['All', ...categories.map(c => c.name)].map(cat => (
                        <button 
                          key={cat} 
                          onClick={() => setSelectedCategory(cat)} 
                          className={`flex items-center justify-between w-full px-12 py-7 rounded-[40px] text-sm font-black transition-all duration-500 ${
                            selectedCategory === cat 
                            ? 'bg-slate-950 text-white shadow-3xl scale-105 -translate-y-1' 
                            : 'text-slate-400 hover:bg-white hover:text-slate-950 hover:shadow-xl'
                          }`}
                        >
                          {cat} <ChevronRight size={18} className={selectedCategory === cat ? 'translate-x-2' : ''} />
                        </button>
                      ))}
                    </div>
                  </div>
                </aside>

                {/* Artifact Matrix (Product Grid) */}
                <div className="lg:col-span-9 space-y-40">
                  <section>
                    <div className="flex items-center justify-between mb-24">
                      <div className="flex items-center gap-8">
                        <div className="w-16 h-16 bg-slate-100 rounded-[28px] flex items-center justify-center text-slate-900"><Command size={28} /></div>
                        <div>
                          <h2 className="text-7xl font-display italic font-black tracking-tighter text-slate-900 uppercase">
                            {selectedCategory === 'All' ? 'Matrix.' : `${selectedCategory}.`}
                          </h2>
                          <p className="text-xs text-slate-400 font-black uppercase tracking-[0.5em]">Synchronizing {filteredProducts.filter(p => selectedCategory === 'All' || p.category === selectedCategory).length} artifacts</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-16">
                      {filteredProducts.filter(p => selectedCategory === 'All' || p.category === selectedCategory).map(p => (
                        <ProductCard 
                          key={p.id} 
                          product={p} 
                          onAddToCart={handleAddToCart} 
                          onViewDetails={(id) => { setSelectedProductId(id); setActivePage('product'); }} 
                          onToggleWishlist={() => {}} 
                          isWishlisted={false} 
                        />
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activePage === 'product' && selectedProductId && (<ProductDetail product={MOCK_PRODUCTS.find(p => p.id === selectedProductId)!} isWishlisted={wishlist.includes(selectedProductId)} onAddToCart={handleAddToCart} onBack={() => setActivePage('home')} onToggleWishlist={() => {}} onViewProduct={setSelectedProductId} />)}
        
        {activePage === 'cart' && (
          <div className="max-w-6xl mx-auto py-24 px-6 animate-reveal">
             <div className="flex flex-col sm:flex-row items-end justify-between mb-32 gap-12">
                <div>
                  <h1 className="text-9xl font-display italic font-black text-slate-950 tracking-tighter leading-none mb-4">Bag.</h1>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.8em]">{cart.length} Identities Linked</p>
                </div>
                <button onClick={() => setActivePage('home')} className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 hover:text-slate-950 transition-colors flex items-center gap-3">
                  <ChevronLeft size={16} /> Expand Search
                </button>
              </div>
              
              {cart.length === 0 ? (
                <div className="bg-white border-2 border-slate-100 rounded-[80px] p-48 text-center shadow-3xl flex flex-col items-center">
                  <div className="p-10 bg-slate-50 rounded-full text-slate-200 mb-12"><ShoppingBag size={80} /></div>
                  <p className="text-4xl font-display italic font-black text-slate-300 mb-12 uppercase tracking-tight">Identity Node is empty.</p>
                  <button onClick={() => setActivePage('home')} className="bg-slate-950 text-white px-20 py-8 rounded-[40px] font-black uppercase text-sm tracking-[0.6em] hover:bg-indigo-600 transition-all shadow-3xl transform hover:scale-105">Initiate Retrieval</button>
                </div>
              ) : (
                <div className="space-y-24">
                  <div className="grid grid-cols-1 gap-12">
                    {cartWithProducts.map((item, idx) => (
                      <div key={idx} className="bg-white rounded-[64px] p-10 flex flex-col md:flex-row items-center gap-16 shadow-2xl hover:shadow-indigo-600/5 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <img src={item.product.images[0]} className="w-72 h-80 object-cover rounded-[48px] shadow-3xl group-hover:scale-105 transition-transform duration-[1.5s]" alt={item.product.title} />
                        <div className="flex-1 space-y-8">
                          <div>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.6em] block mb-4">{item.product.category}</span>
                            <h4 className="text-5xl font-display italic font-black text-slate-900 tracking-tighter">{item.product.title}</h4>
                          </div>
                          <div className="flex items-center gap-12">
                            <div>
                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em] mb-1">Exchange</p>
                                <p className="text-3xl font-black text-slate-900 tracking-tighter">${item.product.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-8 bg-slate-50 p-4 rounded-[32px] border border-slate-100">
                               <button className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm"><Minus size={18} /></button>
                               <span className="font-black text-2xl w-10 text-center">{item.quantity}</span>
                               <button className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm"><Plus size={18} /></button>
                            </div>
                          </div>
                        </div>
                        <button className="text-slate-200 hover:text-rose-500 p-10 transition-colors"><Trash2 size={40} strokeWidth={1.5} /></button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-slate-950 text-white p-24 rounded-[80px] flex flex-col lg:flex-row justify-between items-center shadow-[0_100px_150px_-50px_rgba(2,6,23,0.5)] gap-12">
                    <div className="text-center lg:text-left">
                      <p className="text-indigo-400 font-black uppercase tracking-[1em] text-[10px] mb-8">Consolidated Matrix Value</p>
                      <h3 className="text-[10rem] font-display italic font-black tracking-tighter leading-none">${cartTotal.toFixed(2)}</h3>
                    </div>
                    <button onClick={() => setActivePage('checkout')} className="bg-white text-slate-950 px-24 py-12 rounded-[56px] font-black text-3xl hover:bg-indigo-600 hover:text-white transition-all shadow-3xl hover:scale-105 active:scale-95 flex items-center gap-6">
                      Checkout. <ArrowRight size={32} />
                    </button>
                  </div>
                </div>
              )}
          </div>
        )}

        {activePage === 'profile' && isAuthenticated && (
          <div className="max-w-5xl mx-auto py-24 px-6 animate-reveal">
             <div className="bg-white rounded-[80px] p-24 shadow-3xl border border-slate-100 flex flex-col md:flex-row items-center gap-24 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-32 opacity-5 text-indigo-600 group-hover:rotate-12 transition-transform duration-1000"><Command size={400} /></div>
                <div className="w-80 h-80 rounded-[72px] bg-slate-950 flex items-center justify-center text-white relative shadow-3xl group-hover:rotate-3 transition-transform duration-700">
                  <UserIcon size={160} strokeWidth={1} />
                  <div className="absolute -bottom-10 -right-10 bg-amber-400 text-slate-950 p-10 rounded-[48px] shadow-3xl border-[12px] border-white"><Trophy size={56} /></div>
                </div>
                <div className="flex-1 text-center md:text-left relative z-10">
                  <div className="flex flex-col sm:flex-row items-center gap-8 justify-center md:justify-start mb-10">
                    <h1 className="text-8xl font-display italic font-black text-slate-950 tracking-tighter">{user?.name}</h1>
                    <span className="bg-slate-950 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.5em]">Lvl: {user?.tier}</span>
                  </div>
                  <p className="text-3xl text-slate-400 font-medium mb-16 uppercase tracking-[0.4em] font-display italic">Identity: {user?.email}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="bg-slate-50 p-12 rounded-[48px] border border-slate-100 shadow-sm hover:shadow-xl transition-all"><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.8em] mb-8">Node Credits</p><p className="text-7xl font-display italic font-black text-indigo-600 tracking-tighter">{user?.points}</p></div>
                    <div className="bg-slate-50 p-12 rounded-[48px] border border-slate-100 shadow-sm hover:shadow-xl transition-all"><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.8em] mb-8">Wallet Liquidity</p><p className="text-7xl font-display italic font-black text-slate-950 tracking-tighter">${user?.walletBalance.toFixed(2)}</p></div>
                  </div>
                </div>
              </div>
              <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
                 <button onClick={() => setActivePage('orders')} className="bg-white p-12 rounded-[56px] border border-slate-100 flex justify-between items-center group hover:bg-slate-950 hover:text-white transition-all shadow-xl hover:shadow-2xl">
                   <div className="flex items-center gap-10">
                     <div className="p-6 bg-indigo-50 text-indigo-600 rounded-[32px] group-hover:bg-white/10 group-hover:text-white transition-colors"><Clock size={36} /></div>
                     <span className="text-3xl font-display italic font-black tracking-tight">Access Logbook</span>
                   </div>
                   <ChevronRight className="group-hover:translate-x-4 transition-transform" size={40} />
                 </button>
                 <button onClick={logout} className="bg-rose-50 p-12 rounded-[56px] border border-rose-100 flex justify-between items-center group hover:bg-rose-600 hover:text-white transition-all shadow-xl">
                   <div className="flex items-center gap-10">
                     <div className="p-6 bg-white rounded-[32px] text-rose-600 group-hover:bg-white/20 group-hover:text-white transition-colors"><LogOut size={36} /></div>
                     <span className="text-3xl font-display italic font-black tracking-tight text-rose-600 group-hover:text-white">Close Terminal</span>
                   </div>
                   <X size={40} />
                 </button>
              </div>
          </div>
        )}
      </main>

      {/* AI Hub */}
      {user?.role === 'customer' && <AIHelpDesk />}

      {/* Global Archive Footer */}
      <footer className="bg-slate-950 text-white pt-80 pb-32 mt-80 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-40 relative z-10">
          <div className="md:col-span-2 space-y-24">
            <h2 className="text-[16rem] font-display italic font-black tracking-tighter text-indigo-600 leading-[0.6]">LUXORAA</h2>
            <p className="text-5xl text-white/20 max-w-2xl font-medium leading-relaxed italic font-display">
              A decentralized artifact matrix defining the vanguard of the modern era.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[1em] text-white/20 mb-20">Navigation</h4>
            <ul className="space-y-12 text-sm font-black uppercase tracking-[0.4em] text-white/40">
              <li className="hover:text-white cursor-pointer transition-all flex items-center gap-6" onClick={() => setActivePage('home')}><Command size={18} /> Marketplace</li>
              <li className="hover:text-white cursor-pointer transition-all flex items-center gap-6" onClick={() => setActivePage('profile')}><Fingerprint size={18} /> Identity Hub</li>
              {isAuthenticated && <li className="hover:text-rose-500 cursor-pointer transition-all flex items-center gap-6" onClick={logout}><LogOut size={18} /> Terminate</li>}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[1em] text-white/20 mb-20">Distribution</h4>
            <ul className="space-y-12 text-sm font-black uppercase tracking-[0.4em] text-white/40">
              {categories.map(c => <li key={`f-${c.name}`} className="hover:text-white cursor-pointer transition-all" onClick={() => { setSelectedCategory(c.name); window.scrollTo({ top: 2200, behavior: 'smooth' }); }}>{c.name} Shard</li>)}
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-80 pt-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black uppercase tracking-[1.5em] text-white/10 relative z-10">
           <span>&copy; 2025 LUXORAA GLOBAL SYSTEMS CORP</span>
           <div className="flex items-center gap-10">
              <span className="flex items-center gap-3"><Globe size={14} /> Node: London-A2</span>
              <span className="flex items-center gap-3"><ShieldCheck size={14} /> Protocol: RSA-4096</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <LuxoraaApp />
  </AuthProvider>
);

export default App;
