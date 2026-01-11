# 🏛️ ESPECIFICAÇÕES TÉCNICAS: GOTH-ANGEL-SINNER ARCHIVE
## *Architectural Integrity & Engineering Protocol*

Este documento descreve a infraestrutura técnica do projeto G.A.S, detalhando as escolhas de design de software e integrações de sistemas.

---

## 1. Arquitetura de Software

O sistema utiliza uma arquitetura baseada em **Componentes Atômicos** sob o ecossistema **React 19**, priorizando a imutabilidade de estado e renderização eficiente.

### 1.1. Core Engine (Singleton Pattern)
- **Global Audio Engine:** Implementado em `GlobalAudioEngine.tsx`, o player funciona como um Singleton desacoplado da UI. Ele utiliza o `ReactPlayer` para gerenciar o buffer de áudio globalmente.
- **Context API:** O `PlayerContext.tsx` atua como o *State Bus* central, orquestrando eventos de reprodução, gerenciamento de fila (Queue) e sincronização de metadados entre as views.

### 1.2. Renderização e Performance
- **GPU Acceleration:** Implementação de `will-change: transform` e `translateZ(0)` em cards e transições de tela para delegar o processamento de animações à GPU.
- **Lazy Loading & Suspense:** Módulos pesados como `LyricView` e `AIAssistant` são carregados sob demanda via `React.lazy()`, reduzindo o *First Contentful Paint (FCP)*.
- **Debounced Search:** O hook `useSongs` implementa um atraso de 300ms nas queries do Supabase para evitar *bottlenecks* de rede durante o input do usuário.

---

## 2. Camada de Dados (Backend-as-a-Service)

### 2.1. Supabase (PostgreSQL)
A persistência de dados é feita via Supabase, utilizando filtragem avançada diretamente no lado do servidor.

**Schema da Tabela `songs`:**
| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | UUID | Identificador único. |
| `title` | TEXT | Nome da track (indexado para busca). |
| `image_url` | TEXT | Link CDN para artwork. |
| `storage_url` | TEXT | Link direto do Supabase Storage (MP3). |
| `metadata` | JSONB | Estrutura flexível contendo BPM, Produtor, e Sentiment. |
| `lyrics` | TEXT | Stream de texto bruto para decodificação na view. |

### 2.2. Otimização de Queries
Utilizamos o modificador `.range()` para implementação de **Infinite Scroll**, carregando chunks de 24 itens por página, mitigando o consumo de memória no cliente.

---

## 3. Inteligência Artificial (Memory Core)

O assistente utiliza o modelo **gemini-3-flash-preview** via `@google/genai`.

- **System Instruction:** O modelo é injetado com um protocolo de persona gótico-técnica, garantindo respostas que se alinham à estética do projeto.
- **Context Window:** Mantemos o histórico de mensagens localmente para conversas contextuais sobre a discografia.

---

## 4. Módulos Específicos

### 4.1. Timeline (Recursão de Dados)
O `Timeline.tsx` não utiliza uma timeline linear simples, mas sim um **Gráfico de Nós (Mind Map)**. 
- **Lógica:** Implementado via componentes recursivos que renderizam dinamicamente a `NodeData`.
- **Interação:** Gerenciamento de estado via `Set<string>` para controlar expansão/colapso de múltiplos ramos simultaneamente sem perda de performance.

### 4.2. Theater (Media Integration)
- **IFrame API:** Integração com o YouTube para processamento de vídeo.
- **CSS Post-processing:** Aplicação de filtros `grayscale` e `grain` via overlays para uniformizar a estética lo-fi do conteúdo externo.

### 4.3. The Vault (Legal Dossier)
View estática baseada em objetos literais de alta densidade, focada em acessibilidade (A11y) e leitura clara de documentos históricos e tabelas de litígio.

---

## 5. Protocolos de Estilo e UX

- **Design System:** Baseado em Tailwind CSS com variáveis root CSS para tokens de cor (`--neon-pink`, `--deep-purple`).
- **Typography:** 
    - *UnifrakturMaguntia:* Cabeçalhos e identidade visual.
    - *Cinzel:* Títulos monumentais.
    - *JetBrains Mono:* Metadados e logs técnicos.
- **Motion Design:** Utilização de `framer-motion` para transições de layout compartilhado (`layoutId`) e animações de entrada estagiadas.

---

## 6. Manutenção e Segurança

- **API Security:** A chave do Supabase é exposta como `anon-key` (segura via RLS - Row Level Security). A chave do Gemini é acessada via `process.env.API_KEY`.
- **Browser Compatibility:** Suporte total para browsers baseados em Chromium, Webkit e Firefox, com fallbacks de desfoque (blur) para motores que não suportam `backdrop-filter`.

---
*Documento Gerado pelo Core de Engenharia SandroBreaker.*
*Versão: 2.5.0-STABLE*