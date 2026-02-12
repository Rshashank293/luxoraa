
import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, Search, Heart, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  userPoints: number;
  onNavigate: (page: string, gender?: string, category?: string, theme?: string) => void;
  onSearch: (query: string) => void;
  userRole?: string;
  isMember?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onNavigate, userRole }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = ['Home', 'Women', 'Men', 'Accessories', 'Sale'];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[150] transition-all duration-700 px-6 sm:px-16 py-6 sm:py-8 ${isScrolled ? 'py-4' : 'py-8'}`}>
      <div className={`max-w-[1500px] mx-auto h-20 px-12 transition-all duration-700 rounded-full flex justify-between items-center ${isScrolled ? 'glass-dark shadow-2xl border-white/10' : 'bg-transparent'}`}>
        
        {/* Logo */}
        <div onClick={() => onNavigate('home')} className="flex items-center gap-4 cursor-pointer group">
          <h1 className="text-xl sm:text-2xl font-black italic tracking-[0.2em] uppercase font-display text-white">LUXORAA</h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-12">
          {sections.map(sec => (
            <button 
              key={sec} 
              onClick={() => onNavigate(sec.toLowerCase() === 'home' ? 'home' : 'shop')}
              className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 hover:text-white transition-all hover:translate-y-[-1px]"
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-8">
          <button className="text-white/40 hover:text-white transition-colors"><Search size={18} /></button>
          <button onClick={() => onNavigate('profile')} className="text-white/40 hover:text-white transition-colors"><User size={18} /></button>
          <button onClick={() => onNavigate('cart')} className="relative group text-white">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] text-black text-[8px] font-black rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          {userRole === 'admin' && <ShieldCheck size={20} className="text-[#D4AF37]" />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
