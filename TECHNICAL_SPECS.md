# 🏛️ MANUAL TÉCNICO & FUNCIONAL: G.A.S ARCHIVE
## *Engineering Protocol & Functional Specification*

Este documento fornece um dossiê exaustivo sobre a implementação técnica, arquitetura de software e experiência do usuário (UX) do Goth-Angel-Sinner Archive.

---

## 1. Arquitetura de Estados e Fluxo de Dados

### 1.1. Gerenciamento de Estado Global (Context API)
O sistema utiliza o `PlayerContext.tsx` como o cérebro central da aplicação.
- **Funcionalidade:** Centraliza o estado de reprodução (`isPlaying`), fila (`queue`), índice atual e progresso temporal.
- **Usabilidade:** Permite que o usuário navegue entre diferentes visões (Archive, Timeline, Vault) sem interromper a música. O estado persiste através de toda a aplicação (SPA).

### 1.2. Integração com Backend (Supabase)
O hook customizado `useSongs.ts` gerencia a comunicação com a API do Supabase.
- **Funcionalidade:** Implementa busca semântica via `ilike`, filtros de sentimento por metadados JSONB e paginação infinita (`range`).
- **Lógica de Performance:** Utiliza um *debounce* de 300ms no input de busca para evitar chamadas excessivas à API, economizando banda e processamento.

---

## 2. Detalhamento dos Componentes e Visões

### 2.1. The Archive (ArchiveView.tsx)
O portal de entrada do santuário, desenhado para exploração fluida.
- **Funcionalidade:** Renderiza categorias dinâmicas baseadas nos metadados do álbum ("The Classics", "SoundCloud Era", "Rare").
- **Destaque de UX (Spotlight):** Um algoritmo escolhe aleatoriamente uma "Featured Song" no topo, criando um ponto focal imediato para o usuário.
- **Usabilidade:** Utiliza `AnimatePresence` do Framer Motion para transições de entrada suaves. Cards que não possuem `storage_url` são renderizados em escala de cinza e com estado de `Lock`, indicando visualmente que o arquivo de áudio não foi localizado no servidor.

### 2.2. Memory Core (AIAssistant.tsx)
Interface de conversação integrada com o modelo **Gemini 3 Flash**.
- **Funcionalidade:** Processa queries sobre a vida e obra de Gustav Åhr.
- **Engine Técnica:** Utiliza o SDK `@google/genai`. O prompt do sistema injeta uma persona "Custodiante do Arquivo", garantindo respostas melancólicas e precisas.
- **Usabilidade:** Interface baseada em terminal retro-futurista com auto-scroll e indicadores de carregamento pulsantes.

### 2.3. Legacy Mapping (Timeline.tsx)
Um mapa mental recursivo que desafia a linearidade tradicional.
- **Funcionalidade:** Renderização de nós dinâmicos. Ao clicar em um nó, o sistema expande os sub-nós e abre um painel lateral de "Deep Dive".
- **Lógica de Dados:** Estrutura em árvore (`NodeData`) que permite expansão infinita sem perda de performance através de componentes recursivos e `layoutId` do Framer Motion.
- **Usabilidade:** Painel lateral com scroll customizado e análise técnica detalhada para usuários que buscam profundidade documental.

### 2.4. Lyric View (LyricView.tsx)
A experiência de imersão total na track selecionada.
- **Funcionalidade:** Decodifica a string de `lyrics` do banco de dados em um layout vertical legível.
- **Efeito Visual:** Background dinâmico que utiliza a imagem do álbum com desfoque de 40px e opacidade reduzida, criando uma atmosfera que se adapta às cores de cada track.
- **Sincronização:** Barra de progresso interativa que permite ao usuário "saltar" para qualquer ponto da música (`seek`).

---

## 3. Engine de Áudio (GlobalAudioEngine.tsx)

O motor de som é desacoplado da interface para garantir estabilidade.
- **Segurança:** Bloqueia links externos não seguros, priorizando exclusivamente o Supabase Storage.
- **Tratamento de Erros:** Se uma track falha ao carregar, o sistema automaticamente tenta disparar a próxima track da fila após 1 segundo, garantindo que o "silêncio" seja minimizado.

---

## 4. Design System & Identidade Visual

### 4.1. Tokens de Estilo
- **Cores:** `--neon-pink` (#FF007F) para ações primárias e vida; `--deep-purple` (#7000FF) para metadados técnicos; `--pure-black` (#050505) como base de santuário.
- **Tipografia:** Uso estratégico de *UnifrakturMaguntia* para reforçar a estética gótica e *JetBrains Mono* para dados brutos, criando um contraste entre o antigo e o técnico.

### 4.2. Efeitos Atmosféricos
- **Grain & Scanlines:** Camadas fixas de CSS Overlay que simulam uma tela CRT antiga, dando uma textura "analógica" à interface digital.
- **GPU Acceleration:** Todas as animações utilizam `transform: translateZ(0)` para garantir 60 FPS estáveis mesmo em dispositivos com hardware limitado.

---

## 5. Acessibilidade e Compatibilidade

- **A11y:** Uso de ARIA labels em botões de controle de áudio e tags semânticas HTML5.
- **Responsividade:** Layout adaptável que transiciona de grids de 6 colunas (Desktop) para 2 colunas (Mobile), mantendo a legibilidade dos metadados.

---
*Documentação Gerada por SandroBreaker - Protocolo de Preservação Digital.*
*Atualizada em: 2025*