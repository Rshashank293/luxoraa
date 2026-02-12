
import React, { useState, useEffect } from 'react';
// Added ShoppingBag to imports to resolve the compilation error on line 56
import { ShoppingBag, Heart, User, Search, Menu, X, Command, ChevronDown, Zap, Sparkles, Trophy } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  userPoints: number;
  onNavigate: (page: string, gender?: string, category?: string, theme?: string) => void;
  onSearch: (query: string) => void;
  userRole?: string;
  isMember?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onNavigate, onSearch, userRole, isMember }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = ['Women', 'Men', 'Accessories', 'Sale'];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[110] transition-all duration-700 px-4 sm:px-12 py-6 sm:py-8 ${isScrolled ? 'translate-y-0' : 'translate-y-0'}`}>
      <div className={`max-w-[1400px] mx-auto h-20 sm:h-24 px-8 sm:px-16 transition-all duration-700 rounded-full flex justify-between items-center ${isScrolled ? 'glass shadow-2xl shadow-black/5' : 'bg-transparent'}`}>
        
        {/* Logo Section */}
        <div onClick={() => onNavigate('home')} className="flex items-center gap-4 cursor-pointer group">
          <h1 className="text-2xl sm:text-3xl font-black italic tracking-tighter uppercase font-display">LUXORAA</h1>
        </div>

        {/* Minimalist Centered Menu */}
        <div className="hidden lg:flex items-center gap-16">
          {sections.map(sec => (
            <button 
              key={sec} 
              onClick={() => onNavigate('shop', sec === 'Women' || sec === 'Men' ? (sec as any) : undefined)}
              className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 hover:text-slate-950 transition-colors"
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-6 sm:gap-10">
          <div className="hidden md:flex items-center gap-2 group cursor-pointer text-slate-300 hover:text-slate-900 transition-colors">
             <Search size={18} />
             <span className="text-[10px] font-black uppercase tracking-widest">Query</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            <button onClick={() => onNavigate('cart')} className="relative group">
              <ShoppingBag size={22} className="text-slate-900 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-slate-900 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => onNavigate('profile')} className="p-3 bg-slate-950 text-white rounded-full shadow-lg hover:bg-[#D4AF37] transition-all">
              <User size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
