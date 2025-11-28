import React, { useState, useRef, useEffect } from 'react';
import { Send, Cpu, Shield } from 'lucide-react';
import { chatWithSystem } from '../services/geminiService';

const Chatbot: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'SECURE CHANNEL OPEN. AI CO-PILOT ONLINE. AWAITING ORDERS.' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setInput('');
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);

    const history = messages.map(m => ({ role: m.role, parts: [m.text] }));
    const response = await chatWithSystem(userMsg, history);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-green-400 font-mono">
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 border text-xs md:text-sm ${
              m.role === 'user' 
                ? 'border-green-600 bg-green-900/20 text-green-100 rounded-tl-lg rounded-br-lg' 
                : 'border-blue-600 bg-blue-900/10 text-blue-200 rounded-tr-lg rounded-bl-lg'
            }`}>
              <div className="text-[10px] opacity-70 mb-1 font-bold flex items-center gap-1">
                  {m.role === 'user' ? 'CMD_AUTH_USER' : <><Cpu size={10} /> AI_CORE</>}
              </div>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="max-w-[80%] p-3 border border-blue-600 bg-blue-900/10 text-blue-200 animate-pulse text-xs">
                DECRYPTING RESPONSE...
             </div>
          </div>
        )}
      </div>
      <div className="p-2 border-t border-green-800 bg-black/60 flex gap-2 items-center">
        <Shield size={18} className="text-green-600" />
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="TRANSMIT MESSAGE..."
          className="flex-1 bg-transparent border-none text-green-400 focus:outline-none placeholder-green-800 font-bold"
        />
        <button 
            onClick={handleSend}
            disabled={loading}
            className="text-green-500 hover:text-green-300 disabled:opacity-50"
        >
            <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;