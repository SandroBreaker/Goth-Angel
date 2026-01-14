
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Heart, Sparkles, Shield } from 'lucide-react';

interface DonationModalProps {
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const pixKey = "11982244907";
  const MotionDiv = motion.div as any;

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <MotionDiv 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl"
      onClick={onClose}
    >
      <MotionDiv 
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 30, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg bg-[#050505] border-2 border-[#FF007F] p-8 md:p-12 shadow-[0_0_100px_rgba(255,0,127,0.2)] overflow-hidden rounded-sm"
        onClick={e => e.stopPropagation()}
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 p-4 opacity-10 text-[#FF007F]">
          <Heart size={120} strokeWidth={1} fill="currentColor" />
        </div>
        
        <div className="relative z-10">
          <header className="flex justify-between items-start mb-10">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-4 text-[#FF007F] mb-2">
                <Heart size={24} className="fill-[#FF007F]/20" />
                <h3 className="font-gothic text-4xl md:text-5xl text-white tracking-widest drop-shadow-[0_0_15px_rgba(255,0,127,0.5)]">Support the Legacy</h3>
              </div>
              <p className="font-serif-classic text-[10px] md:text-[12px] text-neutral-400 uppercase tracking-[0.3em] font-bold">Maintain the Digital Sanctuary</p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 bg-neutral-900/50 hover:bg-[#FF007F]/20 text-neutral-500 hover:text-white transition-all rounded-full group"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform" />
            </button>
          </header>

          <section className="mb-12 space-y-6">
            <p className="font-serif-classic text-[11px] md:text-[13px] text-neutral-300 leading-relaxed uppercase tracking-wider text-justify border-l-2 border-[#FF007F]/30 pl-6">
              Este arquivo é um esforço independente para imortalizar a obra de Gustav. Sua contribuição ajuda a cobrir os custos de infraestrutura e a manter este santuário livre de anúncios.
            </p>
          </section>

          <section className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[#FF007F]">
                <Sparkles size={14} />
                <span className="font-serif-classic text-[10px] font-bold uppercase tracking-[0.4em]">Oferenda via PIX</span>
              </div>
              
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-grow bg-black border border-neutral-800 p-5 font-mono text-base text-white tracking-[0.3em] flex items-center justify-center select-all shadow-inner">
                  {pixKey}
                </div>
                <button 
                  onClick={handleCopy}
                  className={`px-8 py-5 transition-all duration-500 border-2 flex items-center justify-center gap-3 group relative overflow-hidden ${
                    copied 
                    ? 'bg-[#00FF41] border-[#00FF41] text-black shadow-[0_0_20px_#00FF41]' 
                    : 'bg-[#FF007F] border-[#FF007F] text-white shadow-[0_0_25px_rgba(255,0,127,0.4)] hover:scale-105 active:scale-95'
                  }`}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  <span className="font-serif-classic text-[11px] font-bold uppercase tracking-widest">
                    {copied ? 'Copiado' : 'Copiar Chave'}
                  </span>
                </button>
              </div>
            </div>

            <div className="p-6 bg-[#FF007F]/5 border border-[#FF007F]/20 flex items-center gap-5">
               <Shield size={20} className="text-[#FF007F] shrink-0" />
               <p className="font-serif-classic text-[9px] text-neutral-400 uppercase leading-relaxed tracking-widest italic">
                 "Every small gesture ensures that his signal never fades from the web."
               </p>
            </div>
          </section>

          <footer className="mt-12 pt-8 border-t border-neutral-900 flex justify-between items-center opacity-60">
             <div className="flex items-center gap-3">
                <span className="font-gothic text-2xl text-neutral-600 select-none">Lil Peep</span>
             </div>
             <div className="flex items-center gap-3 font-serif-classic text-[8px] text-neutral-500 uppercase tracking-widest font-bold">
                <span>All Fragments Preserved</span>
                <div className="w-1 h-1 bg-[#FF007F] rounded-full animate-pulse" />
             </div>
          </footer>
        </div>

        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#FF007F]/40" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#FF007F]/40" />
      </MotionDiv>
    </MotionDiv>
  );
};
