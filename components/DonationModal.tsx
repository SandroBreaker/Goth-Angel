
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coffee, Copy, Check, Zap, ShieldCheck, Heart } from 'lucide-react';

interface DonationModalProps {
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const pixKey = "11982244907";
  // Fix: Casting motion.div to any to resolve React 19 type incompatibilities
  const MotionDiv = motion.div as any;

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    // Fix: Using MotionDiv (casted to any) to resolve type errors
    <MotionDiv 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Fix: Using MotionDiv (casted to any) to resolve type errors */}
      <MotionDiv 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-[#050505] border border-neutral-800 p-8 shadow-[0_0_50px_rgba(255,0,127,0.15)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-0"></div>

        <div className="relative z-10">
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FF007F]/10 border border-[#FF007F]/20 text-[#FF007F]">
                <Coffee size={18} />
              </div>
              <div>
                <h3 className="text-[11px] font-bold tracking-[0.4em] text-white uppercase">Neural_Funding</h3>
                <p className="text-[8px] text-neutral-500 uppercase tracking-widest mt-0.5">Support Project Integrity</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-neutral-900 text-neutral-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </header>

          <section className="mb-8 space-y-4">
            <p className="font-mono text-[10px] text-neutral-400 leading-relaxed uppercase tracking-wider text-justify">
              O G.A.S Archive é um santuário digital gratuito e sem anúncios. Sua contribuição ajuda a manter os servidores de alta performance e a indexação de dados do projeto ativos.
            </p>
            <div className="h-px w-full bg-neutral-900"></div>
          </section>

          <section className="space-y-6">
            <div className="space-y-2">
              <span className="text-[9px] font-bold text-[#FF007F] uppercase tracking-[0.3em]">Chave PIX (Celular)</span>
              <div className="flex gap-2">
                <div className="flex-grow bg-neutral-950 border border-neutral-800 p-4 font-mono text-sm text-white tracking-[0.2em] flex items-center justify-center select-all">
                  {pixKey}
                </div>
                <button 
                  onClick={handleCopy}
                  className={`px-6 transition-all border flex items-center justify-center gap-2 ${copied ? 'bg-[#00FF41] border-[#00FF41] text-black' : 'bg-[#FF007F]/10 border-[#FF007F]/30 text-[#FF007F] hover:bg-[#FF007F] hover:text-white'}`}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest hidden xs:inline">
                    {copied ? 'Copied' : 'Copy'}
                  </span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-neutral-900/40 border border-neutral-800 flex items-start gap-4">
               <Zap size={16} className="text-[#7000FF] shrink-0 mt-1" />
               <p className="text-[8px] text-neutral-500 uppercase leading-relaxed tracking-widest">
                 Qualquer valor via "Buy me a coffee" é direcionado integralmente para a manutenção da infraestrutura técnica (Neural Nodes).
               </p>
            </div>
          </section>

          <footer className="mt-10 pt-6 border-t border-neutral-900 flex justify-between items-center opacity-40">
             <div className="flex items-center gap-2">
                <ShieldCheck size={12} className="text-neutral-500" />
                <span className="text-[7px] font-mono text-neutral-500 uppercase tracking-widest">Secure Transfer Protocol</span>
             </div>
             <Heart size={12} className="text-[#FF007F]" fill="currentColor" />
          </footer>
        </div>
      </MotionDiv>
    </MotionDiv>
  );
};
