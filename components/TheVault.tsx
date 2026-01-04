
import React from 'react';
import { Lock, CloudOff, FileWarning } from 'lucide-react';

const lostMedia = [
  { title: 'Full Moon', status: 'Partially Found', year: '2014', detail: 'Early track produced before the Peep era.' },
  { title: 'Deathwish (Original Mix)', status: 'Lost', year: '2015', detail: 'Alternate version of the collaborative track.' },
  { title: 'The GBC Tape', status: 'Unreleased', year: '2017', detail: 'Planned group project with GothBoiClique members.' },
  { title: 'London Recordings', status: 'Private Archive', year: '2017', detail: 'Hours of vocal takes from the COWYS sessions.' }
];

export const TheVault: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-24 px-6">
      <div className="text-center mb-24">
        <h2 className="font-serif-classic text-4xl mb-4 tracking-[0.2em] text-white">THE VAULT</h2>
        <p className="font-mono text-[10px] text-neutral-600 uppercase tracking-[0.5em]">Lost Media & Unreleased Echoes</p>
      </div>

      <div className="space-y-4">
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

      <div className="mt-20 p-8 border border-dashed border-neutral-900 text-center">
        <FileWarning className="mx-auto mb-4 text-neutral-800" size={32} />
        <p className="text-[10px] font-mono text-neutral-700 uppercase tracking-[0.3em]">
          Access restricted to primary archivists. More fragments discovered monthly.
        </p>
      </div>
    </div>
  );
};
