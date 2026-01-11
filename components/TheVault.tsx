
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, CloudOff, FileWarning, ShieldAlert, Package, Briefcase, 
  Calendar, Activity, ChevronRight, Fingerprint, Info, 
  BookOpen, Scale, Archive, ClipboardList, Zap 
} from 'lucide-react';

const dossierData = {
  subject: {
    realName: "Gustav Elijah Åhr",
    alias: "Lil Peep",
    otherNames: ["Trap Goose", "Gus"],
    birth: "1 de novembro de 1996, Allentown, PA",
    death: "15 de novembro de 2017, Tucson, AZ",
    cause: "Overdose acidental (fentanil/alprazolam)",
    nationality: ["Estados Unidos", "Suécia"],
  },
  sections: [
    {
      id: "chronology",
      title: "CRONOLOGIA VITAL",
      icon: <Calendar size={18} />,
      items: [
        { label: "Pedigree", content: "Pais Liza Womack e Johan Åhr, ambos graduados em Harvard. Linhagem acadêmica de excelência." },
        { label: "Raízes", content: "Cresceu em Allentown antes de se mudar para Long Beach, NY. Apelido 'Peep' dado pela mãe." },
        { label: "Talento", content: "Identificado como 'superdotado' na 3ª série. Tocou trombone e tuba na infância." },
        { label: "Compromisso", content: "Aos 18, tatuou o rosto para inviabilizar empregos convencionais e forçar o sucesso artístico." }
      ]
    },
    {
      id: "career",
      title: "PIPELINE MUSICAL",
      icon: <Activity size={18} />,
      items: [
        { label: "Trap Goose", content: "Início no SoundCloud em 2013. Mudança para LA em 2016, vivendo inicialmente em Skid Row." },
        { label: "Coletivos", content: "Membro da Schemaposse e posteriormente GothBoiClique (GBC). Lançou 'Crybaby' e 'Hellboy'." },
        { label: "Londres", content: "Mudança em 2017 para gravar com iLoveMakonnen, buscando novos horizontes sônicos." },
        { label: "Impacto", content: "Consolidado como o 'futuro do emo', fundindo cadências de trap com angústia rock." }
      ]
    }
  ],
  analysis: {
    intro: "Lil Peep emergiu como um fenômeno cultural definidor do final da década de 2010. Seu surgimento no SoundCloud contornou guardiões tradicionais, cultivando uma conexão direta com um público que se via refletido em letras cruas sobre saúde mental e alienação.",
    architecture: {
      title: "ARQUITETURA SÔNICA",
      content: "Fusão radical de elementos díspares: cadência trap com angústia melódica do punk e rock alternativo. O uso de samples (Mineral, Death Cab for Cutie, The Cure) serviu como ponte cultural entre gêneros.",
    },
    legal: {
      title: "WOMACK VS FAE: POSIÇÕES LEGAIS",
      table: [
        { topic: "Causa da Morte", estate: "Negligência e incentivo ao uso de drogas.", fae: "Escolha pessoal de um adulto responsável." },
        { topic: "Dever de Cuidado", estate: "FAE assumiu gestão da vida pessoal e segurança.", fae: "Acordo comercial 'arm's length'; não são babás." },
        { topic: "Condições da Turnê", estate: "Pressionado a atuar doente e exausto.", fae: "Encorajaram a sobriedade e distanciamento de influências." }
      ]
    },
    releases: {
      title: "LOG DE LANÇAMENTOS PÓSTUMOS",
      table: [
        { type: "Álbum", project: "Come Over When You're Sober, Pt. 2", date: "2018" },
        { type: "Compilação", project: "Everybody's Everything", date: "2019" },
        { type: "Colaborativo", project: "Diamonds (w/ iLoveMakonnen)", date: "2023" },
        { type: "Mixtape", project: "Crybaby (Relançamento)", date: "2020" },
        { type: "Mixtape", project: "Lil Peep; Part One (Relançamento)", date: "2024" }
      ]
    }
  }
};

