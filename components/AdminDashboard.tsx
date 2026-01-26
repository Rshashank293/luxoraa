import React, { useState, useMemo } from 'react';
import { 
  BarChart3, Box, Users, DollarSign, TrendingUp, TrendingDown, 
  ArrowUpRight, ShoppingBag, AlertCircle, Package, Search, 
  Filter, MoreHorizontal, CheckCircle2, XCircle, Clock, LineChart, ShieldCheck,
  Sparkles, Settings, Globe, Zap, Activity
} from 'lucide-react';
import { Product, Order } from '../types';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, orders }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'orders'>('overview');
  const [inventorySearch, setInventorySearch] = useState('');

  const stats = useMemo(() => ({
    revenue: orders.reduce((sum, o) => sum + o.totalAmount, 0) + 12540.50,
    customers: 842,
    conversion: 3.42,
    roi: 12.4,
    outOfStock: products.filter(p => p.stock === 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock < 10).length,
    activeSessions: 42,
    globalReach: 14
  }), [orders, products]);

  const salesData = [4500, 5200, 3800, 6100, 5900, 7200, 6800];
  const maxSales = Math.max(...salesData);

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(inventorySearch.toLowerCase()) || 
    p.category.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, change: '+12.5%', icon: DollarSign, color: 'indigo' },
          { label: 'Live Traffic', value: stats.activeSessions, change: '+5.2%', icon: Activity, color: 'emerald' },
          { label: 'Market ROI', value: `${stats.roi}%`, change: '+0.8%', icon: TrendingUp, color: 'amber' },
          { label: 'Stock Alerts', value: stats.lowStock, change: '-2 today', icon: Package, color: 'rose' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-slate-50 text-slate-900 group-hover:bg-indigo-600 group-hover:text-white transition-all`}>
                <item.icon size={24} />
              </div>
              <span className={`text-xs font-black ${item.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'} flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg`}>
                {item.change} <ArrowUpRight size={12} />
              </span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{item.label}</p>
            <h3 className="text-3xl font-black text-slate-900">{item.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div><h4 className="text-xl font-black text-slate-900">Sales Velocity</h4><p className="text-sm text-slate-400 font-medium">Daily performance tracking</p></div>
            <select className="bg-slate-50 border-none rounded-xl text-sm font-bold px-4 py-2 outline-none cursor-pointer"><option>Last 7 Days</option><option>Last 30 Days</option></select>
          </div>
          <div className="h-64 flex items-end gap-3 px-2">
            {salesData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="w-full relative h-full">
                   <div className="absolute bottom-0 w-full bg-slate-100 rounded-t-xl group-hover:bg-indigo-600 transition-all cursor-pointer" style={{ height: `${(val / maxSales) * 100}%` }}>
                     <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">${val}</div>
                   </div>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase">Day {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-12 opacity-10"><Sparkles size={120} /></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8"><div className="p-2 bg-indigo-600 rounded-lg"><ShieldCheck size={20} /></div><h4 className="font-black">L-Ops AI Engine</h4></div>
            <div className="space-y-6">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10"><p className="text-xs text-indigo-400 font-black uppercase mb-2">Inventory Alert</p><p className="text-sm text-slate-300 leading-relaxed">Running low on 'AeroMax Running Shoes'. Demand is up 22% this morning.</p></div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10"><p className="text-xs text-emerald-400 font-black uppercase mb-2">Market Sentiment</p><p className="text-sm text-slate-300 leading-relaxed">Customer feedback on 'Linen Button-Down' is 98% positive. AI suggests boosting ad spend.</p></div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400"><Globe size={24} /></div>
             <div><p className="text-xs font-black uppercase tracking-widest text-slate-500">Global Reach</p><p className="text-lg font-black">{stats.globalReach} Regions Live</p></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md"><Search size={18} className="absolute left-4 top-3.5 text-slate-400" /><input type="text" placeholder="Filter inventory by name or category..." className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-600 transition-all" value={inventorySearch} onChange={(e) => setInventorySearch(e.target.value)} /></div>
        <div className="flex gap-3 w-full sm:w-auto"><button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all"><Package size={18} /> New Entry</button></div>
      </div>
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-x-auto"><table className="w-full text-left"><thead className="bg-slate-50 border-b border-slate-100"><tr><th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Product Reference</th><th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Category</th><th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Pricing</th><th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Inventory</th><th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Operations</th></tr></thead><tbody className="divide-y divide-slate-50">{filteredProducts.map(p => (
        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
          <td className="px-8 py-5"><div className="flex items-center gap-4"><img src={p.images[0]} className="w-12 h-12 rounded-xl object-cover" /><div className="font-bold text-slate-900">{p.title}</div></div></td>
          <td className="px-8 py-5"><span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-tighter">{p.category}</span></td>
          <td className="px-8 py-5 font-black">${p.price.toFixed(2)}</td>
          <td className="px-8 py-5"><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-emerald-500' : 'bg-rose-500'}`} /><span className="font-bold">{p.stock} Units</span></div></td>
          <td className="px-8 py-5"><button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Settings size={18} /></button></td>
        </tr>
      ))}</tbody></table></div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden"><table className="w-full text-left border-collapse"><thead className="bg-slate-50 border-b border-slate-100"><tr><th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Order Ticket</th><th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Consignee</th><th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Tracking Status</th><th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Fraud Check</th><th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Value</th></tr></thead><tbody className="divide-y divide-slate-50">{orders.length === 0 ? (<tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold">Waiting for market transactions...</td></tr>) : (orders.map(o => (
        <tr key={o.id} className="hover:bg-slate-50 transition-colors">
          <td className="px-8 py-5 font-black text-indigo-600">#{o.id}</td>
          <td className="px-8 py-5 font-bold">{o.shippingAddress.fullName}</td>
          <td className="px-8 py-5"><div className="bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase px-3 py-1 rounded-full inline-block">{o.status}</div></td>
          <td className="px-8 py-5"><div className="flex items-center gap-2"><div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${o.fraudScore > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${o.fraudScore}%` }} /></div><span className="text-[10px] font-black">{o.fraudScore}%</span></div></td>
          <td className="px-8 py-5 font-black text-slate-900">${o.totalAmount.toFixed(2)}</td>
        </tr>
      )))}</tbody></table></div>
    </div>
  );

  return (
    <div className="py-12 px-4 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-4"><div className="p-4 bg-slate-900 text-white rounded-[24px]"><Zap size={32} /></div><div><h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Operations</h1><p className="text-slate-500 font-medium tracking-wide">Enterprise Resource Management Console</p></div></div>
        <div className="flex gap-2 p-1.5 bg-white border border-slate-100 rounded-3xl shadow-sm">
          {[
            { id: 'overview', icon: BarChart3, label: 'Analytics' },
            { id: 'inventory', icon: Box, label: 'Inventory' },
            { id: 'orders', icon: ShoppingBag, label: 'Logistics' },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}><tab.icon size={16} /> {tab.label}</button>
          ))}
        </div>
      </div>
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'inventory' && renderInventory()}
      {activeTab === 'orders' && renderOrders()}
    </div>
  );
};

export default AdminDashboard;