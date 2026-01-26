import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { getChatbotResponse } from '../services/geminiService';

const AIHelpDesk: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Welcome to Luxoraa Elite Support. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
    const botResponse = await getChatbotResponse(userMsg, history);
    
    setMessages(prev => [...prev, { role: 'model', text: botResponse || 'I am sorry, I could not process that.' }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-indigo-600 transition-all hover:scale-110 active:scale-95 group"
        >
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full animate-ping" />
          <MessageSquare className="group-hover:rotate-12 transition-transform" />
        </button>
      ) : (
        <div className="w-[400px] h-[600px] bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-8 duration-500">
          <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500 rounded-xl"><Bot size={20} /></div>
              <div>
                <p className="font-black text-sm">Luxoraa Concierge</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Powered</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X size={20} /></button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="relative flex items-center">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Luxoraa anything..."
                className="w-full pl-4 pr-12 py-4 bg-slate-50 rounded-2xl border-none text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 p-2 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-center gap-1.5 opacity-40">
              <Sparkles size={12} className="text-indigo-600" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Enhanced by Gemini</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIHelpDesk;