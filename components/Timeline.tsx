
import React, { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Music, Star, ShieldCheck, ChevronRight, 
  Zap, Activity, BookOpen, Scale, 
  Archive, User, Maximize2, X, Disc, 
  Ghost, ExternalLink, Skull, HelpCircle, Film, Cpu,
  Layers, BarChart3
} from 'lucide-react';
import { TimelineHistory } from './TimelineHistory.tsx';

interface NodeData {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: {
    title: string;
    description: string;
    analysis: string;
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
    analysis: 'Gustav Elijah Åhr (1996–2017), conhecido mundialmente como Lil Peep, foi o catalisador de um movimento que redefiniu a música alternativa na era digital. Sua persona artística fundiu a vulnerabilidade crua do emo dos anos 2000 com a estética niilista e rítmica do trap moderno. Como um "Kurt Cobain da geração Z", Peep utilizou a internet para construir um santuário para os desajustados, transformando o SoundCloud no epicentro de uma revolução cultural que priorizava a honestidade emocional sobre a perfeição técnica.'
  },
  children: [
    {
      id: 'carreira',
      label: 'Carreira Musical',
      icon: <Music size={16} />,
      content: {
        title: 'Arquitetura do Emo-Rap',
        description: 'Fusão estratégica de hip-hop, trap, punk e rock alternativo.',
        analysis: 'A carreira musical de Peep foi uma trajetória meteórica de subversão. Do seu quarto em Long Island para palcos mundiais, ele desmantelou as barreiras entre gêneros. Sua discografia serve como um diário público de sua evolução, desde as primeiras mixtapes experimentais lo-fi até produções de estúdio polidas em Londres. O legado de sua obra reside na sua habilidade única de harmonizar melodias melancólicas com graves distorcidos, criando um som que é simultaneamente nostálgico e futurista.'
      },
      children: [
        {
          id: 'estilo', label: 'Estilo', icon: <Zap size={14} />,
          content: { 
            title: 'Identidade Sônica', 
            description: 'Gêneros híbridos e produção lo-fi.',
            analysis: 'A sonoridade de Peep é caracterizada por uma estética intencionalmente imperfeita. Utilizando o Audacity e microfones baratos em seus primeiros dias, ele criou o "emo-trap" — um subgênero que resgatava a angústia de bandas como Brand New e Taking Back Sunday para o contexto das batidas 808. Sua voz, que oscilava entre o canto melódico suave e o grito gutural punk, tornou-se o instrumento definitivo para expressar a alienação da juventude hiperconectada.'
          },
          children: [
            { id: 'emo-rap', label: 'Emo Rap', icon: <Activity size={12} />, content: { title: 'Emo Rap', description: 'Gênero que funde a angústia do emo com a cadência do trap.', analysis: 'O Emo Rap de Peep não era apenas um estilo, mas uma filosofia de vulnerabilidade radical. Ele trouxe temas como depressão e ideação suicida para a linha de frente do hip-hop, humanizando um gênero que muitas vezes celebrava a hiper-masculinidade.' } },
            { id: 'trap', label: 'Trap', icon: <Activity size={12} />, content: { title: 'Trap', description: 'Batidas rítmicas e graves profundos da cultura de Atlanta.', analysis: 'Apesar de suas raízes no rock, Peep dominava a cadência rítmica do trap. As batidas pesadas serviam como o esqueleto necessário para sustentar suas melodias etéreas, criando um contraste sônico potente que se tornou sua marca registrada.' } },
            { id: 'pop-punk', label: 'Pop-punk', icon: <Activity size={12} />, content: { title: 'Pop-punk', description: 'Melodias cativantes com letras de rebeldia juvenil.', analysis: 'Em seu álbum COWYS Pt. 1, Peep abraçou plenamente as estruturas do pop-punk dos anos 2000. Suas composições eram hinos geracionais sobre relacionamentos tóxicos e escapismo, canalizando a energia de ídolos como Blink-182.' } },
            { id: 'lo-fi', label: 'Lo-fi', icon: <Activity size={12} />, content: { title: 'Lo-fi', description: 'Estética intencionalmente crua e distorcida (Audacity).', analysis: 'A produção lo-fi era uma escolha ética e estética. Representava a democratização da música através da internet, onde a crueza da emoção era mais valorizada do que a limpeza do som de estúdio profissional.' } },
          ]
        },
        {
          id: 'discografia', label: 'Discografia Principal', icon: <Disc size={14} />,
          content: { 
            title: 'Trabalhos Seminais', 
            description: 'Projetos que definiram o movimento emo-rap.',
            analysis: 'Cada lançamento de Peep marcou um novo território sônico. De "Part One", que apresentou seu niilismo sonhador, a "Hellboy", que solidificou sua estatura cultural, e finalmente "COWYS Pt. 1", que o lançou ao estrelato global. Sua discografia póstuma, cuidadosamente gerida por sua mãe, Liza Womack, continua a expandir sua narrativa original, preservando a masterização lo-fi que seus fãs tanto amam.'
          },
          children: [
            { id: 'cowys1', label: "Come Over When You're Sober, Pt. 1", icon: <Disc size={12} />, content: { title: "COWYS Pt. 1", description: "Lançado em 15 de agosto de 2017, marcando sua transição para o pop-punk.", analysis: 'Seu único álbum de estúdio lançado em vida. Representa o pico de sua colaboração criativa com Smokeasac e uma virada para uma sonoridade mais acessível e ambiciosa, sem sacrificar sua essência sombria.' } },
            { id: 'crybaby', label: 'Mixtape Crybaby', icon: <Disc size={12} />, content: { title: "Crybaby", description: "Lançada em 2016, estabelecendo o Gus como o futuro do emo.", analysis: 'A mixtape que o tornou um ícone. Com samples de Brand New e Radiohead, Peep criou uma obra-prima de colagem musical que definia o que significava ser um "Crybaby" na era digital.' } },
            { id: 'hellboy', label: 'Mixtape Hellboy', icon: <Disc size={12} />, content: { title: "Hellboy", description: "Projeto definitivo que sintetiza a nostalgia dos anos 2000.", analysis: 'Considara por muitos como sua maior obra. Hellboy explorou as profundezas de sua depressão e seu estilo de vida rockstar decadente, consolidando seu status como o líder supremo do GBC.' } },
            { id: 'partone', label: 'Mixtape Lil Peep; Part One', icon: <Disc size={12} />, content: { title: "Part One", description: "Lançada no SoundCloud em 2015, o início do fenômeno.", analysis: 'Onde o mito começou. Gravada inteiramente em seu quarto, esta mixtape apresentou o mundo à sua voz melancólica e aos seus primeiros experimentos com samples de rock obscuro.' } },
          ]
        },
        {
          id: 'coletivos', label: 'Coletivos', icon: <Ghost size={14} />,
          content: { 
            title: 'Grupos e Afiliações', 
            description: 'Comunidades criativas fundamentais.',
            analysis: 'Peep nunca foi um artista isolado. Sua arte floresceu em coletivos que operavam nas franjas da indústria. Estas alianças eram baseadas em uma ética de trabalho "faça você mesmo" e em uma rebeldia compartilhada contra o mainstream. Através do GBC e da Schemaposse, ele ajudou a construir a infraestrutura de uma nova subcultura.'
          },
          children: [
            { id: 'gbc', label: 'GothBoiClique (GBC)', icon: <Ghost size={12} />, content: { title: "GBC", description: "Uniu-se em 2016, mudando o paradigma do rap alternativo.", analysis: 'O coletivo definitivo. Juntamente com Lil Tracy, Wicca Phase Springs Eternal e outros, Peep formou um supergrupo de rap-gótico que ditou a estética e o som do SoundCloud por anos.' } },
            { id: 'schemaposse', label: 'Schemaposse', icon: <Ghost size={12} />, content: { title: "Schemaposse", description: "Seu primeiro coletivo, fundado por JGRXXN.", analysis: 'A base de treinamento de Gus. Foi aqui que ele conheceu colaboradores vitais como Ghostemane e começou a levar sua produção musical a sério, saindo de Nova York para o deserto da Califórnia.' } },
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
        analysis: 'A curadoria de samples em Lil Peep era um ato de reverência histórica. Ele não apenas usava batidas; ele resgatava a melancolia de bandas de post-hardcore, emo e indie rock. Ao samplear grupos como Underoath ou Oasis, ele estava, na verdade, fazendo uma curadoria de sentimentos, validando sua própria angústia através de uma linhagem musical estabelecida e apresentando-a a uma audiência de rap que muitas vezes desconhecia o gênero rock.'
      },
      children: [
        { id: 'deathcab', label: 'Death Cab for Cutie', icon: <Music size={12} />, content: { title: 'Death Cab for Cutie', description: 'Sample de "Brothers on a Hotel Bed" em Skyscrapers.', analysis: 'Um exemplo perfeito de como Peep trazia o som introspectivo do indie rock para o trap, transformando um piano melancólico em um hino de isolamento digital.' } },
        { id: 'oasis', label: 'Oasis', icon: <Music size={12} />, content: { title: 'Oasis', description: 'Incursões no Britpop e melodias melancólicas.', analysis: 'Demonstra a versatilidade de Peep em reinterpretar clássicos do Britpop, injetando uma sensibilidade lo-fi e trap em melodias mundialmente conhecidas.' } },
        { id: 'underoath', label: 'Underoath', icon: <Music size={12} />, content: { title: 'Underoath', description: 'Influências de post-hardcore integradas ao trap.', analysis: 'Utilizou a energia agressiva do post-hardcore para criar canções que ressoavam com os antigos fãs de Warped Tour, provando que o espírito punk estava vivo no SoundCloud.' } },
      ]
    },
    {
      id: 'moda',
      label: 'Moda e Estilo Visual',
      icon: <Star size={16} />,
      content: {
        title: 'Redefinição Estética',
        description: 'Androginia e sensibilidade de gênero fluido desafiando o hip-hop.',
        analysis: 'Lil Peep foi um pioneiro visual. Sua estética de gênero fluido, tatuagens faciais proeminentes e cabelos neon desafiaram a hiper-masculinidade do hip-hop tradicional. Ele era uma colagem viva de referências góticas, punk e skate-wear, tornando-se uma musa para a alta moda global. Seu estilo não era apenas performático; era uma expressão externa de sua vulnerabilidade interna e rebeldia contra as normas sociais.'
      },
      children: [
        { id: 'paris-milan', label: 'Desfiles em Paris e Milão', icon: <ExternalLink size={12} />, content: { title: 'Passarelas', description: 'Desfilou para VLONE e Marcelo Burlon em 2017.', analysis: 'Sua ascensão às passarelas europeias em 2017 marcou o momento em que a cultura do "SoundCloud rap" foi validada pela elite da moda global, reconhecendo-o como o rosto de uma nova rebeldia.' } },
        { id: 'tattoos', label: 'Tatuagens Faciais', icon: <Star size={12} />, content: { title: 'Crybaby', description: 'Símbolos de vulnerabilidade e compromisso com a arte.', analysis: 'Cada tatuagem no rosto de Gus contava uma história. A de "Crybaby" era um lembrete constante de sua sensibilidade, enquanto as outras serviam como um escudo visual contra o mundo convencional.' } },
        { id: 'hair', label: 'Cabelos Coloridos', icon: <Star size={12} />, content: { title: 'Cabelos Neon', description: 'Fusão de estéticas punk, gótica e streetwear.', analysis: 'Do rosa choque ao preto e rosa, seu cabelo era uma extensão de sua mutabilidade artística. Ele mudava de cor conforme mudava de fase criativa, inspirando milhões a abraçarem sua própria individualidade.' } },
      ]
    },
    {
      id: 'vida',
      label: 'Vida Pessoal e Saúde',
      icon: <Heart size={16} />,
      content: {
        title: 'Ethos de Vulnerabilidade',
        description: 'Uso da plataforma para destigmatizar problemas de saúde mental.',
        analysis: 'A vida de Gustav Åhr foi vivida com uma honestidade brutal que muitos achavam desconfortável. Ele utilizou sua plataforma para falar abertamente sobre depressão, ansiedade e bissexualidade em uma época em que esses temas ainda eram tabus no rap. Sua coragem em ser vulnerável em público criou um espaço seguro para seus fãs, permitindo que eles se sentissem vistos e menos sozinhos em suas próprias batalhas internas.'
      },
      children: [
        { id: 'bisexual', label: 'Bissexualidade', icon: <Heart size={12} />, content: { title: 'Bissexualidade', description: 'Assumiu abertamente, quebrando paradigmas na cena rap.', analysis: 'Ao assumir sua bissexualidade no Twitter em 2017, Gus quebrou um dos maiores estigmas do hip-hop, tornando-se um símbolo de aceitação e autenticidade para a comunidade LGBTQ+.' } },
        { id: 'depression', label: 'Depressão e Ansiedade', icon: <Activity size={12} />, content: { title: 'Saúde Mental', description: 'Letras confessionais que serviam como diário aberto.', analysis: 'Sua música era uma forma de automedicação através da arte. Ele falava sobre a escuridão não para celebrá-la, mas para exorcizá-la, oferecendo conforto a todos que compartilhavam o mesmo peso.' } },
        { id: 'substances', label: 'Uso de Substâncias', icon: <Zap size={12} />, content: { title: 'Crise de Opioides', description: 'Automedicação como resposta ao trauma e pressão da fama.', analysis: 'A automedicação foi uma resposta trágica à exaustão e às pressões da fama súbita. Seu uso de substâncias era um pedido de socorro silenciado pelas demandas de uma indústria que muitas vezes prioriza a turnê sobre a saúde.' } },
      ]
    },
    {
      id: 'morte',
      label: 'Morte e Legado',
      icon: <ShieldCheck size={16} />,
      content: {
        title: 'Legado Póstumo',
        description: 'Uma análise das implicações legais e culturais após novembro de 2017.',
        analysis: 'A morte prematura de Peep em 2017 em Tucson, Arizona, enviou ondas de choque através da indústria da música. O que se seguiu foi uma batalha legal e ética sem precedentes liderada por sua mãe, Liza Womack, para recuperar o controle sobre sua arte. Seu legado póstumo transformou-se em uma missão de preservação, garantindo que sua visão original não fosse diluída por interesses corporativos e que a conversa sobre o dever de cuidado da indústria para com os artistas jovens continuasse.'
      },
      children: [
        {
          id: 'incidente', label: 'Incidente em Tucson (2017)', icon: <Skull size={14} />,
          content: { title: '15 de Novembro', description: 'A tragédia que chocou a indústria musical.', analysis: 'O falecimento de Gus no ônibus de turnê foi um momento divisor de águas. Expôs a falta de protocolos de segurança em turnês de jovens artistas e a facilidade com que substâncias adulteradas (contendo fentanil) circulam nos bastidores da indústria.' },
          children: [
            { id: 'overdose', label: 'Overdose Acidental', icon: <Skull size={12} />, content: { title: 'Overdose', description: 'Falecimento no ônibus de turnê durante a rota de Tucson.', analysis: 'Um erro trágico e fatal. Gus foi encontrado sem vida por sua equipe em um ônibus de turnê que estava parado há horas, expondo negligências graves em sua supervisão.' } },
            { id: 'fentanyl', label: 'Fentanil e Xanax', icon: <Skull size={12} />, content: { title: 'Substâncias', description: 'Overdose causada pela combinação letal de fármacos.', analysis: 'A causa oficial foi a combinação de alprazolam e fentanil. O fentanil é um opioide sintético extremamente potente que tem causado uma crise de saúde pública sem precedentes em todo o mundo.' } },
          ]
        },
        {
          id: 'juridico', label: 'Batalha Jurídica', icon: <Scale size={14} />,
          content: { title: 'Dever de Cuidado', description: 'Processo histórico contra a gestão First Access Entertainment.', analysis: 'A mãe de Peep moveu um processo histórico que questionou as obrigações legais das agências de gerenciamento. A alegação era de que a gestão falhou em fornecer um ambiente de trabalho seguro e incentivou o uso de drogas para manter o artista "produtivo" em turnê.' },
          children: [
            { id: 'liza', label: 'Processo de Liza Womack', icon: <Scale size={12} />, content: { title: 'Womack vs FAE', description: 'Processo por negligência e homicídio culposo movido em 2019.', analysis: 'Uma batalha de Davi contra Golias. Liza lutou por anos para limpar o nome de seu filho e expor as práticas abusivas de gestão que contribuíram para sua morte.' } },
            { id: 'acordo', label: 'Acordo em 2023', icon: <ShieldCheck size={12} />, content: { title: 'Resolução', description: 'Catálogo e arquivos devolvidos integralmente à família.', analysis: 'O acordo judicial de 2023 foi uma vitória total para a família. A FAE devolveu todos os direitos das músicas e arquivos originais, permitindo que Liza gerisse o legado de Gus conforme sua visão autêntica.' } },
          ]
        },
        {
          id: 'postumo', label: 'Lançamentos Posthuma', icon: <Archive size={14} />,
          content: { title: 'Estratégia Póstuma', description: 'Migração de obras originais para plataformas de streaming.', analysis: 'Ao contrário de muitos lançamentos póstumos oportunistas, a família de Gus focou em relançar seu material original do SoundCloud. Isso garantiu que as mixtapes fundamentais fossem preservadas em sua forma original, com todos os samples licenciados, honrando a estética lo-fi do Gus.' },
          children: [
            { id: 'cowys2', label: "Come Over When You're Sober, Pt. 2", icon: <Disc size={12} />, content: { title: "COWYS Pt. 2", description: "Primeiro álbum póstumo de estúdio, lançado em 2018.", analysis: 'Finalizado pelo produtor Smokeasac, este álbum estreou no topo das paradas mundiais, contendo hinos como "Life is Beautiful", provando a imortalidade comercial da visão do Gus.' } },
            { id: 'diamonds', label: 'Álbum Diamonds', icon: <Disc size={12} />, content: { title: "Diamonds", description: "Lançamento em 2023 após anos de antecipação pelos fãs.", analysis: 'O lendário álbum colaborativo com iLoveMakonnen. Após anos de disputas legais, finalmente foi lançado em sua forma original, mostrando o Gus explorando sonoridades pop mais brilhantes.' } },
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

  const nodeColors = [
    'border-neutral-700 bg-[#1a1c23]',
    'border-[#7000FF]/30 bg-[#2a2d36]/80',
    'border-[#FF007F]/30 bg-[#1a1c23]/90',
    'border-neutral-800 bg-[#121214]/95',
  ];

  return (
    <div className="flex flex-col relative items-start">
      <div className="flex items-center group relative">
        {depth > 0 && (
          <div className="absolute left-0 -translate-x-full h-px bg-neutral-800 w-4 md:w-8" />
        )}
        
        <MotionDiv
          layout
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (node.children) onToggle(node.id);
            onSelect(node);
          }}
          className={`flex items-center gap-3 md:gap-4 px-4 md:px-6 py-2 md:py-3 rounded-none border backdrop-blur-md cursor-pointer transition-all duration-300 ${
            nodeColors[Math.min(depth, nodeColors.length - 1)]
          } ${isExpanded ? 'border-[#FF007F]/50 ring-1 ring-[#FF007F]/20' : 'hover:border-neutral-500'}`}
        >
          <div className={`${isExpanded ? 'text-[#FF007F]' : 'text-neutral-500'} transition-colors shrink-0`}>
            {React.cloneElement(node.icon as any, { size: 14 })}
          </div>
          <span className="font-mono text-[9px] md:text-[10px] text-neutral-100 tracking-[0.1em] md:tracking-[0.2em] uppercase whitespace-nowrap">
            {node.label}
          </span>
          {node.children && (
            <ChevronRight 
              size={10} 
              className={`text-neutral-600 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-[#FF007F]' : ''}`} 
            />
          )}
        </MotionDiv>
      </div>

      <AnimatePresence>
        {isExpanded && node.children && (
          <MotionDiv
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="ml-8 md:ml-16 mt-2 md:mt-4 space-y-2 md:space-y-4 relative border-l border-neutral-800/50 pl-4 md:pl-8"
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
  const [viewMode, setViewMode] = useState<'mapping' | 'chronology'>('mapping');
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

      <div className="absolute top-1/2 left-1/4 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-[#FF007F]/3 blur-[80px] md:blur-[140px] rounded-full pointer-events-none animate-pulse" />

      <div className="max-w-[1800px] mx-auto px-6 md:px-12 pt-16 md:pt-32 pb-40 md:pb-64">
        <div className="mb-16 md:mb-32 flex flex-col items-start max-w-2xl">
          <MotionDiv initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
             <div className="inline-flex items-center gap-3 px-3 py-1 border border-[#FF007F]/20 bg-[#FF007F]/5 mb-6">
               <Cpu size={12} className="text-[#FF007F]" />
               <span className="font-mono text-[8px] md:text-[9px] text-[#FF007F] tracking-[0.4em] uppercase font-bold">LEGACY_MAPPING_PROTOCOL_V4</span>
             </div>
             <h2 className="font-serif-classic text-4xl md:text-6xl text-white tracking-widest uppercase mb-6 md:mb-8 leading-tight">Mapa do<br/><span className="text-[#FF007F]">Legado</span></h2>
             
             {/* View Mode Selector */}
             <div className="flex gap-4 mt-8 p-1 bg-neutral-900/50 border border-neutral-800 self-start">
                <button 
                  onClick={() => setViewMode('mapping')}
                  className={`flex items-center gap-2 px-4 py-2 font-mono text-[9px] tracking-widest uppercase transition-all ${viewMode === 'mapping' ? 'bg-[#FF007F] text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  <Layers size={14} /> [ MAPPING_MODE ]
                </button>
                <button 
                  onClick={() => setViewMode('chronology')}
                  className={`flex items-center gap-2 px-4 py-2 font-mono text-[9px] tracking-widest uppercase transition-all ${viewMode === 'chronology' ? 'bg-[#FF007F] text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  <BarChart3 size={14} /> [ CHRONOLOGY_MODE ]
                </button>
             </div>
          </MotionDiv>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'mapping' ? (
            <MotionDiv 
              key="mapping"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="flex justify-start min-h-[800px] md:min-h-[1200px] p-4 md:p-8 overflow-x-auto scrollbar-hide"
            >
               <div className="relative flex-grow">
                 <MindMapNode 
                   node={mindMapTree} 
                   depth={0} 
                   onSelect={setSelectedNode} 
                   expandedIds={expandedIds}
                   onToggle={handleToggle}
                 />
               </div>
            </MotionDiv>
          ) : (
            <MotionDiv
              key="chronology"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <TimelineHistory />
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedNode && (
          <MotionDiv
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 35, stiffness: 200 }}
            className="fixed top-0 right-0 w-full md:w-[600px] h-full bg-[#0a0a0b] border-l border-neutral-900 z-[300] shadow-[-40px_0_100px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col"
          >
            <div className="p-6 md:p-10 border-b border-neutral-900 flex justify-between items-center bg-[#0d0d0f]/50 backdrop-blur-xl">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="p-2 md:p-3 bg-[#FF007F]/10 border border-[#FF007F]/20 text-[#FF007F]">
                  {React.cloneElement(selectedNode.icon as any, { size: 18 })}
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[8px] md:text-[9px] text-[#FF007F] tracking-[0.3em] md:tracking-[0.5em] uppercase font-bold">Fragment ID: {selectedNode.id}</span>
                  <span className="font-mono text-[9px] md:text-[11px] text-neutral-400 tracking-[0.2em] uppercase">Status: Decifrado</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="p-3 md:p-4 hover:bg-neutral-900 text-neutral-500 hover:text-white transition-all rounded-full group"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 md:p-12 space-y-12 md:space-y-16 custom-scrollbar">
              <section>
                <h2 className="font-serif-classic text-2xl md:text-4xl text-white mb-6 md:mb-10 tracking-tight leading-tight uppercase border-l-4 border-[#FF007F] pl-6 md:pl-8">
                  {selectedNode.content.title}
                </h2>
                <div className="p-6 md:p-10 bg-neutral-950 border border-neutral-900 font-mono text-xs md:text-sm text-neutral-400 leading-relaxed italic uppercase relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF007F]/20 to-transparent" />
                  <span className="relative z-10">"{selectedNode.content.description}"</span>
                </div>
              </section>

              <div className="space-y-10 md:space-y-12">
                 <div className="flex items-center gap-4 md:gap-6 text-neutral-800">
                    <Activity size={14} className="text-[#7000FF]" />
                    <span className="font-mono text-[8px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.6em] font-bold">Análise de Frequência</span>
                    <div className="h-px flex-grow bg-neutral-900" />
                 </div>

                 <div className="prose prose-invert max-w-none">
                   <p className="text-neutral-400 font-mono text-[10px] md:text-xs leading-loose uppercase tracking-widest text-justify">
                     {selectedNode.content.analysis}
                   </p>
                 </div>

                 {selectedNode.children && (
                   <div className="space-y-6 pt-6 md:pt-10">
                     <span className="font-mono text-[8px] md:text-[9px] text-neutral-600 uppercase tracking-[0.5em] font-bold">Sub-Nódulos em Conexão:</span>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                       {selectedNode.children.map(child => (
                         <button 
                           key={child.id} 
                           onClick={() => {
                             if (!expandedIds.has(selectedNode.id)) handleToggle(selectedNode.id);
                             setSelectedNode(child);
                           }}
                           className="p-3 md:p-4 bg-neutral-900/50 border border-neutral-800 hover:border-[#FF007F]/40 transition-all flex items-center gap-3 text-left group/sub"
                         >
                           <div className="w-1.5 h-1.5 bg-[#FF007F]/40 group-hover/sub:bg-[#FF007F] rounded-full transition-colors" />
                           <span className="font-mono text-[8px] md:text-[9px] text-neutral-400 group-hover/sub:text-white uppercase tracking-widest">
                             {child.label}
                           </span>
                         </button>
                       ))}
                     </div>
                   </div>
                 )}
              </div>
            </div>

            <div className="p-6 md:p-10 bg-[#0d0d0f] border-t border-neutral-900 flex flex-col items-center gap-4">
               <Archive size={40} className="text-neutral-900 mb-2 opacity-30" />
               <p className="font-mono text-[7px] md:text-[8px] text-neutral-700 tracking-[0.3em] md:tracking-[0.5em] uppercase text-center leading-relaxed px-4">
                 Heritage Protected by SandroBreaker Engineering Protocol.<br/>
                 Copyright © 2025 - All Data Streams Preserved.
               </p>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 md:bottom-12 left-6 md:left-12 flex flex-col gap-3 md:gap-4 opacity-40">
         <div className="flex items-center gap-3 md:gap-4">
           <div className="w-3 h-3 md:w-4 md:h-4 bg-[#FF007F] rounded-none border border-white/10" />
           <span className="font-mono text-[8px] md:text-[9px] text-white tracking-[0.3em] uppercase">Eixo Emocional</span>
         </div>
         <div className="flex items-center gap-3 md:gap-4">
           <div className="w-3 h-3 md:w-4 md:h-4 bg-[#7000FF] rounded-none border border-white/10" />
           <span className="font-mono text-[8px] md:text-[9px] text-white tracking-[0.3em] uppercase">Eixo Técnico</span>
         </div>
      </div>
    </div>
  );
};
