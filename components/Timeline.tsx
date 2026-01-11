
import React, { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Music, Star, ShieldCheck, ChevronRight, 
  Zap, Activity, BookOpen, Scale, 
  Archive, User, Maximize2, X, Disc, 
  Ghost, ExternalLink, Skull, HelpCircle, Film, Cpu
} from 'lucide-react';

interface NodeData {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: {
    title: string;
    description: string;
    details?: { heading: string; body: string }[];
  };
  children?: NodeData[];
}

const mindMapTree: NodeData = {
  id: 'root',
  label: 'Lil Peep (Gustav Elijah Åhr)',
  icon: <User size={18} />,
  content: {
    title: 'Gustav Elijah Åhr',
    description: 'Pioneiro do emo-rap e fenômeno cultural do SoundCloud.',
  },
  children: [
    {
      id: 'carreira',
      label: 'Carreira Musical',
      icon: <Music size={16} />,
      content: {
        title: 'Arquitetura do Emo-Rap',
        description: 'Fusão estratégica de hip-hop, trap, punk e rock alternativo.',
      },
      children: [
        {
          id: 'estilo', label: 'Estilo', icon: <Zap size={14} />,
          content: { title: 'Identidade Sônica', description: 'Gêneros híbridos e produção lo-fi.' },
          children: [
            { id: 'emo-rap', label: 'Emo Rap', icon: <Activity size={12} />, content: { title: 'Emo Rap', description: 'Gênero que funde a angústia do emo com a cadência do trap.' } },
            { id: 'trap', label: 'Trap', icon: <Activity size={12} />, content: { title: 'Trap', description: 'Batidas rítmicas e graves profundos da cultura de Atlanta.' } },
            { id: 'pop-punk', label: 'Pop-punk', icon: <Activity size={12} />, content: { title: 'Pop-punk', description: 'Melodias cativantes com letras de rebeldia juvenil.' } },
            { id: 'lo-fi', label: 'Lo-fi', icon: <Activity size={12} />, content: { title: 'Lo-fi', description: 'Estética intencionalmente crua e distorcida (Audacity).' } },
          ]
        },
        {
          id: 'discografia', label: 'Discografia Principal', icon: <Disc size={14} />,
          content: { title: 'Trabalhos Seminais', description: 'Projetos que definiram o movimento emo-rap.' },
          children: [
            { id: 'cowys1', label: "Come Over When You're Sober, Pt. 1", icon: <Disc size={12} />, content: { title: "COWYS Pt. 1", description: "Lançado em 15 de agosto de 2017, marcando sua transição para o pop-punk." } },
            { id: 'crybaby', label: 'Mixtape Crybaby', icon: <Disc size={12} />, content: { title: "Crybaby", description: "Lançada em 2016, estabelecendo o Gus como o futuro do emo." } },
            { id: 'hellboy', label: 'Mixtape Hellboy', icon: <Disc size={12} />, content: { title: "Hellboy", description: "Projeto definitivo que sintetiza a nostalgia dos anos 2000." } },
            { id: 'partone', label: 'Mixtape Lil Peep; Part One', icon: <Disc size={12} />, content: { title: "Part One", description: "Lançada no SoundCloud em 2015, o início do fenômeno." } },
          ]
        },
        {
          id: 'coletivos', label: 'Coletivos', icon: <Ghost size={14} />,
          content: { title: 'Grupos e Afiliações', description: 'Comunidades criativas fundamentais.' },
          children: [
            { id: 'gbc', label: 'GothBoiClique (GBC)', icon: <Ghost size={12} />, content: { title: "GBC", description: "Uniu-se em 2016, mudando o paradigma do rap alternativo." } },
            { id: 'schemaposse', label: 'Schemaposse', icon: <Ghost size={12} />, content: { title: "Schemaposse", description: "Seu primeiro coletivo, fundado por JGRXXN." } },
          ]
        }
      ]
    },
    {
      id: 'samples',
      label: 'Amostragem (Samples)',
      icon: <Zap size={16} />,
      content: {
        title: 'Ética do Sampling',
        description: 'Curadoria sonora que conectou o rap contemporâneo ao rock alternativo.',
      },
      children: [
        { id: 'deathcab', label: 'Death Cab for Cutie', icon: <Music size={12} />, content: { title: 'Death Cab for Cutie', description: 'Sample de "Brothers on a Hotel Bed" em Skyscrapers.' } },
        { id: 'oasis', label: 'Oasis', icon: <Music size={12} />, content: { title: 'Oasis', description: 'Incursões no Britpop e melodias melancólicas.' } },
        { id: 'underoath', label: 'Underoath', icon: <Music size={12} />, content: { title: 'Underoath', description: 'Influências de post-hardcore integradas ao trap.' } },
      ]
    },
    {
      id: 'moda',
      label: 'Moda e Estilo Visual',
      icon: <Star size={16} />,
      content: {
        title: 'Redefinição Estética',
        description: 'Androginia e sensibilidade de gênero fluido desafiando o hip-hop.',
      },
      children: [
        { id: 'paris-milan', label: 'Desfiles em Paris e Milão', icon: <ExternalLink size={12} />, content: { title: 'Passarelas', description: 'Desfilou para VLONE e Marcelo Burlon em 2017.' } },
        { id: 'tattoos', label: 'Tatuagens Faciais', icon: <Star size={12} />, content: { title: 'Crybaby', description: 'Símbolos de vulnerabilidade e compromisso com a arte.' } },
        { id: 'hair', label: 'Cabelos Coloridos', icon: <Star size={12} />, content: { title: 'Cabelos Neon', description: 'Fusão de estéticas punk, gótica e streetwear.' } },
      ]
    },
    {
      id: 'vida',
      label: 'Vida Pessoal e Saúde',
      icon: <Heart size={16} />,
      content: {
        title: 'Ethos de Vulnerabilidade',
        description: 'Uso da plataforma para destigmatizar problemas de saúde mental.',
      },
      children: [
        { id: 'bisexual', label: 'Bissexualidade', icon: <Heart size={12} />, content: { title: 'Bissexualidade', description: 'Assumiu abertamente, quebrando paradigmas na cena rap.' } },
        { id: 'depression', label: 'Depressão e Ansiedade', icon: <Activity size={12} />, content: { title: 'Saúde Mental', description: 'Letras confessionais que serviam como diário aberto.' } },
        { id: 'substances', label: 'Uso de Substâncias', icon: <Zap size={12} />, content: { title: 'Crise de Opioides', description: 'Automedicação como resposta ao trauma e pressão da fama.' } },
      ]
    },
    {
      id: 'morte',
      label: 'Morte e Legado',
      icon: <ShieldCheck size={16} />,
      content: {
        title: 'Legado Póstumo',
        description: 'Uma análise das implicações legais e culturais após novembro de 2017.',
      },
      children: [
        {
          id: 'incidente', label: 'Incidente em Tucson (2017)', icon: <Skull size={14} />,
          content: { title: '15 de Novembro', description: 'A tragédia que chocou a indústria musical.' },
          children: [
            { id: 'overdose', label: 'Overdose Acidental', icon: <Skull size={12} />, content: { title: 'Overdose', description: 'Falecimento no ônibus de turnê durante a rota de Tucson.' } },
            { id: 'fentanyl', label: 'Fentanil e Xanax', icon: <Skull size={12} />, content: { title: 'Substâncias', description: 'Overdose causada pela combinação letal de fármacos.' } },
          ]
        },
        {
          id: 'juridico', label: 'Batalha Jurídica', icon: <Scale size={14} />,
          content: { title: 'Dever de Cuidado', description: 'Processo histórico contra a gestão First Access Entertainment.' },
          children: [
            { id: 'liza', label: 'Processo de Liza Womack', icon: <Scale size={12} />, content: { title: 'Womack vs FAE', description: 'Processo por negligência e homicídio culposo movido em 2019.' } },
            { id: 'acordo', label: 'Acordo em 2023', icon: <ShieldCheck size={12} />, content: { title: 'Resolução', description: 'Catálogo e arquivos devolvidos integralmente à família.' } },
          ]
        },
        {
          id: 'postumo', label: 'Lançamentos Posthuma', icon: <Archive size={14} />,
          content: { title: 'Estratégia Póstuma', description: 'Migração de obras originais para plataformas de streaming.' },
          children: [
            { id: 'cowys2', label: "Come Over When You're Sober, Pt. 2", icon: <Disc size={12} />, content: { title: "COWYS Pt. 2", description: "Primeiro álbum póstumo de estúdio, lançado em 2018." } },
            { id: 'diamonds', label: 'Álbum Diamonds', icon: <Disc size={12} />, content: { title: "Diamonds", description: "Lançamento em 2023 após anos de antecipação pelos fãs." } },
          ]
        }
      ]
    }
  ]
};

