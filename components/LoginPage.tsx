import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, Fingerprint, Terminal, ShieldCheck } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginPageProps {
  onLogin: (user: UserType) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    onLogin({
      id: 'u-1',
      name: 'Alex Rivera',
      email,
      role: 'customer',
      points: 450,
      tier: 'Gold',
      isMember: true,
      walletBalance: 250,
      status: 'Active',
      lastLogin: new Date().toISOString(),
      mfaEnabled: true
    });
  };

  return (
    <div className="min-h-screen flex bg-[#0A0908]">
      {/* Visual Identity Column */}
      <div className="hidden lg:flex relative w-1/2 overflow-hidden group">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[20s] scale-110 group-hover:scale-100" />
        <div className="relative z-20 flex flex-col justify-between p-24 text-white w-full">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-[#D4AF37] text-black shadow-2xl rounded-none"><Terminal size={32} /></div>
            <h1 className="text-4xl font-black tracking-widest font-display italic">LUXORAA</h1>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.8em] text-[#D4AF37] mb-8">Identity Protocol</p>
            <h2 className="text-[7rem] font-display italic font-black leading-[0.85] mb-12">The <br/> <span className="opacity-40 font-sans tracking-tighter not-italic">Identity.</span></h2>
          </div>
          <div className="flex gap-12 text-[9px] font-black uppercase tracking-widest opacity-30">
            <div className="flex items-center gap-3"><ShieldCheck size={16} /> RSA Verified</div>
            <div className="flex items-center gap-3"><Fingerprint size={16} /> Biometric Sync</div>
          </div>
        </div>
      </div>

      {/* Auth Column */}
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-[#0A0908]">
        <div className="w-full max-w-md">
          <div className="mb-16">
            <h3 className="text-5xl font-display italic font-black text-white mb-6">Welcome Back</h3>
            <p className="text-white/40 italic font-display">Synchronize your credentials to the Luxoraa matrix.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 ml-4">Node Address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  required type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="identity@luxoraa.com"
                  className="w-full bg-white/5 border border-white/5 rounded-none py-5 pl-16 pr-8 text-white outline-none focus:border-[#D4AF37] transition-all"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center px-4">
                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Secret Code</label>
                <button type="button" className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37]">Recover</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  required type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/5 rounded-none py-5 pl-16 pr-8 text-white outline-none focus:border-[#D4AF37] transition-all"
                />
              </div>
            </div>

            <button 
              type="submit" disabled={isLoading}
              className="w-full btn-gold py-6 flex items-center justify-center gap-6 rounded-none group"
            >
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : <>Initialize Node <ArrowRight className="group-hover:translate-x-3 transition-transform" /></>}
            </button>
          </form>

          <div className="mt-16 pt-12 border-t border-white/5 text-center">
             <button className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-colors">Join the Elite Collective</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;