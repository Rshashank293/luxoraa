
import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, Loader2, 
  ShieldCheck, User as UserIcon, Chrome, Apple, Store, Key, Fingerprint, Globe, 
  ShieldAlert, Terminal, ShieldX, Trophy, Shield, ChevronLeft, CheckCircle2,
  AlertCircle, RefreshCw
} from 'lucide-react';
import { User as UserType, AdminSubRole } from '../types';

interface LoginPageProps {
  onLogin: (user: UserType) => void;
}

type AuthView = 'login' | 'signup' | 'forgot' | 'reset-sent' | 'reset-password';

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [view, setView] = useState<AuthView>('login');
  const [role, setRole] = useState<'customer' | 'admin' | 'seller'>('customer');
  const [adminSubRole, setAdminSubRole] = useState<AdminSubRole>('Super Admin');
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateForm = () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid node address (email).");
      return false;
    }
    if (view === 'signup' && name.length < 2) {
      setError("Name must be at least 2 characters.");
      return false;
    }
    if (view === 'reset-password') {
      if (newPassword.length < 6) {
        setError("New passphrase must be at least 6 characters.");
        return false;
      }
      if (newPassword !== confirmNewPassword) {
        setError("Passphrases do not match.");
        return false;
      }
    } else if (view !== 'forgot' && view !== 'reset-sent' && password.length < 6) {
      setError("Passphrase must be at least 6 characters.");
      return false;
    }
    if (view === 'signup' && password !== confirmPassword) {
      setError("Passphrases do not match.");
      return false;
    }
    return true;
  };

  const handleAuth = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (view === 'forgot') {
      setView('reset-sent');
      setIsLoading(false);
      return;
    }

    if (view === 'reset-password') {
      setSuccessMessage("Your passphrase has been securely reset.");
      setView('login');
      setIsLoading(false);
      return;
    }

    try {
      let mockUser: UserType;
      const baseUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: name || (role === 'admin' ? 'Jordan Vance' : role === 'seller' ? 'Rivera Designs' : 'Alex Rivera'),
        email: email,
        points: role === 'customer' ? 450 : 0,
        tier: 'Gold' as const,
        walletBalance: role === 'seller' ? 1250 : 250,
        status: 'Active' as const,
        lastLogin: new Date().toISOString(),
        mfaEnabled: role !== 'customer',
        isMember: role === 'customer'
      };

      if (role === 'admin') {
        mockUser = { ...baseUser, role: 'admin', adminRole: adminSubRole };
      } else if (role === 'seller') {
        mockUser = { ...baseUser, role: 'seller' };
      } else {
        mockUser = { ...baseUser, role: 'customer' };
      }
      
      onLogin(mockUser);
    } catch (err: any) {
      setError("Authentication failed. Connection timeout.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    // Simulate Google OAuth Popup
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockUser: UserType = { 
      id: 'g-1', 
      name: 'Google User', 
      email: 'user@gmail.com', 
      role: 'customer', 
      points: 100, 
      tier: 'Member', 
      walletBalance: 0, 
      status: 'Active', 
      lastLogin: new Date().toISOString(), 
      mfaEnabled: true, 
      isMember: false 
    };
    onLogin(mockUser);
  };

  const theme = {
    customer: { main: 'bg-indigo-600', accent: 'text-indigo-600', bg: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?auto=format&fit=crop&q=80&w=1200' },
    admin: { main: 'bg-rose-600', accent: 'text-rose-600', bg: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200' },
    seller: { main: 'bg-emerald-600', accent: 'text-emerald-600', bg: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200' }
  }[role];

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row bg-white transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Left Column: Branding & Atmosphere */}
      <div className="hidden lg:flex relative w-5/12 overflow-hidden bg-slate-900 group">
        <div className={`absolute inset-0 z-10 transition-colors duration-1000 ${role === 'admin' ? 'bg-rose-950/50' : role === 'seller' ? 'bg-emerald-950/50' : 'bg-slate-950/20'}`} />
        <img 
          src={theme.bg}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-[20s] scale-110 group-hover:scale-100 opacity-60"
          alt="Atmosphere"
        />
        <div className="relative z-20 flex flex-col justify-between p-24 text-white w-full">
          <div className="flex items-center gap-6">
             <div className={`p-4 rounded-3xl ${theme.main} shadow-3xl transform transition-all duration-700 hover:rotate-12`}><Terminal size={32} /></div>
             <h1 className="text-4xl font-black tracking-tighter italic uppercase font-display">Luxoraa</h1>
          </div>
          <div className="max-w-xl animate-in fade-in slide-in-from-left-12 duration-1000">
            <p className="text-[10px] font-black uppercase tracking-[0.8em] text-white/40 mb-10 flex items-center gap-4">
              <Fingerprint size={16} className={theme.accent} /> {role === 'admin' ? `${adminSubRole.toUpperCase()} NODE` : `${role.toUpperCase()} PROTOCOL`}
            </p>
            <h2 className="text-[7rem] font-display italic font-black leading-[0.8] mb-12">
              The <br/> <span className="opacity-40 font-sans tracking-tighter not-italic">Identity.</span>
            </h2>
            <p className="text-xl text-white/60 font-medium italic font-display leading-relaxed">
              Step into the neural core of premium artifacts and global elegance.
            </p>
          </div>
          <div className="flex items-center gap-12 text-[9px] font-black uppercase tracking-[0.6em] text-white/20">
            <div className="flex items-center gap-4"><Globe size={16} /> Distributed Ledger</div>
            <div className="flex items-center gap-4"><ShieldCheck size={16} /> End-to-End RSA</div>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Forms */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-20 bg-[#fcfcfd] relative overflow-hidden">
        {/* Role Selector Floating at Top */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50">
           <div className="flex gap-2 p-1.5 bg-white rounded-full border border-slate-100 shadow-xl backdrop-blur-xl">
              {[
                { id: 'customer', label: 'Store', icon: ShoppingBag },
                { id: 'seller', label: 'Merchant', icon: Store },
                { id: 'admin', label: 'Root Ops', icon: ShieldCheck }
              ].map((r) => (
                <button 
                  key={r.id} 
                  onClick={() => { setRole(r.id as any); setError(null); }} 
                  className={`px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${role === r.id ? `${theme.main} text-white shadow-2xl scale-110 z-10` : 'text-slate-400 hover:text-slate-900'}`}
                >
                  <r.icon size={14} /> {r.label}
                </button>
              ))}
           </div>
        </div>

        <div className="w-full max-w-[460px] relative z-10">
          {/* Header */}
          <div className="mb-12 lg:text-left text-center">
            {view !== 'reset-sent' && (
              <h3 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase font-display italic">
                {view === 'login' ? 'Welcome Back' : 
                 view === 'signup' ? 'Create Node' : 
                 view === 'reset-password' ? 'Reset Secret' : 'Recovery'}
              </h3>
            )}
            <p className="text-slate-400 font-medium text-lg italic font-display">
              {view === 'login' ? 'Sync your credentials to the cluster.' : 
               view === 'signup' ? 'Join the world of elite artifact collection.' : 
               view === 'forgot' ? 'Initiate identity recovery protocol.' : 
               view === 'reset-password' ? 'Define a new secure access pattern.' : ''}
            </p>
          </div>

          {/* Success View for Email Sent */}
          {view === 'reset-sent' ? (
            <div className="text-center space-y-8 animate-in zoom-in duration-500">
               <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={48} />
               </div>
               <div className="space-y-4">
                  <h4 className="text-3xl font-black tracking-tighter uppercase font-display italic">Recovery Dispatched</h4>
                  <p className="text-slate-500 font-medium italic font-display">A recovery sequence has been beamed to {email}. Check your comms link.</p>
               </div>
               <div className="pt-6 space-y-4">
                  <button 
                    onClick={() => setView('reset-password')}
                    className={`w-full py-6 rounded-full font-black text-xs uppercase tracking-[0.4em] text-white transition-all shadow-3xl ${theme.main}`}
                  >
                    Open Reset Link (Simulated)
                  </button>
                  <button 
                    onClick={() => setView('login')}
                    className="w-full py-6 rounded-full font-black text-xs uppercase tracking-[0.4em] border-2 border-slate-100 hover:border-slate-900 transition-all"
                  >
                    Return to Auth
                  </button>
               </div>
            </div>
          ) : (
            <>
              {/* Error Display */}
              {error && (
                <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 text-rose-600 animate-in slide-in-from-top-4">
                  <AlertCircle size={20} />
                  <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
                </div>
              )}

              {/* Success Notification */}
              {successMessage && (
                <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4 text-emerald-600 animate-in slide-in-from-top-4">
                  <CheckCircle2 size={20} />
                  <p className="text-xs font-bold uppercase tracking-widest">{successMessage}</p>
                </div>
              )}

              {/* Admin Role Selector (Granular Permissions UI) */}
              {role === 'admin' && view === 'login' && (
                <div className="mb-10 animate-in fade-in duration-500">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3 mb-4 block">Command Tier</label>
                   <div className="grid grid-cols-2 gap-3">
                      {(['Super Admin', 'Ops Manager', 'Security Lead', 'Support Hero'] as AdminSubRole[]).map(r => (
                        <button 
                          key={r} 
                          onClick={() => setAdminSubRole(r)}
                          className={`px-4 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all ${adminSubRole === r ? 'bg-rose-600 border-rose-600 text-white shadow-xl scale-105' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
                        >
                          {r}
                        </button>
                      ))}
                   </div>
                </div>
              )}

              {/* Main Auth Form */}
              <form onSubmit={handleAuth} className="space-y-6">
                {view === 'signup' && (
                  <div className="space-y-2.5 animate-in slide-in-from-top-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">Identity Name</label>
                    <div className="relative group">
                      <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={20} />
                      <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Alex Rivera" className="w-full bg-white border border-slate-100 rounded-[28px] py-4 pl-16 pr-6 text-slate-900 outline-none focus:ring-[12px] focus:ring-slate-900/5 focus:border-slate-900 transition-all shadow-sm" />
                    </div>
                  </div>
                )}

                {(view !== 'reset-password') && (
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">Node Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={20} />
                      <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="identity@luxoraa.com" className="w-full bg-white border border-slate-100 rounded-[28px] py-4 pl-16 pr-6 text-slate-900 outline-none focus:ring-[12px] focus:ring-slate-900/5 focus:border-slate-900 transition-all shadow-sm" />
                    </div>
                  </div>
                )}

                {view === 'reset-password' && (
                  <>
                    <div className="space-y-2.5 animate-in slide-in-from-top-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">New Secret Passphrase</label>
                      <div className="relative group">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={20} />
                        <input required type={showPassword ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white border border-slate-100 rounded-[28px] py-4 pl-16 pr-16 text-slate-900 outline-none focus:ring-[12px] focus:ring-slate-900/5 focus:border-slate-900 transition-all shadow-sm" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors p-2">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                      </div>
                    </div>
                    <div className="space-y-2.5 animate-in slide-in-from-top-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">Confirm New Secret</label>
                      <div className="relative group">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={20} />
                        <input required type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white border border-slate-100 rounded-[28px] py-4 pl-16 pr-6 text-slate-900 outline-none focus:ring-[12px] focus:ring-slate-900/5 focus:border-slate-900 transition-all shadow-sm" />
                      </div>
                    </div>
                  </>
                )}

                {view !== 'forgot' && view !== 'reset-password' && (
                  <div className="space-y-2.5 animate-in slide-in-from-top-4">
                    <div className="flex justify-between items-center px-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Secret Passphrase</label>
                      {view === 'login' && (
                        <button type="button" onClick={() => setView('forgot')} className="text-[10px] font-black text-slate-400 hover:text-slate-950 uppercase tracking-widest transition-colors">Forgot?</button>
                      )}
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={20} />
                      <input required type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white border border-slate-100 rounded-[28px] py-4 pl-16 pr-16 text-slate-900 outline-none focus:ring-[12px] focus:ring-slate-900/5 focus:border-slate-900 transition-all shadow-sm" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors p-2">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                    </div>
                  </div>
                )}

                {view === 'signup' && (
                  <div className="space-y-2.5 animate-in slide-in-from-top-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">Verify Passphrase</label>
                    <div className="relative group">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={20} />
                      <input required type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white border border-slate-100 rounded-[28px] py-4 pl-16 pr-6 text-slate-900 outline-none focus:ring-[12px] focus:ring-slate-900/5 focus:border-slate-900 transition-all shadow-sm" />
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className={`w-full py-6 rounded-full font-black text-xs uppercase tracking-[0.6em] flex items-center justify-center gap-6 transition-all shadow-3xl active:scale-[0.98] text-white ${isLoading ? 'bg-slate-200 cursor-wait' : `${theme.main} hover:scale-[1.02]`}`}
                >
                  {isLoading ? <Loader2 className="animate-spin" size={24} /> : 
                   view === 'login' ? <>Initialize Node <ArrowRight size={20} /></> :
                   view === 'signup' ? <>Register Identity <ArrowRight size={20} /></> :
                   view === 'reset-password' ? <>Update Secret <RefreshCw size={20} /></> :
                   <>Request Recovery <ArrowRight size={20} /></>}
                </button>
              </form>

              {/* Social Logins */}
              {view === 'login' && (
                <div className="mt-10 space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-[#fcfcfd] px-4 text-slate-300">Third-Party Sync</span></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-4 py-5 bg-white border border-slate-100 rounded-[24px] hover:border-slate-900 transition-all shadow-sm">
                       <Chrome size={20} className="text-rose-500" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Google</span>
                    </button>
                    <button className="flex items-center justify-center gap-4 py-5 bg-white border border-slate-100 rounded-[24px] hover:border-slate-900 transition-all shadow-sm">
                       <Apple size={20} className="text-slate-900" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Apple ID</span>
                    </button>
                  </div>
                </div>
              )}

              {/* View Switcher Footer */}
              <div className="mt-12 pt-8 border-t border-slate-100 text-center space-y-4">
                 <p className="text-slate-400 font-medium italic font-display">
                    {view === 'login' ? "Don't have an identity node?" : 
                     view === 'signup' ? "Already part of the cluster?" : 
                     view === 'reset-password' ? "Changed your mind?" : "Remember your credentials?"}
                 </p>
                 <button 
                   onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                   className="text-xs font-black uppercase tracking-[0.4em] text-slate-900 hover:text-indigo-600 transition-colors"
                 >
                   {view === 'login' ? 'Join the Matrix' : 'Return to Sync'}
                 </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
