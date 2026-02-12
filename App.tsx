
import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { MOCK_PRODUCTS } from './constants';
import { Product, CartItem, Order, User, Gender, Theme, Category } from './types';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import AIHelpDesk from './components/AIHelpDesk';
import AdminDashboard from './components/AdminDashboard';
import SellerDashboard from './components/SellerDashboard';
import LoginPage from './components/LoginPage';
import { ArrowRight, Trophy, ShoppingBag, ShieldCheck, Star, Package, CheckCircle, Smartphone, MapPin, Loader2, Sparkles, Instagram, Facebook, Twitter, Mail } from 'lucide-react';

// --- AUTH CONTEXT ---
const AuthContext = createContext<any>(null);
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('lux_session_token');
    if (savedToken) { 
      try { setUser(JSON.parse(savedToken)); setIsAuthenticated(true); } catch (e) { localStorage.removeItem('lux_session_token'); }
    }
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const login = (u: User) => { 
    setUser(u); setIsAuthenticated(true); localStorage.setItem('lux_session_token', JSON.stringify(u)); 
  };
  
  const logout = () => { 
    setUser(null); setIsAuthenticated(false); localStorage.removeItem('lux_session_token'); window.location.href = '/';
  };

  return <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

// --- MAIN APP ---
const LuxoraaApp: React.FC = () => {
  const { user, login, logout, isAuthenticated, loading } = useAuth();
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigate = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === id);
      if (existing) return prev.map(i => i.productId === id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { productId: id, quantity: 1 }];
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0908] flex flex-col items-center justify-center p-24">
        <Loader2 className="animate-spin text-[#D4AF37] mb-8" size={64} strokeWidth={1} />
        <p className="text-[10px] font-black uppercase tracking-[1em] text-[#D4AF37]/40 animate-pulse">LUXORAA MATRIX</p>
      </div>
    );
  }

  if (!isAuthenticated) return <LoginPage onLogin={login} />;

  if (user?.role === 'admin') {
    return (
      <div className="bg-[#0A0908] min-h-screen text-white">
        <Navbar cartCount={0} userPoints={0} onNavigate={() => {}} onSearch={() => {}} userRole="admin" />
        <div className="pt-24"><AdminDashboard user={user} products={MOCK_PRODUCTS} orders={[]} /></div>
        <button onClick={logout} className="fixed top-8 right-8 z-[200] px-6 py-3 bg-white/5 border border-white/10 text-[#D4AF37] rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all">TERMINATE SESSION</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0908] flex flex-col">
      <Navbar 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        userPoints={user?.points || 0} 
        onNavigate={handleNavigate} 
        onSearch={q => setSearchQuery(q)} 
        userRole={user?.role} 
        isMember={user?.isMember}
      />
      
      <main className="flex-1">
        {activePage === 'home' && (
          <div className="space-y-0 pb-0">
            {/* HERO SECTION - REPLICA */}
            <section className="relative h-screen min-h-[900px] flex items-center overflow-hidden">
               <div className="absolute inset-0 sepia-overlay">
                  <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2400" className="w-full h-full object-cover scale-105" alt="Luxury Hero" />
               </div>
               <div className="relative z-10 max-w-[1500px] mx-auto px-16 w-full flex justify-between items-center">
                  <div className="max-w-2xl animate-lux">
                     <h1 className="text-8xl sm:text-[9rem] font-display font-black leading-[0.9] text-white tracking-tighter mb-10">
                        Elevate <br/> Your <br/> <span className="italic">Elegance</span>
                     </h1>
                     <p className="text-white/60 text-lg italic font-display mb-12 max-w-md">Discover the epitome of luxury fashion at Luxoraa, where every artifact tells a story of heritage.</p>
                     <button onClick={() => handleNavigate('shop')} className="btn-gold px-12 py-5 rounded-none text-xs flex items-center gap-6 group">
                        Shop Now <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                     </button>
                  </div>
                  <div className="hidden xl:block w-[450px] aspect-[3/4] rounded-none overflow-hidden shadow-2xl border-4 border-white/5 relative group">
                     <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                     <div className="absolute bottom-8 left-8 text-white">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-2">Exclusive Artifact</p>
                        <h4 className="text-3xl font-display italic">Signature Quilted</h4>
                     </div>
                  </div>
               </div>
               
               {/* Brand Values Sub-Hero */}
               <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md border-t border-white/5 py-12">
                  <div className="max-w-[1500px] mx-auto px-16 grid grid-cols-4 gap-12">
                     {[
                        { label: '4.9/5 Rating', desc: 'Authentication Reviews', icon: Star },
                        { label: 'Secure Checkout', desc: 'SSL Encryption Node', icon: ShieldCheck },
                        { label: 'Free Shipping', desc: 'Complimentary Delivery', icon: Package },
                        { label: '24/7 Support', desc: 'Concierge Terminal', icon: Smartphone }
                     ].map((v, i) => (
                        <div key={i} className="flex items-center gap-6">
                           <div className="p-3 bg-white/5 text-[#D4AF37] rounded-none border border-white/10"><v.icon size={24} strokeWidth={1} /></div>
                           <div><p className="text-sm font-black text-white">{v.label}</p><p className="text-[10px] uppercase text-white/40 tracking-widest">{v.desc}</p></div>
                        </div>
                     ))}
                  </div>
               </div>
            </section>
            
            {/* NEW ARRIVALS GRID */}
            <section className="bg-[#0A0908] py-32">
               <div className="max-w-[1500px] mx-auto px-16">
                  <div className="flex justify-between items-end mb-20">
                     <h2 className="text-6xl font-display italic font-black text-white tracking-tighter">New Arrivals</h2>
                     <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest">
                        <button className="text-[#D4AF37] border-b border-[#D4AF37] pb-1">Bestselling</button>
                        <button className="text-white/40 hover:text-white transition-colors">Trending</button>
                        <button className="text-white/40 hover:text-white transition-colors">On Sale</button>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
               </div>
            </section>

            {/* SPECIAL OFFER BANNER */}
            <section className="relative py-48 overflow-hidden group">
               <div className="absolute inset-0">
                  <img src="https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=2400" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[10s]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
               </div>
               <div className="relative z-10 max-w-[1500px] mx-auto px-16">
                  <span className="text-[10px] font-black uppercase tracking-[0.8em] text-[#D4AF37] mb-8 block">Exclusive Opportunity</span>
                  <h2 className="text-8xl font-display font-black italic text-white mb-12">Get 20% Off</h2>
                  <p className="text-white/40 text-xl font-display italic mb-16 max-w-md">Limited time only. Elevate your collection with our signature artifacts at an unprecedented rate.</p>
                  <div className="flex items-center gap-12">
                     <button className="btn-gold px-12 py-5 text-xs">Get 20% Off</button>
                     <div className="flex gap-8 text-white">
                        <div className="text-center">
                           <p className="text-4xl font-display italic font-black">02</p>
                           <p className="text-[8px] uppercase tracking-widest text-white/40">Days</p>
                        </div>
                        <div className="text-center">
                           <p className="text-4xl font-display italic font-black">14</p>
                           <p className="text-[8px] uppercase tracking-widest text-white/40">Hrs</p>
                        </div>
                        <div className="text-center">
                           <p className="text-4xl font-display italic font-black">07</p>
                           <p className="text-[8px] uppercase tracking-widest text-white/40">Mins</p>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* INSTAGRAM FEED */}
            <section className="bg-[#0A0908] py-48">
               <div className="max-w-[1500px] mx-auto px-16 text-center">
                  <h2 className="text-6xl font-display italic font-black text-white mb-6">Follow us on Instagram</h2>
                  <p className="text-white/40 text-lg font-display italic mb-20">Share your styles with #Luxoraa for a chance to be featured.</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                     {[
                        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b',
                        'https://images.unsplash.com/photo-1483985988355-763728e1935b',
                        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d',
                        'https://images.unsplash.com/photo-1509631179647-0177331693ae',
                        'https://images.unsplash.com/photo-1496747611176-843222e1e57c',
                        'https://images.unsplash.com/photo-1445205170230-053b83016050'
                     ].map((img, i) => (
                        <div key={i} className="aspect-square relative overflow-hidden group cursor-pointer">
                           <img src={`${img}?auto=format&fit=crop&q=80&w=600`} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Instagram className="text-white" size={24} />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-black border-t border-white/5 py-24">
               <div className="max-w-[1500px] mx-auto px-16 flex flex-col items-center">
                  <h3 className="text-2xl font-black italic tracking-[0.4em] text-white uppercase mb-16 font-display">LUXORAA</h3>
                  <div className="flex gap-16 text-[10px] font-black uppercase tracking-widest text-white/40 mb-20">
                     <button className="hover:text-white transition-colors">About Us</button>
                     <button className="hover:text-white transition-colors">Collection</button>
                     <button className="hover:text-white transition-colors">Sustainability</button>
                     <button className="hover:text-white transition-colors">Privacy Policy</button>
                  </div>
                  <div className="flex gap-8 mb-12">
                     <button className="p-4 bg-white/5 rounded-full text-white hover:bg-[#D4AF37] hover:text-black transition-all"><Instagram size={20} /></button>
                     <button className="p-4 bg-white/5 rounded-full text-white hover:bg-[#D4AF37] hover:text-black transition-all"><Facebook size={20} /></button>
                     <button className="p-4 bg-white/5 rounded-full text-white hover:bg-[#D4AF37] hover:text-black transition-all"><Twitter size={20} /></button>
                     <button className="p-4 bg-white/5 rounded-full text-white hover:bg-[#D4AF37] hover:text-black transition-all"><Mail size={20} /></button>
                  </div>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest">&copy; 2025 Luxoraa Premium Collective. All rights reserved.</p>
               </div>
            </footer>
          </div>
        )}

        {activePage === 'product' && selectedProductId && (
          <div className="bg-[#FDFCFB]">
            <ProductDetail 
              product={MOCK_PRODUCTS.find(p => p.id === selectedProductId)!} 
              onBack={() => handleNavigate('home')} 
              onAddToCart={handleAddToCart} 
              onToggleWishlist={() => {}} 
              onViewProduct={setSelectedProductId}
              isWishlisted={false}
            />
          </div>
        )}
      </main>

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
