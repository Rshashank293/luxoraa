import React, { useState } from 'react';
import { ShoppingBag, Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, Loader2, ShieldCheck, User as UserIcon } from 'lucide-react';
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
  const [showDevAccess, setShowDevAccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuth(role, email);
  };

  const handleAuth = (selectedRole: 'customer' | 'admin', selectedEmail: string) => {
    setIsLoading(true);
    // Simulating a professional authentication handshake
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
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-inter selection:bg-indigo-100">
      {/* Brand Header */}
      <div className="absolute top-12 flex items-center gap-2 cursor-default">
        <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white">
          <Sparkles size={18} />
        </div>
        <h1 className="text-xl font-black tracking-tighter italic">LUXORAA</h1>
      </div>

      <div className="w-full max-w-[400px] px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {role === 'admin' ? 'Staff Authentication' : 'Welcome back'}
          </h2>
          <p className="text-slate-500 font-medium">
            {role === 'admin' 
              ? 'Secure entry for terminal management.' 
              : 'Sign in to access your curated collection.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" size={18} />
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-end px-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <button type="button" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-500 transition-colors uppercase tracking-wider">Forgot?</button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" size={18} />
              <input 
                required
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-12 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-black text-white py-4.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98] shadow-lg shadow-black/5 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>Sign In <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-slate-500 font-medium">
            New to Luxoraa? <button className="text-black font-bold hover:underline">Create Account</button>
          </p>
        </div>

        {/* Hidden Developer / Admin Helper - Toggleable but discreet */}
        <div className="mt-16 flex flex-col items-center gap-4">
           <button 
             onClick={() => setShowDevAccess(!showDevAccess)}
             className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] hover:text-slate-500 transition-colors"
           >
             Developer Access
           </button>
           
           {showDevAccess && (
             <div className="flex gap-2 animate-in fade-in zoom-in-95 duration-300">
               <button 
                 onClick={() => handleAuth('customer', 'alex@luxoraa.com')}
                 className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-200 transition-all"
               >
                 <UserIcon size={12} /> Log in as Customer
               </button>
               <button 
                 onClick={() => handleAuth('admin', 'ops@luxoraa.com')}
                 className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-200 transition-all"
               >
                 <ShieldCheck size={12} /> Log in as Admin
               </button>
             </div>
           )}
        </div>
      </div>

      {/* Subtle Portal Switch in Footer */}
      <footer className="absolute bottom-12 w-full px-12 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
        <span>&copy; 2025 LUXORAA GLOBAL</span>
        <button 
          onClick={() => {
            setRole(role === 'customer' ? 'admin' : 'customer');
            setEmail('');
            setPassword('');
          }}
          className="hover:text-black transition-colors"
        >
          {role === 'customer' ? 'Staff Portal' : 'Customer View'}
        </button>
      </footer>
    </div>
  );
};

export default LoginPage;