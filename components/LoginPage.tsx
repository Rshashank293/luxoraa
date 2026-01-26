import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, Loader2, 
  ShieldCheck, User as UserIcon, Chrome, Apple, Store, Key, Fingerprint, Globe, ShieldAlert,
  Terminal, ShieldX
} from 'lucide-react';
import { User as UserType } from '../types';

interface LoginPageProps {
  onLogin: (user: UserType) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<'customer' | 'admin' | 'seller'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulate API request to Serverless Auth Endpoint
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      if (password.length < 6) {
        throw new Error("Security protocol requires min. 6 characters for secret passphrase.");
      }

      if (email === 'fail@luxoraa.com') {
        throw new Error("Unauthorized access attempt. Endpoint blocked.");
      }

      let mockUser: UserType;
      if (role === 'admin') {
        mockUser = { id: 'a-1', name: 'Jordan Vance', email: email || 'ops@luxoraa.com', role: 'admin', points: 0, tier: 'Platinum', walletBalance: 0, status: 'Active', lastLogin: new Date().toISOString(), mfaEnabled: true };
      } else if (role === 'seller') {
        mockUser = { id: 's-1', name: name || 'Rivera Designs', email: email || 'seller@luxoraa.com', role: 'seller', points: 120, tier: 'Gold', walletBalance: 1250.00, status: 'Active', lastLogin: new Date().toISOString(), mfaEnabled: true };
      } else {
        mockUser = { id: 'u-1', name: name || 'Alex Rivera', email: email || 'alex@luxoraa.com', role: 'customer', points: 450, tier: 'Gold', walletBalance: 250.00, status: 'Active', lastLogin: new Date().toISOString(), mfaEnabled: false };
      }
      
