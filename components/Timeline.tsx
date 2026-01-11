
import React, { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Music, Star, ShieldCheck, ChevronRight, 
  Zap, Activity, BookOpen, Scale, 
  Archive, User, Maximize2, X, Disc, 
  Ghost, ExternalLink, Skull, HelpCircle, Film
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
        },
        {
          id: 'colaboradores', label: 'Colaboradores Chave', icon: <User size={14} />,
          content: { title: 'Parcerias Criativas', description: 'Artistas que ajudaram a moldar o som de Peep.' },
          children: [
            { id: 'tracy', label: 'Lil Tracy', icon: <User size={12} />, content: { title: "Lil Tracy", description: "Parceria prolífica resultando em hits como Witchblades." } },
            { id: 'makonnen', label: 'iLoveMakonnen', icon: <User size={12} />, content: { title: "iLoveMakonnen", description: "Colaboração em Londres para o álbum Diamonds." } },
            { id: 'smokeasac', label: 'Smokeasac', icon: <User size={12} />, content: { title: "Smokeasac", description: "Produtor principal por trás da sonoridade de COWYS." } },
            { id: 'nedarb', label: 'Nedarb Nagrom', icon: <User size={12} />, content: { title: "Nedarb Nagrom", description: "Produtor chave das primeiras mixtapes experimentais." } },
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
        { id: 'brandnew', label: 'Brand New', icon: <Music size={12} />, content: { title: 'Brand New', description: 'Samples que trazem a angústia do rock alternativo dos anos 2000.' } },
        { id: 'underoath', label: 'Underoath', icon: <Music size={12} />, content: { title: 'Underoath', description: 'Influências de post-hardcore integradas ao trap.' } },
        { id: 'deathcab', label: 'Death Cab for Cutie', icon: <Music size={12} />, content: { title: 'Death Cab for Cutie', description: 'Sample de "Brothers on a Hotel Bed" em Skyscrapers.' } },
        { id: 'oasis', label: 'Oasis', icon: <Music size={12} />, content: { title: 'Oasis', description: 'Incursões no Britpop e melodias melancólicas.' } },
        { id: 'avenged', label: 'Avenged Sevenfold', icon: <Music size={12} />, content: { title: 'Avenged Sevenfold', description: 'Samples de metal moderno em Hellboy.' } },
        { id: 'microphones', label: 'The Microphones', icon: <Music size={12} />, content: { title: 'The Microphones', description: 'Influências de indie folk e lo-fi atmosférico.' } },
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
        { id: 'brands', label: 'Vlone e Marcelo Burlon', icon: <Star size={12} />, content: { title: 'Legitimação', description: 'Sinalizou a aceitação da estética disruptiva pela alta costura.' } },
        { id: 'tattoos', label: 'Tatuagens Faciais', icon: <Star size={12} />, content: { title: 'Crybaby', description: 'Símbolos de vulnerabilidade e compromisso com a arte.' } },
        { id: 'hair', label: 'Cabelos Coloridos', icon: <Star size={12} />, content: { title: 'Cabelos Neon', description: 'Fusão de estéticas punk, gótica e streetwear.' } },
        { id: 'nosmoking', label: "Marca 'No Smoking'", icon: <Archive size={12} />, content: { title: 'Plataforma Comunitária', description: 'Conceito colaborativo para capacitar fãs e artistas.' } },
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
        { id: 'bipolar', label: 'Transtorno Bipolar', icon: <Activity size={12} />, content: { title: 'Condições', description: 'Falou abertamente sobre suas lutas e automedicação.' } },
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
            { id: 'fae', label: 'First Access Entertainment (FAE)', icon: <Scale size={12} />, content: { title: 'A Gestão', description: 'Defesa baseada no "acordo comercial" e responsabilidade adulta.' } },
            { id: 'negligencia', label: 'Alegação de Negligência', icon: <Scale size={12} />, content: { title: 'Negligência', description: 'Acusação de que a gestão falhou em proteger o artista exausto.' } },
            { id: 'acordo', label: 'Acordo em 2023', icon: <ShieldCheck size={12} />, content: { title: 'Resolução', description: 'Catálogo e arquivos devolvidos integralmente à família.' } },
          ]
        },
        {
          id: 'postumo', label: 'Lançamentos Posthuma', icon: <Archive size={14} />,
          content: { title: 'Estratégia Póstuma', description: 'Migração de obras originais para plataformas de streaming.' },
          children: [
            { id: 'cowys2', label: "Come Over When You're Sober, Pt. 2", icon: <Disc size={12} />, content: { title: "COWYS Pt. 2", description: "Primeiro álbum póstumo de estúdio, lançado em 2018." } },
            { id: 'diamonds', label: 'Álbum Diamonds', icon: <Disc size={12} />, content: { title: "Diamonds", description: "Lançamento em 2023 após anos de antecipação pelos fãs." } },
            { id: 'doc', label: "Documentário Everybody's Everything", icon: <Film size={12} />, content: { title: "Everybody's Everything", description: "Registro documental da vida e impacto de Gus." } },
          ]
        },
        {
          id: 'comparacoes', label: 'Comparações', icon: <HelpCircle size={14} />,
          content: { title: 'Estatura Cultural', description: 'Como Peep é visto na história da música.' },
          children: [
            { id: 'cobain', label: 'Kurt Cobain da Geração', icon: <User size={12} />, content: { title: "Voz Geracional", description: "Canalizou angústia niilista como Cobain fez nos anos 90." } },
            { id: 'metallica', label: 'Metallica (Corgan)', icon: <Music size={12} />, content: { title: "Billy Corgan", description: "Elogiado por vocalistas do rock clássico pela sua crueza." } },
          ]
        }
      ]
    }
  ]
};