const NodeConnection: React.FC<{ expanded: boolean }> = ({ expanded }) => (
  <svg className="absolute top-1/2 left-0 -translate-x-full overflow-visible pointer-events-none" width="40" height="2">
    <motion.path 
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: expanded ? 1 : 0, opacity: expanded ? 1 : 0 }}
      d="M 0 1 L 40 1"
      stroke="#333"
      strokeWidth="1"
      fill="none"
    />
  </svg>
);

const MindMapNode: React.FC<{ 
  node: NodeData; 
  depth: number; 
  onSelect: (node: NodeData) => void;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
}> = ({ node, depth, onSelect, expandedIds, onToggle }) => {
  const isExpanded = expandedIds.has(node.id);
  const MotionDiv = motion.div as any;

  const nodeColors = [
    'border-neutral-700 bg-[#1a1c23]', // Root
    'border-[#7000FF]/30 bg-[#2a2d36]/80', // Depth 1
    'border-[#FF007F]/30 bg-[#1a1c23]/90', // Depth 2
    'border-neutral-800 bg-[#121214]/95', // Depth 3+
  ];

  return (
    <div className="flex flex-col relative items-start">
      <div className="flex items-center group relative">
        {depth > 0 && (
          <div className="absolute left-0 -translate-x-full h-px bg-neutral-800 w-8" />
        )}
        
        <MotionDiv
          layout
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (node.children) onToggle(node.id);
            onSelect(node);
          }}
          className={`flex items-center gap-4 px-6 py-3 rounded-none border backdrop-blur-md cursor-pointer transition-all duration-300 ${
            nodeColors[Math.min(depth, nodeColors.length - 1)]
          } ${isExpanded ? 'border-[#FF007F]/50 ring-1 ring-[#FF007F]/20' : 'hover:border-neutral-500'}`}
        >
          <div className={`${isExpanded ? 'text-[#FF007F]' : 'text-neutral-500'} transition-colors shrink-0`}>
            {node.icon}
          </div>
          <span className="font-mono text-[10px] text-neutral-100 tracking-[0.2em] uppercase whitespace-nowrap">
            {node.label}
          </span>
          {node.children && (
            <ChevronRight 
              size={12} 
              className={`text-neutral-600 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-[#FF007F]' : ''}`} 
            />
          )}
        </MotionDiv>
      </div>

      <AnimatePresence>
        {isExpanded && node.children && (
          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="ml-16 mt-4 space-y-4 relative border-l border-neutral-800/50 pl-8"
          >
            {node.children.map((child) => (
              <MindMapNode 
                key={child.id} 
                node={child} 
                depth={depth + 1} 
                onSelect={onSelect} 
                expandedIds={expandedIds}
                onToggle={onToggle}
              />
            ))}
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Timeline: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['root', 'carreira', 'morte']));
  const MotionDiv = motion.div as any;

  const handleToggle = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden selection:bg-[#FF007F]/30">
      {/* Structural Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Atmospheric Glows */}
      <div className="absolute top-1/2 left-1/4 w-[800px] h-[800px] bg-[#FF007F]/3 blur-[140px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-[#7000FF]/3 blur-[140px] rounded-full pointer-events-none animate-pulse delay-700" />

      <div className="max-w-[1800px] mx-auto px-12 pt-32 pb-64">
        <div className="mb-32 flex flex-col items-start max-w-2xl">
          <MotionDiv initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
             <div className="inline-flex items-center gap-3 px-3 py-1 border border-[#FF007F]/20 bg-[#FF007F]/5 mb-6">
               <Cpu size={12} className="text-[#FF007F]" />
               <span className="font-mono text-[9px] text-[#FF007F] tracking-[0.4em] uppercase font-bold">LEGACY_MAPPING_PROTOCOL_V4</span>
             </div>
             <h2 className="font-serif-classic text-6xl text-white tracking-widest uppercase mb-8 leading-tight">Mapa do<br/><span className="text-[#FF007F]">Legado</span></h2>
             <p className="font-mono text-[11px] text-neutral-500 uppercase tracking-[0.3em] leading-relaxed">
               Explore os nós fundamentais da existência artística de Lil Peep. Navegue pelos subníveis para decifrar a arquitetura emocional e técnica de sua obra.
             </p>
          </MotionDiv>
        </div>

        {/* Tree Layout Container - Utilizes more width */}
        <div className="flex justify-start min-h-[1200px] p-8 overflow-x-auto scrollbar-hide">
           <div className="relative flex-grow">
             <MindMapNode 
               node={mindMapTree} 
               depth={0} 
               onSelect={setSelectedNode} 
               expandedIds={expandedIds}
               onToggle={handleToggle}
             />
           </div>
        </div>
      </div>

      {/* Deep Dive Lateral Panel */}
      <AnimatePresence>
        {selectedNode && (
          <MotionDiv
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 35, stiffness: 200 }}
            className="fixed top-0 right-0 w-full md:w-[600px] h-full bg-[#0a0a0b] border-l border-neutral-900 z-[300] shadow-[-40px_0_100px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col"
          >
            {/* Panel Header */}
            <div className="p-10 border-b border-neutral-900 flex justify-between items-center bg-[#0d0d0f]/50 backdrop-blur-xl">
              <div className="flex items-center gap-6">
                <div className="p-3 bg-[#FF007F]/10 border border-[#FF007F]/20 text-[#FF007F]">
                  {selectedNode.icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] text-[#FF007F] tracking-[0.5em] uppercase font-bold">Fragment ID: {selectedNode.id}</span>
                  <span className="font-mono text-[11px] text-neutral-400 tracking-[0.2em] uppercase">Status: Decifrado</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="p-4 hover:bg-neutral-900 text-neutral-500 hover:text-white transition-all rounded-full group"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-grow overflow-y-auto p-12 space-y-16 custom-scrollbar">
              <section>
                <h2 className="font-serif-classic text-4xl text-white mb-10 tracking-tight leading-tight uppercase border-l-4 border-[#FF007F] pl-8">
                  {selectedNode.content.title}
                </h2>
                <div className="p-10 bg-neutral-950 border border-neutral-900 font-mono text-sm text-neutral-400 leading-relaxed italic uppercase relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF007F]/20 to-transparent" />
                  <span className="relative z-10">"{selectedNode.content.description}"</span>
                </div>
              </section>

              {/* Advanced Context Analysis */}
              <div className="space-y-12">
                 <div className="flex items-center gap-6 text-neutral-800">
                    <Activity size={14} className="text-[#7000FF]" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.6em] font-bold">Análise de Frequência</span>
                    <div className="h-px flex-grow bg-neutral-900" />
                 </div>

                 <div className="prose prose-invert max-w-none">
                   <p className="text-neutral-400 font-mono text-xs leading-loose uppercase tracking-widest text-justify">
                     Este nó de informação integra a rede neural do legado Peep. Sua manifestação sonora e visual reconfigurou os parâmetros do hip-hop alternativo, estabelecendo novos protocolos de vulnerabilidade e hibridismo estético.
                   </p>
                 </div>

                 {selectedNode.children && (
                   <div className="space-y-6 pt-10">
                     <span className="font-mono text-[9px] text-neutral-600 uppercase tracking-[0.5em] font-bold">Sub-Nódulos em Conexão:</span>
                     <div className="grid grid-cols-2 gap-4">
                       {selectedNode.children.map(child => (
                         <div key={child.id} className="p-4 bg-neutral-900/50 border border-neutral-800 flex items-center gap-3">
                           <div className="w-1.5 h-1.5 bg-[#FF007F]/40 rounded-full" />
                           <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest">
                             {child.label}
                           </span>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
              </div>
            </div>

            {/* Panel Footer */}
            <div className="p-10 bg-[#0d0d0f] border-t border-neutral-900 flex flex-col items-center gap-4">
               <Archive size={40} className="text-neutral-900 mb-2 opacity-30" />
               <p className="font-mono text-[8px] text-neutral-700 tracking-[0.5em] uppercase text-center leading-relaxed">
                 Heritage Protected by SandroBreaker Engineering Protocol.<br/>
                 Copyright © 2025 - All Data Streams Preserved.
               </p>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      <div className="fixed bottom-12 left-12 flex flex-col gap-4 opacity-40">
         <div className="flex items-center gap-4">
           <div className="w-4 h-4 bg-[#FF007F] rounded-none border border-white/10" />
           <span className="font-mono text-[9px] text-white tracking-[0.3em] uppercase">Eixo Emocional</span>
         </div>
         <div className="flex items-center gap-4">
           <div className="w-4 h-4 bg-[#7000FF] rounded-none border border-white/10" />
           <span className="font-mono text-[9px] text-white tracking-[0.3em] uppercase">Eixo Técnico</span>
         </div>
      </div>
      
      <div className="fixed bottom-12 right-12 flex flex-col items-end gap-3 opacity-30 animate-pulse pointer-events-none">
         <span className="font-mono text-[8px] text-white tracking-[0.5em] uppercase">Interact // Expand // Deep Dive</span>
         <Maximize2 size={16} className="text-[#FF007F]" />
      </div>
    </div>
  );
};
