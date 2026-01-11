# 🔗 GOTH-ANGEL-SINNER ARCHIVE
### *Digital Sanctuary & Technical Portfolio*

![Status](https://img.shields.io/badge/Status-Operational-FF007F?style=for-the-badge&logo=statuspage)
![Engine](https://img.shields.io/badge/Engine-React_19-black?style=for-the-badge&logo=react)
![Database](https://img.shields.io/badge/Database-Supabase-7000FF?style=for-the-badge&logo=supabase)

---

## 🌹 Visão Geral
O **Goth-Angel-Sinner (G.A.S) Archive** é um memorial digital interativo e de alta performance dedicado à obra de **Lil Peep (Gustav Elijah Åhr)**. Desenvolvido como um showcase técnico por **SandroBreaker**, o projeto funde estética *cyber-goth*, engenharia de som via cloud e inteligência artificial generativa.

> *"Technology serves to immortalize feelings."*

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Propósito |
| :--- | :--- | :--- |
| **Frontend** | React 19 + TypeScript | Core da aplicação e UI reativa. |
| **Styling** | Tailwind CSS | Sistema de design utilitário e responsividade. |
| **Animations** | Framer Motion | Orquestração de micro-interações e transições fluidas. |
| **Database** | Supabase (PostgreSQL) | Indexação de metadados, letras e logs. |
| **Storage** | Supabase Storage | Hospedagem de fragmentos de áudio (MP3). |
| **Intelligence** | Google Gemini API | Assistente "Memory Core" para queries contextuais. |
| **Media** | React Player | Engine global de processamento de áudio/vídeo. |

---

## 🏛️ Estrutura do Santuário

### 1. The Archive (Digital Vault)
Uma interface de streaming de alto desempenho que categoriza a discografia em Eras (Classics, SoundCloud, Rare). Utiliza um sistema de cache estratégico para garantir latência mínima no carregamento de metadados.

### 2. Legacy Mapping (Timeline)
Um mapa mental interativo (Mind Map) que explora a genealogia artística, vida pessoal e batalhas jurídicas de Gustav. Desenvolvido com uma lógica de nós recursivos e animações de layout complexas.

### 3. Memory Core (AI Assistant)
Interface de terminal integrada com o modelo **Gemini 3 Flash**, atuando como o custodiante do arquivo. Processa linguagem natural com uma persona técnica e melancólica.

### 4. The Theater
Feed curado de fragmentos visuais oficiais, conectando a API do YouTube com filtros de estética lo-fi e processamento de imagem via CSS.

### 5. The Vault
Dossiê detalhado baseado em registros legais (Case 19-cv-02456), apresentando fatos brutos sobre a infraestrutura da carreira e legado póstumo do artista.

---

## 🚀 Engenharia de Performance

- **Global Audio Engine:** Implementação de um Singleton de áudio que persiste entre trocas de views sem interrupção do stream.
- **Skeleton Loading:** Sistema de placeholder animado para mitigar a percepção de latência em conexões lentas.
- **GPU Acceleration:** Uso extensivo de `will-change` e transformações 3D para garantir 60fps em animações de grid e desfoque.
- **Atomic Components:** Arquitetura baseada em componentes puros e memoizados para evitar re-renders desnecessários.

---

## 🔧 Configuração e Deploy

1. **Clonagem e Dependências:**
   ```bash
   npm install
   ```

2. **Variáveis de Ambiente:**
   O projeto requer uma chave de API do Google GenAI configurada no ambiente como `process.env.API_KEY` para o funcionamento do **Memory Core**.

3. **Database Schema:**
   A tabela `songs` no Supabase segue a estrutura definida em `types.ts`, com suporte a metadados JSONB para flexibilidade de atributos.

---

## 👤 Autor
**SandroBreaker** - Lead Frontend Engineer & UI/UX Designer.
*Especializado em criar experiências digitais onde a estética gótica encontra a alta performance.*

---

<p align="center">
  <img src="https://phmmvngzhrzyuauiwpzc.supabase.co/storage/v1/object/public/assets/peep-logo-small.png" width="50" alt="G.A.S Logo" /><br/>
  <strong>GOTH-ANGEL-SINNER</strong><br/>
  © 2025 ALL FRAGMENTS PRESERVED
</p>