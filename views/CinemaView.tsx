
import React, { useState, useEffect } from 'react';
import { generateLuxuryVideo } from '../geminiService';
import { GeneratedVideo } from '../types';

const CinemaView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [hasKey, setHasKey] = useState(false);
  const [loadingKey, setLoadingKey] = useState(true);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    const selected = await (window as any).aistudio.hasSelectedApiKey();
    setHasKey(selected);
    setLoadingKey(false);
  };

  const handleOpenKey = async () => {
    await (window as any).aistudio.openSelectKey();
    setHasKey(true); // Assume success after dialog
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const url = await generateLuxuryVideo(prompt);
      setVideos(prev => [{ url, prompt, timestamp: new Date() }, ...prev]);
      setPrompt('');
    } catch (error) {
      console.error(error);
      if (error.message?.includes("Requested entity was not found")) {
        setHasKey(false);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (loadingKey) return <div className="h-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>;

  if (!hasKey) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-950">
        <div className="max-w-md glass p-10 rounded-3xl border border-amber-900/30">
          <h2 className="serif text-3xl gold-text mb-4">Elite Authentication Required</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Cinema Studio access requires an active billing project. Please select your premium API key to continue.
          </p>
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="block text-xs text-amber-500/50 hover:text-amber-500 mb-6 transition-colors underline uppercase tracking-widest">Billing Documentation</a>
          <button 
            onClick={handleOpenKey}
            className="w-full py-4 bg-amber-500 text-slate-950 font-bold rounded-full hover:bg-amber-400 transition-all shadow-lg"
          >
            Authenticate Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="serif text-4xl gold-text mb-2">Cinema Studio</h1>
        <p className="text-slate-400">Direct ultra-luxury cinematic experiences in 1080p high-fidelity.</p>
      </header>

      <div className="glass p-8 rounded-3xl border border-amber-900/10 mb-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] -z-10"></div>
        
        <div className="max-w-3xl mx-auto text-center">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Direct your scene... e.g., 'A vintage Ferrari driving through the Swiss Alps at dawn, golden light reflecting off the chrome'"
            className="w-full h-32 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-xl placeholder-slate-700 focus:outline-none focus:border-amber-500/50 transition-all resize-none mb-6 shadow-inner"
          ></textarea>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="px-12 py-4 bg-gradient-to-r from-amber-600 to-amber-400 text-slate-950 font-bold rounded-full hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all disabled:opacity-50 uppercase tracking-widest text-sm"
          >
            {isGenerating ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing Film...
              </span>
            ) : 'Generate Cinema'}
          </button>
          
          {isGenerating && (
             <p className="mt-4 text-xs text-amber-500/50 italic">Rendering high-fidelity motion. This may take a few moments.</p>
          )}
        </div>
      </div>

      <div className="space-y-12">
        {videos.map((vid, idx) => (
          <div key={idx} className="glass rounded-3xl overflow-hidden shadow-2xl animate-fadeIn">
            <video controls className="w-full aspect-video bg-black">
              <source src={vid.url} type="video/mp4" />
            </video>
            <div className="p-8">
              <h3 className="serif text-2xl text-amber-100 mb-2">{vid.prompt}</h3>
              <p className="text-slate-500 text-xs uppercase tracking-widest">{vid.timestamp.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CinemaView;
