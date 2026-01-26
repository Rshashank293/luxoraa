
import React, { useState } from 'react';
import { 
  BarChart3, Box, DollarSign, Package, Plus, Search, Settings, 
  TrendingUp, Activity, Store, ArrowUpRight, Zap, Globe, MoreHorizontal,
  LayoutDashboard, ShoppingBag, CreditCard, ChevronRight
} from 'lucide-react';
// Use User instead of Seller as it is not exported from types.ts
import { Product, Order, User } from '../types';

interface SellerDashboardProps {
  // Updated from Seller to User
  seller: User;
  products: Product[];
  orders: Order[];
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ seller, products, orders }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'finance'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const myProducts = products.filter(p => p.sellerId === 's-1');
  
  const stats = {
    revenue: 4520.00,
    ordersCount: 12,
    rating: 4.8,
    activeListings: myProducts.length
  };

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Shop Earnings', value: `$${stats.revenue.toLocaleString()}`, change: '+18.4%', icon: DollarSign, color: 'emerald' },
          { label: 'Active Orders', value: stats.ordersCount, change: '+2 today', icon: ShoppingBag, color: 'indigo' },
          { label: 'Store Rating', value: stats.rating, change: 'Stable', icon: Activity, color: 'amber' },
          { label: 'Live Products', value: stats.activeListings, change: '100% Active', icon: Box, color: 'slate' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all"><item.icon size={22} /></div>
              <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">{item.change} <ArrowUpRight size={10} /></span>
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{item.label}</p>
            <h3 className="text-2xl font-black text-slate-900">{item.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div><h4 className="text-xl font-black text-slate-900">Revenue Stream</h4><p className="text-sm text-slate-400 font-medium">Monthly payout projection</p></div>
            <div className="flex gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full" /><span className="text-[10px] font-black text-slate-400 uppercase">Profits</span></div>
          </div>
          <div className="h-48 flex items-end gap-2 px-2">
            {[30, 45, 35, 60, 55, 80, 75, 90, 85, 100, 95, 110].map((v, i) => (
              <div key={i} className="flex-1 bg-emerald-50 rounded-t-lg relative group">
                <div className="absolute bottom-0 w-full bg-emerald-500 transition-all rounded-t-lg" style={{ height: `${v/1.1}%` }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-black text-slate-300 uppercase"><span>Jan</span><span>Dec</span></div>
        </div>

        <div className="bg-emerald-600 text-white p-8 rounded-[40px] shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10"><Zap size={100} /></div>
          <div className="relative z-10">
            <h4 className="font-black text-lg mb-6">Seller Pro Tools</h4>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10">
                <div className="flex items-center gap-3"><Package size={18} /><span className="text-xs font-bold">Add New Product</span></div>
                <ChevronRight size={16} />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10">
                <div className="flex items-center gap-3"><TrendingUp size={18} /><span className="text-xs font-bold">Boost Listings</span></div>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="pt-8 mt-8 border-t border-white/10">
             <div className="flex items-center gap-3"><CreditCard size={20} /><p className="text-xs font-black uppercase tracking-widest">Next Payout: May 15</p></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex justify-between items-center">
        <div className="relative max-w-md w-full"><Search size={18} className="absolute left-4 top-3.5 text-slate-400" /><input type="text" placeholder="Filter your listings..." className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-600" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
        <button className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-emerald-700 transition-all"><Plus size={18} /> New Listing</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myProducts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
          <div key={p.id} className="bg-white border border-slate-100 rounded-[32px] overflow-hidden group hover:shadow-xl transition-all">
            <div className="aspect-[16/10] relative"><img src={p.images[0]} className="w-full h-full object-cover" /><div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-900 uppercase tracking-widest">${p.price}</div></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2"><h5 className="font-bold text-slate-900">{p.title}</h5><div className="flex items-center gap-1 text-emerald-500 font-bold text-xs"><Package size={14} /> {p.stock}</div></div>
              <div className="flex gap-2 mt-4"><button className="flex-1 bg-slate-50 text-slate-600 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-50 hover:text-emerald-600 transition-colors">Edit Details</button><button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all"><MoreHorizontal size={16} /></button></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="py-12 px-4 animate-in fade-in duration-1000">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 mb-12">
        <div className="flex items-center gap-4"><div className="p-4 bg-emerald-600 text-white rounded-[24px] shadow-lg shadow-emerald-200"><Store size={32} /></div><div><h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Rivera Designs</h1><p className="text-slate-500 font-medium tracking-wide">Merchant Portal • Global Storefront ID: LUX-8822</p></div></div>
        <div className="flex flex-wrap gap-2 p-1.5 bg-white border border-slate-100 rounded-3xl shadow-sm">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Dash' },
            { id: 'products', icon: Box, label: 'Shop' },
            { id: 'orders', icon: ShoppingBag, label: 'Orders' },
            { id: 'finance', icon: DollarSign, label: 'Wallet' },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}><tab.icon size={16} /> {tab.label}</button>
          ))}
        </div>
      </div>
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'products' && renderProducts()}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-12 text-center text-slate-400 font-bold"><p>Merchant order processing terminal active. Waiting for new buyers...</p></div>
      )}
      {activeTab === 'finance' && (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-12"><div className="max-w-md mx-auto text-center"><DollarSign size={48} className="mx-auto text-emerald-500 mb-6" /><h4 className="text-2xl font-black text-slate-900 mb-2">Merchant Balance</h4><p className="text-4xl font-black text-emerald-600 mb-8">${seller.walletBalance.toLocaleString()}</p><button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-emerald-600 transition-all">Withdraw Earnings</button></div></div>
      )}
    </div>
  );
};

export default SellerDashboard;
