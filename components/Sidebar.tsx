
import React from 'react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, setIsOpen }) => {
  const navItems = [
    { type: ViewType.HOME, label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { type: ViewType.CONCIERGE, label: 'Concierge', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { type: ViewType.VISUALS, label: 'Visual Studio', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { type: ViewType.CINEMA, label: 'Cinema Studio', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { type: ViewType.VOICE, label: 'Live Voice', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
    { type: ViewType.LIFESTYLE, label: 'Lifestyle Insights', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ];

  return (
    <aside className={`h-full glass border-r border-amber-900/20 transition-all duration-300 z-50 flex flex-col ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-6 flex items-center justify-between">
        {isOpen && <h1 className="serif text-2xl gold-text font-bold tracking-widest">LUXORAA</h1>}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-amber-500"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={isOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
          </svg>
        </button>
      </div>

      <nav className="mt-8 flex-1">
        {navItems.map((item) => (
          <button
            key={item.type}
            onClick={() => setView(item.type)}
            className={`w-full flex items-center p-4 transition-all duration-200 group relative ${
              currentView === item.type 
                ? 'bg-amber-900/10 text-amber-400' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
            }`}
          >
            {currentView === item.type && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 shadow-[0_0_10px_#d97706]"></div>
            )}
            <svg className={`w-6 h-6 min-w-[24px] ${currentView === item.type ? 'text-amber-500' : 'group-hover:text-amber-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
            </svg>
            {isOpen && <span className="ml-4 font-medium tracking-wide">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-amber-900/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-200 flex items-center justify-center text-slate-950 font-bold">
            JD
          </div>
          {isOpen && (
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-amber-100">Julien Deville</p>
              <p className="text-xs text-slate-500 truncate">Platinum Member</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
