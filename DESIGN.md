---
name: Banking Dashboard
description: Dashboard bancário em Angular para demonstrar uma experiência financeira confiável, clara e precisa.
colors:
  background: '#ffffff'
  surface: '#f7f8f5'
  surface-strong: '#eef1e9'
  surface-selected: '#edf4dc'
  text: '#1f241d'
  muted: '#5b6357'
  border: '#dfe5d8'
  primary: '#5f7f20'
  primary-strong: '#45630f'
  tertiary: '#6d5278'
  success: '#1f7a4d'
  warning: '#9a6200'
  error: '#b42318'
  info: '#2563eb'
typography:
  display:
    fontFamily: "Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: '2.5rem'
    fontWeight: 700
    lineHeight: 1.05
  body:
    fontFamily: "Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: '0.8125rem'
    fontWeight: 700
    lineHeight: 1
rounded:
  sm: '0.375rem'
  md: '0.5rem'
  lg: '0.75rem'
spacing:
  xs: '0.25rem'
  sm: '0.5rem'
  md: '1rem'
  lg: '1.5rem'
  xl: '2rem'
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.background}'
    rounded: '{rounded.md}'
    padding: '0 1rem'
  card:
    backgroundColor: '{colors.background}'
    textColor: '{colors.text}'
    rounded: '{rounded.lg}'
    padding: '1.25rem'
  badge-neutral:
    backgroundColor: '{colors.surface-strong}'
    textColor: '{colors.muted}'
    rounded: '{rounded.lg}'
    padding: '0 0.75rem'
---

# Design System: Banking Dashboard

## 1. Overview

**Creative North Star: "A Mesa de Controle Financeiro."**

O sistema visual é uma superfície bancária de trabalho: contida, objetiva e preparada para leitura rápida. A interface privilegia densidade organizada, hierarquia forte e estados explícitos. O visual serve à tomada de decisão financeira, não a impacto decorativo.

A base implementada usa Angular Material como fundação acessível, com tokens próprios para cor, espaçamento, radius e motion. O shell preview estabelece sidebar fixa no desktop, topbar de operação e uma composição responsiva que valida o dashboard antes das rotas reais.

**Key Characteristics:**

- Superfícies neutras e acento oliva usado com moderação.
- Cards e painéis flat by default, separados por borda e contraste tonal.
- Tipografia sans única para títulos, labels, dados financeiros e microcopy.
- Estados compartilhados para loading, empty, error, badges e confirmação.

## 2. Colors

A paleta é restrained: branco e superfícies neutras sustentam a experiência; oliva direciona ação e seleção; ameixa fica reservado para apoio visual pontual.

### Primary

- **Oliva Operacional** (`#5f7f20`): ações primárias, item ativo na navegação, ícones de destaque e foco visual.
- **Oliva Forte** (`#45630f`): hover, texto ativo e estados de seleção com maior contraste.

### Secondary

- **Grafite de Confiança** (`#1f241d`): texto principal, títulos, valores financeiros e ícones críticos.
- **Cinza Operacional** (`#5b6357`): descrições, metadados e textos secundários.

### Tertiary

- **Ameixa Financeira** (`#6d5278`): acento secundário para gráficos ou agrupamentos especiais; não é decoração padrão.

### Neutral

- **Branco de Trabalho** (`#ffffff`): fundo de cards, painéis e áreas de leitura.
- **Superfície Técnica** (`#f7f8f5`): fundo geral do aplicativo.
- **Linha Discreta** (`#dfe5d8`): bordas, divisórias e separação de painéis.

### Named Rules

**The Restrained Finance Rule.** O acento oliva aparece em ações, seleção e foco; se ele começa a decorar a tela inteira, está errado.

**The No Generic Fintech Rule.** Azul-marinho com dourado, gradientes roxo/azul e glassmorphism decorativo são proibidos.

## 3. Typography

**Display Font:** Roboto com fallback `'Helvetica Neue', Arial, sans-serif`
**Body Font:** Roboto com fallback `'Helvetica Neue', Arial, sans-serif`
**Label/Mono Font:** Não há fonte mono definida nesta fase.

**Character:** Tipografia de produto: familiar, densa e legível. Uma família única reduz ruído e mantém consistência entre navegação, cards, badges, estados e dados financeiros.

### Hierarchy

- **Display** (700, `2.5rem`, 1.05): títulos principais de página.
- **Headline** (700, `1.75rem`, 1.15): títulos de seções importantes.
- **Title** (700, `1.125rem`, 1.25): cabeçalhos de cards e painéis.
- **Body** (400, `1rem`, 1.6): descrições e textos de apoio.
- **Label** (700, `0.8125rem`, 1): badges, navegação, metadados e rótulos compactos.

### Named Rules

**The Product Type Rule.** Não use fontes display em labels, botões, tabelas ou valores financeiros.

## 4. Elevation

O sistema é flat by default. Profundidade é criada por bordas, superfícies tonais e agrupamento. Sombras só aparecem como resposta de foco ou overlay, não como decoração permanente.

### Shadow Vocabulary

- **Focus Ring** (`0 0 0 3px rgba(95, 127, 32, 0.24)`): feedback de foco em elementos interativos.

### Named Rules

**The Structural Depth Rule.** Se uma sombra não explica foco, hover, overlay ou arraste, ela não entra.

## 5. Components

### Buttons

- **Shape:** cantos discretos (`0.5rem`).
- **Primary:** Material flat button com oliva operacional e texto branco.
- **Hover / Focus:** foco visível com ring oliva; hover não muda a estrutura do layout.
- **Secondary / Ghost:** Material button textual para ações secundárias.

### Chips

- **Style:** badges arredondados com fundo tonal e texto forte.
- **State:** variantes `success`, `warning`, `error`, `info` e `neutral`.

### Cards / Containers

- **Corner Style:** radius moderado (`0.75rem`).
- **Background:** branco de trabalho sobre superfície técnica.
- **Shadow Strategy:** sem sombra em repouso.
- **Border:** linha discreta (`#dfe5d8`) para separar conteúdo.
- **Internal Padding:** `1.25rem` para cards, `1.5rem` para estados.

### Inputs / Fields

- **Style:** seguem Angular Material quando implementados em fases futuras.
- **Focus:** foco forte e acessível.
- **Error / Disabled:** estado textual e visual, nunca apenas cor.

### Navigation

- **Style:** sidebar fixa no desktop, topbar operacional no conteúdo.
- **Active State:** fundo oliva suave e texto oliva forte.
- **Mobile Treatment:** sidebar vira menu acionável pela topbar.

## 6. Do's and Don'ts

### Do:

- **Do** usar os tokens em `src/styles/_tokens.scss` antes de criar valores novos.
- **Do** manter o acento oliva reservado para ação, seleção e foco.
- **Do** validar contraste WCAG AA em textos, badges e botões.
- **Do** usar componentes compartilhados para estados recorrentes.
- **Do** manter o shell denso, escaneável e responsivo.

### Don't:

- **Don't** criar aparência de banco corporativo antigo.
- **Don't** usar excesso de azul-marinho com dourado.
- **Don't** usar gradientes roxo/azul genéricos.
- **Don't** usar glassmorphism decorativo.
- **Don't** empilhar cards sem hierarquia clara.
- **Don't** comunicar erro, sucesso, alerta ou status financeiro apenas por cor.
