
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CloudOff, FileWarning, ShieldAlert, Package, Briefcase, User, Calendar, MapPin, Activity, ChevronRight, Fingerprint, Info } from 'lucide-react';

const dossierData = {
  subject: {
    realName: "Gustav Elijah Åhr",
    alias: "Lil Peep",
    otherNames: ["Trap Goose", "Gus"],
    birth: "Nov 1, 1996, Allentown, PA",
    death: "Nov 15, 2017, Tucson, AZ",
    cause: "Accidental overdose (fentanyl/alprazolam)",
    nationality: ["USA", "Sweden"],
  },
  sections: [
    {
      id: "chronology",
      title: "LIFE CHRONOLOGY",
      icon: <Calendar size={18} />,
      items: [
        { label: "Pedigree", content: "Parents Liza Womack and Johan Åhr were both Harvard graduates." },
        { label: "Lineage", content: "Maternal grandfather John Womack was a renowned Harvard professor and Mexican Revolution expert." },
        { label: "Roots", content: "Grew up in Allentown in a home owned by Muhlenberg College before moving to Long Beach, NY." },
        { label: "Childhood", content: "Identified as 'gifted and talented' in 3rd grade; learned trombone and tuba." },
        { label: "Transition", content: "At 18, tattooed a broken heart on his face to ensure he could never have a 'conventional job'." }
      ]
    },
    {
      id: "career",
      title: "MUSICAL PIPELINE",
      icon: <Activity size={18} />,
      items: [
        { label: "Origins", content: "Began as Trap Goose on SoundCloud in 2013." },
        { label: "Ascent", content: "Joined GothBoiClique (GBC) in Sept 2016, releasing 'Crybaby' and 'Hellboy'." },
        { label: "Global", content: "Moved to London in 2017 to record with iLoveMakonnen, seeking distance from LA influences." },
        { label: "Impact", content: "Established the 'future of emo' through raw vulnerability and genre-blurring." }
      ]
    },
    {
      id: "legal",
      title: "WOMACK VS FAE",
      icon: <Briefcase size={18} />,
      items: [
        { label: "Lawsuit", content: "Liza Womack sued First Access Entertainment in 2019 for negligence and wrongful death." },
        { label: "Defense", content: "FAE argued Peep was an adult responsible for his own decisions with no legal 'duty of care'." },
        { label: "Outcome", content: "Case settled in 2023, returning full control of the catalog and archives to the family." }
      ]
    },
    {
      id: "legacy",
      title: "LEGACY & IMPACT",
      icon: <ShieldAlert size={18} />,
      items: [
        { label: "Cinema", content: "Documentary 'Everybody's Everything' (2019) produced by Terrence Malick." },
        { label: "Advocacy", content: "Used his platform to destigmatize depression, bipolar disorder, and suicidal ideation." },
        { label: "Posthumous", content: "Significant releases include COWYS Pt. 2 (2018) and 'Diamonds' (2023)." }
      ]
    }
  ],
  lostMedia: [
    { title: 'Full Moon', status: 'Fragment', year: '2014', detail: 'Early track produced before the Lil Peep era.' },
    { title: 'NO SMOK!NG', status: 'Secured', year: '2017', detail: 'Custom fashion line designed to celebrate fan creativity.' },
    { title: 'London Vocals', status: 'Vaulted', year: '2017', detail: 'Raw vocal takes from the final experimental sessions.' }
  ]
};

