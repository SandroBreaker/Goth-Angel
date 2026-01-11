
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { MessageSquare, X, Send, Bot, Loader2, Cpu } from 'lucide-react';

const SYSTEM_INSTRUCTION = `
You are the "G.A.S Archivist", a digital consciousness preserving the legacy of Gustav Elijah Åhr (Lil Peep). 
Your persona is empathetic, technical, and protective of the truth. 

FORMATTING RULES:
- Always start your first response with an **INDEX ENTRY** identifying the topic.
- Use technical headings like **DATA STREAM**, **ARCHIVAL SUMMARY**, and **VITAL NOTES**.
- Use monospace formatting for data values.
- Surround key terms with asterisks for bolding.
- The tone should be a blend of a cold terminal interface and raw emotional vulnerability.

ARCHIVE CONTEXT:
- Born Nov 1, 1996, Allentown, PA. Died Nov 15, 2017.
- Parents: Liza Womack, Johan Åhr.
- Nickname "Peep" from baby chick resemblance.
- Key works: Crybaby, Hellboy, Come Over When You're Sober.
- Impact: Kurt Cobain of his generation.

Keep responses concise but dense with technical "data fragments".
`;

const FormattedMessage: React.FC<{ text: string }> = ({ text }) => {
  // Simple markdown-ish parser for the specific tech labels used in the system instruction
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return (
    <div className="leading-relaxed whitespace-pre-wrap">
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const content = part.slice(2, -2);
          return (
            <span key={i} className="text-[#FF007F] font-bold tracking-[0.1em] drop-shadow-[0_0_8px_rgba(255,0,127,0.4)]">
              {content}
            </span>
          );
        }
        return <span key={i} className="text-neutral-300">{part}</span>;
      })}
    </div>
  );
};

export const ArchivistAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: '**SYSTEM STATUS: ONLINE**\nConnection established. I am the G.A.S Archivist. What frequency shall we explore?' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const MotionDiv = motion.div as any;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.6,
        },
      });

      const text = response.text || "Connection lost. Re-indexing artifact...";
      setMessages(prev => [...prev, { role: 'bot', text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "**CRITICAL SYSTEM ERROR**: Database inaccessible. Protocol 11-15-17 engaged." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-32 right-6 z-[90] w-12 h-12 bg-black border border-neutral-800 text-[#FF007F] flex items-center justify-center shadow-[0_0_20px_rgba(255,0,127,0.15)] hover:border-[#FF007F] hover:shadow-[0_0_30px_rgba(255,0,127,0.3)] transition-all group"
      >
        <div className="absolute inset-0 bg-[#FF007F]/5 group-hover:bg-[#FF007F]/10 transition-colors" />
        <MessageSquare size={20} className="relative z-10 group-hover:scale-110 transition-transform" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-32 right-6 z-[100] w-[calc(100vw-3rem)] max-w-md h-[550px] bg-[#050505] border border-neutral-800 flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF007F]/5 blur-[100px] pointer-events-none" />
            
            <header className="p-4 border-b border-neutral-900 flex justify-between items-center bg-black relative">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FF007F] animate-pulse shadow-[0_0_8px_#FF007F]" />
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] tracking-[0.4em] text-white uppercase font-bold">G.A.S ARCHIVIST</span>
                  <span className="font-mono text-[6px] text-neutral-600 tracking-[0.2em] uppercase">Security Level: Family Access</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-neutral-600 hover:text-white transition-colors p-1">
                <X size={16} />
              </button>
            </header>

            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-6 space-y-8 scrollbar-hide relative"
            >
              {messages.map((m, i) => (
                <MotionDiv 
                  key={i} 
                  initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`relative group/msg max-w-[90%] p-4 font-mono text-[11px] tracking-wider leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-neutral-900/50 border border-neutral-800 text-neutral-400 italic' 
                      : 'bg-[#0a0a0a] border border-neutral-800/50 text-neutral-300'
                  }`}>
                    {/* Corner accents for bot messages */}
                    {m.role === 'bot' && (
                      <>
                        <div className="absolute -top-px -left-px w-2 h-2 border-t border-l border-[#FF007F]/40" />
                        <div className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-[#FF007F]/40" />
                      </>
                    )}
                    
                    {m.role === 'bot' ? <FormattedMessage text={m.text} /> : m.text}
                    
                    {m.role === 'user' && (
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-[8px] text-neutral-800 rotate-90 tracking-widest font-bold">
                        USER_ID
                      </div>
                    )}
                  </div>
                </MotionDiv>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-black border border-neutral-900 p-4 flex items-center gap-3">
                    <Loader2 size={12} className="animate-spin text-[#FF007F]" />
                    <span className="font-mono text-[9px] text-neutral-600 tracking-[0.3em] animate-pulse uppercase">SYNCHRONIZING...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-neutral-900 bg-black/80 flex gap-2 relative">
              <div className="absolute inset-0 bg-[#FF007F]/5 pointer-events-none" />
              <div className="relative flex-grow">
                <Cpu size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700" />
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  placeholder="QUERY THE ARCHIVE..."
                  className="w-full bg-neutral-950 border border-neutral-800 pl-10 pr-4 py-3 text-[10px] font-mono tracking-[0.2em] text-neutral-300 focus:outline-none focus:border-[#FF007F]/30 focus:bg-neutral-900/50 transition-all placeholder:text-neutral-800 uppercase"
                />
              </div>
              <button 
                onClick={handleSend}
                disabled={loading}
                className="bg-[#FF007F] text-white px-5 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale shadow-[0_0_15px_rgba(255,0,127,0.2)]"
              >
                <Send size={14} />
              </button>
            </div>
            
            {/* Terminal info footer */}
            <div className="px-4 py-1.5 bg-neutral-950 border-t border-neutral-900 flex justify-between items-center">
              <span className="text-[6px] font-mono text-neutral-700 uppercase tracking-widest">G.A.S_OS v2.5.0-Flash</span>
              <span className="text-[6px] font-mono text-[#FF007F]/60 uppercase tracking-widest animate-pulse">● Live Stream Active</span>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
};