const MindMapNode: React.FC<{ 
  node: NodeData; 
  depth: number; 
  onSelect: (node: NodeData) => void;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
}> = ({ node, depth, onSelect, expandedIds, onToggle }) => {
  const isExpanded = expandedIds.has(node.id);
  const MotionDiv = motion.div as any;

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        {/* Connection Line to parent */}
        {depth > 0 && (
          <div className="w-8 h-px bg-neutral-800 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-neutral-700 rounded-full" />
          </div>
        )}

        <MotionDiv
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (node.children) onToggle(node.id);
            onSelect(node);
          }}
          className={`group flex items-center gap-3 px-5 py-2.5 rounded-lg border backdrop-blur-md cursor-pointer transition-all duration-300 ${
            node.id === 'root' 
              ? 'bg-[#1a1c23] border-neutral-700 shadow-xl' 
              : isExpanded
                ? 'bg-[#2a2d36] border-[#7000FF]/50 shadow-[0_0_15px_rgba(112,0,255,0.15)]'
                : 'bg-[#2a2d36]/60 border-neutral-800 hover:border-[#FF007F]/40'
          }`}
        >
          <div className={`${isExpanded ? 'text-[#FF007F]' : 'text-neutral-500'} transition-colors`}>
            {node.icon}
          </div>
          <span className="font-mono text-[10px] text-neutral-100 tracking-[0.1em] uppercase whitespace-nowrap">
            {node.label}
          </span>
          {node.children && (
            <ChevronRight 
              size={12} 
              className={`text-neutral-600 transition-transform ${isExpanded ? 'rotate-90 text-[#FF007F]' : 'group-hover:translate-x-1'}`} 
            />
          )}
        </MotionDiv>
      </div>

      <AnimatePresence>
        {isExpanded && node.children && (
          <MotionDiv
            initial={{ opacity: 0, height: 0, x: -10 }}
            animate={{ opacity: 1, height: 'auto', x: 0 }}
            exit={{ opacity: 0, height: 0, x: -10 }}
            className="ml-8 border-l border-neutral-900 mt-2 space-y-2 relative"
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
  const containerRef = useRef<HTMLDivElement>(null);
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
    <div className="relative min-h-screen bg-[#050505] overflow-hidden py-32" ref={containerRef}>
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#FF007F]/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#7000FF]/5 blur-[120px] rounded-full animate-pulse delay-1000" />
        
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-10 relative z-10">
        <div className="mb-24 flex flex-col items-center">
          <MotionDiv initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center gap-4">
             <div className="px-4 py-1 border border-[#FF007F]/20 bg-[#FF007F]/5">
               <span className="font-mono text-[8px] text-[#FF007F] tracking-[0.4em] uppercase font-bold">Relational Mind Map</span>
             </div>
             <h2 className="font-serif-classic text-5xl md:text-6xl text-white tracking-[0.1em] uppercase text-center drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">MAPA DO LEGADO</h2>
             <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#FF007F] to-transparent mt-4" />
          </MotionDiv>
        </div>

        {/* Tree Layout Container */}
        <div className="flex justify-start min-h-[900px] p-10 overflow-x-auto scrollbar-hide pb-40">
           <div className="relative">
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
            transition={{ type: 'spring', damping: 35, stiffness: 250 }}
            className="fixed top-0 right-0 w-full md:w-[500px] h-full bg-[#0a0a0b] border-l border-neutral-900 z-[300] shadow-[-40px_0_100px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col"
          >
            {/* Panel Header */}
            <div className="p-8 border-b border-neutral-900 flex justify-between items-center bg-[#0d0d0f]">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-[#FF007F]/10 border border-[#FF007F]/20 text-[#FF007F]">
                  {selectedNode.icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] text-neutral-600 tracking-[0.3em] uppercase">Fragment ID: {selectedNode.id}</span>
                  <span className="font-mono text-[10px] text-white tracking-[0.1em] uppercase font-bold">Protocolo Ativo</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="p-3 hover:bg-neutral-900 text-neutral-500 hover:text-white transition-all rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-grow overflow-y-auto p-10 space-y-12">
              <section>
                <h2 className="font-serif-classic text-3xl text-white mb-6 tracking-tight leading-tight">
                  {selectedNode.content.title}
                </h2>
                <div className="p-6 bg-neutral-950 border-l-2 border-[#FF007F] font-mono text-sm text-neutral-300 leading-relaxed italic uppercase">
                  "{selectedNode.content.description}"
                </div>
              </section>

              {/* Data Visualization / Details */}
              <div className="space-y-10">
                 <div className="flex items-center gap-4 text-neutral-700">
                    <Activity size={12} className="text-[#7000FF]" />
                    <span className="font-mono text-[8px] uppercase tracking-[0.4em]">Análise de Fluxo</span>
                    <div className="h-px flex-grow bg-neutral-900" />
                 </div>

                 <p className="text-neutral-400 font-mono text-xs leading-relaxed uppercase tracking-wide">
                   Este nó representa uma frequência crítica na linha do tempo de Lil Peep. A análise sugere um impacto direto na subcultura digital contemporânea, influenciando tanto a estética quanto a narrativa de vulnerabilidade no hip-hop moderno.
                 </p>

                 {selectedNode.children && (
                   <div className="space-y-4">
                     <span className="font-mono text-[8px] text-neutral-600 uppercase tracking-[0.3em]">Sub-Nódulos Relacionados:</span>
                     <div className="flex flex-wrap gap-2">
                       {selectedNode.children.map(child => (
                         <span key={child.id} className="px-3 py-1 bg-neutral-900 border border-neutral-800 text-neutral-500 font-mono text-[9px] uppercase">
                           {child.label}
                         </span>
                       ))}
                     </div>
                   </div>
                 )}
              </div>
            </div>

            {/* Panel Footer */}
            <div className="p-8 bg-[#0d0d0f] border-t border-neutral-900 flex flex-col items-center gap-4">
               <Archive size={32} className="text-neutral-900 mb-2" />
               <p className="font-mono text-[8px] text-neutral-700 tracking-[0.4em] uppercase text-center">
                 Heritage Protected by SandroBreaker Engineering.<br/>
                 Integridade de dados verificada.
               </p>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      <div className="fixed bottom-10 left-10 flex flex-col gap-3 opacity-30">
         <div className="flex items-center gap-3">
           <div className="w-3 h-3 bg-[#FF007F] rounded-sm" />
           <span className="font-mono text-[8px] text-white tracking-[0.2em] uppercase">Eixo Emocional</span>
         </div>
         <div className="flex items-center gap-3">
           <div className="w-3 h-3 bg-[#7000FF] rounded-sm" />
           <span className="font-mono text-[8px] text-white tracking-[0.2em] uppercase">Eixo Técnico</span>
         </div>
      </div>
      
      <div className="fixed bottom-10 right-10 flex flex-col items-end gap-2 opacity-30 animate-pulse pointer-events-none">
         <span className="font-mono text-[7px] text-white tracking-[0.4em] uppercase">Clique para Expandir / Explorar</span>
         <Maximize2 size={12} className="text-[#FF007F]" />
      </div>
    </div>
  );
};