const DossierSection: React.FC<{ section: any }> = ({ section }) => {
  const [isOpen, setIsOpen] = useState(false);
  const MotionDiv = motion.div as any;

  return (
    <div className="border border-neutral-900 bg-[#080808]/40 overflow-hidden group">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-neutral-900/40 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-sm ${isOpen ? 'text-[#FF007F] bg-[#FF007F]/10' : 'text-neutral-600'} transition-colors`}>
            {section.icon}
          </div>
          <h3 className="font-serif-classic text-sm tracking-[0.2em] text-white uppercase">{section.title}</h3>
        </div>
        <ChevronRight size={16} className={`text-neutral-700 transition-transform duration-300 ${isOpen ? 'rotate-90 text-[#FF007F]' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 space-y-4">
              {section.items.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-4 group/item">
                  <div className="w-1 h-1 bg-neutral-800 group-hover/item:bg-[#FF007F] rounded-full mt-2 transition-colors" />
                  <div>
                    <span className="font-mono text-[9px] text-[#7000FF] uppercase tracking-widest block mb-1">{item.label}</span>
                    <p className="font-mono text-[10px] text-neutral-400 leading-relaxed uppercase">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

export const TheVault: React.FC = () => {
  const MotionDiv = motion.div as any;

  return (
    <div className="max-w-6xl mx-auto py-24 px-6 pb-48">
      {/* Header Dossier */}
      <section className="mb-24 grid grid-cols-1 lg:grid-cols-3 gap-12 items-end border-b border-neutral-900 pb-16">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <Fingerprint size={24} className="text-[#FF007F] opacity-50" />
            <span className="font-mono text-[10px] text-neutral-600 tracking-[0.5em] uppercase">Archive Subject #110196</span>
          </div>
          <h2 className="font-serif-classic text-5xl md:text-7xl text-white tracking-tighter mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            {dossierData.subject.realName.toUpperCase()}
          </h2>
          <div className="flex flex-wrap gap-4 font-mono text-[9px] tracking-[0.3em] uppercase">
            <span className="text-[#FF007F] border border-[#FF007F]/20 px-3 py-1 bg-[#FF007F]/5">{dossierData.subject.alias}</span>
            {dossierData.subject.otherNames.map(n => (
              <span key={n} className="text-neutral-500 border border-neutral-900 px-3 py-1">{n}</span>
            ))}
          </div>
        </div>

        <div className="space-y-3 bg-neutral-950 p-6 border border-neutral-900">
          <div className="flex justify-between items-center text-[10px] font-mono tracking-widest uppercase">
            <span className="text-neutral-600">Origin</span>
            <span className="text-neutral-200">{dossierData.subject.birth}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono tracking-widest uppercase">
            <span className="text-neutral-600">Terminal</span>
            <span className="text-neutral-200">{dossierData.subject.death}</span>
          </div>
          <div className="h-px bg-neutral-900 my-2" />
          <p className="text-[8px] font-mono text-[#FF007F] tracking-[0.2em] leading-relaxed uppercase opacity-80">
            CAUSE: {dossierData.subject.cause}
          </p>
        </div>
      </section>

      {/* Main Dossier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
        {dossierData.sections.map((section) => (
          <DossierSection key={section.id} section={section} />
        ))}
      </div>

      {/* Lost Media / Vaulted Items */}
      <div className="mb-24">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-grow bg-neutral-900" />
          <h3 className="font-serif-classic text-xl text-white tracking-[0.4em] uppercase">LOST FRAGMENTS</h3>
          <div className="h-px flex-grow bg-neutral-900" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {dossierData.lostMedia.map((item, idx) => (
            <div key={idx} className="bg-neutral-950 border border-neutral-900 p-8 group hover:border-[#7000FF]/40 transition-all relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 {item.status === 'Vaulted' ? <Lock size={48} /> : <CloudOff size={48} />}
               </div>
               <div className="relative z-10">
                 <div className="flex justify-between items-start mb-4">
                   <span className="font-mono text-[8px] text-[#7000FF] tracking-[0.5em] uppercase">{item.status}</span>
                   <span className="font-mono text-[8px] text-neutral-700 uppercase">{item.year}</span>
                 </div>
                 <h4 className="font-serif-classic text-lg text-neutral-200 mb-2 group-hover:text-[#FF007F] transition-colors">{item.title}</h4>
                 <p className="font-mono text-[9px] text-neutral-600 leading-relaxed uppercase">{item.detail}</p>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Disclaimer */}
      <div className="p-12 border border-dashed border-neutral-900 text-center relative group">
        <div className="absolute inset-0 bg-neutral-900/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <FileWarning className="mx-auto mb-6 text-neutral-800 group-hover:text-[#FF007F] transition-colors" size={40} />
        <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-[0.5em] mb-2">
          Heritage Protected. Integridade de catálogo restaurada.
        </p>
        <p className="text-[8px] font-mono text-neutral-800 uppercase tracking-[0.3em]">
          All metadata verified via family records and legal documentation.
        </p>
      </div>
    </div>
  );
};
