# 💯 100 Days Challenge: O Caminho para a Full Stack Excellence

Este repositório documenta minha jornada no **Desafio de 100 Dias de Código**, um compromisso intenso e prático para dominar diversas tecnologias e construir uma base sólida em Engenharia de Software Front-end e Full Stack.

-----

## 🇧🇷 Descrição do Desafio

Este é o meu diário de código de 100 dias, focado em transformar conceitos teóricos em projetos funcionais e de alta qualidade. Cada dia representa um novo passo no aprendizado, seja através de testes específicos, refatorações complexas ou a criação de novas aplicações do zero.

**Compromisso Principal:** Garanto um *commit* diário para manter o ritmo e a disciplina, demonstrando consistência e progresso contínuo.

O objetivo é diversificar ao máximo o portfólio, garantindo a aplicação dos princípios de **Código Limpo**, **SOLID**, e **melhores práticas** de performance e manutenibilidade.

## 🇺🇸 Challenge Description

This repository documents my journey through the **100 Days of Code Challenge**, an intense and practical commitment to mastering diverse technologies and building a solid foundation in Front-end and Full Stack Software Engineering.

**Core Commitment:** I ensure a daily commit to maintain pace and discipline, demonstrating consistency and continuous progress.

The goal is to diversify the portfolio as much as possible, ensuring the application of **Clean Code**, **SOLID principles**, and **best practices** in performance and maintainability.

-----

## 🛠️ Stack Tecnológico

Este desafio explora um leque abrangente de tecnologias modernas para garantir o desenvolvimento Full Stack completo, desde aplicações simples em Vanilla JS até projetos escaláveis com frameworks:

| Categoria | Tecnologias |
| :--- | :--- |
| **Básico (Vanilla)** | **HTML**, **CSS** e **JavaScript (ES6+)**. |
| **Frameworks de UI** | **React** (utilizado no projeto Jokenpo). |
| **Backend/Full Stack** | **Next.js** (planejado para projetos futuros e escaláveis). |
| **Tipagem** | **TypeScript** (fundamental para projetos de alta qualidade e manutenibilidade). |
| **Estilização/Ferramentas**| **Tailwind CSS**, **Vassouras CSS** (para projetos com React/Next.js) e **CSS Puro** (para projetos básicos). |
| **Build Tools/Linting** | **Vite**, **ESLint** (para garantir padrões de código de excelência). |

-----

## 💻 Progresso e Projetos Atuais

Abaixo estão os principais projetos e testes desenvolvidos como parte deste desafio.

### Day X: Quicklist - Lista de Compras (HTML, CSS Puro, JS Otimizado)

**Foco:** Refatoração e Arquitetura em Vanilla JS. O desafio foi reescrever a lógica de uma lista de afazeres, aplicando princípios de **SOLID** (com classes separadas para Estado/Modelo, UI e Serviço de Alerta) e otimizando o desempenho com **Delegação de Eventos** e **persitência local (localStorage)**.

  * **Tecnologias:** HTML, CSS, JavaScript (Classes).
  * **Melhorias:** Delegação de Eventos, Estrutura modular (SOLID), Design fiel ao mockup Quicklist.
  * **Status:** Concluído.

### Day Y: Jokenpo Game (React, Vite, Tailwind CSS)

**Foco:** Gerenciamento de Estado em React (Hooks), Funções Puras e Separação de Lógica. O desafio foi criar o clássico "Pedra, Papel e Tesoura", isolando a lógica de decisão do jogo em um módulo de controle separado.

  * **Tecnologias:** React, JavaScript (Hooks), Tailwind CSS.
  * **Arquivos Relevantes:**
      * `src/components/gameControlOptions/index.jsx`: Contém as funções puras `getMachineChoice` e `determineGameResult` (SRP e Testabilidade).
      * `src/App.jsx`: Controla a navegação de `view` (`'play'` para `'game'`) e o estado global (`score`).
      * `src/components/game/index.jsx`: Utiliza `useEffect` e `useCallback` para processar o resultado da rodada de forma assíncrona.
  * **Status:** Concluído.

-----

## ⚙️ Como Rodar os Projetos

Para rodar qualquer projeto baseado em React/Vite (como o Jokenpo Game):

1.  **Clone o repositório:**
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO]
    cd jokenpo-challenge # Ou a pasta do projeto
    ```
2.  **Instale as dependências:**
    ```bash
    pnpm install # ou npm install / yarn install
    ```
3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    pnpm run dev
    ```

Para projetos em Vanilla JS (como o Quicklist), basta abrir o arquivo `index.html` no seu navegador.

-----

\<p align="center"\>Siga o progresso e contribua com ideias\! Todo dia é dia de código\! 🚀\</p\>
\<p align="center"\>Feito com 💜 por Juan Evangelista\</p\>
