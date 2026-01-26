
import React, { useState } from 'react';
import { 
  ShoppingBag, Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, Loader2, 
  ShieldCheck, User as UserIcon, Chrome, Apple, Store, Key, Fingerprint, Globe, ShieldAlert 
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

  const handleAuth = (selectedRole: 'customer' | 'admin' | 'seller', selectedEmail: string) => {
    setIsLoading(true);
    setError(null);

    // Simulate Server-side verification
    setTimeout(() => {
      if (password.length < 4) {
        setError('Secret Passphrase must be at least 4 characters for node authorization.');
        setIsLoading(false);
        return;
      }

      let mockUser: UserType;
      if (selectedRole === 'admin') {
        mockUser = { id: 'a-1', name: 'Jordan Vance', email: selectedEmail || 'ops@luxoraa.com', role: 'admin', points: 0, tier: 'Platinum', walletBalance: 0, status: 'Active', lastLogin: new Date().toISOString(), mfaEnabled: true };
      } else if (selectedRole === 'seller') {
        mockUser = { id: 's-1', name: name || 'Rivera Designs', email: selectedEmail || 'seller@luxoraa.com', role: 'seller', points: 120, tier: 'Gold', walletBalance: 1250.00, status: 'Active', lastLogin: new Date().toISOString(), mfaEnabled: true };
      } else {
        mockUser = { id: 'u-1', name: name || 'Alex Rivera', email: selectedEmail || 'alex@luxoraa.com', role: 'customer', points: 450, tier: 'Gold', walletBalance: 250.00, status: 'Active', lastLogin: new Date().toISOString(), mfaEnabled: false };
      }
      
      setIsLoading(false);
      onLogin(mockUser);
    }, 1500);
  };

  const roleStyles = {
    customer: { primary: 'bg-black', accent: 'text-indigo-600', bg: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?auto=format&fit=crop&q=80&w=1200' },
    admin: { primary: 'bg-rose-600', accent: 'text-rose-600', bg: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200' },
    seller: { primary: 'bg-emerald-600', accent: 'text-emerald-600', bg: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200' }
  };

  const activeStyle = roleStyles[role];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden selection:bg-indigo-500/20">
      {/* Cinematic Identity Portal */}
      <div className="hidden lg:flex relative w-1/2 overflow-hidden bg-slate-900">
        <div className={`absolute inset-0 z-10 transition-colors duration-1000 ${role === 'admin' ? 'bg-rose-950/40' : role === 'seller' ? 'bg-emerald-950/40' : 'bg-slate-950/20'}`} />
        <img 
          src={activeStyle.bg}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 scale-105 opacity-80"
          alt="Atmosphere"
        />
        <div className="relative z-20 flex flex-col justify-between p-20 text-white w-full">
          <div className="flex items-center gap-4">
             <div className={`p-3 rounded-2xl ${activeStyle.primary} shadow-2xl transition-all duration-500 scale-110`}><Sparkles size={28} /></div>
             <h1 className="text-3xl font-black tracking-tighter italic">LUXORAA</h1>
          </div>
          <div className="max-w-xl animate-in fade-in slide-in-from-left-8 duration-1000">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60 mb-8 flex items-center gap-3">
              <Fingerprint size={14} className={activeStyle.accent} /> Secure Identity Node 0x{role.toUpperCase()}
            </p>
            <h2 className="text-8xl font-display italic font-black leading-[0.9] mb-10">
              Enter <br/> <span className="opacity-40 font-sans tracking-tight not-italic">The Vault.</span>
            </h2>
            <p className="text-xl text-white/60 font-medium leading-relaxed italic font-display">Experience the elite vanguard of neural marketplace intelligence.</p>
          </div>
          <div className="flex items-center gap-10 text-[9px] font-black uppercase tracking-[0.5em] text-white/30">
            <div className="flex items-center gap-3"><Globe size={14} /> Global Distribution</div>
            <div className="flex items-center gap-3"><ShieldCheck size={14} /> RSA-4096 Protection</div>
          </div>
        </div>
      </div>

      {/* Form Node */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-24 relative bg-[#fcfcfd]">
        <div className="w-full max-w-[440px] relative z-10">
          <div className="mb-12 lg:text-left text-center">
            <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase">
              {isSignUp ? 'New Identity' : 'Authenticate'}
            </h3>
            <p className="text-slate-500 font-medium text-lg italic font-display">
              Connect to {role} control node.
            </p>
          </div>

          {error && (
            <div className="mb-8 p-5 bg-rose-50 border border-rose-100 rounded-[24px] flex items-center gap-4 text-rose-600 animate-in shake duration-500">
               {/* Fixed: ShieldAlert is now imported from lucide-react */}
               <ShieldAlert size={20} className="shrink-0" />
               <p className="text-xs font-black uppercase tracking-widest">{error}</p>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleAuth(role, email); }} className="space-y-6">
            {isSignUp && (
              <div className="space-y-2 stagger-in">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Full Identity</label>
                <div className="relative group">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={18} />
                  <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Alex Rivera" className="w-full bg-white border border-slate-100 rounded-[24px] py-5 pl-14 pr-4 text-slate-900 outline-none focus:ring-8 focus:ring-slate-900/5 focus:border-slate-900 transition-all shadow-sm" />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Endpoint Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={18} />
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="alex@luxoraa.com" className="w-full bg-white border border-slate-100 rounded-[24px] py-5 pl-14 pr-4 text-slate-900 outline-none focus:ring-8 focus:ring-slate-900/5 focus:border-slate-900 transition-all shadow-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Secret Passphrase</label>
                 {!isSignUp && <button type="button" className="text-[10px] font-black text-indigo-600 hover:text-indigo-900 uppercase tracking-widest transition-colors">Recover</button>}
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={18} />
                <input required type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white border border-slate-100 rounded-[24px] py-5 pl-14 pr-14 text-slate-900 outline-none focus:ring-8 focus:ring-slate-900/5 focus:border-slate-900 transition-all shadow-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors p-1">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className={`w-full py-6 rounded-[28px] font-black text-sm uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-[0.98] text-white ${isLoading ? 'bg-slate-200' : activeStyle.primary}`}>
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : <>{isSignUp ? 'Create Node' : 'Initialize Node'} <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {isSignUp ? 'Already Identified?' : 'New Node?'} 
              <button onClick={() => { setIsSignUp(!isSignUp); setRole('customer'); setError(null); }} className="text-slate-900 font-black ml-3 hover:underline">
                {isSignUp ? 'Authorize' : 'Request Access'}
              </button>
            </p>
          </div>

          {/* Role Switching Terminal */}
          <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col items-center gap-8">
             <div className="flex gap-4 p-2 bg-slate-50 rounded-[24px] border border-slate-100">
                {[
                  { id: 'customer', label: 'Market', icon: ShoppingBag, color: 'indigo' },
                  { id: 'seller', label: 'Merchant', icon: Store, color: 'emerald' },
                  { id: 'admin', label: 'Root Ops', icon: ShieldCheck, color: 'rose' }
                ].map((r) => (
                  <button 
                    key={r.id} 
                    onClick={() => { setRole(r.id as any); setIsSignUp(false); setError(null); }} 
                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${role === r.id ? `bg-white text-${r.color}-600 shadow-xl scale-105` : 'text-slate-400 hover:text-slate-900'}`}
                  >
                    <r.icon size={14} /> {r.label}
                  </button>
                ))}
             </div>
             <div className="flex items-center gap-4 opacity-20">
                <Key size={14} />
                <span className="text-[9px] font-black uppercase tracking-[0.6em]">System Protocol LUX-v2.0.5</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
