import React, { useState, useMemo } from 'react';
import { 
  BarChart3, Box, Users, DollarSign, TrendingUp, TrendingDown, 
  ArrowUpRight, ShoppingBag, AlertCircle, Package, Search, 
  Filter, MoreHorizontal, CheckCircle2, XCircle, Clock, LineChart, ShieldCheck,
  Sparkles, Settings, Globe, Zap, Activity, UserCheck, ShieldAlert, Fingerprint, Lock, ShieldX,
  Target, Zap as ZapIcon, Terminal, BarChart4
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

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, orders }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'security'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const renderOverview = () => (
    <div className="space-y-12 animate-in">
      {/* SaaS Style Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: 'Revenue', value: '$12,450', change: '+12.5%', icon: DollarSign, color: 'emerald' },
          { label: 'Active Node Users', value: '1,420', change: '+5.2%', icon: Users, color: 'indigo' },
          { label: 'Conversion', value: '3.42%', change: '+0.8%', icon: Target, color: 'amber' },
          { label: 'Uptime', value: '99.98%', change: 'Stable', icon: Activity, color: 'rose' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 p-8 rounded-[40px] border border-white/5 shadow-2xl group hover:border-white/10 transition-all">
             <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-white/5 text-slate-400 group-hover:text-white transition-all`}><stat.icon size={24} /></div>
                <div className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-black text-emerald-400">+{stat.change}</div>
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">{stat.label}</p>
             <h3 className="text-4xl font-black italic tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 bg-white/5 p-12 rounded-[56px] border border-white/5 shadow-3xl">
            <div className="flex justify-between items-center mb-12">
               <div>
                 <h4 className="text-2xl font-black italic tracking-tighter">Growth Metrics</h4>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global distribution across 14 nodes</p>
               </div>
               <div className="flex gap-2">
                 <div className="w-12 h-6 bg-rose-600 rounded-full" />
                 <div className="w-12 h-6 bg-white/10 rounded-full" />
               </div>
            </div>
            <div className="h-64 flex items-end gap-4 px-4">
               {[40, 60, 45, 90, 70, 85, 100].map((v, i) => (
                 <div key={i} className="flex-1 bg-white/5 rounded-t-2xl relative group overflow-hidden">
                    <div className="absolute bottom-0 w-full bg-rose-600 group-hover:bg-rose-500 transition-all" style={{ height: `${v}%` }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                 </div>
               ))}
            </div>
            <div className="flex justify-between mt-6 px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
               <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
         </div>

         <div className="bg-rose-600 p-12 rounded-[56px] shadow-[0_60px_100px_-30px_rgba(225,29,72,0.4)] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-16 opacity-10 group-hover:rotate-12 transition-transform duration-1000"><ZapIcon size={200} /></div>
            <div className="relative z-10">
               <h4 className="text-3xl font-black italic mb-8">System <br/> Integrity</h4>
               <div className="space-y-6">
                  <div className="bg-black/10 p-5 rounded-3xl border border-white/10 backdrop-blur-md">
                     <p className="text-[10px] font-black uppercase mb-2">Live Threats</p>
                     <p className="text-2xl font-black">0 Detected</p>
                  </div>
                  <div className="bg-black/10 p-5 rounded-3xl border border-white/10 backdrop-blur-md">
                     <p className="text-[10px] font-black uppercase mb-2">Node Latency</p>
                     <p className="text-2xl font-black">24ms Avg.</p>
                  </div>
               </div>
            </div>
            <div className="pt-10 border-t border-white/10 flex items-center gap-4">
               <ShieldCheck size={24} />
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">Node Root Node Active</span>
            </div>
         </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-8 animate-in">
       <div className="bg-white/5 p-8 rounded-[40px] border border-white/5 flex justify-between items-center shadow-xl">
          <div className="relative max-w-md w-full">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Filter identities..."
              className="w-full bg-white/5 border-none rounded-2xl py-4 pl-14 pr-6 text-sm outline-none focus:ring-2 focus:ring-rose-600 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-rose-600 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl">Initialize New Node</button>
       </div>

       <div className="bg-white/5 rounded-[48px] border border-white/5 shadow-3xl overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-white/5 border-b border-white/5">
                <tr>
                   <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Identity Artifact</th>
                   <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Access Tier</th>
                   <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Node Status</th>
                   <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Last Session</th>
                   <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Security</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
                {MOCK_USERS.map(u => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                     <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">{u.name.charAt(0)}</div>
                           <div><p className="font-black text-lg tracking-tight">{u.name}</p><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{u.email}</p></div>
                        </div>
                     </td>
                     <td className="px-10 py-8"><span className="text-[10px] font-black uppercase px-4 py-2 bg-white/5 rounded-xl border border-white/10">{u.role}</span></td>
                     <td className="px-10 py-8"><div className="flex items-center gap-3"><div className={`w-2 h-2 rounded-full animate-pulse ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} /><span className="text-xs font-bold">{u.status}</span></div></td>
                     <td className="px-10 py-8 text-xs font-black text-slate-500 uppercase">{new Date(u.lastLogin).toLocaleDateString()}</td>
                     <td className="px-10 py-8"><div className={`flex items-center gap-2 ${u.mfaEnabled ? 'text-emerald-500' : 'text-slate-600'}`}>{u.mfaEnabled ? <ShieldCheck size={18} /> : <Lock size={18} />}<span className="text-[10px] font-black uppercase tracking-widest">{u.mfaEnabled ? 'MFA ON' : 'MFA OFF'}</span></div></td>
                  </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );

  return (
    <div className="space-y-16 animate-in">
       <div className="flex justify-between items-end">
          <div>
            <h1 className="text-8xl font-black italic tracking-tighter leading-none mb-6">Ops Center</h1>
            <p className="text-xl text-slate-500 font-medium italic font-display">Command & Control Interface v3.0.4</p>
          </div>
          <div className="flex gap-4 p-2 bg-white/5 rounded-[32px] border border-white/5">
            {[
              { id: 'overview', icon: BarChart4, label: 'Analytics' },
              { id: 'users', icon: Users, label: 'Identities' },
              { id: 'security', icon: Terminal, label: 'Console' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-8 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-rose-600 text-white shadow-2xl' : 'text-slate-500 hover:text-white'}`}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </div>
       </div>

       {activeTab === 'overview' && renderOverview()}
       {activeTab === 'users' && renderUsers()}
       {activeTab === 'security' && <div className="p-20 bg-white/5 rounded-[64px] border border-white/5 text-center"><Terminal size={60} className="mx-auto mb-8 text-slate-700" /><p className="text-xl font-bold text-slate-500 italic">Accessing root security sharding... Audit trail processing.</p></div>}
    </div>
  );
};

export default AdminDashboard;