import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, Search } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  userPoints: number;
  onNavigate: (page: string) => void;
  onSearch: (query: string) => void;
  userRole?: string;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = ['Home', 'Women', 'Men', 'Accessories', 'Sale'];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-1000 ${isScrolled ? 'pt-4' : 'pt-8'}`}>
      <div className={`max-w-[1500px] mx-auto h-20 px-12 transition-all duration-700 rounded-full flex justify-between items-center ${isScrolled ? 'glass-dark shadow-2xl mx-6' : 'bg-transparent'}`}>
        
        {/* Branding */}
        <div onClick={() => onNavigate('home')} className="cursor-pointer">
          <h1 className="text-xl sm:text-2xl font-black italic tracking-[0.3em] font-display text-white">LUXORAA</h1>
        </div>

        {/* Navigation */}
        <div className="hidden lg:flex items-center gap-12">
          {links.map(link => (
            <button 
              key={link} 
              onClick={() => onNavigate(link === 'Home' ? 'home' : 'shop')}
              className="text-[9px] font-black uppercase tracking-[0.4em] text-white/50 hover:text-white transition-all"
            >
              {link}
            </button>
          ))}
        </div>

        {/* Interaction Node */}
        <div className="flex items-center gap-8">
          <button className="text-white/40 hover:text-white transition-colors"><Search size={18} /></button>
          <button onClick={() => onNavigate('profile')} className="text-white/40 hover:text-white transition-colors"><User size={18} /></button>
          <button onClick={() => onNavigate('cart')} className="relative text-white flex items-center gap-2">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] text-black text-[8px] font-black rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;