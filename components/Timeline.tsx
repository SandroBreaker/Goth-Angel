
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  era: 'childhood' | 'isolation' | 'transformation' | 'fame' | 'legacy';
  imagePlaceholder: string;
}

const bioData: TimelineEvent[] = [
  {
    year: '1996',
    title: 'THE ANGEL IS BORN',
    description: 'Gustav Elijah Åhr enters the world in Allentown, Pennsylvania. Born to educators, he grows up in a house filled with books and high expectations, but he already feels the pull of a different frequency.',
    era: 'childhood',
    imagePlaceholder: 'https://images.unsplash.com/photo-1510440043132-841961e09159?q=80&w=600&auto=format&fit=crop'
  },
  {
    year: '2010',
    title: 'THE BEDROOM SANCTUARY',
    description: 'Feeling like an outsider in Long Beach High, Gustav retreats into the digital void. He spends days locked in his room, finding more comfort in YouTube and early SoundCloud communities than in the hallways of school.',
    era: 'isolation',
    imagePlaceholder: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=600&auto=format&fit=crop'
  },
  {
    year: '2013',
    title: 'THE FACE AS A CANVAS',
    description: 'The first face tattoos appear. Not as a fashion statement, but as a deliberate act of bridge-burning. Gustav decides he will never work a "normal" office job. He is fully committed to the life of an artist.',
    era: 'transformation',
    imagePlaceholder: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=600&auto=format&fit=crop'
  },
  {
    year: '2015',
    title: 'SCHEMAPOSSE & THE TRIBE',
    description: 'Gus becomes Peep. He joins SchemaPosse and later GothBoiClique, finding a chosen family of internet misfits. They share clothes, drugs, and melodies, creating a sound that would soon shake the world.',
    era: 'fame',
    imagePlaceholder: 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?q=80&w=600&auto=format&fit=crop'
  },
  {
    year: '2017',
    title: 'THE ETERNAL FREQUENCY',
    description: 'From a bedroom in Long Island to sold-out shows across the globe. Peep becomes the voice of a generation that feels too much. His vulnerability is his greatest weapon, and his legacy is now preserved forever in code.',
    era: 'legacy',
    imagePlaceholder: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop'
  }
];

export const Timeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Background Color Interpolation
  // Childhood (Sepia/Warm) -> Isolation (Cold Blue) -> Peep (Neon Pink/Dark)
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ['#1a120b', '#0b121a', '#050505', '#1a0b1a', '#050505']
  );

  const lineHeight = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const lineColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['#d4a373', '#7000FF', '#FF007F']
  );

  const MotionDiv = motion.div as any;

  return (
    <MotionDiv 
      ref={containerRef}
      style={{ backgroundColor }}
      className="relative min-h-screen py-32 transition-colors duration-1000 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 relative">
        {/* The Thread of Life (Animated Line) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2 hidden md:block" />
        <MotionDiv 
          className="absolute left-1/2 top-0 w-px -translate-x-1/2 hidden md:block origin-top z-20"
          style={{ 
            height: useTransform(lineHeight, [0, 1], ['0%', '100%']),
            backgroundColor: lineColor,
            boxShadow: useTransform(lineColor, (c) => `0 0 15px ${c}`)
          }}
        />

        <div className="text-center mb-48">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <h2 className="font-gothic text-7xl md:text-9xl mb-4 text-white opacity-20 select-none">Chronicle</h2>
            <p className="font-serif-classic text-xl tracking-[0.4em] text-neutral-400 uppercase">The Human Journey</p>
          </MotionDiv>
        </div>

        <div className="space-y-64 relative z-10">
          {bioData.map((event, idx) => (
            <div key={idx} className="relative">
              <div className={`flex flex-col md:flex-row items-center gap-12 lg:gap-24 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                
                {/* Text Section */}
                <MotionDiv 
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`w-full md:w-1/2 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
                >
                  <span className="font-mono text-5xl md:text-7xl font-bold opacity-10 mb-2 block" style={{ color: idx % 2 === 0 ? '#FF007F' : '#7000FF' }}>
                    {event.year}
                  </span>
                  <h3 className="font-serif-classic text-2xl md:text-4xl text-white mb-6 tracking-tight leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-neutral-400 text-base md:text-lg font-light leading-relaxed font-sans max-w-lg mx-auto md:mx-0 inline-block">
                    {event.description}
                  </p>
                  
                  <div className={`mt-8 flex ${idx % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                    <div className="h-px w-24 bg-neutral-800" />
                  </div>
                </MotionDiv>

                {/* Visual / Memory Section */}
                <MotionDiv 
                  initial={{ opacity: 0, scale: 0.9, rotate: idx % 2 === 0 ? 2 : -2 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: idx % 2 === 0 ? -1 : 1 }}
                  viewport={{ margin: "-100px" }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="w-full md:w-1/2 flex justify-center"
                >
                  <div className="relative group p-4 bg-[#080808] border border-neutral-800 shadow-2xl">
                    <div className="overflow-hidden aspect-[4/3] w-full max-w-sm grayscale-[60%] group-hover:grayscale-0 transition-all duration-1000">
                      <img 
                        src={event.imagePlaceholder} 
                        alt={event.title}
                        className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                      />
                    </div>
                    {/* Polaroid / Diary Note style footer */}
                    <div className="mt-4 pb-2">
                       <span className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest">
                         ARCHIVE_MEM_ID_{idx+102}
                       </span>
                    </div>
                    {/* Decorative Tape / Clip */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-white/5 backdrop-blur-md border border-white/5" />
                  </div>
                </MotionDiv>

              </div>

              {/* Central Node for Mobile */}
              <div className="md:hidden absolute left-0 top-0 h-full w-px bg-white/10 ml-[-1rem]">
                <div className="w-3 h-3 bg-white/20 rounded-full mt-4 -ml-1.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Closing Quote */}
        <MotionDiv 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="mt-64 text-center"
        >
          <blockquote className="font-serif-classic text-2xl md:text-4xl text-neutral-500 italic max-w-4xl mx-auto leading-relaxed">
            "I'm just a human. I have emotions. I have feelings. I'm not a robot."
          </blockquote>
          <cite className="font-mono text-xs text-[#FF007F] block mt-8 tracking-[0.5em] uppercase">— Gustav Elijah Åhr</cite>
        </MotionDiv>
      </div>
    </MotionDiv>
  );
};
