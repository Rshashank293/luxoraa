
import React, { useState, useMemo } from 'react';
import { 
  BarChart3, Box, Users, DollarSign, TrendingUp, TrendingDown, 
  ArrowUpRight, ShoppingBag, AlertCircle, Package, Search, 
  Filter, MoreHorizontal, CheckCircle2, XCircle, Clock, LineChart, ShieldCheck,
  Sparkles, Settings, Globe, Zap, Activity, UserCheck, ShieldAlert, Fingerprint, Lock, ShieldX
} from 'lucide-react';
import { Product, Order, User, UserStatus, AuditLog } from '../types';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
}

const MOCK_USERS: User[] = [
  { id: 'u-1', name: 'Alex Rivera', email: 'alex@luxoraa.com', role: 'customer', points: 450, tier: 'Gold', walletBalance: 250, status: 'Active', lastLogin: '2025-05-10T14:30:00Z', mfaEnabled: false },
  { id: 'u-2', name: 'Sarah Chen', email: 'sarah@design.io', role: 'customer', points: 1200, tier: 'Platinum', walletBalance: 890, status: 'Active', lastLogin: '2025-05-11T09:15:00Z', mfaEnabled: true },
  { id: 'u-3', name: 'Mike Ross', email: 'mike@firm.com', role: 'customer', points: 50, tier: 'Silver', walletBalance: 0, status: 'Suspended', lastLogin: '2025-04-30T11:00:00Z', mfaEnabled: false },
  { id: 's-1', name: 'Rivera Designs', email: 'seller@luxoraa.com', role: 'seller', points: 120, tier: 'Gold', walletBalance: 1250, status: 'Active', lastLogin: '2025-05-11T10:00:00Z', mfaEnabled: true },
];

