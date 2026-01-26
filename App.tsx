
import React, { useState, useEffect } from 'react';
import { ViewType } from './types';
import HomeView from './views/HomeView';
import ConciergeView from './views/ConciergeView';
import VisualsView from './views/VisualsView';
import CinemaView from './views/CinemaView';
import VoiceView from './views/VoiceView';
import LifestyleView from './views/LifestyleView';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.HOME);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderView = () => {
    switch (currentView) {
      case ViewType.HOME: return <HomeView setView={setCurrentView} />;
      case ViewType.CONCIERGE: return <ConciergeView />;
      case ViewType.VISUALS: return <VisualsView />;
      case ViewType.CINEMA: return <CinemaView />;
      case ViewType.VOICE: return <VoiceView />;
      case ViewType.LIFESTYLE: return <LifestyleView />;
      default: return <HomeView setView={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-100">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      
      <main className={`flex-1 transition-all duration-300 relative ${isSidebarOpen ? 'ml-0' : 'ml-0'}`}>
        <div className="h-full overflow-y-auto overflow-x-hidden">
          {renderView()}
        </div>
        
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-900 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900 rounded-full blur-[150px]"></div>
        </div>
      </main>
    </div>
  );
};

export default App;
