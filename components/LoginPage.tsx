
import React, { useState } from 'react';
import { User, ShieldAlert, ShoppingBag, Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, Key, Fingerprint, Loader2, Globe } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginPageProps {
  onLogin: (user: UserType) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuth(role, email);
  };

  const handleAuth = (selectedRole: 'customer' | 'admin', selectedEmail: string) => {
    setIsLoading(true);
    // Mock authentication delay simulating a secure handshake
    setTimeout(() => {
      const mockUser: UserType = selectedRole === 'customer' 
        ? {
            id: 'u-1',
            name: 'Alex Rivera',
            email: selectedEmail || 'alex@luxoraa.com',
            role: 'customer',
            points: 450,
            tier: 'Gold',
            walletBalance: 250.00
          }
        : {
            id: 'a-1',
            name: 'Jordan Vance',
            email: selectedEmail || 'ops@luxoraa.com',
            role: 'admin',
            points: 0,
            tier: 'Platinum',
            walletBalance: 0
          };
      
      setIsLoading(false);
      onLogin(mockUser);
    }, 1200);
  };

  const isStaff = role === 'admin';

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col md:flex-row items-stretch selection:bg-indigo-500/30 font-inter">
      {/* Cinematic Branding Side */}
      <div className="hidden lg:flex relative w-1/2 overflow-hidden border-r border-white/5">
        <div className={`absolute inset-0 bg-gradient-to-t ${isStaff ? 'from-rose-950/40' : 'from-indigo-950/40'} via-transparent to-slate-950/20 z-10 transition-colors duration-700`} />
        <img 
          src={isStaff ? "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" : "https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?auto=format&fit=crop&q=80&w=1200"} 
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-pulse-soft opacity-60 transition-all duration-1000"
          alt="Atmosphere"
        />
        <div className="relative z-20 flex flex-col justify-between p-20 w-full text-white">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${isStaff ? 'bg-rose-600' : 'bg-indigo-600'} rounded-2xl flex items-center justify-center shadow-2xl transition-colors duration-700`}>
              {isStaff ? <ShieldAlert size={28} /> : <Sparkles size={28} />}
            </div>
            <h1 className="text-4xl font-black tracking-tighter italic">LUXORAA</h1>
          </div>
          
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className={`h-px w-12 ${isStaff ? 'bg-rose-500' : 'bg-indigo-500'}`} />
              <span className={`${isStaff ? 'text-rose-400' : 'text-indigo-400'} font-black text-xs uppercase tracking-[0.3em]`}>{isStaff ? 'Operations Command' : 'Neural Commerce Suite'}</span>
            </div>
            <h2 className="text-7xl font-black mb-8 leading-[1.1] tracking-tight">
              {isStaff ? 'Logistics. Intelligence. ' : 'One Identity. '} <br/> 
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isStaff ? 'from-rose-400 to-amber-400' : 'from-indigo-400 to-violet-400'}`}>
                {isStaff ? 'Real-time Control.' : 'Total Control.'}
              </span>
            </h2>
            <p className="text-slate-400 text-xl leading-relaxed font-medium">
              {isStaff 
                ? 'Managing the global Luxoraa network with precision-engineered AI tools and live inventory streaming.'
                : 'Bridging the gap between high-end consumer experiences and sophisticated backend logistics.'}
            </p>
          </div>

          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
            <div className="flex items-center gap-2"><Fingerprint size={14} /> Biometric ID</div>
            <div className="flex items-center gap-2"><Globe size={14} /> Global Node {isStaff ? '0xStaff' : '0xUser'}</div>
          </div>
        </div>
      </div>

      {/* Login Interaction Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-[#020617]">
        {/* Ambient background decorative elements */}
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${isStaff ? 'bg-rose-600/5' : 'bg-indigo-600/5'} blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 transition-colors duration-700`} />
        <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] ${isStaff ? 'bg-amber-600/5' : 'bg-violet-600/5'} blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 transition-colors duration-700`} />

        <div className="w-full max-w-[460px] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="mb-10 text-center lg:text-left">
            <div className="lg:hidden flex justify-center items-center gap-3 mb-10">
               <div className={`p-2.5 ${isStaff ? 'bg-rose-600 shadow-rose-600/40' : 'bg-indigo-600 shadow-indigo-600/40'} rounded-xl text-white shadow-lg transition-colors`}><Sparkles size={24} /></div>
               <h1 className="text-3xl font-black text-white tracking-tighter italic">LUXORAA</h1>
            </div>
            <h3 className="text-4xl font-black text-white mb-3 tracking-tight">
              {isStaff ? 'Ops Portal' : 'Member Sign In'}
            </h3>
            <p className="text-slate-500 font-medium text-lg">
              {isStaff ? 'Staff authentication required for system access.' : 'Present your digital credentials to enter the storefront.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mb-10">
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity Endpoint</label>
              <div className="relative group">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isStaff ? 'group-focus-within:text-rose-400' : 'group-focus-within:text-indigo-400'} text-slate-600`} size={20} />
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isStaff ? 'ops@luxoraa.com' : 'alex@luxoraa.com'}
                  className="w-full bg-slate-900/40 border border-white/10 rounded-[22px] py-4.5 pl-12 pr-4 text-white placeholder:text-slate-700 outline-none focus:ring-2 focus:ring-opacity-50 transition-all text-lg"
                  style={{ '--tw-ring-color': isStaff ? 'rgba(225, 29, 72, 0.5)' : 'rgba(79, 70, 229, 0.5)' } as any}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Passkey</label>
              <div className="relative group">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isStaff ? 'group-focus-within:text-rose-400' : 'group-focus-within:text-indigo-400'} text-slate-600`} size={20} />
                <input 
                  required
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/40 border border-white/10 rounded-[22px] py-4.5 pl-12 pr-12 text-white placeholder:text-slate-700 outline-none focus:ring-2 focus:ring-opacity-50 transition-all text-lg"
                  style={{ '--tw-ring-color': isStaff ? 'rgba(225, 29, 72, 0.5)' : 'rgba(79, 70, 229, 0.5)' } as any}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-5 rounded-[22px] font-black text-xl flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-[0.98] ${
                isLoading 
                ? 'bg-slate-800 text-slate-500 cursor-wait' 
                : isStaff 
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>Enter {isStaff ? 'Command Center' : 'Storefront'} <ArrowRight size={22} /></>
              )}
            </button>
          </form>

          {/* Quick Demo Access Portal - One click for current role */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-px bg-white/5 flex-1" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Quick Entry</span>
              <div className="h-px bg-white/5 flex-1" />
            </div>
            
            <button 
              onClick={() => handleAuth(role, role === 'customer' ? 'alex@luxoraa.com' : 'ops@luxoraa.com')}
              className={`w-full group relative flex items-center gap-5 p-5 bg-slate-900/30 border border-white/5 rounded-[28px] ${isStaff ? 'hover:border-rose-500/40 hover:bg-rose-500/5' : 'hover:border-indigo-500/40 hover:bg-indigo-500/5'} transition-all`}
            >
              <div className={`p-4 ${isStaff ? 'bg-rose-600/10 text-rose-400 group-hover:bg-rose-600' : 'bg-indigo-600/10 text-indigo-400 group-hover:bg-indigo-600'} group-hover:text-white rounded-2xl transition-all`}>
                {isStaff ? <ShieldAlert size={24} /> : <ShoppingBag size={24} />}
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Demo {isStaff ? 'Jordan Vance' : 'Alex Rivera'}</p>
                <p className="text-[10px] text-slate-600 font-bold italic tracking-wide">{isStaff ? 'Enterprise Operations' : 'Premium Gold Member'}</p>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                 <ArrowRight size={18} className={isStaff ? 'text-rose-400' : 'text-indigo-400'} />
              </div>
            </button>
          </div>

          {/* Footer Navigation */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
            <button 
              onClick={() => {
                setRole(isStaff ? 'customer' : 'admin');
                setEmail('');
                setPassword('');
              }}
              className="text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors group"
            >
              {isStaff ? <ShoppingBag size={14} className="group-hover:text-indigo-400" /> : <ShieldAlert size={14} className="group-hover:text-rose-400" />}
              {isStaff ? 'Back to Customer Login' : 'Authorized Staff Portal'}
            </button>
            <div className="flex items-center gap-2 text-amber-500 opacity-60">
               <Key size={14} />
               <p className="text-[10px] font-black uppercase tracking-widest">Sandbox Protocol</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
