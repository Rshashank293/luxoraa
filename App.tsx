
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
    setTimeout(verifySession, 2000); 
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

  const cartTotal = cartWithProducts.reduce((sum, item) => {
    const price = (user?.isMember && item.product.membershipPrice) ? item.product.membershipPrice : item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated) {
      if (user?.role === 'admin' && activePage === 'home') setActivePage('admin');
      if (user?.role === 'seller' && activePage === 'home') setActivePage('seller');
    }
  }, [isAuthenticated, user?.role, loading, activePage]);

  useEffect(() => {
    const fetchCuration = async () => {
      const recs = await getSmartRecommendations("pop culture marvel anime hoodies shirts official merch", MOCK_PRODUCTS);
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
    setToast({ message: 'Artifact Linked to Identity', type: 'success' });
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
    { name: 'Oversized Tees', image: 'https://images.unsplash.com/photo-1576871333020-2219d51cca94?auto=format&fit=crop&q=80&w=1200', color: 'bg-rose-600', count: MOCK_PRODUCTS.filter(p => p.category === 'Oversized Tees').length },
    { name: 'Classic T-Shirts', image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80&w=1200', color: 'bg-indigo-600', count: MOCK_PRODUCTS.filter(p => p.category === 'Classic T-Shirts').length },
    { name: 'Hoodies & Sweatshirts', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1200', color: 'bg-emerald-600', count: MOCK_PRODUCTS.filter(p => p.category === 'Hoodies & Sweatshirts').length },
    { name: 'Joggers & Pajamas', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=1200', color: 'bg-amber-500', count: MOCK_PRODUCTS.filter(p => p.category === 'Joggers & Pajamas').length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="relative z-10 flex flex-col items-center gap-12">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div className="absolute inset-0 border-[1px] border-white/5 rounded-3xl animate-[spin_8s_linear_infinite]" />
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] animate-reveal">
              <Command size={40} className="text-slate-950" />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-6xl font-display italic font-black text-white tracking-[-0.05em] uppercase">
              LUXORAA
            </h1>
            <span className="text-[10px] font-black uppercase tracking-[1em] text-white/30 mt-4">Official Fandom Hub</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col selection:bg-rose-600/10 hero-gradient">
      <Toaster message={toast?.message || null} type={toast?.type || 'info'} onClose={() => setToast(null)} />
      <Navbar cartCount={cart.reduce((s, i) => s + i.quantity, 0)} userPoints={user?.points || 0} onNavigate={setActivePage} onSearch={handleSearch} userRole={user?.role} />
      
      <main className="flex-1 pt-40 w-full animate-reveal">
        {activePage === 'home' && (
          <div className="pb-40 space-y-48">
            <div className="max-w-7xl mx-auto px-6">
              <section className="relative h-[85vh] rounded-[80px] overflow-hidden shadow-[0_120px_200px_-60px_rgba(0,0,0,0.3)] group bg-slate-950">
                <img src="https://images.unsplash.com/photo-1576871333020-2219d51cca94?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover transition-transform duration-[15s] group-hover:scale-105 opacity-50 blur-[2px] group-hover:blur-0" alt="Fandom Scene" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end justify-start p-16 sm:p-24">
                  <div className="max-w-5xl space-y-16 animate-reveal">
                      <div className="flex items-center gap-4">
                        <span className="bg-rose-600 text-white text-[9px] font-black px-10 py-4 rounded-full uppercase tracking-[0.5em] shadow-2xl">Official Merchandise</span>
                      </div>
                      <h2 className="text-[12rem] font-display italic text-white leading-[0.7] tracking-tighter">Wear Your <br/> <span className="opacity-30 font-sans tracking-tight not-italic">Fandom.</span></h2>
                      <div className="flex flex-col sm:flex-row gap-12 items-start sm:items-center">
                        <p className="text-3xl text-white/50 max-w-lg font-medium leading-relaxed italic font-display">
                          Decentralized pop-culture artifacts for the modern vanguard.
                        </p>
                        <button onClick={() => window.scrollTo({ top: 1000, behavior: 'smooth' })} className="bg-white text-slate-950 px-20 py-10 rounded-[48px] font-black text-2xl hover:bg-rose-600 hover:text-white transition-all shadow-3xl flex items-center gap-8 group/btn hover:scale-105 active:scale-95">
                          Explore Shards <ArrowDown className="group-hover/btn:translate-y-2 transition-transform" />
                        </button>
                      </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Fandom Nodes (Categories) */}
            <section className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col sm:flex-row items-end justify-between mb-24 gap-8">
                <div>
                  <h3 className="text-7xl font-display italic font-black tracking-tighter text-slate-950 uppercase mb-4">Nodes.</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em]">Departmental Intelligence Nodes</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {categories.map((cat, idx) => (
                  <div key={cat.name} onClick={() => setSelectedCategory(cat.name)} className={`relative h-[550px] rounded-[64px] overflow-hidden group shadow-[0_40px_100px_-30px_rgba(0,0,0,0.1)] hover:scale-[1.03] transition-all duration-700 cursor-pointer animate-reveal stagger-${idx+1}`}>
                    <img src={cat.image} className="w-full h-full object-cover opacity-100 group-hover:opacity-90 transition-all" alt={cat.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                    <div className="absolute inset-0 p-12 flex flex-col justify-end items-start text-white">
                      <div className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest mb-6 ${cat.color} shadow-2xl`}>{cat.count} Artifacts</div>
                      <h4 className="text-5xl font-display italic font-black mb-4 tracking-tighter">{cat.name}.</h4>
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 group-hover:opacity-100 transition-all">Synchronise <ArrowRight className="inline ml-2" size={14} /></p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Artifact Grid */}
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center justify-between mb-24">
                <h2 className="text-7xl font-display italic font-black tracking-tighter text-slate-900 uppercase">
                  {selectedCategory === 'All' ? 'Matrix.' : `${selectedCategory}.`}
                </h2>
                {user?.isMember && (
                  <div className="bg-amber-400 text-slate-950 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Trophy size={14} /> Membership Active: Exclusive Pricing Sync'd
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                {filteredProducts.filter(p => selectedCategory === 'All' || p.category === selectedCategory).map(p => (
                  <div key={p.id} className="relative group">
                    <ProductCard 
                      product={p} 
                      onAddToCart={handleAddToCart} 
                      onViewDetails={(id) => { setSelectedProductId(id); setActivePage('product'); }} 
                      onToggleWishlist={() => {}} 
                      isWishlisted={false} 
                    />
                    {p.collectionName && (
                       <div className="absolute top-8 left-8 z-10">
                          <span className="bg-slate-950/80 backdrop-blur-md text-white text-[8px] font-black px-4 py-2 rounded-full uppercase tracking-widest">{p.collectionName}</span>
                       </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activePage === 'product' && selectedProductId && (<ProductDetail product={MOCK_PRODUCTS.find(p => p.id === selectedProductId)!} isWishlisted={wishlist.includes(selectedProductId)} onAddToCart={handleAddToCart} onBack={() => setActivePage('home')} onToggleWishlist={() => {}} onViewProduct={setSelectedProductId} />)}
        {activePage === 'cart' && <div className="max-w-6xl mx-auto py-24 px-6"><h1 className="text-8xl font-display font-black italic mb-12">Bag.</h1>{/* Cart items logic here... */}</div>}
      </main>

      {user?.role === 'customer' && <AIHelpDesk />}
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <LuxoraaApp />
  </AuthProvider>
);

export default App;
