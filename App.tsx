
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
  LayoutDashboard, Bell, Globe, Fingerprint, Activity, Menu, X
} from 'lucide-react';
import { getSmartSearch, getSmartRecommendations } from './services/geminiService';

// --- AUTH CONTEXT ---
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedSession = localStorage.getItem('luxoraa_session');
    if (savedSession) {
      setUser(JSON.parse(savedSession));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('luxoraa_session', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('luxoraa_session');
    window.location.hash = ''; // Reset "route"
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// --- CORE APP ---
const LuxoraaApp: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Persistence for Cart/Wishlist
  useEffect(() => {
    const savedCart = localStorage.getItem('luxoraa_cart');
    const savedWish = localStorage.getItem('luxoraa_wishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWish) setWishlist(JSON.parse(savedWish));
  }, []);

  useEffect(() => {
    localStorage.setItem('luxoraa_cart', JSON.stringify(cart));
    localStorage.setItem('luxoraa_wishlist', JSON.stringify(wishlist));
  }, [cart, wishlist]);

  const cartWithProducts = useMemo(() => {
    return cart.map(item => ({
      ...item,
      product: MOCK_PRODUCTS.find(p => p.id === item.productId)!
    }));
  }, [cart]);

  const cartTotal = cartWithProducts.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Security Gate
  useEffect(() => {
    if (!isAuthenticated) return;
    if ((activePage === 'admin' && user?.role !== 'admin') || 
        (activePage === 'seller' && user?.role !== 'seller')) {
      setActivePage('home');
    }
  }, [activePage, isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'customer') {
      const fetchAI = async () => {
        const recs = await getSmartRecommendations("luxury urban style, high-end lifestyle", MOCK_PRODUCTS);
        setAiRecommendations(recs);
      };
      fetchAI();
    }
  }, [isAuthenticated, user?.role]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 2) {
      const results = await getSmartSearch(query, MOCK_PRODUCTS);
      setFilteredProducts(results);
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
    setCart([]);
    setActivePage('orders');
    window.scrollTo(0, 0);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={(u) => { useAuth().login(u); }} />;
  }

  // --- OPS LAYOUT (Admin / Seller) ---
  if (user?.role === 'admin' || user?.role === 'seller') {
    const isOpsAdmin = user.role === 'admin';
    const accentColor = isOpsAdmin ? 'rose' : 'emerald';

    return (
      <div className="min-h-screen bg-slate-950 text-white flex overflow-hidden selection:bg-rose-500/30">
        {/* Sidebar Terminal */}
        <aside className={`transition-all duration-500 border-r border-white/5 bg-slate-950 flex flex-col ${isSidebarOpen ? 'w-80' : 'w-24'}`}>
          <div className="p-8 flex items-center gap-4">
             <div className={`p-3 rounded-2xl shadow-2xl ${isOpsAdmin ? 'bg-rose-600' : 'bg-emerald-600'}`}>
                <Sparkles size={24} className="text-white" />
             </div>
             {isSidebarOpen && <h1 className="text-xl font-black tracking-tighter italic">LUXORAA</h1>}
          </div>
          
          <nav className="flex-1 px-4 space-y-2 pt-8">
            {[
              { id: isOpsAdmin ? 'admin' : 'seller', icon: LayoutDashboard, label: 'Control Center' },
              { id: 'inventory', icon: Package, label: 'Identity Assets' },
              { id: 'orders', icon: ShoppingBag, label: 'Order Logic' },
              { id: 'security', icon: Fingerprint, label: 'Audit Trail' }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${
                  activePage === item.id ? (isOpsAdmin ? 'bg-rose-600 text-white shadow-xl' : 'bg-emerald-600 text-white shadow-xl') : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={24} />
                {isSidebarOpen && <span className="font-black text-[10px] uppercase tracking-[0.2em]">{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className="p-6 border-t border-white/5 space-y-4">
            <button onClick={logout} className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 transition-all">
               <LogOut size={24} />
               {isSidebarOpen && <span className="font-black text-[10px] uppercase tracking-[0.2em]">Terminate</span>}
            </button>
          </div>
        </aside>

        {/* Workspace */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="h-20 border-b border-white/5 px-10 flex justify-between items-center bg-slate-950/50 backdrop-blur-xl">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-500 hover:text-white transition-colors">
              {isSidebarOpen ? <Menu size={20} /> : <X size={20} />}
            </button>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <div className={`w-2 h-2 rounded-full animate-pulse ${isOpsAdmin ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node: {isOpsAdmin ? 'Root-A1' : 'Merchant-S1'}</span>
              </div>
              <button className="relative p-2 text-slate-500 hover:text-white">
                <Bell size={20} />
                <span className={`absolute top-1 right-1 w-2 h-2 rounded-full ${isOpsAdmin ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              </button>
              <div className="flex items-center gap-3 pl-8 border-l border-white/10">
                <div className="text-right">
                  <p className="text-xs font-black">{user.name}</p>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{user.role}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/10 flex items-center justify-center font-black">
                  {user.name.charAt(0)}
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
            {isOpsAdmin ? (
               <AdminDashboard products={MOCK_PRODUCTS} orders={orders} />
            ) : (
               <SellerDashboard seller={{ id: 's-1', name: 'Rivera Designs', rating: 4.8, joinedDate: '2024', isVerified: true, commissionRate: 0.1, totalSales: 4500, balance: 1250 }} products={MOCK_PRODUCTS} orders={orders} />
            )}
          </div>
        </main>
      </div>
    );
  }

  // --- CONSUMER LAYOUT (Customer) ---
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Navbar 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        userPoints={user?.points || 0} 
        onNavigate={setActivePage} 
        onSearch={handleSearch} 
        userRole={user?.role}
      />
      
      <main className="flex-1 pt-32 max-w-7xl mx-auto px-6 w-full stagger-in">
        {activePage === 'home' && (
          <div className="pb-24 space-y-32">
            {/* Cinematic Hero */}
            <section className="relative h-[650px] rounded-[64px] overflow-hidden shadow-[0_60px_100px_-20px_rgba(0,0,0,0.15)] group bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?auto=format&fit=crop&q=80&w=2000" 
                className="w-full h-full object-cover transition-transform duration-[8s] group-hover:scale-110 opacity-70" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent flex items-center px-12 sm:px-24">
                <div className="max-w-4xl space-y-12 animate-in">
                   <div className="flex gap-4">
                     <span className="glass border border-white/20 text-indigo-700 text-[10px] font-black px-8 py-3 rounded-full uppercase tracking-[0.4em] shadow-xl">Spring Collection 2025</span>
                     <div className="flex items-center gap-2 bg-indigo-600 text-white text-[10px] font-black px-8 py-3 rounded-full uppercase tracking-[0.4em]">
                       <Zap size={14} fill="currentColor" /> Neural Drop
                     </div>
                   </div>
                   <h2 className="text-9xl font-display italic text-white leading-[0.85] tracking-tighter">Pure <br/> <span className="opacity-40 font-sans tracking-tight not-italic">Identity.</span></h2>
                   <p className="text-2xl text-white/70 max-w-lg leading-relaxed font-medium italic font-display">Refining the boundaries between digital and tactile luxury.</p>
                   <div className="flex gap-8 items-center pt-8">
                     <button onClick={() => window.scrollTo({ top: 850, behavior: 'smooth' })} className="bg-white text-black px-14 py-6 rounded-[32px] font-black text-xl hover:bg-indigo-600 hover:text-white transition-all shadow-3xl flex items-center gap-4 group/btn">
                       Enter Marketplace <ArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
                     </button>
                   </div>
                </div>
              </div>
            </section>

            {/* Discovery Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-24">
              <aside className="space-y-20">
                <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-3xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-10 opacity-5 text-indigo-600 group-hover:scale-110 transition-transform"><Trophy size={120} /></div>
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-10">Elite Identity</h4>
                   <p className="text-4xl font-display italic font-black text-slate-900 mb-2">{user?.tier}</p>
                   <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden mb-6"><div className="h-full bg-indigo-600 rounded-full" style={{ width: '65%' }} /></div>
                   <div className="flex items-center gap-2">
                     <div className="p-1 bg-amber-400 rounded-full"><Zap size={10} fill="currentColor" /></div>
                     <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{user?.points} Luxoraa Credits</p>
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
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                       {aiRecommendations.map(p => (
                         <ProductCard key={`ai-${p.id}`} product={p} onAddToCart={handleAddToCart} onViewDetails={(id) => { setSelectedProductId(id); setActivePage('product'); }} onToggleWishlist={toggleWishlist} isWishlisted={wishlist.includes(p.id)} />
                       ))}
                     </div>
                  </section>
                )}

                <section>
                   <div className="flex items-center gap-5 mb-20">
                     <div className="p-5 bg-slate-100 text-slate-950 rounded-[32px] shadow-xl"><Search size={32} /></div>
                     <div>
                       <h2 className="text-5xl font-black tracking-tighter text-slate-900">{searchQuery ? `"${searchQuery}"` : 'Market Catalog'}</h2>
                       <p className="text-sm text-slate-400 font-medium tracking-wide">{filteredProducts.length} high-fidelity artifacts</p>
                     </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
                     {filteredProducts.filter(p => selectedCategory === 'All' || p.category === selectedCategory).map(p => (
                       <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onViewDetails={(id) => { setSelectedProductId(id); setActivePage('product'); }} onToggleWishlist={toggleWishlist} isWishlisted={wishlist.includes(p.id)} />
                     ))}
                   </div>
                </section>
              </div>
            </div>
          </div>
        )}
        
        {activePage === 'cart' && (
          <div className="max-w-5xl mx-auto py-12 px-4 animate-in">
             <div className="flex items-center gap-8 mb-20">
                <div className="p-8 bg-indigo-600/5 text-indigo-600 rounded-[40px] shadow-2xl border border-indigo-600/10"><ShoppingBag size={48} /></div>
                <div><h1 className="text-6xl font-black text-slate-900 tracking-tighter">Shopping Bag</h1><p className="text-slate-400 font-black uppercase tracking-[0.5em] text-xs">{cart.length} Identity Artifacts Selected</p></div>
              </div>
              {cart.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-[80px] p-40 text-center shadow-3xl">
                  <p className="text-3xl font-black text-slate-300 mb-10 uppercase tracking-[0.3em]">Selection is Empty</p>
                  <button onClick={() => setActivePage('home')} className="bg-slate-950 text-white px-16 py-6 rounded-[32px] font-black uppercase text-sm tracking-[0.4em] hover:bg-indigo-600 transition-all">Begin Discovery</button>
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
                      <button onClick={() => removeFromCart(item.productId)} className="text-slate-200 hover:text-rose-500 p-6 transition-colors group/trash"><Trash2 size={32} /></button>
                    </div>
                  ))}
                  <div className="mt-24 bg-slate-950 text-white p-16 rounded-[80px] flex justify-between items-center shadow-3xl">
                    <div><p className="text-slate-500 font-black uppercase tracking-[0.6em] text-[10px] mb-6">Total Payout</p><h3 className="text-8xl font-black tracking-tighter">${cartTotal.toFixed(2)}</h3></div>
                    <button onClick={() => setActivePage('checkout')} className="bg-white text-slate-950 px-20 py-8 rounded-[40px] font-black text-2xl hover:bg-indigo-600 hover:text-white transition-all">Initiate Checkout</button>
                  </div>
                </div>
              )}
          </div>
        )}
        
        {activePage === 'profile' && (
          <div className="max-w-5xl mx-auto py-12 animate-in">
             <div className="bg-white rounded-[80px] p-20 shadow-3xl border border-white flex flex-col md:flex-row items-center gap-20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-24 opacity-5 text-indigo-600 group-hover:rotate-12 transition-transform duration-1000"><Sparkles size={300} /></div>
                <div className="w-72 h-72 rounded-[64px] bg-slate-950 flex items-center justify-center text-white relative shadow-2xl">
                  <UserIcon size={140} strokeWidth={1} />
                  <div className="absolute -bottom-8 -right-8 bg-amber-400 text-slate-950 p-8 rounded-[40px] shadow-3xl border-[10px] border-white"><Trophy size={48} /></div>
                </div>
                <div className="flex-1 text-center md:text-left relative z-10">
                  <div className="flex items-center gap-6 justify-center md:justify-start mb-6">
                    <h1 className="text-7xl font-black text-slate-900 tracking-tighter">{user.name}</h1>
                    <span className="bg-indigo-600 text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em]">Rank: {user.tier}</span>
                  </div>
                  <p className="text-2xl text-slate-400 font-medium mb-16 uppercase tracking-[0.4em]">{user.email}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em] mb-6">Available Credits</p><p className="text-6xl font-black text-indigo-600 tracking-tighter">{user.points}</p></div>
                    <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em] mb-6">Identity Wallet</p><p className="text-6xl font-black text-slate-950 tracking-tighter">${user.walletBalance.toFixed(2)}</p></div>
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
                 <button onClick={logout} className="bg-rose-50 p-10 rounded-[48px] border border-rose-100 flex justify-between items-center group hover:bg-rose-600 hover:text-white transition-all shadow-lg">
                   <div className="flex items-center gap-8">
                     <div className="p-5 bg-white rounded-[28px] text-rose-600 group-hover:bg-white/20 group-hover:text-white transition-colors"><LogOut size={32} /></div>
                     <span className="text-2xl font-black tracking-tight text-rose-600 group-hover:text-white">Close Session</span>
                   </div>
                   <ChevronRight />
                 </button>
              </div>
          </div>
        )}

        {activePage === 'wishlist' && <div className="py-12"><div className="flex items-center gap-8 mb-20"><div className="p-8 bg-rose-50 text-rose-500 rounded-[40px] shadow-2xl"><Heart size={48} fill="currentColor" /></div><h1 className="text-6xl font-black tracking-tighter">Curated Desires</h1></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">{MOCK_PRODUCTS.filter(p => wishlist.includes(p.id)).map(p => (<ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onViewDetails={(id) => { setSelectedProductId(id); setActivePage('product'); }} onToggleWishlist={toggleWishlist} isWishlisted={true} />))}</div></div>}
        {activePage === 'product' && selectedProductId && (<ProductDetail product={MOCK_PRODUCTS.find(p => p.id === selectedProductId)!} isWishlisted={wishlist.includes(selectedProductId)} onAddToCart={handleAddToCart} onBack={() => setActivePage('home')} onToggleWishlist={toggleWishlist} onViewProduct={setSelectedProductId} />)}
        {activePage === 'checkout' && <CheckoutView total={cartTotal} items={cartWithProducts} onBack={() => setActivePage('home')} onPlaceOrder={placeOrder} />}
        {activePage === 'orders' && <div className="py-12 max-w-5xl mx-auto"><div className="flex items-center gap-8 mb-20"><div className="p-8 bg-indigo-600/5 text-indigo-600 rounded-[40px] shadow-2xl"><Package size={48} /></div><h1 className="text-6xl font-black tracking-tighter">Archive History</h1></div><div className="space-y-10">{orders.map(o => (<div key={o.id} className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-xl flex justify-between items-center"><div><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-3">Serial ID: {o.id}</p><p className="font-black text-2xl text-slate-900">{new Date(o.date).toLocaleDateString()}</p></div><div className="bg-emerald-100 text-emerald-700 px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-sm">{o.status}</div><div className="text-right"><p className="text-4xl font-black text-indigo-600 tracking-tighter">${o.totalAmount.toFixed(2)}</p></div></div>))}</div></div>}
      </main>
      
      {user?.role === 'customer' && <AIHelpDesk />}
      
      <footer className="bg-slate-950 text-white pt-64 pb-20 mt-64 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-32 relative z-10">
          <div className="md:col-span-2 space-y-16">
            <h2 className="text-8xl font-black italic tracking-tighter text-indigo-600 leading-none">LUXORAA</h2>
            <p className="text-3xl text-white/40 max-w-xl font-medium leading-relaxed italic font-display">Neural curation for the modern global vanguard.</p>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 mb-12">Architecture</h4>
            <ul className="space-y-8 text-sm font-black uppercase tracking-widest text-white/60">
              <li className="hover:text-white cursor-pointer transition-all flex items-center gap-2" onClick={() => setActivePage('home')}>Marketplace</li>
              <li className="hover:text-white cursor-pointer transition-all flex items-center gap-2" onClick={() => setActivePage('profile')}>User Identity</li>
              <li className="hover:text-rose-500 cursor-pointer transition-all flex items-center gap-2" onClick={logout}>Terminate Session</li>
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
        <div className="max-w-7xl mx-auto px-6 mt-64 pt-12 border-t border-white/5 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.8em] text-white/10 relative z-10">
           <span>&copy; 2025 LUXORAA GLOBAL PROTOCOL</span>
           <span>0xNeural Node: Active</span>
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
