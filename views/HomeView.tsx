
import React from 'react';
import { ViewType } from '../types';

interface HomeViewProps {
  setView: (view: ViewType) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ setView }) => {
  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto animate-fadeIn">
      <header className="mb-12">
        <h2 className="text-slate-400 text-sm tracking-widest uppercase mb-2">Welcome Back</h2>
        <h1 className="serif text-5xl lg:text-6xl gold-text font-light mb-4">Good Evening, Julien</h1>
        <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
          Your personal gateway to the world's most exclusive experiences. How may Luxora elevate your lifestyle today?
        </p>
      </header>

      {/* Featured Card */}
      <div className="relative h-[400px] rounded-2xl overflow-hidden mb-12 group cursor-pointer shadow-2xl">
        <img 
          src="https://picsum.photos/seed/luxury-yacht/1600/800" 
          alt="Featured Destination" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 lg:p-12 w-full">
          <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-tighter rounded mb-4 backdrop-blur-md border border-amber-500/30">
            Exclusive Discovery
          </span>
          <h3 className="serif text-4xl text-white mb-2">The Amalfi Coast Escape</h3>
          <p className="text-slate-300 max-w-lg mb-6">Experience the Mediterranean like never before with private villa access and bespoke nautical charters.</p>
          <button 
            onClick={() => setView(ViewType.CONCIERGE)}
            className="px-8 py-3 bg-white text-slate-950 font-bold rounded-full hover:bg-amber-100 transition-colors flex items-center"
          >
            Arrange Journey
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { title: 'Fine Dining', desc: 'Secure reservations at Michelin-starred establishments globally.', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
          { title: 'Bespoke Visuals', desc: 'Generate high-fidelity concepts for your next project.', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
          { title: 'Private Voice', desc: 'Conversational assistance for immediate arrangements.', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' }
        ].map((card, idx) => (
          <div key={idx} className="glass p-8 rounded-2xl border border-amber-900/10 hover:border-amber-500/30 transition-all duration-300 cursor-pointer group shadow-lg">
            <div className="w-12 h-12 bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-500 mb-6 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} /></svg>
            </div>
            <h4 className="serif text-2xl text-amber-100 mb-2">{card.title}</h4>
            <p className="text-slate-400 leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeView;
