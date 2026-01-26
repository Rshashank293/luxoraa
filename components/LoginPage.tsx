
import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  Loader2, 
  ShieldCheck, 
  User as UserIcon,
  Chrome,
  Apple,
  Store,
  Key
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
  const [showDevAccess, setShowDevAccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuth(role, email);
  };

  const handleAuth = (selectedRole: 'customer' | 'admin' | 'seller', selectedEmail: string) => {
    setIsLoading(true);
    setTimeout(() => {
      let mockUser: UserType;
      
      if (selectedRole === 'admin') {
        mockUser = {
          id: 'a-1',
          name: 'Jordan Vance',
          email: selectedEmail || 'ops@luxoraa.com',
          role: 'admin',
          points: 0,
          tier: 'Platinum',
          walletBalance: 0,
          status: 'Active',
          lastLogin: new Date().toISOString(),
          mfaEnabled: true
        };
      } else if (selectedRole === 'seller') {
        mockUser = {
          id: 's-1',
          name: name || 'Rivera Designs',
          email: selectedEmail || 'seller@luxoraa.com',
          role: 'seller',
          points: 120,
          tier: 'Gold',
          walletBalance: 1250.00,
          status: 'Active',
          lastLogin: new Date().toISOString(),
          mfaEnabled: true
        };
      } else {
        mockUser = {
          id: 'u-1',
          name: name || 'Alex Rivera',
          email: selectedEmail || 'alex@luxoraa.com',
          role: 'customer',
          points: 450,
          tier: 'Gold',
          walletBalance: 250.00,
          status: 'Active',
          lastLogin: new Date().toISOString(),
          mfaEnabled: false
        };
      }
      
      setIsLoading(false);
      onLogin(mockUser);
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      handleAuth('customer', `user@${provider.toLowerCase()}.com`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-inter selection:bg-indigo-100 p-6">
      <div className="absolute top-8 sm:top-12 flex items-center gap-2 cursor-default group">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform duration-500">
          <Sparkles size={22} />
        </div>
        <h1 className="text-2xl font-black tracking-tighter italic text-slate-900">LUXORAA</h1>
      </div>

      <div className="w-full max-w-[440px] bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 p-8 sm:p-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 border border-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
            {role === 'admin' ? 'Command Terminal' : role === 'seller' ? 'Seller Hub' : (isSignUp ? 'Join Luxoraa' : 'Welcome back')}
          </h2>
          <p className="text-slate-500 font-medium text-sm">
            {role === 'admin' 
              ? 'Authorized staff authentication required.' 
              : role === 'seller' 
                ? 'Access your shop management suite.'
                : (isSignUp ? 'Create your profile to start your journey.' : 'Enter your credentials to access your collection.')}
          </p>
        </div>

        {role === 'customer' && !isSignUp && (
          <div className="space-y-3 mb-8">
            <button onClick={() => handleSocialLogin('Google')} className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group">
              <Chrome size={18} className="text-slate-400 group-hover:text-red-500 transition-colors" />
              <span className="text-sm font-bold text-slate-700">Continue with Google</span>
            </button>
            <button onClick={() => handleSocialLogin('Apple')} className="w-full flex items-center justify-center gap-3 py-3 bg-black text-white rounded-xl hover:bg-slate-900 transition-colors">
              <Apple size={18} />
              <span className="text-sm font-bold">Continue with Apple</span>
            </button>
            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-slate-100 flex-1" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Or email</span>
              <div className="h-px bg-slate-100 flex-1" />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" size={18} />
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all" />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" size={18} />
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-end px-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Passphrase</label>
              {!isSignUp && <button type="button" className="text-[10px] font-black text-indigo-600 hover:text-indigo-500 transition-colors uppercase tracking-widest">Forgot?</button>}
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" size={18} />
              <input required type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-12 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black transition-colors p-1">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className={`w-full py-4.5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all shadow-xl shadow-black/10 disabled:bg-slate-300 disabled:cursor-not-allowed group ${role === 'admin' ? 'bg-rose-600 hover:bg-rose-700 text-white' : role === 'seller' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-black hover:bg-slate-800 text-white'}`}>
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>{isSignUp ? 'Create My Account' : (role === 'admin' ? 'Launch Terminal' : role === 'seller' ? 'Enter Seller Hub' : 'Sign In')} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 font-medium">
            {isSignUp ? 'Already have an account?' : 'New to Luxoraa?'} 
            <button onClick={() => { setIsSignUp(!isSignUp); setRole('customer'); }} className="text-black font-black hover:underline ml-1">
              {isSignUp ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
           <button onClick={() => setShowDevAccess(!showDevAccess)} className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] hover:text-slate-500 transition-colors">Terminal Debug</button>
           {showDevAccess && (
             <div className="flex flex-wrap justify-center gap-2 animate-in fade-in zoom-in-95 duration-300">
               <button onClick={() => handleAuth('customer', 'alex@luxoraa.com')} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-600 transition-all"><UserIcon size={12} /> Customer</button>
               <button onClick={() => handleAuth('seller', 'seller@luxoraa.com')} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 flex items-center gap-2 hover:bg-emerald-50 hover:text-emerald-600 transition-all"><Store size={12} /> Seller</button>
               <button onClick={() => handleAuth('admin', 'ops@luxoraa.com')} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 flex items-center gap-2 hover:bg-rose-50 hover:text-rose-600 transition-all"><ShieldCheck size={12} /> Admin</button>
             </div>
           )}
        </div>
      </div>

      <footer className="mt-12 w-full max-w-[440px] px-6 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
        <span>&copy; 2025 LUXORAA</span>
        <div className="flex items-center gap-6">
          <button onClick={() => { setRole(role === 'seller' ? 'customer' : 'seller'); setIsSignUp(false); }} className={`transition-colors flex items-center gap-1.5 ${role === 'seller' ? 'text-emerald-500' : 'hover:text-black'}`}>
            <Store size={12} /> {role === 'seller' ? 'Market' : 'Sell'}
          </button>
          <button onClick={() => { setRole(role === 'admin' ? 'customer' : 'admin'); setIsSignUp(false); }} className={`transition-colors flex items-center gap-1.5 ${role === 'admin' ? 'text-rose-500' : 'hover:text-black'}`}>
            <ShieldCheck size={12} /> {role === 'admin' ? 'Market' : 'Staff'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
