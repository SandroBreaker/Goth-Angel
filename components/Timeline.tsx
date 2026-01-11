
import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Quote, Heart, Music, Star, ShieldCheck, ChevronDown, GraduationCap, Palette, Zap } from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  details?: string[];
  era: 'origins' | 'awakening' | 'ascent' | 'stardom' | 'legacy';
  icon?: React.ReactNode;
}

const bioData: TimelineEvent[] = [
  {
    year: '1996 – 2001',
    title: 'THE PEDIGREE',
    subtitle: 'Allentown to Harvard Lineage',
    description: 'Born Gustav Elijah Åhr on Nov 1st, 1996. A lineage of academic excellence met with a soul destined for rebellion.',
    details: [
      'Born in Allentown, PA, in a home owned by Muhlenberg College.',
      'Parents Liza Womack and Johan Åhr were both Harvard graduates.',
      'Grandfather John Womack was a renowned Harvard professor and Mexican Revolution expert.',
      'The nickname "Peep" was given by his mother because he looked like a baby chick.'
    ],
    era: 'origins',
    icon: <Heart size={18} />
  },
  {
    year: '2001 – 2013',
    title: 'GIFTED & TALENTED',
    subtitle: 'The Outlier in Long Beach',
    description: 'Identified as "gifted" early on, Gus navigated school with a mixture of brilliance and profound alienation.',
    details: [
      'Moved to Long Beach, NY before age five.',
      'Identified as a "Gifted and Talented" student in 3rd grade (2004).',
      'Accomplished musician: learned to play trombone and tuba.',
      'Early writing blended reality and make-believe to express complex emotions.'
    ],
    era: 'origins',
    icon: <GraduationCap size={18} />
  },
  {
    year: '2013 – 2015',
    title: 'THE AWAKENING',
    subtitle: 'Trap Goose & Symbolic Vows',
    description: 'Facing severe anxiety after his parents\' separation, Gus found refuge in the digital underground.',
    details: [
      'Began self-medicating with cannabis and Xanax at age 16 for anxiety.',
      'Graduated high school 6 months early in Jan 2014 via online courses.',
      'Tattooed a broken heart on his face at 18 to "guarantee" he could never have a conventional job.',
      'Released "Lil Peep; Part One" and "Live Forever" from his bedroom sanctuary.'
    ],
    era: 'awakening',
    icon: <Palette size={18} />
  },
  {
    year: '2016',
    title: 'UNDERGROUND ASCENT',
    subtitle: 'Skid Row to GBC',
    description: 'A move to LA ignited a global movement, blending grunge aesthetics with trap frequencies.',
    details: [
      'Moved to LA in Feb 2016, living in Skid Row while building his career.',
      'First live performance in Tucson, AZ (Feb 12) with Schemaposse.',
      'Joined GothBoiClique (GBC) in Sept 2016, releasing "Crybaby" and "Hellboy".',
      'Established the "Future of Emo" sound through raw vulnerability.'
    ],
    era: 'ascent',
    icon: <Star size={18} />
  },
  {
    year: '2017',
    title: 'GLOBAL FREQUENCY',
    subtitle: 'Runways & First Access',
    description: 'Transitioning from SoundCloud hero to international icon, Peep redefined what a modern rockstar looks like.',
    details: [
      'First solo tour through Russia, Europe, and USA in Spring 2017.',
      'Modeled for VLONE (Paris) and Marcelo Burlon (Milan) Fashion Weeks.',
      'Released "Come Over When You\'re Sober, Pt. 1" on August 15, 2017.',
      'Began recording "Diamonds" with iLoveMakonnen in London to find a fresh start.'
    ],
    era: 'stardom',
    icon: <Zap size={18} />
  },
  {
    year: '2017 – PRESENT',
    title: 'THE ETERNAL ECHO',
    subtitle: 'Womack vs FAE & Preservation',
    description: 'His family\'s battle for justice and the preservation of his raw, unfiltered artistic integrity.',
    details: [
      'Passed on Nov 15, 2017. Accidental overdose of fentanyl and alprazolam.',
      'Liza Womack sued FAE in 2019 for negligence and wrongful death.',
      '2023 Settlement: Full control of catalog and archives returned to the family.',
      'Regarded as the "Kurt Cobain of his generation" for capturing modern youth angst.'
    ],
    era: 'legacy',
    icon: <ShieldCheck size={18} />
  }
];

