
import React from 'react';
import { ShoppingCart, Heart, User, Search, Menu, Sparkles, LayoutDashboard, ShieldAlert, Store } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  userPoints: number;
  onNavigate: (page: string) => void;
  onSearch: (query: string) => void;
  userRole?: string;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, userPoints, onNavigate, onSearch, userRole }) => {
  const isAdmin = userRole === 'admin';
  const isSeller = userRole === 'seller';
  const isSpecialRole = isAdmin || isSeller;

  return (
    <nav className={`sticky top-0 z-50 transition-colors duration-500 border-b ${isSpecialRole ? 'bg-slate-900 text-white border-white/10' : 'glass border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <button className={`md:hidden p-2 rounded-lg ${isSpecialRole ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}>
              <Menu size={20} />
            </button>
            <div 
              onClick={() => onNavigate(isAdmin ? 'admin' : isSeller ? 'seller' : 'home')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <h1 className={`text-2xl font-black tracking-tighter italic ${isSpecialRole ? 'text-white' : 'bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent'}`}>
                LUXORAA
              </h1>
              {isAdmin && (
                <span className="bg-rose-500 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">Ops</span>
              )}
              {isSeller && (
                <span className="bg-emerald-500 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">Merchant</span>
              )}
            </div>
          </div>

          {!isSpecialRole && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="AI Smart Search..."
                  className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 transition-all text-sm outline-none font-medium"
                  onChange={(e) => onSearch(e.target.value)}
                />
                <Search className="absolute left-3.5 top-2 text-slate-400" size={16} />
              </div>
            </div>
          )}

          <div className="flex items-center gap-1 sm:gap-4">
            {!isSpecialRole ? (
              <>
                <div className="hidden sm:flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                  <Sparkles size={14} className="text-indigo-600 animate-pulse" />
                  <span className="text-xs font-black text-indigo-700">{userPoints} CREDITS</span>
                </div>
                <button onClick={() => onNavigate('wishlist')} className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"><Heart size={20} /></button>
                <button onClick={() => onNavigate('cart')} className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all relative">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{cartCount}</span>}
                </button>
                <button onClick={() => onNavigate('profile')} className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"><User size={20} /></button>
              </>
            ) : (
              <div className="flex items-center gap-6">
                <div className="hidden md:flex flex-col items-end">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isAdmin ? 'Enterprise Admin' : 'Shop Manager'}</p>
                  <p className="text-xs font-bold">{isAdmin ? 'Jordan Vance' : 'Rivera Designs'}</p>
                </div>
                <button onClick={() => onNavigate('profile')} className={`p-2 rounded-full transition-all relative ${isAdmin ? 'text-rose-400 hover:bg-rose-500/10' : 'text-emerald-400 hover:bg-emerald-500/10'}`}>
                   {isAdmin ? <ShieldAlert size={22} /> : <Store size={22} />}
                   <div className={`absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-slate-900 ${isAdmin ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
