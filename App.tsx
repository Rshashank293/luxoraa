
import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { MOCK_PRODUCTS } from './constants';
import { Product, CartItem, Order, ShippingAddress, User, Gender, Theme, Category } from './types';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import CheckoutView from './components/CheckoutView';
import AIHelpDesk from './components/AIHelpDesk';
import AdminDashboard from './components/AdminDashboard';
import SellerDashboard from './components/SellerDashboard';
import LoginPage from './components/LoginPage';
// Added Loader2 to imports to resolve the compilation error on line 102
import { Sparkles, Command, ArrowRight, ArrowDown, Zap, Trophy, ShoppingBag, Fingerprint, Globe, ShieldCheck, Star, Package, ChevronRight, LayoutDashboard, Home, Search, Heart, User as UserIcon, Minus, Loader2 } from 'lucide-react';
import { getSmartSearch, getSmartRecommendations } from './services/geminiService';

// --- AUTH CONTEXT ---
const AuthContext = createContext<any>(null);
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated JWT persistence check
    const savedToken = localStorage.getItem('lux_session_token');
    if (savedToken) { 
      try {
        const u = JSON.parse(savedToken);
        setUser(u); 
        setIsAuthenticated(true); 
      } catch (e) {
        localStorage.removeItem('lux_session_token');
      }
    }
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const login = (u: User) => { 
    setUser(u); 
    setIsAuthenticated(true); 
    localStorage.setItem('lux_session_token', JSON.stringify(u)); 
  };
  
  const logout = () => { 
    setUser(null); 
    setIsAuthenticated(false); 
    localStorage.removeItem('lux_session_token'); 
    window.location.href = '/'; // Simple hard reset for clean state
  };

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
  const { user, login, logout, toggleMembership, isAuthenticated, loading } = useAuth();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-24">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-600/20 blur-3xl animate-pulse rounded-full" />
          <Loader2 className="animate-spin text-slate-900 relative z-10" size={64} strokeWidth={1} />
        </div>
        <p className="mt-12 text-[10px] font-black uppercase tracking-[1em] text-slate-300 animate-pulse">Syncing Matrix...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  // Handle Admin Routing
  if (user?.role === 'admin') {
    return (
      <div className="bg-slate-950 min-h-screen">
        <Navbar 
          cartCount={0} 
          userPoints={0} 
          onNavigate={() => {}} 
          onSearch={() => {}} 
          userRole="admin"
        />
        <div className="pt-24">
          <AdminDashboard user={user} products={MOCK_PRODUCTS} orders={[]} />
        </div>
        <button onClick={logout} className="fixed top-8 right-8 z-[200] px-6 py-3 bg-white/10 hover:bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Terminate Ops</button>
      </div>
    );
  }

  // Handle Seller Routing
  if (user?.role === 'seller') {
    return (
      <div className="bg-[#F8F7F4] min-h-screen">
        <Navbar cartCount={0} userPoints={0} onNavigate={() => {}} onSearch={() => {}} userRole="seller" />
        <div className="pt-24">
          <SellerDashboard seller={user} products={MOCK_PRODUCTS} orders={[]} />
        </div>
        <button onClick={logout} className="fixed top-8 right-8 z-[200] px-6 py-3 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Exit Merchant</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col">
      <Navbar 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        userPoints={user?.points || 0} 
        onNavigate={handleNavigate} 
        onSearch={q => setSearchQuery(q)} 
        userRole={user?.role} 
        isMember={user?.isMember}
      />
      
      <main className="flex-1 pt-24 sm:pt-32">
        <button onClick={logout} className="fixed top-12 right-12 z-[200] hidden sm:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-900 transition-all p-3 glass rounded-full shadow-xl">
           <Fingerprint size={16} /> Logout Protocol
        </button>

        {activePage === 'home' && (
          <div className="space-y-32 sm:space-y-48 pb-40">
            {/* HERO SECTION */}
            <section className="max-w-[1440px] mx-auto px-4 sm:px-12">
              <div className="relative h-[80vh] sm:h-[90vh] rounded-[48px] sm:rounded-[64px] overflow-hidden bg-white shadow-2xl flex flex-col lg:flex-row">
                <div className="lg:w-1/2 p-8 sm:p-24 flex flex-col justify-center items-start space-y-8 sm:space-y-12 z-10">
                   <div className="animate-lux">
                      <span className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-300 mb-8 block">New Season • '25</span>
                      <h2 className="text-7xl sm:text-[9rem] font-display italic font-black leading-[0.8] tracking-tighter text-slate-900">
                        Elevate <br/> Your <br/> <span className="opacity-20 font-sans tracking-tight not-italic">Elegance.</span>
                      </h2>
                      <button onClick={() => handleNavigate('shop')} className="mt-12 bg-slate-900 text-white px-16 py-6 sm:px-24 sm:py-8 rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-[#D4AF37] transition-all shadow-4xl group flex items-center gap-6">
                        Shop Now <ArrowRight className="group-hover:translate-x-3 transition-transform" />
                      </button>
                   </div>
                </div>
                <div className="hidden lg:block lg:w-1/2 relative">
                   <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="Luxury Fashion" />
                </div>
              </div>
            </section>
            
            {/* PRODUCT GRID */}
            <section className="max-w-[1440px] mx-auto px-4 sm:px-12">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
                  {MOCK_PRODUCTS.slice(0, 4).map(p => (
                    <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onViewDetails={id => { setSelectedProductId(id); setActivePage('product'); }} onToggleWishlist={() => {}} isWishlisted={false} isUserMember={user?.isMember} />
                  ))}
               </div>
            </section>
          </div>
        )}

        {activePage === 'shop' && (
          <div className="max-w-[1440px] mx-auto px-4 sm:px-12 pb-48 animate-lux">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 sm:gap-12">
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
      <nav className="sm:hidden fixed bottom-6 left-6 right-6 z-[100] h-20 bg-white shadow-2xl rounded-[32px] border border-slate-100 flex items-center justify-around px-8">
        {[
          { icon: Home, page: 'home' },
          { icon: Search, page: 'shop' },
          { icon: Trophy, page: 'membership' },
          { icon: ShoppingBag, page: 'cart' },
          { icon: UserIcon, page: 'profile' }
        ].map(item => (
          <button key={item.page} onClick={() => handleNavigate(item.page)} className={`p-3 transition-all ${activePage === item.page ? 'text-slate-900 scale-125' : 'text-slate-300'}`}>
            <item.icon size={24} />
          </button>
        ))}
      </nav>

      <AIHelpDesk />
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <LuxoraaApp />
  </AuthProvider>
);

export default App;
