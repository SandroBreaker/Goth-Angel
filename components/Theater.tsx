
import React from 'react';
import { motion } from 'framer-motion';

const videos = [
  { id: '3rkJ3L5Ce80', title: 'Awful Things', type: 'Music Video' },
  { id: 'v_K_A_4vI-o', title: 'Save That Shit', type: 'Music Video' },
  { id: 'WvV5H_mK6K8', title: 'Life Is Beautiful', type: 'Music Video' },
  { id: '7o0U9r7KAnU', title: 'The Brightside', type: 'Music Video' },
  { id: 'S_fE_6fC3tI', title: 'Star Shopping (Live)', type: 'Rare Performance' },
  { id: '1T66jP6T96Y', title: 'Everybody\'s Everything', type: 'Documentary Trailer' }
];

export const Theater: React.FC = () => {
  const MotionDiv = motion.div as any;

  return (
    <div className="max-w-6xl mx-auto py-24 px-6">
      <div className="text-center mb-24">
        <h2 className="font-serif-classic text-4xl mb-4 tracking-[0.2em] text-white">THEATER</h2>
        <p className="font-mono text-[10px] text-neutral-600 uppercase tracking-[0.5em]">Visual Archives & Documentaries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {videos.map((vid, idx) => (
          <MotionDiv
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="group"
          >
            <div className="aspect-video bg-neutral-900 border border-neutral-800 group-hover:border-[#FF007F]/40 transition-all overflow-hidden relative">
              <iframe
                className="w-full h-full grayscale-[50%] group-hover:grayscale-0 transition-all duration-700"
                src={`https://www.youtube.com/embed/${vid.id}?controls=1&rel=0`}
                title={vid.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="mt-4 flex justify-between items-center px-1">
              <h3 className="font-serif-classic text-sm text-neutral-300 group-hover:text-white transition-colors tracking-widest">{vid.title}</h3>
              <span className="font-mono text-[9px] text-neutral-600 uppercase border border-neutral-900 px-2 py-0.5">{vid.type}</span>
            </div>
          </MotionDiv>
        ))}
      </div>
    </div>
  );
};
