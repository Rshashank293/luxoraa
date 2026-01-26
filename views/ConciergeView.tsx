
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { generateConciergeResponse } from '../geminiService';

const ConciergeView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        (err) => console.debug("Location access denied", err)
      );
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateConciergeResponse(input, messages, location);
      const modelMessage: ChatMessage = {
        role: 'model',
        text: response.text,
        timestamp: new Date(),
        sources: response.sources
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        role: 'model',
        text: "I apologize, but my connections are temporarily interrupted. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4 md:p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="serif text-3xl gold-text">Concierge</h1>
          <p className="text-slate-500 text-sm">Real-time luxury intelligence grounded in Search and Maps</p>
        </div>
        <div className="flex space-x-2 items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-slate-400 uppercase tracking-widest">Precision Active</span>
          {location && <span className="text-[10px] text-amber-500/50 ml-2">Location Synced</span>}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto space-y-6 pr-4 mb-6 custom-scrollbar" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-50">
            <div className="w-20 h-20 border border-amber-900/30 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-amber-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
            <h3 className="serif text-2xl mb-2">Private Consultation</h3>
            <p className="max-w-md">"Show me the most exclusive Italian restaurants in the city" or "Locate a boutique with the new Patek Philippe collection nearby."</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}>
            <div className={`max-w-[85%] rounded-2xl px-6 py-4 ${
              msg.role === 'user' 
                ? 'bg-amber-900/20 border border-amber-500/30 text-amber-100 shadow-xl' 
                : 'glass border border-slate-800 text-slate-200 shadow-2xl'
            }`}>
              <div className="prose prose-invert prose-amber max-w-none">
                {msg.text.split('\n').map((line, i) => (
                  <p key={i} className="mb-2 leading-relaxed">{line}</p>
                ))}
              </div>
              
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                  <p className="text-[10px] uppercase tracking-tighter text-slate-500">Verified Intelligence</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((src, i) => (
                      <a key={i} href={src.uri} target="_blank" rel="noreferrer" className="text-xs text-amber-500/80 hover:text-amber-400 bg-amber-500/5 px-2 py-1 rounded border border-amber-500/10 flex items-center transition-all">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        {src.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="glass border border-slate-800 rounded-2xl px-6 py-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 pb-4">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Inquire Luxora..."
            className="w-full bg-slate-900/50 border border-slate-800 rounded-full py-5 px-8 pr-16 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-lg placeholder-slate-600 shadow-inner glass group-hover:bg-slate-900/80"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center hover:bg-amber-400 transition-all disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConciergeView;
