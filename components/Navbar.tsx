import React from 'react';
import { ShoppingCart, Heart, User, Search, Menu, Sparkles } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  userPoints: number;
  onNavigate: (page: string) => void;
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, userPoints, onNavigate, onSearch }) => {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 rounded-lg hover:bg-slate-100">
              <Menu size={20} />
            </button>
            <h1 
              onClick={() => onNavigate('home')}
              className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent cursor-pointer tracking-tighter"
            >
              LUXORAA
            </h1>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="AI Smart Search..."
                className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                onChange={(e) => onSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-4">
            {/* Loyalty Points Display */}
            <div className="hidden sm:flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
              <Sparkles size={14} className="text-indigo-600 animate-pulse" />
              <span className="text-xs font-bold text-indigo-700">{userPoints} Credits</span>
            </div>

            <button 
              onClick={() => onNavigate('wishlist')}
              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
            >
              <Heart size={22} />
            </button>
            <button 
              onClick={() => onNavigate('cart')}
              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all relative"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => onNavigate('profile')}
              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
            >
              <User size={22} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;