      onLogin(mockUser);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const theme = {
    customer: { main: 'bg-black', accent: 'text-indigo-600', glow: 'shadow-indigo-600/20', bg: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?auto=format&fit=crop&q=80&w=1200' },
    admin: { main: 'bg-rose-600', accent: 'text-rose-600', glow: 'shadow-rose-600/20', bg: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200' },
    seller: { main: 'bg-emerald-600', accent: 'text-emerald-600', glow: 'shadow-emerald-600/20', bg: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200' }
  }[role];

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row bg-white transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Visual Identity Side */}
      <div className="hidden lg:flex relative w-1/2 overflow-hidden bg-slate-900 group">
        <div className={`absolute inset-0 z-10 transition-colors duration-1000 ${role === 'admin' ? 'bg-rose-950/50' : role === 'seller' ? 'bg-emerald-950/50' : 'bg-slate-950/20'}`} />
        <img 
          src={theme.bg}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-[20s] scale-110 group-hover:scale-100 opacity-60"
          alt="Atmosphere"
        />
        <div className="relative z-20 flex flex-col justify-between p-24 text-white w-full">
          <div className="flex items-center gap-6 stagger-in">
             <div className={`p-4 rounded-3xl ${theme.main} shadow-3xl transform transition-all duration-700 hover:rotate-12`}><Terminal size={32} /></div>
             <h1 className="text-4xl font-black tracking-tighter italic uppercase">Luxoraa</h1>
          </div>
          
          <div className="max-w-xl animate-in fade-in slide-in-from-left-12 duration-1000">
            <p className="text-[10px] font-black uppercase tracking-[0.8em] text-white/40 mb-10 flex items-center gap-4">
              <Fingerprint size={16} className={theme.accent} /> Secure Node Protocol {role.toUpperCase()}
            </p>
            <h2 className="text-[8rem] font-display italic font-black leading-[0.8] mb-12">
              The <br/> <span className="opacity-40 font-sans tracking-tighter not-italic">Identity.</span>
            </h2>
            <p className="text-2xl text-white/50 font-medium leading-relaxed italic font-display">A decentralized artifact network for the global elite vanguard.</p>
          </div>

          <div className="flex items-center gap-12 text-[9px] font-black uppercase tracking-[0.6em] text-white/20">
            <div className="flex items-center gap-4"><Globe size={16} /> Distributed Ledger</div>
            <div className="flex items-center gap-4"><ShieldCheck size={16} /> End-to-End RSA</div>
          </div>
        </div>
      </div>

      {/* Authentication Form Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-24 bg-[#fcfcfd] relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-100/50 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />

        <div className="w-full max-w-[460px] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="mb-16 lg:text-left text-center">
            <h3 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase">
              {isSignUp ? 'New Node' : 'Authenticate'}
            </h3>
            <p className="text-slate-400 font-medium text-lg italic font-display">
              Connect to Luxoraa {role} cluster.
            </p>
          </div>

          {error && (
            <div className="mb-10 p-6 bg-rose-50 border border-rose-100 rounded-[32px] flex items-center gap-5 text-rose-600 animate-in shake">
               <ShieldX size={24} className="shrink-0" />
               <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-8">
            {isSignUp && (
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">Full Identity Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={20} />
                  <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Alexander Rivera" className="w-full bg-white border border-slate-100 rounded-[28px] py-5 pl-16 pr-6 text-slate-900 outline-none focus:ring-[12px] focus:ring-slate-900/5 focus:border-slate-900 transition-all shadow-sm" />
                </div>
              </div>
            )}
            
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">Node Address (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={20} />
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="identity@luxoraa.com" className="w-full bg-white border border-slate-100 rounded-[28px] py-5 pl-16 pr-6 text-slate-900 outline-none focus:ring-[12px] focus:ring-slate-900/5 focus:border-slate-900 transition-all shadow-sm" />
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center px-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Secret Passphrase</label>
                 {!isSignUp && <button type="button" className="text-[10px] font-black text-indigo-600 hover:text-indigo-900 uppercase tracking-widest transition-colors">Recover</button>}
              </div>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={20} />
                <input required type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white border border-slate-100 rounded-[28px] py-5 pl-16 pr-16 text-slate-900 outline-none focus:ring-[12px] focus:ring-slate-900/5 focus:border-slate-900 transition-all shadow-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors p-2">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading} 
              className={`w-full py-7 rounded-[32px] font-black text-sm uppercase tracking-[0.6em] flex items-center justify-center gap-6 transition-all shadow-3xl active:scale-[0.98] text-white ${isLoading ? 'bg-slate-200 cursor-wait' : `${theme.main} hover:scale-[1.02] ${theme.glow}`}`}
            >
              {isLoading ? (
                <div className="flex items-center gap-4">
                  <Loader2 className="animate-spin" size={24} />
                  <span>Verifying Node...</span>
                </div>
              ) : (
                <>
                  {isSignUp ? 'Request Access' : 'Initialize Node'} 
                  <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-16 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
              {isSignUp ? 'Already have an endpoint?' : 'Need node authorization?'} 
              <button onClick={() => { setIsSignUp(!isSignUp); setError(null); }} className="text-slate-900 font-black ml-4 hover:underline">
                {isSignUp ? 'Authenticate' : 'Register Now'}
              </button>
            </p>
          </div>

          {/* Persistent Control Hub */}
          <div className="mt-24 pt-12 border-t border-slate-100 flex flex-col items-center gap-10">
             <div className="flex gap-4 p-2.5 bg-slate-100/50 rounded-[32px] border border-slate-100 backdrop-blur-sm shadow-inner">
                {[
                  { id: 'customer', label: 'Store', icon: ShoppingBag, color: 'indigo' },
                  { id: 'seller', label: 'Merchant', icon: Store, color: 'emerald' },
                  { id: 'admin', label: 'Root Ops', icon: ShieldCheck, color: 'rose' }
                ].map((r) => (
                  <button 
                    key={r.id} 
                    onClick={() => { setRole(r.id as any); setIsSignUp(false); setError(null); }} 
                    className={`px-8 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${role === r.id ? `bg-white text-slate-900 shadow-2xl scale-110 z-10` : 'text-slate-400 hover:text-slate-900'}`}
                  >
                    <r.icon size={16} /> {r.label}
                  </button>
                ))}
             </div>
             <div className="flex items-center gap-6 opacity-20">
                <Key size={16} />
                <span className="text-[10px] font-black uppercase tracking-[1em]">Luxoraa System 2025 v3.0</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;