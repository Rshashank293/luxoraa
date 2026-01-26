
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, User, Search, Menu, X, Command, ChevronDown, Zap, Sparkles, Trophy } from 'lucide-react';

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
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuStructure = {
    Men: ['Oversized Tees', 'Classic T-Shirts', 'Polos', 'Sneakers', 'Watches'],
    Women: ['Dresses', 'Tops', 'Oversized Tees', 'Sneakers', 'Accessories'],
    Kids: ['Toys', 'Classic T-Shirts', 'Hoodies'],
    Themes: ['Marvel', 'DC Comics', 'Anime', 'Disney', 'Harry Potter', 'Star Wars']
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[120] bg-rose-600 text-white text-[10px] sm:text-[11px] py-1.5 text-center font-black uppercase tracking-[0.4em] px-4">
        {isMember ? 'ELITE STATUS ACTIVE • PRIORITY ACCESS ON' : 'JOIN LUX-ELITE FOR EXCLUSIVE SAVINGS & EARLY DROPS'}
      </div>

      <nav className={`fixed top-7 left-0 right-0 z-[110] transition-all duration-500 ${isScrolled ? 'translate-y-0' : 'translate-y-2'}`}>
        <div className={`max-w-[1400px] mx-auto h-16 sm:h-20 px-4 sm:px-8 transition-all duration-500 rounded-b-[32px] sm:rounded-b-[40px] flex justify-between items-center ${isScrolled ? 'glass shadow-2xl' : 'bg-transparent'}`}>
          
          <div className="flex items-center gap-4 sm:gap-10">
            <div onClick={() => onNavigate('home')} className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-900 rounded-lg sm:rounded-xl flex items-center justify-center text-white group-hover:rotate-12 transition-all">
                <Command size={18} />
              </div>
              <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase">LUXORAA</h1>
            </div>

            <div className="hidden lg:flex items-center gap-8">
              {Object.keys(menuStructure).map(section => (
                <div 
                  key={section}
                  className="relative group"
                  onMouseEnter={() => setActiveMegaMenu(section)}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <button className="flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-950 transition-colors py-8">
                    {section} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                  </button>
                  
                  {activeMegaMenu === section && (
                    <div className="fixed top-[104px] left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] p-12 animate-reveal">
                      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-12">
                        <div className="col-span-1 border-r border-slate-50">
                           <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] mb-8">Categories</h4>
                           <div className="flex flex-col gap-4">
                              {menuStructure[section as keyof typeof menuStructure].map(cat => (
                                <button 
                                  key={cat}
                                  onClick={() => { onNavigate('shop', section === 'Themes' ? undefined : section, section === 'Themes' ? undefined : cat, section === 'Themes' ? cat : undefined); setActiveMegaMenu(null); }}
                                  className="text-sm font-black text-slate-900 hover:text-rose-600 transition-colors text-left flex items-center gap-2 group/item"
                                >
                                   {cat} <Sparkles size={12} className="opacity-0 group-hover/item:opacity-100 transition-all text-amber-500" />
                                </button>
                              ))}
                           </div>
                        </div>
                        <div className="col-span-2 grid grid-cols-2 gap-8">
                           <div className="bg-slate-50 p-8 rounded-[40px] flex flex-col justify-end group/banner cursor-pointer hover:bg-slate-100 transition-all">
                              <span className="text-rose-600 font-black text-[9px] uppercase tracking-widest mb-2">Elite Drop</span>
                              <h5 className="text-3xl font-display italic font-black text-slate-950 tracking-tighter">Footwear <br/> Revolution.</h5>
                           </div>
                           <div className="bg-indigo-600 p-8 rounded-[40px] flex flex-col justify-end text-white group/banner cursor-pointer hover:bg-indigo-700 transition-all">
                              <span className="font-black text-[9px] uppercase tracking-widest mb-2">Vault Access</span>
                              <h5 className="text-3xl font-display italic font-black tracking-tighter">Statues & <br/> Collectibles.</h5>
                           </div>
                        </div>
                        <div className="col-span-1 flex flex-col justify-center gap-6">
                           <div className="flex items-center gap-4 p-5 bg-amber-50 rounded-3xl border border-amber-100">
                              <Trophy className="text-amber-500" fill="currentColor" size={24} />
                              <div>
                                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Elite Benefit</p>
                                <p className="text-xs font-bold text-slate-600">Free Express Delivery</p>
                              </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden md:flex relative group">
              <input
                type="text"
                placeholder="Query fandoms..."
                className="w-48 xl:w-64 bg-slate-100/50 border border-transparent rounded-2xl py-2 px-6 pl-12 text-xs font-semibold focus:bg-white focus:border-slate-900 transition-all outline-none"
                onChange={(e) => onSearch(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => onNavigate('membership')} 
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-200 transition-all"
              >
                <Trophy size={14} /> {isMember ? 'Elite' : 'Join Elite'}
              </button>
              <button onClick={() => onNavigate('cart')} className="p-3 bg-slate-900 text-white rounded-2xl flex items-center gap-2 hover:bg-rose-600 transition-all shadow-xl group">
                <ShoppingCart size={18} />
                <span className="text-[10px] font-black">{cartCount}</span>
              </button>
              <button onClick={() => onNavigate('profile')} className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-950 hover:bg-slate-200 transition-all">
                <User size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
