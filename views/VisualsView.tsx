
import React, { useState } from 'react';
import { generateLuxuryImage } from '../geminiService';
import { GeneratedImage } from '../types';

const VisualsView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const url = await generateLuxuryImage(prompt);
      if (url) {
        setImages(prev => [{ url, prompt, timestamp: new Date() }, ...prev]);
        setPrompt('');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="serif text-4xl gold-text mb-2">Visual Studio</h1>
        <p className="text-slate-400">Conceptualize luxury interiors, watch designs, and elite destinations in 8K fidelity.</p>
      </header>

      <div className="glass p-8 rounded-3xl border border-amber-900/10 mb-12 shadow-2xl relative overflow-hidden">
        {/* Subtle animated background for the generator box */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] -z-10 animate-pulse"></div>
        
        <div className="max-w-3xl mx-auto text-center">
          <label className="block text-xs uppercase tracking-widest text-amber-500 mb-4 font-bold">Creative Directives</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe a bespoke luxury concept... e.g., 'Modern glass penthouse overlooking Lake Como at sunset, minimalist interior with marble finishes'"
            className="w-full h-32 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-xl placeholder-slate-700 focus:outline-none focus:border-amber-500/50 transition-all resize-none mb-6 shadow-inner"
          ></textarea>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="px-12 py-4 bg-gradient-to-r from-amber-600 to-amber-400 text-slate-950 font-bold rounded-full hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
          >
            {isGenerating ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing...
              </span>
            ) : 'Generate Concept'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
        {images.map((img, idx) => (
          <div key={idx} className="group animate-fadeIn">
            <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 shadow-2xl ring-1 ring-amber-900/20">
              <img src={img.url} alt={img.prompt} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                <button className="px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-xs uppercase tracking-widest hover:bg-white hover:text-slate-950 transition-all">
                  Download 4K
                </button>
              </div>
            </div>
            <h3 className="serif text-xl text-amber-100 mb-2 truncate px-2">{img.prompt}</h3>
            <p className="text-slate-500 text-xs uppercase tracking-widest px-2">{img.timestamp.toLocaleTimeString()}</p>
          </div>
        ))}
        
        {images.length === 0 && !isGenerating && (
          <div className="col-span-full py-24 text-center opacity-30">
            <svg className="w-20 h-20 mx-auto text-amber-500/50 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <p className="text-xl">Your archive is empty. Begin conceptualizing above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualsView;
