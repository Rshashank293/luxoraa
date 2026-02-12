
import React, { useState, useMemo } from 'react';
import { 
  BarChart3, Box, Users, DollarSign, TrendingUp, TrendingDown, 
  ArrowUpRight, ShoppingBag, AlertCircle, Package, Search, 
  Filter, MoreHorizontal, CheckCircle2, XCircle, Clock, LineChart, ShieldCheck,
  Sparkles, Settings, Globe, Zap, Activity, UserCheck, ShieldAlert, Fingerprint, Lock, ShieldX,
  Target, Zap as ZapIcon, Terminal, BarChart4, Trophy, Shield, Calendar, Tag, ChevronDown
} from 'lucide-react';
import { Product, Order, User, UserStatus, AuditLog, AdminSubRole } from '../types';

interface AdminDashboardProps {
  user: User; // Current logged in admin
  products: Product[];
  orders: Order[];
}

const MOCK_AUDITS: AuditLog[] = [
  { id: 'a-1', actorId: 'admin-1', action: 'PRICE_SYNC', timestamp: '2025-05-12T10:00:00Z', details: 'Bulk updated membership pricing for Marvel collection' },
  { id: 'a-2', actorId: 'system', action: 'STOCK_ALERT', timestamp: '2025-05-12T09:45:00Z', details: 'Spider-Man Oversized Tee low on node stock' },
];

const MOCK_USERS: User[] = [
  { id: 'u-1', name: 'Alex Rivera', email: 'alex@luxoraa.com', role: 'customer', points: 450, tier: 'Gold', walletBalance: 250, status: 'Active', lastLogin: '2025-05-10T14:30:00Z', mfaEnabled: false, isMember: true },
  { id: 'u-2', name: 'Sarah Chen', email: 'sarah@design.io', role: 'customer', points: 1200, tier: 'Platinum', walletBalance: 890, status: 'Active', lastLogin: '2025-05-11T09:15:00Z', mfaEnabled: true, isMember: true },
  { id: 'u-3', name: 'Mike Ross', email: 'mike@firm.com', role: 'customer', points: 50, tier: 'Silver', walletBalance: 0, status: 'Suspended', lastLogin: '2025-04-30T11:00:00Z', mfaEnabled: false, isMember: false },
  { id: 'u-4', name: 'James Wilson', email: 'james@verify.me', role: 'customer', points: 0, tier: 'Member', walletBalance: 0, status: 'Pending Verification', lastLogin: '2025-05-12T08:00:00Z', mfaEnabled: false, isMember: false },
  { id: 's-1', name: 'Rivera Designs', email: 'seller@luxoraa.com', role: 'seller', points: 120, tier: 'Gold', walletBalance: 1250, status: 'Active', lastLogin: '2025-05-11T10:00:00Z', mfaEnabled: true, isMember: false },
];

// Added some local mock orders for demonstration if none are passed
const MOCK_ORDERS: Order[] = [
  { id: 'LX-882201', userId: 'u-1', items: [], totalAmount: 45000, status: 'Delivered', date: '2025-05-01T10:00:00Z', trackingNumber: 'TRK123', paymentMethod: 'Card', shippingAddress: { fullName: 'Alex Rivera', address: '123 Pl', city: 'SF', zipCode: '94103', phone: '123' }, fraudScore: 2 },
  { id: 'LX-882202', userId: 'u-2', items: [], totalAmount: 12000, status: 'Shipped', date: '2025-05-10T14:30:00Z', trackingNumber: 'TRK124', paymentMethod: 'UPI', shippingAddress: { fullName: 'Sarah Chen', address: '456 St', city: 'NY', zipCode: '10001', phone: '456' }, fraudScore: 5 },
  { id: 'LX-882203', userId: 'u-1', items: [], totalAmount: 8500, status: 'Placed', date: '2025-05-12T09:00:00Z', trackingNumber: 'TRK125', paymentMethod: 'Netbanking', shippingAddress: { fullName: 'Alex Rivera', address: '123 Pl', city: 'SF', zipCode: '94103', phone: '123' }, fraudScore: 12 },
  { id: 'LX-882204', userId: 'u-3', items: [], totalAmount: 99000, status: 'Packed', date: '2025-04-20T11:00:00Z', trackingNumber: 'TRK126', paymentMethod: 'Card', shippingAddress: { fullName: 'Mike Ross', address: '789 Av', city: 'CHI', zipCode: '60601', phone: '789' }, fraudScore: 45 },
];

