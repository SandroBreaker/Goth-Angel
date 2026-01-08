
import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Quote, Heart, Music, Star, ShieldCheck, Plus, Minus, ChevronDown } from 'lucide-react';

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
    title: 'ORIGINS & LINEAGE',
    subtitle: 'Allentown, Pennsylvania',
    description: 'Gustav Elijah Åhr entered the world on November 1st, 1996. Born to Harvard-educated parents—Liza Womack and Johan Åhr.',
    details: [
      'Nascimento em 1 de novembro de 1996, em Allentown, Pensilvânia.',
      'Família vivia na 2625 Liberty St., em uma casa do Muhlenberg College.',
      'Influência central do avô materno, John Womack, renomado historiador de Harvard.',
      'Apelido "Peep" inspirado nos filhotes de galinha que a família criava.'
    ],
    era: 'origins',
    icon: <Heart size={18} />
  },
  {
    year: '2001 – 2010',
    title: 'THE GIFTED OUTSIDER',
    subtitle: 'Long Beach, Long Island',
    description: 'Relocated to Long Island before age five. Gus was identified as a "gifted and talented" student, showing a precocious nature.',
    details: [
      'Mudança para Long Beach por volta de 2001.',
      'Identificado como aluno "superdotado e talentoso" na terceira série (2004).',
      'Aprendeu a tocar instrumentos de sopro: trombone e tuba.',
      'Trabalhos de infância já misturavam realidade e faz-de-conta para expressar sentimentos.'
    ],
    era: 'origins',
    icon: <Music size={18} />
  },
  {
    year: '2013 – 2015',
    title: 'THE AWAKENING',
    subtitle: 'The Bedroom Sanctuary',
    description: 'After his parents\' separation in 2012, Gus began facing severe anxiety. He graduated high school early and chose art.',
    details: [
      'Formou-se no ensino médio 6 meses antes do esperado via cursos online.',
      'Primeira tatuagem facial (coração partido) aos 18 para "bloquear" empregos convencionais.',
      'Começou no SoundCloud como Trap Goose antes de assumir Lil Peep.',
      'Gravou "Lil Peep; Part One" e "Live Forever" inteiramente em seu quarto.'
    ],
    era: 'awakening',
    icon: <Quote size={18} />
  },
  {
    year: '2016',
    title: 'UNDERGROUND ASCENT',
    subtitle: 'Skid Row to GBC',
    description: 'Moved to Los Angeles in February 2016. Living initially in Skid Row, performing first shows and joining collectives.',
    details: [
      'Primeiro show em Tucson, Arizona (12 de fevereiro) com Schemaposse.',
      'Uniu-se formalmente ao GothBoiClique (GBC) em setembro de 2016.',
      'Lançou "Crybaby" e "Hellboy", consolidando o gênero Emo Rap globalmente.',
      'Assinou parceria de gestão com a First Access Entertainment.'
    ],
    era: 'ascent',
    icon: <Star size={18} />
  },
  {
    year: '2017',
    title: 'GLOBAL FREQUENCY',
    subtitle: 'Stardom & Identity',
    description: 'A meteoric rise led to global tours, fashion runway appearances, and profound personal revelations.',
    details: [
      'Primeira turnê solo pela Rússia, Europa e EUA na primavera de 2017.',
      'Desfilou para VLONE e Marcelo Burlon nas Semanas de Moda de Paris e Milão.',
      'Assumiu bissexualidade no Twitter em 8 de agosto de 2017.',
      'Lançou "Come Over When You\'re Sober, Pt. 1" em 15 de agosto de 2017.'
    ],
    era: 'stardom',
    icon: <ShieldCheck size={18} />
  },
  {
    year: '2017 – PRESENT',
    title: 'THE ETERNAL ECHO',
    subtitle: 'Legacy & Preservation',
    description: 'Following his passing on Nov 15, 2017, his family began a long journey to protect his artistic integrity.',
    details: [
      'Overdose acidental de fentanil e alprazolam em 15 de novembro de 2017.',
      'Liza Womack processou a gestão por negligência, recuperando o controle total em 2023.',
      'Lançamentos póstumos: COWYS Pt. 2, documentário Everybody\'s Everything e Diamonds.',
      'Relançamento de mixtapes clássicas com samples autorizados para streaming.'
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
        
        {/* Text Section */}
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
                {isExpanded ? 'CLOSE ARCHIVE' : 'DECRYPT DATASET'}
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
                      <span className="text-[11px] font-mono text-neutral-500 tracking-wider leading-relaxed uppercase">{detail}</span>
                    </MotionDiv>
                  ))}
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>
        </MotionDiv>

        {/* Visual / Abstract Section */}
        <MotionDiv 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full md:w-1/2 flex justify-center"
        >
          <div className="relative p-12 bg-neutral-950/40 border border-neutral-900 shadow-2xl overflow-hidden group/card">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF007F]/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
            <div className="relative z-10 font-gothic text-9xl opacity-5 select-none pointer-events-none group-hover/card:opacity-20 transition-opacity duration-1000">
              {event.era.charAt(0)}
            </div>
            <div className="mt-4 font-mono text-[8px] text-neutral-800 uppercase tracking-[0.5em] group-hover/card:text-neutral-500 transition-colors">
              LOG_FRAGMENT_#{100+idx}
            </div>
            <div className="absolute top-6 right-6 text-[#7000FF]/20 group-hover/card:text-[#7000FF]/60 transition-colors">
              {event.icon}
            </div>
          </div>
        </MotionDiv>
      </div>

      {/* Vertical Node Connector for Mobile */}
      <div className="md:hidden absolute left-0 top-0 h-full w-px bg-white/5 ml-[-1rem]">
        <div className="w-2 h-2 bg-[#7000FF]/40 rounded-full mt-4 -ml-1" />
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
        {/* Central Vertical Line */}
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
            <h2 className="font-gothic text-7xl md:text-9xl mb-4 text-white opacity-20 select-none tracking-tighter uppercase">Chronicle</h2>
            <p className="font-serif-classic text-xl tracking-[0.4em] text-neutral-400 uppercase">A Digital Preservation</p>
          </MotionDiv>
        </div>

        <div className="space-y-64 relative z-10">
          {bioData.map((event, idx) => (
            <TimelineItem key={idx} event={event} idx={idx} />
          ))}
        </div>

        {/* Closing Quote */}
        <MotionDiv 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="mt-64 text-center pb-32"
        >
          <div className="mb-12 flex justify-center opacity-40">
            <Quote size={48} className="text-[#FF007F]" />
          </div>
          <blockquote className="font-serif-classic text-2xl md:text-5xl text-white italic max-w-5xl mx-auto leading-tight mb-12">
            "I'm just a human. I have emotions. I have feelings. I'm not a robot. I want to be everything for everyone."
          </blockquote>
          <div className="space-y-4">
             <cite className="font-mono text-sm text-[#FF007F] block tracking-[0.5em] uppercase">— Gustav Elijah Åhr</cite>
             <p className="font-mono text-[10px] text-neutral-700 max-w-xl mx-auto leading-relaxed uppercase tracking-widest">
               His vulnerability was his greatest weapon, and his legacy is now preserved forever in code and collective memory.
             </p>
          </div>
        </MotionDiv>
      </div>
    </MotionDiv>
  );
};
