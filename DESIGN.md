<!-- SEED: re-run $impeccable document once there's code to capture the actual tokens and components. -->
---
name: Banking Dashboard
description: Dashboard bancário em Angular para demonstrar uma experiência financeira confiável, clara e precisa.
---

# Design System: Banking Dashboard

## 1. Overview

**Creative North Star: "A Mesa de Controle Financeiro."**

O sistema deve parecer uma superfície de trabalho bancária bem calibrada: limpa, precisa, legível e pronta para decisões rápidas. A estética serve a tarefas concretas, não a marketing. O usuário deve conseguir conferir saldo, transações, cartões e transferências sem decifrar ornamentos visuais.

A direção visual combina a clareza operacional do Stripe Dashboard, a densidade organizada do Linear e a simplicidade financeira do Nubank. O resultado não deve parecer um banco corporativo antigo, nem um template SaaS genérico com gradientes roxo/azul.

**Key Characteristics:**

- Informação financeira com hierarquia forte e ruído baixo.
- Layouts densos, mas escaneáveis em desktop e mobile.
- Estados de ação sempre explícitos: default, hover, focus, active, disabled, loading, success, warning e error.
- Motion curta e funcional, usada para feedback e mudança de estado.

## 2. Colors

A estratégia de cor é **restrained**: neutros dominam a interface e o acento aparece apenas em ações primárias, seleção atual e estados relevantes. O seed de marca aponta para uma família olive/yellow-green, mas os valores finais devem ser resolvidos na Fase 2 em OKLCH e testados por contraste.

### Primary

- **Oliva Operacional** ([to be resolved during implementation]): acento principal para ação primária, item ativo na navegação e elementos que precisam guiar o olhar.

### Secondary

- **Grafite de Confiança** ([to be resolved during implementation]): texto principal, ícones críticos e títulos de seções.

### Tertiary

- **Ameixa Financeira** ([to be resolved during implementation]): acento secundário opcional para gráficos, badges especiais ou comparação visual, nunca para decoração solta.

### Neutral

- **Branco de Trabalho** ([to be resolved during implementation]): fundo principal, preferencialmente puro ou quase puro, sem creme/bege artificial.
- **Superfície Técnica** ([to be resolved during implementation]): painéis, sidebar, tabelas e áreas agrupadas.
- **Linha Discreta** ([to be resolved during implementation]): divisórias, bordas de inputs e separadores de dados.

### Named Rules

**The Restrained Finance Rule.** A cor de marca ocupa pouco espaço; sua raridade dá peso às ações importantes.

**The No Generic Fintech Rule.** Azul-marinho com dourado e gradientes roxo/azul genéricos são proibidos.

## 3. Typography

**Display Font:** [font family to be chosen at implementation]
**Body Font:** [single sans family to be chosen at implementation]
**Label/Mono Font:** [optional mono to be chosen at implementation]

**Character:** Tipografia de produto, não editorial. Uma família sans bem ajustada deve carregar títulos, labels, tabelas, botões e textos longos com consistência.

### Hierarchy

- **Display** ([to be resolved]): usado com parcimônia em login ou páginas vazias importantes.
- **Headline** ([to be resolved]): títulos de páginas como Dashboard, Extrato e Cartões.
- **Title** ([to be resolved]): cabeçalhos de painéis, cards e seções internas.
- **Body** ([to be resolved]): textos de apoio, mensagens e descrições; limitar prose a 65-75ch.
- **Label** ([to be resolved]): botões, filtros, campos, badges e metadados financeiros.

### Named Rules

**The Product Type Rule.** Não use fontes display em labels, botões, tabelas ou dados financeiros.

## 4. Elevation

Elevação deve ser flat by default. Profundidade vem de contraste tonal, bordas discretas, agrupamento e densidade bem controlada. Sombras aparecem apenas em estados interativos ou overlays, nunca como decoração permanente.

### Named Rules

**The Structural Depth Rule.** Se uma sombra não explica foco, hover, overlay ou arraste, ela não entra.

## 5. Components

### Buttons

- **Shape:** cantos discretos, com raio final resolvido na Fase 2.
- **Primary:** reservado para ações financeiras principais, como Entrar, Transferir e Salvar alterações.
- **Hover / Focus:** feedback visível, contraste preservado e foco por teclado evidente.
- **Loading / Disabled:** estado textual e visual explícito; nunca ocultar a ação atrás de um spinner isolado.

### Cards / Containers

- **Corner Style:** moderado e consistente.
- **Background:** superfícies neutras; cards não devem substituir hierarquia de página.
- **Shadow Strategy:** seguir a elevação flat by default.
- **Internal Padding:** denso o suficiente para dashboard, sem apertar dados tabulares.

### Inputs / Fields

- **Style:** campos previsíveis, com label claro, ajuda quando necessário e erro próximo ao campo.
- **Focus:** foco forte e acessível.
- **Error / Disabled:** não depender só de cor; incluir texto e semântica.

### Navigation

- **Style:** shell com sidebar/topbar previsíveis para app bancário.
- **Active State:** o item ativo deve ser óbvio por cor, peso e/ou marcador estrutural.
- **Mobile Treatment:** navegação colapsada sem perder acesso às rotas principais.

## 6. Do's and Don'ts

### Do:

- **Do** priorizar clareza operacional em saldo, transações, cartões e transferências.
- **Do** usar componentes consistentes entre telas, com estados completos.
- **Do** validar contraste WCAG AA antes de fixar tokens.
- **Do** escrever microcopy em pt-BR direta, com verbos de ação claros.
- **Do** usar skeletons e empty states instrutivos para loading e ausência de dados.

### Don't:

- **Don't** criar aparência de banco corporativo antigo.
- **Don't** usar excesso de azul-marinho com dourado.
- **Don't** usar gradientes roxo/azul genéricos.
- **Don't** usar glassmorphism decorativo.
- **Don't** empilhar cards sem hierarquia clara.
- **Don't** comunicar erro, sucesso, alerta ou status financeiro apenas por cor.