const DataGrid: React.FC<{ title: string; columns: string[]; rows: any[] }> = ({ title, columns, rows }) => (
  <div className="mb-12 border border-neutral-900 bg-black/40 overflow-hidden">
    <div className="bg-neutral-900/50 p-4 border-b border-neutral-800 flex items-center gap-3">
      <ClipboardList size={14} className="text-[#FF007F]" />
      <h4 className="font-mono text-[10px] text-white tracking-[0.2em] uppercase font-bold">{title}</h4>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left font-mono text-[9px] tracking-wider uppercase">
        <thead className="bg-neutral-950/50 text-neutral-500 border-b border-neutral-900">
          <tr>
            {columns.map(col => <th key={col} className="p-4 font-bold border-r border-neutral-900 last:border-0">{col}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-900">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-[#FF007F]/5 transition-colors">
              {Object.values(row).map((val: any, j) => (
                <td key={j} className="p-4 text-neutral-300 border-r border-neutral-900 last:border-0 leading-relaxed max-w-xs">{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AnalysisBlock: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
  <div className="mb-16">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-2 bg-neutral-900 text-[#FF007F] border border-neutral-800">{icon}</div>
      <h3 className="font-serif-classic text-lg text-white tracking-[0.2em] uppercase">{title}</h3>
      <div className="h-px flex-grow bg-neutral-900" />
    </div>
    <div className="font-mono text-[11px] text-neutral-400 leading-relaxed uppercase space-y-4 max-w-4xl italic border-l border-[#FF007F]/20 pl-6">
      {children}
    </div>
  </div>
);

export const TheVault: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dossier' | 'analysis'>('dossier');
  const MotionDiv = motion.div as any;

  return (
    <div className="max-w-6xl mx-auto py-24 px-6 pb-48">
      {/* Header Dossier */}
      <section className="mb-16 grid grid-cols-1 lg:grid-cols-3 gap-12 items-end border-b border-neutral-900 pb-16">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <Fingerprint size={24} className="text-[#FF007F] opacity-50" />
            <span className="font-mono text-[10px] text-neutral-600 tracking-[0.5em] uppercase">Archive Subject #110196</span>
          </div>
          <h2 className="font-serif-classic text-5xl md:text-7xl text-white tracking-tighter mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            {dossierData.subject.realName.toUpperCase()}
          </h2>
          <div className="flex flex-wrap gap-4 font-mono text-[9px] tracking-[0.3em] uppercase">
            <span className="text-[#FF007F] border border-[#FF007F]/20 px-3 py-1 bg-[#FF007F]/5">{dossierData.subject.alias}</span>
            {dossierData.subject.otherNames.map(n => (
              <span key={n} className="text-neutral-500 border border-neutral-900 px-3 py-1">{n}</span>
            ))}
          </div>
        </div>

        <div className="space-y-3 bg-neutral-950 p-6 border border-neutral-900">
          <div className="flex justify-between items-center text-[10px] font-mono tracking-widest uppercase">
            <span className="text-neutral-600">Origin</span>
            <span className="text-neutral-200">{dossierData.subject.birth}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono tracking-widest uppercase">
            <span className="text-neutral-600">Terminal</span>
            <span className="text-neutral-200">{dossierData.subject.death}</span>
          </div>
          <div className="h-px bg-neutral-900 my-2" />
          <p className="text-[8px] font-mono text-[#FF007F] tracking-[0.2em] leading-relaxed uppercase opacity-80">
            CAUSE: {dossierData.subject.cause}
          </p>
        </div>
      </section>

      {/* Mode Selector */}
      <div className="flex gap-4 mb-16 border-b border-neutral-900">
        <button 
          onClick={() => setActiveTab('dossier')}
          className={`pb-4 px-6 font-mono text-[10px] tracking-[0.3em] uppercase transition-all relative ${activeTab === 'dossier' ? 'text-[#FF007F]' : 'text-neutral-600 hover:text-neutral-400'}`}
        >
          {activeTab === 'dossier' && <MotionDiv layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF007F]" />}
          01 // Core Dossier
        </button>
        <button 
          onClick={() => setActiveTab('analysis')}
          className={`pb-4 px-6 font-mono text-[10px] tracking-[0.3em] uppercase transition-all relative ${activeTab === 'analysis' ? 'text-[#7000FF]' : 'text-neutral-600 hover:text-neutral-400'}`}
        >
          {activeTab === 'analysis' && <MotionDiv layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7000FF]" />}
          02 // Archival Analysis
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'dossier' ? (
          <MotionDiv 
            key="dossier" 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {dossierData.sections.map((section) => (
              <div key={section.id} className="border border-neutral-900 bg-[#080808]/40 p-8 group">
                <div className="flex items-center gap-4 mb-8">
                  <div className="text-[#7000FF]">{section.icon}</div>
                  <h3 className="font-serif-classic text-sm tracking-[0.2em] text-white uppercase">{section.title}</h3>
                </div>
                <div className="space-y-6">
                  {section.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-1 h-1 bg-[#FF007F]/40 rounded-full mt-2" />
                      <div>
                        <span className="font-mono text-[8px] text-[#7000FF] uppercase tracking-widest block mb-1">{item.label}</span>
                        <p className="font-mono text-[10px] text-neutral-400 leading-relaxed uppercase">{item.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </MotionDiv>
        ) : (
          <MotionDiv 
            key="analysis" 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
          >
            <AnalysisBlock title="A VOZ DE UMA GERAÇÃO" icon={<BookOpen size={18} />}>
              <p>{dossierData.analysis.intro}</p>
              <p>Peep não foi apenas um músico, mas um fenômeno cultural. Ele se tornou o 'Kurt Cobain desta geração', canalizando angústia niilista para a era digital.</p>
            </AnalysisBlock>

            <AnalysisBlock title={dossierData.analysis.architecture.title} icon={<Zap size={18} />}>
              <p>{dossierData.analysis.architecture.content}</p>
              <p>O sampling estratégico de Mineral, Death Cab for Cutie e The Cure educou uma nova geração sobre a linhagem do rock alternativo.</p>
            </AnalysisBlock>

            <DataGrid 
              title={dossierData.analysis.legal.title} 
              columns={['Tópico de Litígio', 'Posição do Espólio (Liza)', 'Defesa da FAE']} 
              rows={dossierData.analysis.legal.table} 
            />

            <DataGrid 
              title={dossierData.analysis.releases.title} 
              columns={['Tipo', 'Projeto', 'Ano de Lançamento']} 
              rows={dossierData.analysis.releases.table} 
            />

            <AnalysisBlock title="CONCLUSÃO DO ARQUIVO" icon={<Archive size={18} />}>
              <p>Lil Peep transcendeu o rótulo de 'SoundCloud Rapper'. Sua influência permanece indelével através da normalização da vulnerabilidade masculina e da redefinição estética do Hip-Hop.</p>
              <p>All fragments preserved. Connection terminal closed.</p>
            </AnalysisBlock>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Security Disclaimer */}
      <div className="mt-24 p-12 border border-dashed border-neutral-900 text-center relative group">
        <div className="absolute inset-0 bg-neutral-900/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <FileWarning className="mx-auto mb-6 text-neutral-800 group-hover:text-[#FF007F] transition-colors" size={40} />
        <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-[0.5em] mb-2">
          Heritage Protected. Integridade de catálogo restaurada.
        </p>
        <p className="text-[8px] font-mono text-neutral-800 uppercase tracking-[0.3em]">
          Todos os metadados verificados via registros familiares e documentação legal (Case 19-cv-02456).
        </p>
      </div>
    </div>
  );
};