type AdminTab = 'overview' | 'users' | 'orders' | 'security' | 'audits';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, products, orders: propsOrders }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Order Filters State
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [orderDateStart, setOrderDateStart] = useState<string>('');
  const [orderDateEnd, setOrderDateEnd] = useState<string>('');
  const [orderCustomerId, setOrderCustomerId] = useState<string>('');

  const orders = useMemo(() => propsOrders.length > 0 ? propsOrders : MOCK_ORDERS, [propsOrders]);

  // RBAC Permission Logic
  const permissions: Record<AdminTab, AdminSubRole[]> = {
    overview: ['Super Admin', 'Ops Manager'],
    users: ['Super Admin', 'Support Hero'],
    orders: ['Super Admin', 'Ops Manager', 'Support Hero'],
    audits: ['Super Admin', 'Security Lead', 'Ops Manager'],
    security: ['Super Admin', 'Security Lead']
  };

  const hasPermission = (tab: AdminTab) => {
    return permissions[tab].includes(user.adminRole || 'Super Admin');
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
      const matchCustomer = !orderCustomerId || o.userId.toLowerCase().includes(orderCustomerId.toLowerCase()) || o.id.toLowerCase().includes(orderCustomerId.toLowerCase());
      
      let matchDate = true;
      if (orderDateStart) {
        matchDate = matchDate && new Date(o.date) >= new Date(orderDateStart);
      }
      if (orderDateEnd) {
        const endDate = new Date(orderDateEnd);
        endDate.setHours(23, 59, 59, 999);
        matchDate = matchDate && new Date(o.date) <= endDate;
      }
      
      return matchStatus && matchCustomer && matchDate;
    });
  }, [orders, orderStatusFilter, orderCustomerId, orderDateStart, orderDateEnd]);

  const renderUnauthorized = () => (
    <div className="flex flex-col items-center justify-center p-32 bg-white/5 rounded-[64px] border border-white/5 shadow-3xl text-center animate-lux">
       <div className="relative mb-12">
          <div className="absolute inset-0 bg-rose-600/20 blur-[100px] animate-pulse rounded-full" />
          <div className="relative p-12 bg-rose-600 text-white rounded-[48px] shadow-2xl">
             <ShieldX size={80} strokeWidth={1.5} />
          </div>
       </div>
       <h4 className="text-4xl font-black italic tracking-tighter text-white mb-4 uppercase">Identity Lockdown</h4>
       <p className="text-slate-500 font-display italic text-xl max-w-md mx-auto mb-10">Access to this command module is restricted to high-tier authorized personnel only.</p>
       <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
          <ShieldAlert size={20} className="text-rose-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Violation logged to Global Registry</span>
       </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-12 animate-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: 'Revenue', value: '₹1,24,500', change: '+12.5%', icon: DollarSign },
          { label: 'Active Node Users', value: '1,420', change: '+5.2%', icon: Users },
          { label: 'Conversion', value: '3.42%', change: '+0.8%', icon: Target },
          { label: 'Uptime', value: '99.98%', change: 'Stable', icon: Activity },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 p-8 rounded-[40px] border border-white/5 shadow-2xl group hover:border-white/10 transition-all">
             <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-white/5 text-slate-400 group-hover:text-white transition-all`}><stat.icon size={24} /></div>
                <div className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-black text-emerald-400">+{stat.change}</div>
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">{stat.label}</p>
             <h3 className="text-4xl font-black italic tracking-tighter text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 bg-white/5 p-12 rounded-[56px] border border-white/5 shadow-3xl">
            <h4 className="text-2xl font-black italic tracking-tighter text-white mb-12">Growth Node Analytics</h4>
            <div className="h-64 flex items-end gap-4 px-4">
               {[40, 60, 45, 90, 70, 85, 100].map((v, i) => (
                 <div key={i} className="flex-1 bg-white/5 rounded-t-2xl relative group overflow-hidden">
                    <div className="absolute bottom-0 w-full bg-rose-600 group-hover:bg-rose-500 transition-all" style={{ height: `${v}%` }} />
                 </div>
               ))}
            </div>
         </div>
         <div className="bg-rose-600 p-12 rounded-[56px] shadow-3xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-16 opacity-10 group-hover:rotate-12 transition-transform duration-1000"><ZapIcon size={200} /></div>
            <div className="relative z-10 text-white">
               <h4 className="text-3xl font-black italic mb-8">System <br/> Integrity</h4>
               <div className="bg-black/10 p-5 rounded-3xl border border-white/10 backdrop-blur-md">
                  <p className="text-[10px] font-black uppercase mb-2">Live Threats</p>
                  <p className="text-2xl font-black">0 Detected</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-8 animate-in text-white">
       <div className="bg-white/5 p-8 rounded-[40px] border border-white/5 flex justify-between items-center shadow-xl">
          <div className="relative max-w-md w-full">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Query identities..."
              className="w-full bg-white/5 border-none rounded-2xl py-4 pl-14 pr-6 text-sm outline-none focus:ring-2 focus:ring-rose-600 transition-all text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
       </div>
       <div className="bg-white/5 rounded-[48px] border border-white/5 shadow-3xl overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-white/5 border-b border-white/5">
                <tr>
                   <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Identity</th>
                   <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Tier</th>
                   <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Membership</th>
                   <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Security</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
                {MOCK_USERS.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                     <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center font-black text-lg">{u.name.charAt(0)}</div>
                           <div><p className="font-black text-lg tracking-tight">{u.name}</p><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{u.email}</p></div>
                        </div>
                     </td>
                     <td className="px-10 py-8"><span className="text-[10px] font-black uppercase px-4 py-2 bg-white/5 rounded-xl border border-white/10">{u.tier}</span></td>
                     <td className="px-10 py-8">
                        <div className={`flex items-center gap-2 ${u.isMember ? 'text-amber-500' : 'text-slate-600'}`}>
                           <Trophy size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">{u.isMember ? 'ACTIVE MEMBER' : 'STANDARD'}</span>
                        </div>
                     </td>
                     <td className="px-10 py-8">
                        <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          u.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                          u.status === 'Suspended' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                          'bg-amber-500/10 border-amber-500/20 text-amber-500'
                        }`}>
                          {u.status}
                        </span>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-8 animate-in text-white">
       {/* Filter Controls */}
       <div className="bg-white/5 p-10 rounded-[48px] border border-white/5 shadow-xl flex flex-col xl:flex-row gap-8 items-end">
          <div className="flex-1 w-full space-y-3">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Order / Customer ID</label>
             <div className="relative">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Query artifacts..."
                  className="w-full bg-white/5 border-none rounded-2xl py-4 pl-14 pr-6 text-sm outline-none focus:ring-2 focus:ring-rose-600 transition-all text-white"
                  value={orderCustomerId}
                  onChange={(e) => setOrderCustomerId(e.target.value)}
                />
             </div>
          </div>
          
          <div className="w-full xl:w-48 space-y-3">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Status Node</label>
             <div className="relative">
                <Filter size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
                <select 
                  className="w-full bg-white/5 border-none rounded-2xl py-4 pl-14 pr-6 text-sm outline-none focus:ring-2 focus:ring-rose-600 transition-all text-white appearance-none cursor-pointer"
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                >
                   <option className="bg-slate-900" value="All">All Cycles</option>
                   <option className="bg-slate-900" value="Placed">Placed</option>
                   <option className="bg-slate-900" value="Packed">Packed</option>
                   <option className="bg-slate-900" value="Shipped">Shipped</option>
                   <option className="bg-slate-900" value="Delivered">Delivered</option>
                   <option className="bg-slate-900" value="Returned">Returned</option>
                </select>
                <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
             </div>
          </div>

          <div className="flex gap-4 w-full xl:w-auto">
             <div className="flex-1 xl:w-44 space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Start Block</label>
                <div className="relative">
                   <Calendar size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
                   <input 
                      type="date"
                      className="w-full bg-white/5 border-none rounded-2xl py-4 pl-14 pr-6 text-[11px] outline-none focus:ring-2 focus:ring-rose-600 transition-all text-white cursor-pointer"
                      value={orderDateStart}
                      onChange={(e) => setOrderDateStart(e.target.value)}
                   />
                </div>
             </div>
             <div className="flex-1 xl:w-44 space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">End Block</label>
                <div className="relative">
                   <Calendar size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
                   <input 
                      type="date"
                      className="w-full bg-white/5 border-none rounded-2xl py-4 pl-14 pr-6 text-[11px] outline-none focus:ring-2 focus:ring-rose-600 transition-all text-white cursor-pointer"
                      value={orderDateEnd}
                      onChange={(e) => setOrderDateEnd(e.target.value)}
                   />
                </div>
             </div>
          </div>
          
          <button 
            onClick={() => {
              setOrderStatusFilter('All');
              setOrderDateStart('');
              setOrderDateEnd('');
              setOrderCustomerId('');
            }}
            className="p-4 bg-white/5 text-slate-400 hover:text-white rounded-2xl border border-white/5 transition-all"
            title="Reset Matrix Filters"
          >
             <RefreshCw size={18} />
          </button>
       </div>

       <div className="bg-white/5 rounded-[48px] border border-white/5 shadow-3xl overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-white/5 border-b border-white/5">
                <tr>
                   <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Artifact ID</th>
                   <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Customer</th>
                   <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Phase</th>
                   <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Value</th>
                   <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Timestamp</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-20 text-center">
                       <p className="text-slate-500 font-display italic text-lg">No orders found matching the filter matrix.</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(o => (
                    <tr key={o.id} className="hover:bg-white/5 transition-colors group">
                       <td className="px-10 py-8 font-black tracking-tight text-rose-500">{o.id}</td>
                       <td className="px-10 py-8">
                          <div>
                            <p className="font-black text-sm tracking-tight">{o.shippingAddress.fullName}</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{o.userId}</p>
                          </div>
                       </td>
                       <td className="px-10 py-8">
                          <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            o.status === 'Delivered' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                            o.status === 'Placed' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                            'bg-indigo-500/10 border-indigo-500/20 text-indigo-500'
                          }`}>
                            {o.status}
                          </span>
                       </td>
                       <td className="px-10 py-8 font-black text-lg">₹{o.totalAmount.toLocaleString()}</td>
                       <td className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          {new Date(o.date).toLocaleDateString()}
                       </td>
                    </tr>
                  ))
                )}
             </tbody>
          </table>
       </div>
    </div>
  );

  const renderAudits = () => (
    <div className="space-y-6 animate-in text-white">
      {MOCK_AUDITS.map(log => (
        <div key={log.id} className="bg-white/5 p-8 rounded-[32px] border border-white/5 flex gap-8 items-center">
           <div className="p-4 bg-white/5 rounded-2xl text-rose-500"><Terminal size={24} /></div>
           <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                 <div className="w-1 h-1 bg-slate-700 rounded-full" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">{log.action}</span>
              </div>
              <p className="font-medium text-slate-200">{log.details}</p>
           </div>
        </div>
      ))}
    </div>
  );

  const renderSecurity = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-white animate-lux">
       <div className="bg-white/5 p-12 rounded-[56px] border border-white/5 shadow-3xl">
          <Fingerprint size={48} className="text-rose-500 mb-8" />
          <h4 className="text-3xl font-black italic tracking-tighter mb-4">Biometric Protocol</h4>
          <p className="text-slate-500 mb-10 leading-relaxed italic font-display">Current biometric node encryption: RSA-4096. All endpoints verified.</p>
          <div className="space-y-4">
             {[
               { label: 'Multi-Factor Sync', active: true },
               { label: 'Quantum Resistent', active: true },
               { label: 'Blockchain ID Audit', active: false }
             ].map((item, i) => (
               <div key={i} className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                  <div className={`w-3 h-3 rounded-full ${item.active ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
               </div>
             ))}
          </div>
       </div>
       <div className="bg-rose-950/20 p-12 rounded-[56px] border border-rose-500/20 shadow-3xl flex flex-col justify-center">
          <ShieldAlert size={48} className="text-rose-600 mb-8" />
          <h4 className="text-3xl font-black italic tracking-tighter mb-4">Firewall Matrix</h4>
          <p className="text-slate-400 mb-10 leading-relaxed">No breaches detected in the last 720 hours. Global node sync status: Optimal.</p>
          <button className="w-full bg-rose-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-rose-700 transition-all">Emergency Lockdown</button>
       </div>
    </div>
  );

  return (
    <div className="space-y-16 animate-in bg-slate-950 min-h-screen p-12 overflow-x-hidden">
       <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
               <span className="px-4 py-2 bg-rose-600 text-white text-[9px] font-black uppercase tracking-[0.4em] rounded-full shadow-lg">{user.adminRole}</span>
               <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
               <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Global Root Node Access</span>
            </div>
            <h1 className="text-6xl sm:text-8xl font-black italic tracking-tighter leading-none mb-6 text-white uppercase">Command Hub.</h1>
            <p className="text-xl text-slate-500 font-medium italic font-display">System Operator: {user.name}</p>
          </div>
          <div className="flex flex-wrap gap-4 p-2 bg-white/5 rounded-[32px] border border-white/5">
            {[
              { id: 'overview', icon: BarChart4, label: 'Analytics' },
              { id: 'users', icon: Users, label: 'Identities' },
              { id: 'orders', icon: ShoppingBag, label: 'Orders' },
              { id: 'audits', icon: Terminal, label: 'Audits' },
              { id: 'security', icon: Fingerprint, label: 'Security' }
            ].map(tab => {
              const allowed = hasPermission(tab.id as AdminTab);
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`flex items-center gap-3 px-8 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all relative overflow-hidden group ${activeTab === tab.id ? 'bg-rose-600 text-white shadow-2xl' : allowed ? 'text-slate-500 hover:text-white' : 'text-slate-800 cursor-not-allowed opacity-40'}`}
                >
                  <tab.icon size={18} /> {tab.label}
                  {!allowed && <Lock size={12} className="absolute top-2 right-2 opacity-40" />}
                </button>
              );
            })}
          </div>
       </div>

       <div className="relative">
          {hasPermission(activeTab) ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'users' && renderUsers()}
              {activeTab === 'orders' && renderOrders()}
              {activeTab === 'audits' && renderAudits()}
              {activeTab === 'security' && renderSecurity()}
            </>
          ) : renderUnauthorized()}
       </div>
    </div>
  );
};

// Reuse existing local RefreshCw or define if missing (lucide-react usually has it)
const RefreshCw = ({ size, className }: { size: number, className?: string }) => (
  <Activity size={size} className={className} />
);

export default AdminDashboard;
