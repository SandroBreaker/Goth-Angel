
import React from 'react';
import { Lock, CloudOff, FileWarning, ShieldAlert, Package, Briefcase } from 'lucide-react';

const lostMedia = [
  { title: 'Diamonds', status: 'Secured', year: '2023', detail: 'The legendary collaborative project with iLoveMakonnen, finally released in its intended form.' },
  { title: 'NO SMOK!NG', status: 'Archive', year: '2017', detail: 'His custom fashion line designed to celebrate fan creativity. Fragments preserved in archives.' },
  { title: 'The GBC Tape', status: 'Unreleased', year: '2017', detail: 'Planned group project with GothBoiClique members. Access restricted to family vaults.' },
  { title: 'London Vocals', status: 'Private', year: '2017', detail: 'Hours of raw vocal takes and experimental demos from the 2017 London sessions.' }
];

const legacyImpact = [
  { 
    title: 'Womack vs FAE', 
    icon: <Briefcase size={20} />, 
    detail: 'A landmark legal battle that returned full artistic control to the Åhr family in 2023.' 
  },
  { 
    title: 'Mental Health Advocacy', 
    icon: <ShieldAlert size={20} />, 
    detail: 'Peep used his platform to destigmatize depression and bipolar disorder in youth subcultures.' 
  },
  { 
    title: 'Everybody\'s Everything', 
    icon: <Package size={20} />, 
    detail: 'The Terrence Malick-produced documentary preserving the raw truth of Gus\'s life.' 
  }
];

export const TheVault: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-24 px-6 pb-48">
      <div className="text-center mb-24">
        <h2 className="font-serif-classic text-4xl mb-4 tracking-[0.2em] text-white">THE VAULT</h2>
        <p className="font-mono text-[10px] text-neutral-600 uppercase tracking-[0.5em]">Secured Artifacts & Unreleased Echoes</p>
      </div>

      <div className="space-y-4 mb-24">
        {lostMedia.map((item, idx) => (
          <div key={idx} className="bg-neutral-950/40 border border-neutral-900 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-[#7000FF]/30 transition-all">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-neutral-900 rounded-sm text-neutral-600 group-hover:text-[#7000FF] transition-colors">
                {item.status === 'Lost' ? <CloudOff size={20} /> : <Lock size={20} />}
              </div>
              <div>
                <h3 className="font-serif-classic text-lg text-neutral-200 mb-1 group-hover:text-white">{item.title}</h3>
                <p className="text-xs text-neutral-500 font-light max-w-md">{item.detail}</p>
              </div>
            </div>
            
            <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0">
              <span className="text-[10px] font-mono text-[#7000FF] bg-[#7000FF]/10 px-3 py-1 uppercase tracking-widest">{item.status}</span>
              <span className="text-[10px] font-mono text-neutral-700 uppercase tracking-widest">{item.year}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        {legacyImpact.map((item, idx) => (
          <div key={idx} className="p-6 border border-neutral-900 bg-neutral-950 hover:border-[#FF007F]/30 transition-all group">
            <div className="text-[#FF007F] mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
            <h4 className="font-serif-classic text-xs text-white mb-2 tracking-widest uppercase">{item.title}</h4>
            <p className="text-[10px] font-mono text-neutral-600 leading-relaxed uppercase">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="p-8 border border-dashed border-neutral-900 text-center">
        <FileWarning className="mx-auto mb-4 text-neutral-800" size={32} />
        <p className="text-[10px] font-mono text-neutral-700 uppercase tracking-[0.3em]">
          Family Heritage Protected. Catalog Integrity Restored.
        </p>
      </div>
    </div>
  );
};