const MOCK_AUDITS: AuditLog[] = [
  { id: 'log-1', actorId: 'a-1', actorName: 'Jordan Vance', action: 'LOGIN', target: 'SYSTEM', details: 'Admin login successful from IP 192.168.1.1', timestamp: new Date().toISOString(), severity: 'Info' },
  { id: 'log-2', actorId: 'a-1', actorName: 'Jordan Vance', action: 'SUSPEND_USER', target: 'u-3', details: 'User u-3 suspended due to multiple failed fraud checks', timestamp: new Date(Date.now() - 3600000).toISOString(), severity: 'Warning' },
  { id: 'log-3', actorId: 's-1', actorName: 'Rivera Designs', action: 'ADD_PRODUCT', target: 'p-102', details: 'New product "Velvet Blazer" added to catalog', timestamp: new Date(Date.now() - 7200000).toISOString(), severity: 'Info' },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, orders }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'orders' | 'users' | 'security'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = useMemo(() => ({
    revenue: orders.reduce((sum, o) => sum + o.totalAmount, 0) + 12540.50,
    customers: MOCK_USERS.length,
    conversion: 3.42,
    roi: 12.4,
    outOfStock: products.filter(p => p.stock === 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock < 10).length,
    activeSessions: 42,
    globalReach: 14,
    securityThreats: 1
  }), [orders, products]);

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, change: '+12.5%', icon: DollarSign, color: 'indigo' },
          { label: 'Live Traffic', value: stats.activeSessions, change: '+5.2%', icon: Activity, color: 'emerald' },
          { label: 'Market ROI', value: `${stats.roi}%`, change: '+0.8%', icon: TrendingUp, color: 'amber' },
          { label: 'Security Status', value: 'Protected', change: 'Stable', icon: ShieldCheck, color: 'rose' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-slate-50 text-slate-900 group-hover:bg-indigo-600 group-hover:text-white transition-all`}><item.icon size={24} /></div>
              <span className={`text-xs font-black ${item.change.startsWith('+') || item.change === 'Stable' ? 'text-emerald-500' : 'text-rose-500'} flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg`}>{item.change} <ArrowUpRight size={12} /></span>
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
            {[4500, 5200, 3800, 6100, 5900, 7200, 6800].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="w-full relative h-full">
                   <div className="absolute bottom-0 w-full bg-slate-100 rounded-t-xl group-hover:bg-indigo-600 transition-all cursor-pointer" style={{ height: `${(val / 7200) * 100}%` }}>
                     <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">${val}</div>
                   </div>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">D-{7-i}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-12 opacity-10"><Sparkles size={120} /></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8"><div className="p-2 bg-indigo-600 rounded-lg"><ShieldCheck size={20} /></div><h4 className="font-black tracking-tight">System Intel</h4></div>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10"><p className="text-[10px] text-indigo-400 font-black uppercase mb-1">Stock Prediction</p><p className="text-sm text-slate-300 leading-relaxed">Inventory replenishment suggested for 'Shoes' category within 48h.</p></div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10"><p className="text-[10px] text-rose-400 font-black uppercase mb-1">Security Alert</p><p className="text-sm text-slate-300 leading-relaxed">Attempted login from unrecognized terminal blocked successfully.</p></div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400"><Globe size={24} /></div>
             <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Global Nodes</p><p className="text-lg font-black">{stats.globalReach} Protected</p></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md"><Search size={18} className="absolute left-4 top-3.5 text-slate-400" /><input type="text" placeholder="Search users by name, email or role..." className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-600 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
        <div className="flex gap-2"><button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2"><UserCheck size={16} /> New Identity</button></div>
      </div>
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Identity</th>
              <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Role</th>
              <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Last Access</th>
              <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Security</th>
              <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {MOCK_USERS.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.role.toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xs font-black">{u.name.charAt(0)}</div>
                    <div><p className="font-bold text-slate-900">{u.name}</p><p className="text-xs text-slate-400">{u.email}</p></div>
                  </div>
                </td>
                <td className="px-8 py-5"><span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${u.role === 'admin' ? 'bg-rose-100 text-rose-700' : u.role === 'seller' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>{u.role}</span></td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <span className="text-xs font-bold text-slate-700">{u.status}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-xs font-medium text-slate-500">{new Date(u.lastLogin).toLocaleDateString()}</td>
                <td className="px-8 py-5">
                  {u.mfaEnabled ? <div className="flex items-center gap-1 text-emerald-600 font-bold text-[10px] uppercase"><ShieldCheck size={14} /> MFA ON</div> : <div className="flex items-center gap-1 text-slate-400 font-bold text-[10px] uppercase"><Lock size={14} /> MFA OFF</div>}
                </td>
                <td className="px-8 py-5">
                  <div className="flex gap-2">
                    <button className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-lg"><Settings size={16} /></button>
                    <button className="p-2 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-lg"><ShieldX size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-xl">
          <div className="flex items-center gap-3 mb-6 text-rose-400"><ShieldAlert size={24} /><h5 className="font-black uppercase tracking-widest text-xs">Security Pulse</h5></div>
          <div className="space-y-4">
             <div className="flex justify-between items-center"><span className="text-slate-400 text-sm">Threat Level</span><span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black">LOW</span></div>
             <div className="flex justify-between items-center"><span className="text-slate-400 text-sm">Active MFA</span><span className="text-white font-black">82%</span></div>
             <div className="flex justify-between items-center"><span className="text-slate-400 text-sm">Failed Logins (24h)</span><span className="text-white font-black">14</span></div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 col-span-2">
           <div className="flex items-center gap-3 mb-6 text-indigo-600"><Fingerprint size={24} /><h5 className="font-black uppercase tracking-widest text-xs">Biometric & MFA Adoption</h5></div>
           <div className="h-24 flex items-end gap-2">
              {[60, 65, 70, 68, 75, 80, 82].map((v, i) => (
                <div key={i} className="flex-1 bg-indigo-50 rounded-t-lg relative group overflow-hidden">
                   <div className="absolute bottom-0 w-full bg-indigo-600 transition-all" style={{ height: `${v}%` }} />
                </div>
              ))}
           </div>
           <div className="flex justify-between mt-4 text-[10px] font-black text-slate-300 uppercase"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center"><h5 className="text-lg font-black text-slate-900">Security Audit Trail</h5><button className="text-xs font-black text-indigo-600 uppercase tracking-widest">Export Logs</button></div>
        <div className="divide-y divide-slate-50">
          {MOCK_AUDITS.map(log => (
            <div key={log.id} className="p-6 hover:bg-slate-50/50 transition-colors flex items-start gap-6">
              <div className={`p-3 rounded-2xl ${log.severity === 'Critical' ? 'bg-rose-50 text-rose-500' : log.severity === 'Warning' ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-500'}`}><ShieldAlert size={20} /></div>
              <div className="flex-1">
                <div className="flex justify-between mb-1"><h6 className="font-bold text-slate-900 text-sm">{log.action} <span className="text-slate-400 font-normal">by</span> {log.actorName}</h6><span className="text-[10px] font-bold text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span></div>
                <p className="text-sm text-slate-600 mb-2">{log.details}</p>
                <div className="flex items-center gap-2"><span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Target ID: {log.target}</span><div className="w-1 h-1 bg-slate-200 rounded-full" /><span className={`text-[10px] font-black uppercase ${log.severity === 'Critical' ? 'text-rose-500' : 'text-slate-400'}`}>{log.severity}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-12 px-4 animate-in fade-in duration-1000">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 mb-12">
        <div className="flex items-center gap-4"><div className="p-4 bg-slate-900 text-white rounded-[24px]"><ShieldCheck size={32} /></div><div><h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Command</h1><p className="text-slate-500 font-medium tracking-wide">Enterprise Hub • Operations & Security</p></div></div>
        <div className="flex flex-wrap gap-2 p-1.5 bg-white border border-slate-100 rounded-3xl shadow-sm">
          {[
            { id: 'overview', icon: BarChart3, label: 'Analytics' },
            { id: 'users', icon: Users, label: 'Identities' },
            { id: 'security', icon: Fingerprint, label: 'Security' },
            { id: 'inventory', icon: Box, label: 'Market' },
            { id: 'orders', icon: ShoppingBag, label: 'Logistics' },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}><tab.icon size={16} /> {tab.label}</button>
          ))}
        </div>
      </div>
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'users' && renderUsers()}
      {activeTab === 'security' && renderSecurity()}
      {activeTab === 'inventory' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-md"><Search size={18} className="absolute left-4 top-3.5 text-slate-400" /><input type="text" placeholder="Filter inventory..." className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-600 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs flex items-center gap-2"><Package size={18} /> New Entry</button>
          </div>
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-x-auto"><table className="w-full text-left"><thead className="bg-slate-50 border-b border-slate-100"><tr><th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Product</th><th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Category</th><th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Seller</th><th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Price</th><th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Stock</th></tr></thead><tbody className="divide-y divide-slate-50">{products.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
            <tr key={p.id} className="hover:bg-slate-50/50 transition-colors"><td className="px-8 py-5"><div className="flex items-center gap-4"><img src={p.images[0]} className="w-10 h-10 rounded-xl object-cover" /><div className="font-bold text-slate-900">{p.title}</div></div></td><td className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-tighter">{p.category}</td><td className="px-8 py-5 text-xs font-bold text-indigo-600">{p.sellerId === 's-1' ? 'Rivera Designs' : 'Global Vendor'}</td><td className="px-8 py-5 font-black text-sm">${p.price.toFixed(2)}</td><td className="px-8 py-5 font-bold">{p.stock}</td></tr>
          ))}</tbody></table></div>
        </div>
      )}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden"><table className="w-full text-left"><thead className="bg-slate-50 border-b border-slate-100"><tr><th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Ticket</th><th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Consignee</th><th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Fraud Score</th><th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Value</th></tr></thead><tbody className="divide-y divide-slate-50">{orders.length === 0 ? (<tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold">Awaiting market events...</td></tr>) : (orders.map(o => (
          <tr key={o.id} className="hover:bg-slate-50 transition-colors"><td className="px-8 py-5 font-black text-indigo-600 text-sm">#{o.id}</td><td className="px-8 py-5 font-bold text-sm">{o.shippingAddress.fullName}</td><td className="px-8 py-5"><div className="flex items-center gap-2"><div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${o.fraudScore > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${o.fraudScore}%` }} /></div><span className="text-[10px] font-black">{o.fraudScore}%</span></div></td><td className="px-8 py-5 font-black text-slate-900">${o.totalAmount.toFixed(2)}</td></tr>
        )))}</tbody></table></div>
      )}
    </div>
  );
};

export default AdminDashboard;
