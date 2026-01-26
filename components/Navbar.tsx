import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, User, Search, Menu, X, Sparkles, ShieldAlert, Store, ChevronDown, LogIn } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  userPoints: number;
  onNavigate: (page: string) => void;
  onSearch: (query: string) => void;
  userRole?: string;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, userPoints, onNavigate, onSearch, userRole }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAdmin = userRole === 'admin';
  const isSeller = userRole === 'seller';
  const isSpecialRole = isAdmin || isSeller;
  const isAuthenticated = !!userRole;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Collection', page: 'home' },
    { name: 'Trending', page: 'home' },
    { name: 'Gift Guide', page: 'home' }
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] bg-slate-950 text-white text-[10px] py-2 text-center font-black uppercase tracking-[0.3em]">
        Free Global Priority Shipping on orders over $500
      </div>

      <nav className={`fixed top-8 left-0 right-0 z-[90] transition-all duration-500 ${
        isScrolled ? 'h-16 shadow-2xl border-b border-white/10' : 'h-20'
      } ${isSpecialRole ? 'bg-slate-950 text-white' : 'glass'}`}>
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <div className="flex items-center gap-10">
            <div 
              onClick={() => onNavigate(isAdmin ? 'admin' : isSeller ? 'seller' : 'home')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <h1 className="text-2xl font-black tracking-tighter italic transition-all group-hover:scale-105">LUXORAA</h1>
              {isAdmin && <span className="bg-rose-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">Ops</span>}
              {isSeller && <span className="bg-emerald-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">Store</span>}
            </div>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <button 
                  key={link.name} 
                  onClick={() => onNavigate(link.page)}
                  className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-sm mx-10">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search catalog..."
                className="w-full bg-slate-100/50 border border-transparent rounded-2xl py-2.5 pl-11 pr-4 focus:bg-white focus:border-indigo-600/20 focus:ring-4 focus:ring-indigo-600/5 transition-all text-xs font-bold outline-none"
                onChange={(e) => onSearch(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600" size={16} />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-6">
            {!isSpecialRole ? (
              <>
                {isAuthenticated && (
                  <div className="hidden sm:flex items-center gap-2 bg-indigo-600/5 px-4 py-2 rounded-full border border-indigo-600/10">
                    <Sparkles size={14} className="text-indigo-600" />
                    <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">{userPoints} pts</span>
                  </div>
                )}
                <button onClick={() => onNavigate('wishlist')} className="p-2 text-slate-400 hover:text-rose-500 transition-all"><Heart size={20} /></button>
                <button onClick={() => onNavigate('cart')} className="p-2 text-slate-400 hover:text-indigo-600 transition-all relative">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => onNavigate('profile')} 
                  className={`flex items-center gap-2 p-2 rounded-full transition-all ${isAuthenticated ? 'text-slate-400 hover:text-indigo-600' : 'bg-slate-900 text-white px-4 hover:bg-indigo-600'}`}
                >
                  {isAuthenticated ? <User size={20} /> : <><LogIn size={18} /><span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Sign In</span></>}
                </button>
              </>
            ) : (
              <button 
                onClick={() => onNavigate('profile')} 
                className={`flex items-center gap-3 p-1.5 pr-4 rounded-full transition-all bg-white/10 hover:bg-white/20`}
              >
                <div className={`p-2 rounded-full ${isAdmin ? 'bg-rose-600' : 'bg-emerald-600'}`}>
                  {isAdmin ? <ShieldAlert size={16} /> : <Store size={16} />}
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Dashboard</span>
              </button>
            )}
            
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="lg:hidden p-2 text-slate-400 hover:text-indigo-600"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`lg:hidden fixed inset-0 z-[110] bg-white transition-all duration-500 ${
          isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}>
          <div className="p-6 flex justify-between items-center border-b border-slate-100">
            <h1 className="text-2xl font-black italic">LUXORAA</h1>
            <button onClick={() => setIsMobileMenuOpen(false)}><X size={32} /></button>
          </div>
          <div className="p-10 space-y-8">
            {navLinks.map(link => (
              <button 
                key={link.name}
                onClick={() => { onNavigate(link.page); setIsMobileMenuOpen(false); }}
                className="block text-4xl font-black uppercase tracking-tighter hover:text-indigo-600 transition-colors"
              >
                {link.name}
              </button>
            ))}
            <div className="pt-10 border-t border-slate-100 space-y-4">
              <button onClick={() => { onNavigate('profile'); setIsMobileMenuOpen(false); }} className="flex items-center gap-4 text-lg font-bold">
                <User size={24} /> {isAuthenticated ? 'My Profile' : 'Sign In'}
              </button>
              <button onClick={() => { onNavigate('wishlist'); setIsMobileMenuOpen(false); }} className="flex items-center gap-4 text-lg font-bold">
                <Heart size={24} /> Wishlist
              </button>
              <button onClick={() => { onNavigate('cart'); setIsMobileMenuOpen(false); }} className="flex items-center gap-4 text-lg font-bold">
                <ShoppingCart size={24} /> Cart ({cartCount})
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;