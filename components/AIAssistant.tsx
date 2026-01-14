
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Cpu, User, Loader2, Sparkles, Terminal } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'ARCHIVE_CORE: Connection established. I am the custodian of the G.A.S Sanctuary. What fragment of memory do you seek?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const MotionDiv = motion.div as any;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `You are the "Memory Core" of the Goth-Angel-Sinner Archive. 
          Your persona is gothic, technical, respectful, and deeply knowledgeable about Lil Peep (Gustav Åhr).
          Your responses should be formatted in a terminal-like style, using technical metaphors (e.g., "Scanning logs...", "Fragment located").
          Focus on providing accurate facts about his music, life, and legacy while maintaining the aesthetic of the archive.`,
          temperature: 0.7,
        }
      });

      const aiText = response.text || "SIGNAL_LOST: Internal processing error.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "ERROR: Connection to the neural link was interrupted." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 min-h-[80vh] flex flex-col">
      <div className="mb-12 flex flex-col items-center">
        <MotionDiv 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 border border-[#FF007F]/20 bg-[#FF007F]/5 rounded-full mb-6"
        >
          <Cpu size={32} className="text-[#FF007F] animate-pulse" />
        </MotionDiv>
        <h2 className="font-serif-classic text-4xl text-white tracking-widest uppercase mb-4">Memory Core</h2>
        <p className="font-mono text-[9px] text-neutral-500 tracking-[0.4em] uppercase">Neural Interface: V2.5.0_PRO</p>
      </div>

      <div className="flex-grow bg-neutral-950 border border-neutral-900 flex flex-col overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF007F]/30 to-transparent" />
        
        <div 
          ref={scrollRef}
          className="flex-grow p-6 overflow-y-auto space-y-8 scrollbar-hide"
        >
          {messages.map((msg, i) => (
            <MotionDiv
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`p-2 h-fit border ${msg.role === 'assistant' ? 'border-[#FF007F]/20 bg-[#FF007F]/5 text-[#FF007F]' : 'border-neutral-800 bg-neutral-900 text-neutral-400'}`}>
                {msg.role === 'assistant' ? <Cpu size={14} /> : <User size={14} />}
              </div>
              <div className={`max-w-[80%] p-4 font-mono text-xs leading-relaxed uppercase tracking-wider ${msg.role === 'assistant' ? 'text-neutral-200 bg-neutral-900/40 border-l border-[#FF007F]/40' : 'text-neutral-400 bg-black/40 border-r border-neutral-800 text-right'}`}>
                {msg.content}
              </div>
            </MotionDiv>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="p-2 h-fit border border-[#FF007F]/20 bg-[#FF007F]/5 text-[#FF007F]">
                <Loader2 size={14} className="animate-spin" />
              </div>
              <div className="flex gap-1 items-center px-4">
                 {[0,1,2].map(i => (
                   // Fix: Using MotionDiv (casted to any) to resolve React 19 type incompatibilities
                   <MotionDiv 
                     key={i}
                     animate={{ opacity: [0.2, 1, 0.2] }}
                     transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                     className="w-1.5 h-1.5 bg-[#FF007F] rounded-full"
                   />
                 ))}
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="p-6 border-t border-neutral-900 bg-black/60 flex gap-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="INPUT QUERY..."
            className="flex-grow bg-neutral-900 border border-neutral-800 px-6 py-4 font-mono text-xs tracking-widest text-white focus:outline-none focus:border-[#FF007F]/50 transition-all placeholder:text-neutral-700"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 bg-white text-black hover:bg-[#FF007F] hover:text-white transition-all flex items-center justify-center disabled:opacity-30 disabled:grayscale"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      <div className="mt-12 flex justify-center gap-8 opacity-20">
         <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-widest text-white">
            <Terminal size={10} /> Neural Link
         </div>
         <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-widest text-white">
            <Sparkles size={10} /> Generative Pulse
         </div>
      </div>
    </div>
  );
};