const TimelineItem: React.FC<{ event: TimelineEvent; idx: number }> = ({ event, idx }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MotionDiv = motion.div as any;

  return (
    <div className="relative group">
      <div className={`flex flex-col md:flex-row items-start gap-12 lg:gap-24 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
        <MotionDiv 
          initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`w-full md:w-1/2 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
        >
          <div className={`flex items-center gap-4 mb-2 ${idx % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
            <span className="font-mono text-[10px] text-[#FF007F] tracking-[0.4em] uppercase">{event.year}</span>
            <div className="text-[#7000FF]">{event.icon}</div>
          </div>
          
          <h3 className="font-serif-classic text-3xl md:text-5xl text-white mb-2 tracking-tight leading-tight group-hover:neon-text-pink transition-all duration-500">
            {event.title}
          </h3>
          <p className="font-mono text-[9px] text-neutral-500 uppercase tracking-[0.3em] mb-6 block">
            {event.subtitle}
          </p>
          
          <p className="text-neutral-400 text-base font-light leading-relaxed mb-8 max-w-lg mx-auto md:mx-0 inline-block">
            {event.description}
          </p>

          <div className={`flex ${idx % 2 === 0 ? 'justify-end' : 'justify-start'} mb-6`}>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 px-4 py-2 border border-neutral-800 bg-black/40 hover:border-[#FF007F]/50 hover:bg-[#FF007F]/5 transition-all group/btn"
            >
              <span className="font-mono text-[8px] tracking-[0.3em] text-neutral-500 group-hover/btn:text-[#FF007F]">
                {isExpanded ? 'CLOSE DATASET' : 'EXTRACT FRAGMENTS'}
              </span>
              <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                <ChevronDown size={12} className="text-[#7000FF]" />
              </div>
            </button>
          </div>
          
          <AnimatePresence>
            {isExpanded && (
              <MotionDiv
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="overflow-hidden"
              >
                <div className={`space-y-4 pt-4 border-t border-neutral-900 ${idx % 2 === 0 ? 'items-end' : 'items-start'} flex flex-col`}>
                  {event.details?.map((detail, dIdx) => (
                    <MotionDiv 
                      key={dIdx}
                      initial={{ x: idx % 2 === 0 ? 20 : -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: dIdx * 0.1 }}
                      className={`flex items-start gap-4 max-w-md ${idx % 2 === 0 ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}
                    >
                      <div className="w-1 h-1 bg-[#FF007F] rounded-full mt-2 shrink-0 shadow-[0_0_5px_#FF007F]" />
                      <span className="text-[11px] font-mono text-neutral-400 tracking-wider leading-relaxed uppercase">{detail}</span>
                    </MotionDiv>
                  ))}
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>
        </MotionDiv>

        <MotionDiv 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full md:w-1/2 flex justify-center"
        >
          <div className="relative p-12 bg-neutral-950/40 border border-neutral-900 shadow-2xl overflow-hidden group/card w-full aspect-video flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF007F]/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
            <div className="relative z-10 font-gothic text-[12rem] opacity-5 select-none pointer-events-none group-hover/card:opacity-10 transition-opacity duration-1000">
              {event.era.charAt(0)}
            </div>
            <div className="absolute bottom-6 font-mono text-[8px] text-neutral-800 uppercase tracking-[0.5em] group-hover/card:text-neutral-500 transition-colors">
              LOG_FRAGMENT_#{100+idx}
            </div>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
};

export const Timeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    ['#050505', '#0a050a', '#050505', '#050a0a', '#0a0505', '#050505']
  );

  const lineHeight = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const lineColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['#7000FF', '#FF007F', '#7000FF']
  );

  const MotionDiv = motion.div as any;

  return (
    <MotionDiv 
      ref={containerRef}
      style={{ backgroundColor }}
      className="relative min-h-screen py-32 transition-colors duration-1000 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2 hidden md:block" />
        <MotionDiv 
          className="absolute left-1/2 top-0 w-px -translate-x-1/2 hidden md:block origin-top z-20"
          style={{ 
            height: useTransform(lineHeight, [0, 1], ['0%', '100%']),
            backgroundColor: lineColor,
            boxShadow: useTransform(lineColor, (c) => `0 0-15px ${c}`)
          }}
        />

        <div className="text-center mb-48">
          <MotionDiv initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
            <h2 className="font-gothic text-7xl md:text-9xl mb-4 text-white opacity-20 select-none tracking-tighter uppercase">Chronicle</h2>
            <p className="font-serif-classic text-xl tracking-[0.4em] text-neutral-400 uppercase">Preserving the Gustav Elijah Åhr Legacy</p>
          </MotionDiv>
        </div>

        <div className="space-y-64 relative z-10">
          {bioData.map((event, idx) => (
            <TimelineItem key={idx} event={event} idx={idx} />
          ))}
        </div>

        <MotionDiv initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 2 }} className="mt-64 text-center pb-32">
          <div className="mb-12 flex justify-center opacity-40">
            <Quote size={48} className="text-[#FF007F]" />
          </div>
          <blockquote className="font-serif-classic text-2xl md:text-5xl text-white italic max-w-5xl mx-auto leading-tight mb-12">
            "I'm just a human. I have emotions. I have feelings. I'm not a robot. I want to be everything for everyone."
          </blockquote>
          <cite className="font-mono text-sm text-[#FF007F] block tracking-[0.5em] uppercase">— Gus Åhr</cite>
        </MotionDiv>
      </div>
    </MotionDiv>
  );
};
