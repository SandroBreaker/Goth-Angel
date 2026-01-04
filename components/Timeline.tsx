
import React from 'react';
import { motion } from 'framer-motion';

const bioEvents = [
  { year: '1996', event: 'Birth of Gustav Elijah Ahr', detail: 'Born in Allentown, Pennsylvania, and raised in Long Island, NY.' },
  { year: '2014', event: 'The Move to Los Angeles', detail: 'Gustav moves to LA to pursue music under the moniker Lil Peep.' },
  { year: '2015', event: 'LiL PEEP; PART ONE', detail: 'His first major mixtape is released on SoundCloud, gaining cult traction.' },
  { year: '2016', event: 'HELLBOY & GBC', detail: 'Releases the seminal "Hellboy" mixtape and joins GothBoiClique.' },
  { year: '2017', event: 'Come Over When You\'re Sober, Pt. 1', detail: 'Debut studio album releases, solidifying his role as a genre pioneer.' },
  { year: '2017', event: 'The Eternal Rest', detail: 'Gustav passes away in Tucson, Arizona. A legacy begins.' },
  { year: '2018-Now', event: 'Posthumous Preservation', detail: 'Estate releases Pt. 2, Everybody\'s Everything, and archival collections.' }
];

export const Timeline: React.FC = () => {
  const MotionDiv = motion.div as any;

  return (
    <div className="max-w-4xl mx-auto py-24 px-6">
      <div className="text-center mb-32">
        <h2 className="font-serif-classic text-4xl mb-4 tracking-[0.2em] text-white">CHRONICLE</h2>
        <p className="font-mono text-[10px] text-neutral-600 uppercase tracking-[0.5em]">The Life of Gustav Ahr</p>
      </div>

      <div className="relative border-l border-neutral-900 ml-4 md:ml-0 md:left-1/2">
        {bioEvents.map((item, idx) => (
          <MotionDiv
            key={idx}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: idx * 0.1 }}
            className={`relative mb-24 md:w-1/2 ${idx % 2 === 0 ? 'md:pr-16 md:text-right md:left-[-50%]' : 'md:pl-16 md:left-[50%]'}`}
          >
            <div className={`absolute top-0 w-3 h-3 bg-black border border-[#FF007F] rounded-full z-10 ${idx % 2 === 0 ? '-left-[6.5px] md:-right-[6.5px] md:left-auto' : '-left-[6.5px]'}`}></div>
            
            <span className="font-serif-classic text-[#FF007F] text-2xl mb-2 block">{item.year}</span>
            <h3 className="font-serif-classic text-lg text-white mb-3 tracking-wide">{item.event}</h3>
            <p className="text-neutral-500 font-light leading-relaxed text-sm">
              {item.detail}
            </p>
          </MotionDiv>
        ))}
      </div>
    </div>
  );
};
