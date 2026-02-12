import React, { useState, useEffect, createContext, useContext } from 'react';
import { MOCK_PRODUCTS } from './constants';
import { CartItem, User } from './types';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import AIHelpDesk from './components/AIHelpDesk';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './components/LoginPage';
import { ArrowRight, Star, ShieldCheck, Package, Smartphone, Instagram, Mail, Facebook, Twitter, Loader2 } from 'lucide-react';

const AuthContext = createContext<any>(null);
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('lux_session');
    if (saved) { setUser(JSON.parse(saved)); setIsAuthenticated(true); }
    setTimeout(() => setLoading(false), 1200);
  }, []);

  const login = (u: User) => { setUser(u); setIsAuthenticated(true); localStorage.setItem('lux_session', JSON.stringify(u)); };
  const logout = () => { setUser(null); setIsAuthenticated(false); localStorage.removeItem('lux_session'); window.location.href = '/'; };

  return <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>{children}</AuthContext.Provider>;
};

const LuxoraaApp: React.FC = () => {
  const { user, login, logout, isAuthenticated, loading } = useContext(AuthContext);
  const [activePage, setActivePage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleNavigate = (page: string) => { setActivePage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleAddToCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === id);
      if (existing) return prev.map(i => i.productId === id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { productId: id, quantity: 1 }];
    });
  };

  if (loading) return (
    <div className="h-screen bg-[#0A0908] flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-[#D4AF37] mb-8" size={48} />
      <h1 className="text-xl font-display italic tracking-[0.5em] text-[#D4AF37]/40">LUXORAA</h1>
    </div>
  );

  if (!isAuthenticated) return <LoginPage onLogin={login} />;

  if (user?.role === 'admin') return (
    <div className="bg-[#0A0908] min-h-screen text-white">
      <Navbar cartCount={0} userPoints={0} onNavigate={() => {}} onSearch={() => {}} userRole="admin" />
      <div className="pt-24"><AdminDashboard user={user} products={MOCK_PRODUCTS} orders={[]} /></div>
      <button onClick={logout} className="fixed top-8 right-8 z-[200] px-6 py-2 bg-[#D4AF37] text-black text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all">Terminate Hub</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0908] selection:bg-[#D4AF37] selection:text-black">
      <Navbar cartCount={cart.length} userPoints={user?.points || 0} onNavigate={handleNavigate} onSearch={() => {}} userRole={user?.role} />
      
      <main>
        {activePage === 'home' && (
          <div className="animate-lux">
            {/* HERO SECTION */}
            <section className="relative h-screen flex items-center overflow-hidden sepia-layer">
              <div className="absolute inset-0">
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2400" className="w-full h-full object-cover scale-105" alt="Luxury Hero" />
                <div className="absolute inset-0 bg-black/30" />
              </div>
              <div className="relative z-10 max-w-[1500px] mx-auto px-16 w-full">
                <div className="max-w-3xl">
                  <h1 className="text-[7rem] sm:text-[10rem] font-display font-black leading-[0.85] text-white tracking-tighter mb-12">
                    Elevate <br/> Your <br/> <span className="italic">Elegance</span>
                  </h1>
                  <p className="text-white/60 text-lg font-display italic mb-16 max-w-md">Discover the epitome of luxury fashion at Luxoraa, where every artifact tells a story of heritage.</p>
                  <button onClick={() => handleNavigate('shop')} className="btn-gold px-14 py-6 text-xs flex items-center gap-6 group">
                    Shop Now <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />
                  </button>
                </div>
              </div>
              
              {/* Trust Signaling */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-2xl border-t border-white/5 py-14">
                <div className="max-w-[1500px] mx-auto px-16 grid grid-cols-2 lg:grid-cols-4 gap-12">
                  {[
                    { label: '4.9/5 Rating', desc: 'Authentication Verified', icon: Star },
                    { label: 'Secure Checkout', desc: 'SSL Encryption Node', icon: ShieldCheck },
                    { label: 'Free Shipping', desc: 'Global Node Delivery', icon: Package },
                    { label: '24/7 Support', desc: 'Concierge Terminal', icon: Smartphone }
                  ].map((v, i) => (
                    <div key={i} className="flex items-center gap-6">
                      <div className="p-3 bg-white/5 text-[#D4AF37] border border-white/10"><v.icon size={24} strokeWidth={1} /></div>
                      <div><p className="text-sm font-black text-white">{v.label}</p><p className="text-[9px] uppercase text-white/40 tracking-widest">{v.desc}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* NEW ARRIVALS */}
            <section className="bg-[#0A0908] py-32">
              <div className="max-w-[1500px] mx-auto px-16">
                <div className="flex justify-between items-end mb-24">
                  <h2 className="text-6xl font-display italic font-black text-white tracking-tighter">New Arrivals</h2>
                  <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest">
                    <button className="text-[#D4AF37] border-b border-[#D4AF37] pb-2">Bestselling</button>
                    <button className="text-white/30 hover:text-white transition-colors">Trending</button>
                    <button className="text-white/30 hover:text-white transition-colors">On Sale</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
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

            {/* SPECIAL OFFER */}
            <section className="relative py-56 overflow-hidden">
              <div className="absolute inset-0">
                <img src="https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=2400" className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
              </div>
              <div className="relative z-10 max-w-[1500px] mx-auto px-16">
                <h2 className="text-[6rem] font-display font-black italic text-white mb-8">Get 20% Off</h2>
                <p className="text-white/40 text-xl font-display italic mb-16 max-w-md">Limited time only. Elevate your collection with our signature artifacts.</p>
                <div className="flex items-center gap-14">
                  <button className="btn-gold px-12 py-5 text-xs">Claim Invitation</button>
                  <div className="flex gap-10 text-white">
                    <div className="text-center"><p className="text-4xl font-display italic font-black">02</p><p className="text-[8px] uppercase tracking-widest text-white/40">Days</p></div>
                    <div className="text-center"><p className="text-4xl font-display italic font-black">14</p><p className="text-[8px] uppercase tracking-widest text-white/40">Hrs</p></div>
                    <div className="text-center"><p className="text-4xl font-display italic font-black">07</p><p className="text-[8px] uppercase tracking-widest text-white/40">Mins</p></div>
                  </div>
                </div>
              </div>
            </section>

            {/* INSTAGRAM COLLECTIVE */}
            <section className="bg-[#0A0908] py-40">
              <div className="max-w-[1500px] mx-auto px-16 text-center">
                <h2 className="text-5xl font-display italic font-black text-white mb-6">Instagram Collective</h2>
                <p className="text-white/40 text-lg font-display italic mb-20">Share your styles with #Luxoraa</p>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                  {[
                    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b',
                    'https://images.unsplash.com/photo-1483985988355-763728e1935b',
                    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d',
                    'https://images.unsplash.com/photo-1509631179647-0177331693ae',
                    'https://images.unsplash.com/photo-1496747611176-843222e1e57c',
                    'https://images.unsplash.com/photo-1445205170230-053b83016050'
                  ].map((img, i) => (
                    <div key={i} className="aspect-square relative overflow-hidden group cursor-pointer">
                      <img src={`${img}?auto=format&fit=crop&q=80&w=600`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Instagram className="text-white" size={24} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* LUXURY FOOTER */}
            <footer className="bg-black border-t border-white/5 py-24">
              <div className="max-w-[1500px] mx-auto px-16 flex flex-col items-center">
                <h3 className="text-2xl font-black italic tracking-[0.5em] text-white uppercase mb-16 font-display">LUXORAA</h3>
                <div className="flex gap-16 text-[10px] font-black uppercase tracking-widest text-white/30 mb-20">
                  <button className="hover:text-white transition-colors">Heritage</button>
                  <button className="hover:text-white transition-colors">Collection</button>
                  <button className="hover:text-white transition-colors">Sustainability</button>
                  <button className="hover:text-white transition-colors">Privacy</button>
                </div>
                <div className="flex gap-10 mb-16">
                  <Instagram size={18} className="text-white/40 hover:text-[#D4AF37] transition-all" />
                  <Facebook size={18} className="text-white/40 hover:text-[#D4AF37] transition-all" />
                  <Twitter size={18} className="text-white/40 hover:text-[#D4AF37] transition-all" />
                  <Mail size={18} className="text-white/40 hover:text-[#D4AF37] transition-all" />
                </div>
                <p className="text-[9px] text-white/10 uppercase tracking-[0.4em]">&copy; 2025 Luxoraa Premium Shards. Global Identity Reserved.</p>
              </div>
            </footer>
          </div>
        )}

        {activePage === 'product' && selectedProductId && (
          <ProductDetail 
            product={MOCK_PRODUCTS.find(p => p.id === selectedProductId)!} 
            onBack={() => handleNavigate('home')} 
            onAddToCart={handleAddToCart} 
            onToggleWishlist={() => {}} 
            onViewProduct={setSelectedProductId}
            isWishlisted={false}
          />
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