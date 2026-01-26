import React, { useState } from 'react';
import { 
  ShoppingBag, Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, Loader2, 
  ShieldCheck, User as UserIcon, Chrome, Apple, Store, Key, Fingerprint, Globe 
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

  const handleAuth = (selectedRole: 'customer' | 'admin' | 'seller', selectedEmail: string) => {
    setIsLoading(true);
    setTimeout(() => {
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">
      {/* Cinematic Side */}
      <div className="hidden lg:flex relative w-1/2 overflow-hidden bg-slate-900">
        <div className={`absolute inset-0 z-10 transition-colors duration-1000 ${role === 'admin' ? 'bg-rose-950/40' : role === 'seller' ? 'bg-emerald-950/40' : 'bg-slate-950/20'}`} />
        <img 
          src={activeStyle.bg}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 scale-105"
          alt="Atmosphere"
        />
        <div className="relative z-20 flex flex-col justify-between p-20 text-white w-full">
          <div className="flex items-center gap-3">
             <div className={`p-2.5 rounded-xl ${activeStyle.primary} shadow-2xl transition-colors duration-500`}><Sparkles size={24} /></div>
             <h1 className="text-3xl font-black tracking-tighter italic">LUXORAA</h1>
          </div>
          <div className="max-w-xl animate-in fade-in slide-in-from-left-8 duration-1000">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60 mb-6">Neural Commerce Protocol 0x{role.toUpperCase()}</p>
            <h2 className="text-7xl font-display italic font-black leading-tight mb-8">
              The Art of <br/> <span className="opacity-60 font-sans tracking-tight not-italic">Refined Living.</span>
            </h2>
            <p className="text-xl text-white/70 font-medium leading-relaxed">Experience a new standard of global marketplace intelligence, tailored for your unique identity.</p>
          </div>
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
            <div className="flex items-center gap-2"><Fingerprint size={14} /> Encrypted Session</div>
            <div className="flex items-center gap-2"><Globe size={14} /> Node: {role === 'customer' ? 'Global' : 'Enterprise'}</div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-20 relative bg-[#fcfcfd]">
        <div className="w-full max-w-[440px] relative z-10">
          <div className="mb-10 lg:text-left text-center">
            <div className="lg:hidden flex justify-center mb-10">
              <div className={`p-3 rounded-2xl ${activeStyle.primary} text-white shadow-xl mb-4`}><Sparkles size={28} /></div>
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
              {role === 'admin' ? 'Ops Center' : role === 'seller' ? 'Merchant Hub' : (isSignUp ? 'Create Identity' : 'Welcome back')}
            </h3>
            <p className="text-slate-500 font-medium text-lg">
              Authorized access required for 0x{role} node.
            </p>
          </div>

          {!isSignUp && role === 'customer' && (
             <div className="grid grid-cols-2 gap-4 mb-8">
               <button onClick={() => handleAuth('customer', 'google@luxoraa.com')} className="flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-bold text-sm">
                 <Chrome size={18} /> Google
               </button>
               <button onClick={() => handleAuth('customer', 'apple@luxoraa.com')} className="flex items-center justify-center gap-3 py-4 bg-black text-white rounded-2xl hover:bg-slate-800 transition-all font-bold text-sm">
                 <Apple size={18} /> Apple
               </button>
             </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleAuth(role, email); }} className="space-y-5">
            {isSignUp && (
              <div className="space-y-1.5 stagger-in">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
                  <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Alex Rivera" className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all" />
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Endpoint</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="alex@luxoraa.com" className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secret Pass</label>
                 {!isSignUp && <button type="button" className="text-[10px] font-black text-indigo-600 hover:text-indigo-500 uppercase tracking-widest">Forgot?</button>}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
                <input required type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-12 text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 p-1">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className={`w-full py-5 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-[0.98] text-white ${isLoading ? 'bg-slate-300' : activeStyle.primary}`}>
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : <>{isSignUp ? 'Create Profile' : 'Authenticate Session'} <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              {isSignUp ? 'Already identified?' : 'New to Luxoraa?'} 
              <button onClick={() => { setIsSignUp(!isSignUp); setRole('customer'); }} className="text-slate-900 font-black ml-2 hover:underline">
                {isSignUp ? 'Authenticate' : 'Register'}
              </button>
            </p>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col items-center gap-6">
             <div className="flex gap-4">
                <button onClick={() => { setRole('customer'); setIsSignUp(false); }} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${role === 'customer' ? 'bg-indigo-600 text-white shadow-xl' : 'bg-slate-50 text-slate-400 hover:text-slate-900'}`}>Market</button>
                <button onClick={() => { setRole('seller'); setIsSignUp(false); }} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${role === 'seller' ? 'bg-emerald-600 text-white shadow-xl' : 'bg-slate-50 text-slate-400 hover:text-slate-900'}`}>Merchant</button>
                <button onClick={() => { setRole('admin'); setIsSignUp(false); }} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${role === 'admin' ? 'bg-rose-600 text-white shadow-xl' : 'bg-slate-50 text-slate-400 hover:text-slate-900'}`}>Ops</button>
             </div>
             <div className="flex items-center gap-2 opacity-30">
                <Key size={14} />
                <span className="text-[9px] font-black uppercase tracking-[0.4em]">Sandbox Environment v1.0.4</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;