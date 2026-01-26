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
  Sparkles, Package, ChevronRight, ArrowRight, Zap, Trophy, Clock, 
  Search, ShoppingBag, Heart, Trash2, Plus, Minus, User as UserIcon, 
  ShieldAlert, Settings, LogOut, Store, ArrowDown, ShieldCheck, 
  LayoutDashboard, Bell, Globe, Fingerprint, Activity, Menu, X, Terminal,
  CreditCard, BarChart4, Users
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
    // Simulate API token verification on mount
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
    setTimeout(verifySession, 800);
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
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-4 ${colors[type]}`}>
      <p className="font-black text-xs uppercase tracking-widest">{message}</p>
      <button onClick={onClose}><X size={16} /></button>
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
  const [orders, setOrders] = useState<Order[]>([]);
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

  // Protected Route Logic
  useEffect(() => {
    if (loading) return;
    if (isAuthenticated) {
      if (user?.role === 'admin' && activePage === 'home') setActivePage('admin');
      if (user?.role === 'seller' && activePage === 'home') setActivePage('seller');
    }
  }, [isAuthenticated, user?.role, loading]);

  // AI Curation Hook
  useEffect(() => {
    if (isAuthenticated && user?.role === 'customer' && activePage === 'home') {
      const fetchCuration = async () => {
        const recs = await getSmartRecommendations("luxury urban minimalist aesthetic", MOCK_PRODUCTS);
        setAiRecommendations(recs);
      };
      fetchCuration();
    }
  }, [isAuthenticated, user, activePage]);

  const handleAddToCart = (productId: string, size?: string, color?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId && item.selectedSize === size && item.selectedColor === color);
      if (existing) {
        return prev.map(item => (item.productId === productId && item.selectedSize === size && item.selectedColor === color) ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId, quantity: 1, selectedSize: size, selectedColor: color }];
    });
    setToast({ message: 'Added to your collection', type: 'success' });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
        <h1 className="text-xl font-black italic text-white/40 tracking-[0.5em] uppercase">Booting Luxoraa</h1>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={(u) => useAuth().login(u)} />;
  }

  // --- OPERATIONS LAYOUT (Admin / Seller) ---
  if (user?.role === 'admin' || user?.role === 'seller') {
    const isAdmin = user.role === 'admin';
    const accent = isAdmin ? 'rose' : 'emerald';

    return (
      <div className="min-h-screen bg-slate-950 text-white flex selection:bg-rose-600/20">
        <Toaster message={toast?.message || null} type={toast?.type || 'info'} onClose={() => setToast(null)} />
        
        {/* Ops Sidebar */}
        <aside className={`transition-all duration-500 border-r border-white/5 bg-slate-950 flex flex-col h-screen sticky top-0 ${isSidebarCollapsed ? 'w-24' : 'w-80'}`}>
          <div className="p-8 flex items-center gap-4">
             <div className={`p-3 rounded-2xl shadow-2xl ${isAdmin ? 'bg-rose-600' : 'bg-emerald-600'}`}>
                <Terminal size={24} className="text-white" />
             </div>
             {!isSidebarCollapsed && <h1 className="text-xl font-black tracking-tighter italic">LUXORAA <span className="text-[10px] uppercase not-italic opacity-40">Ops</span></h1>}
          </div>

          <div className="flex-1 px-4 space-y-2 pt-10">
            {[
              { id: isAdmin ? 'admin' : 'seller', icon: LayoutDashboard, label: 'Control' },
              { id: 'inventory', icon: Package, label: 'Inventory' },
              { id: 'analytics', icon: BarChart4, label: 'Analytics' },
              { id: 'users', icon: Users, label: 'Identity' },
              { id: 'security', icon: Fingerprint, label: 'Security' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  activePage === item.id 
                  ? (isAdmin ? 'bg-rose-600 text-white shadow-xl' : 'bg-emerald-600 text-white shadow-xl') 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={22} />
                {!isSidebarCollapsed && <span className="font-black text-[10px] uppercase tracking-[0.2em]">{item.label}</span>}
              </button>
            ))}
          </div>

          <div className="p-6 border-t border-white/5">
             <button onClick={logout} className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:text-rose-500 transition-all">
                <LogOut size={22} />
                {!isSidebarCollapsed && <span className="font-black text-[10px] uppercase tracking-[0.2em]">Exit Terminal</span>}
             </button>
          </div>
        </aside>

        {/* Workspace Area */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="h-20 border-b border-white/5 px-10 flex justify-between items-center bg-slate-950/80 backdrop-blur-2xl relative z-50">
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 text-slate-500 hover:text-white transition-colors">
              {isSidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-3 bg-white/5 px-5 py-2 rounded-full border border-white/10">
                  <Activity size={14} className={isAdmin ? 'text-rose-500' : 'text-emerald-500'} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node: {isAdmin ? 'Global Root' : 'Merchant-S1'}</span>
               </div>
               <div className="flex items-center gap-4 pl-8 border-l border-white/10">
                  <div className="text-right">
                    <p className="text-xs font-black">{user.name}</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase">{user.role}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${isAdmin ? 'bg-rose-600' : 'bg-emerald-600'}`}>
                    {user.name.charAt(0)}
                  </div>
               </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
            {activePage === (isAdmin ? 'admin' : 'seller') && (
              isAdmin ? <AdminDashboard products={MOCK_PRODUCTS} orders={orders} /> : <SellerDashboard seller={{ id: 's-1', name: 'Rivera Designs', rating: 4.8, joinedDate: '2024', isVerified: true, commissionRate: 0.1, totalSales: 4500, balance: 1250 }} products={MOCK_PRODUCTS} orders={orders} />
            )}
            {activePage === 'inventory' && <div className="animate-in"><h1 className="text-6xl font-black tracking-tighter italic text-white/20 mb-10">Inventory <br/> Management</h1><div className="bg-white/5 rounded-[40px] p-20 border border-white/10 text-center"><Package className="mx-auto mb-6 text-slate-700" size={60} /><p className="text-slate-500 font-bold">Catalog data synchronized. Accessing localized shards...</p></div></div>}
            {activePage === 'security' && <div className="animate-in"><h1 className="text-6xl font-black tracking-tighter italic text-white/20 mb-10">Security <br/> Protocols</h1><div className="grid grid-cols-2 gap-8"><div className="bg-rose-600/10 p-10 rounded-[40px] border border-rose-600/20"><ShieldAlert className="mb-6 text-rose-500" size={40} /><h3 className="text-xl font-black mb-2">Audit Logs</h3><p className="text-slate-500 text-sm">Real-time tracking of administrative mutations.</p></div><div className="bg-indigo-600/10 p-10 rounded-[40px] border border-indigo-600/20"><Fingerprint className="mb-6 text-indigo-500" size={40} /><h3 className="text-xl font-black mb-2">MFA Matrix</h3><p className="text-slate-500 text-sm">Manage multi-factor authentication requirements.</p></div></div></div>}
          </div>
        </main>
      </div>
    );
  }

  // --- MARKETPLACE LAYOUT (Customer) ---
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col selection:bg-indigo-600/20">
      <Toaster message={toast?.message || null} type={toast?.type || 'info'} onClose={() => setToast(null)} />
      <Navbar 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        userPoints={user?.points || 0} 
        onNavigate={setActivePage} 
        onSearch={handleSearch} 
        userRole={user?.role}
      />
      
      <main className="flex-1 pt-32 max-w-7xl mx-auto px-6 w-full animate-in">
        {activePage === 'home' && (
          <div className="pb-32 space-y-32">
            {/* Cinematic Hero */}
            <section className="relative h-[700px] rounded-[64px] overflow-hidden shadow-[0_60px_120px_-30px_rgba(0,0,0,0.15)] group bg-slate-900">
               <img 
                 src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?auto=format&fit=crop&q=80&w=2000" 
                 className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105 opacity-60" 
               />
               <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent flex items-center px-12 sm:px-24">
                 <div className="max-w-4xl space-y-12 stagger-in">
                    <div className="flex gap-4">
                      <span className="glass border border-white/20 text-indigo-700 text-[10px] font-black px-8 py-3 rounded-full uppercase tracking-[0.4em] shadow-xl">Spring Collection 2025</span>
                    </div>
                    <h2 className="text-[10rem] font-display italic text-white leading-[0.8] tracking-tighter">The Art <br/> <span className="opacity-30 font-sans tracking-tight not-italic">of Space.</span></h2>
                    <p className="text-3xl text-white/60 max-w-xl font-medium leading-relaxed italic font-display">A global vanguard of curation, fueled by neural intelligence.</p>
                    <div className="flex gap-8 items-center pt-8">
                      <button onClick={() => window.scrollTo({ top: 900, behavior: 'smooth' })} className="bg-white text-black px-16 py-7 rounded-[32px] font-black text-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-3xl flex items-center gap-6 group/btn">
                        Enter Marketplace <ArrowRight className="group-hover/btn:translate-x-3 transition-transform" />
                      </button>
                    </div>
                 </div>
               </div>
            </section>

            {/* Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-24">
              <aside className="space-y-20 sticky top-32 h-fit">
                <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-3xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-10 opacity-5 text-indigo-600 group-hover:scale-110 transition-transform"><Trophy size={140} /></div>
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-12">User Identity</h4>
                   <p className="text-5xl font-display italic font-black text-slate-900 mb-2">{user?.tier}</p>
                   <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden mb-6 shadow-inner"><div className="h-full bg-indigo-600 rounded-full" style={{ width: '65%' }} /></div>
                   <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2"><Sparkles size={14} className="text-amber-400" /> {user?.points} Lux Credits</p>
                </div>

                <div className="space-y-8">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-10 px-6">Discovery Shards</h4>
                   <div className="grid grid-cols-1 gap-4">
                     {['All', 'Clothes', 'Shoes', 'Toys', 'Accessories'].map(cat => (
                       <button 
                         key={cat} 
                         onClick={() => setSelectedCategory(cat)} 
                         className={`flex items-center justify-between w-full px-10 py-6 rounded-[32px] text-sm font-black transition-all ${
                           selectedCategory === cat 
                           ? 'bg-slate-950 text-white shadow-3xl scale-[1.05]' 
                           : 'text-slate-400 hover:bg-white hover:text-slate-950 hover:shadow-xl'
                         }`}
                       >
                         {cat} <ChevronRight size={16} />
                       </button>
                     ))}
                   </div>
                </div>
              </aside>

              <div className="lg:col-span-3 space-y-40">
                {/* AI Recommendations Section */}
                {!searchQuery && selectedCategory === 'All' && aiRecommendations.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-16">
                      <div className="flex items-center gap-6">
                        <div className="p-6 bg-indigo-600/5 text-indigo-600 rounded-[32px] border border-indigo-600/10"><Sparkles size={32} /></div>
                        <div>
                          <h2 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">Neural Selection</h2>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Tuned to your specific frequency</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                       {aiRecommendations.map(p => (
                         <ProductCard key={`ai-${p.id}`} product={p} onAddToCart={handleAddToCart} onViewDetails={(id) => { setSelectedProductId(id); setActivePage('product'); }} onToggleWishlist={() => {}} isWishlisted={false} />
                       ))}
                    </div>
                  </section>
                )}

                {/* Catalog Grid */}
                <section>
                   <div className="flex items-center gap-6 mb-20">
                     <div className="p-6 bg-slate-900 text-white rounded-[32px] shadow-2xl"><Search size={32} /></div>
                     <div>
                       <h2 className="text-6xl font-black tracking-tighter text-slate-900 uppercase">{searchQuery ? `"${searchQuery}"` : 'Market Catalog'}</h2>
                       <p className="text-sm text-slate-400 font-medium tracking-wide">Synthesizing {filteredProducts.length} premium artifacts</p>
                     </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
                     {filteredProducts.filter(p => selectedCategory === 'All' || p.category === selectedCategory).map(p => (
                       <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onViewDetails={(id) => { setSelectedProductId(id); setActivePage('product'); }} onToggleWishlist={() => {}} isWishlisted={false} />
                     ))}
                   </div>
                </section>
              </div>
            </div>
          </div>
        )}
        
        {/* Marketplace Sub-pages */}
        {activePage === 'product' && selectedProductId && (<ProductDetail product={MOCK_PRODUCTS.find(p => p.id === selectedProductId)!} isWishlisted={wishlist.includes(selectedProductId)} onAddToCart={handleAddToCart} onBack={() => setActivePage('home')} onToggleWishlist={() => {}} onViewProduct={setSelectedProductId} />)}
        {activePage === 'cart' && (
          <div className="max-w-5xl mx-auto py-20 px-4 animate-in">
             <div className="flex items-center gap-10 mb-24">
                <div className="p-10 bg-indigo-600/5 text-indigo-600 rounded-[48px] shadow-3xl border border-indigo-600/10"><ShoppingBag size={56} /></div>
                <div><h1 className="text-8xl font-black text-slate-900 tracking-tighter italic font-display">Bag</h1><p className="text-slate-400 font-black uppercase tracking-[0.6em] text-xs">{cart.length} Identities Selected</p></div>
              </div>
              {cart.length === 0 ? (
                <div className="bg-white border-4 border-dashed border-slate-100 rounded-[80px] p-48 text-center shadow-3xl">
                  <p className="text-4xl font-black text-slate-200 mb-12 uppercase tracking-[0.4em]">Node is Empty</p>
                  <button onClick={() => setActivePage('home')} className="bg-slate-950 text-white px-20 py-8 rounded-[40px] font-black uppercase text-sm tracking-[0.6em] hover:bg-indigo-600 transition-all shadow-3xl transform hover:scale-105">Initiate Search</button>
                </div>
              ) : (
                <div className="space-y-16">
                  {cartWithProducts.map((item, idx) => (
                    <div key={idx} className="bg-white border border-slate-100 rounded-[56px] p-12 flex items-center gap-16 shadow-sm hover:shadow-3xl transition-all group">
                      <img src={item.product.images[0]} className="w-56 h-56 object-cover rounded-[40px] shadow-3xl group-hover:scale-105 transition-transform duration-700" />
                      <div className="flex-1">
                        <h4 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">{item.product.title}</h4>
                        <p className="text-lg font-black text-indigo-600 uppercase tracking-[0.5em] mb-10">${item.product.price.toFixed(2)}</p>
                        <div className="flex items-center gap-10 bg-slate-50 w-fit p-4 rounded-[32px] border border-slate-100 shadow-inner">
                           <button onClick={() => {}} className="p-4 hover:bg-white rounded-2xl transition-all shadow-sm"><Minus size={20} /></button>
                           <span className="font-black text-2xl w-12 text-center">{item.quantity}</span>
                           <button onClick={() => {}} className="p-4 hover:bg-white rounded-2xl transition-all shadow-sm"><Plus size={20} /></button>
                        </div>
                      </div>
                      <button className="text-slate-200 hover:text-rose-500 p-8 transition-colors"><Trash2 size={40} /></button>
                    </div>
                  ))}
                  <div className="mt-32 bg-slate-950 text-white p-20 rounded-[80px] flex justify-between items-center shadow-[0_80px_160px_-40px_rgba(2,6,23,0.5)]">
                    <div><p className="text-slate-500 font-black uppercase tracking-[0.8em] text-[10px] mb-8">Consolidated Payout</p><h3 className="text-[7rem] font-black tracking-tighter italic leading-none">${cartTotal.toFixed(2)}</h3></div>
                    <button onClick={() => setActivePage('checkout')} className="bg-white text-slate-950 px-24 py-10 rounded-[48px] font-black text-3xl hover:bg-indigo-600 hover:text-white transition-all shadow-3xl hover:scale-105 active:scale-95">Checkout</button>
                  </div>
                </div>
              )}
          </div>
        )}
        {activePage === 'checkout' && <CheckoutView total={cartTotal} items={cartWithProducts} onBack={() => setActivePage('home')} onPlaceOrder={() => {}} />}
      </main>

      {user?.role === 'customer' && <AIHelpDesk />}

      <footer className="bg-slate-950 text-white pt-64 pb-20 mt-64 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-40 relative z-10">
          <div className="md:col-span-2 space-y-20">
            <h2 className="text-[12rem] font-black italic tracking-tighter text-indigo-600 leading-[0.7]">LUXORAA</h2>
            <p className="text-4xl text-white/30 max-w-xl font-medium leading-relaxed italic font-display">A decentralized architecture for global luxury artifacts.</p>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.8em] text-white/20 mb-16">Terminal</h4>
            <ul className="space-y-10 text-sm font-black uppercase tracking-[0.3em] text-white/50">
              <li className="hover:text-white cursor-pointer transition-all flex items-center gap-4" onClick={() => setActivePage('home')}>Marketplace</li>
              <li className="hover:text-white cursor-pointer transition-all flex items-center gap-4" onClick={() => setActivePage('profile')}>Identity Hub</li>
              <li className="hover:text-rose-500 cursor-pointer transition-all flex items-center gap-4" onClick={logout}>De-Authenticate</li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.8em] text-white/20 mb-16">Operations</h4>
            <ul className="space-y-10 text-sm font-black uppercase tracking-[0.3em] text-white/50">
              <li className="hover:text-emerald-500 cursor-pointer flex items-center gap-6 transition-all" onClick={() => setActivePage('seller')}><Store size={18} /> Merchant</li>
              <li className="hover:text-rose-500 cursor-pointer flex items-center gap-6 transition-all" onClick={() => setActivePage('admin')}><ShieldAlert size={18} /> Control</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-64 pt-16 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-[1em] text-white/10 relative z-10">
           <span>&copy; 2025 LUXORAA GLOBAL SYSTEMS</span>
           <span>RSA-4096 NODE ACTIVE</span>
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