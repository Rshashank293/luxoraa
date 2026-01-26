
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, User, Search, Menu, X, Sparkles, ShieldAlert, Store, LogIn, Command } from 'lucide-react';

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
  const isAuthenticated = !!userRole;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[110] bg-slate-950 text-white/40 text-[9px] py-1.5 text-center font-bold uppercase tracking-[0.6em]">
        Curation node: Global / Identity v4.0.2
      </div>

      <nav className={`fixed top-8 left-0 right-0 z-[100] transition-all duration-700 px-6 sm:px-12 ${
        isScrolled ? 'translate-y-0' : 'translate-y-4'
      }`}>
        <div className={`max-w-7xl mx-auto h-16 sm:h-20 flex justify-between items-center px-8 transition-all duration-500 rounded-[32px] ${
          isScrolled ? 'glass shadow-2xl scale-[0.98]' : 'bg-transparent'
        }`}>
          {/* Brand Shard */}
          <div className="flex items-center gap-12">
            <div 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative">
                <div className="w-8 h-8 bg-slate-900 rounded-lg group-hover:rotate-[15deg] transition-transform duration-500 flex items-center justify-center text-white">
                  <Command size={16} />
                </div>
                {isAdmin && <div className="absolute -top-2 -right-2 w-4 h-4 bg-rose-500 rounded-full border-2 border-white" />}
              </div>
              <h1 className="text-xl font-black tracking-tighter italic uppercase group-hover:tracking-normal transition-all duration-700">LUXORAA</h1>
            </div>

            <div className="hidden xl:flex items-center gap-10">
              {['Market', 'Journal', 'Vanguard'].map(item => (
                <button 
                  key={item} 
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 group-hover:w-full transition-all duration-500" />
                </button>
              ))}
            </div>
          </div>

          {/* Search Engine Shard */}
          <div className="hidden lg:flex flex-1 max-w-md mx-12">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Query artifacts..."
                className="w-full bg-slate-100/30 border border-slate-200/50 rounded-2xl py-2.5 pl-12 pr-4 focus:bg-white focus:ring-[12px] focus:ring-slate-900/5 focus:border-slate-900 transition-all text-xs font-semibold outline-none"
                onChange={(e) => onSearch(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-slate-900" size={16} />
            </div>
          </div>

          {/* Interaction Shard */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center bg-slate-100/50 p-1.5 rounded-2xl gap-1">
              <button onClick={() => onNavigate('wishlist')} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-white rounded-xl transition-all"><Heart size={18} /></button>
              <button onClick={() => onNavigate('cart')} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all relative">
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-slate-950 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            <button 
              onClick={() => onNavigate('profile')} 
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-500 ${
                isAuthenticated 
                ? 'bg-slate-100 text-slate-900 hover:bg-slate-200' 
                : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-xl shadow-indigo-600/20'
              }`}
            >
              {isAuthenticated ? (
                <>
                  <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                    {userPoints > 0 ? 'P' : <User size={12} />}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest hidden lg:inline">Access Identity</span>
                </>
              ) : (
                <>
                  <LogIn size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Authenticate</span>
                </>
              )}
            </button>
            
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="lg:hidden p-3 text-slate-900 bg-slate-100 rounded-2xl"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Cinematic Mobile Menu */}
        <div className={`fixed inset-0 z-[200] bg-slate-950/40 backdrop-blur-3xl transition-all duration-700 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}>
          <div className={`absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-2xl transition-transform duration-700 ease-expo ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="p-8 flex justify-between items-center border-b border-slate-100">
              <h1 className="text-xl font-black italic uppercase">LUXORAA</h1>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-slate-100 rounded-2xl"><X size={24} /></button>
            </div>
            <div className="p-10 space-y-12">
              {['Home', 'Marketplace', 'Archive', 'Identity'].map((item, idx) => (
                <button 
                  key={item}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-5xl font-black italic tracking-tighter hover:text-indigo-600 transition-all duration-500 delay-${idx * 100}`}
                >
                  {item}.
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
