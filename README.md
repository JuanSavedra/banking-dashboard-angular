# Banking Dashboard

Aplicação front-end bancária construída em **Angular 21 com SSR**, simulando um internet banking
completo: dashboard financeiro, extrato com filtros reativos, transferências Pix, CRUD de
favorecidos e gestão de cartões. O projeto foi desenvolvido como peça de portfólio técnico, com
foco em arquitetura limpa, acessibilidade, performance, testes e CI/CD.

> **Stack principal:** Angular 21 · Standalone Components · SSR (Express) · NgRx · RxJS · Angular
> Material · SCSS (design tokens) · Vitest · ESLint · Prettier · GitHub Actions.

---

## Índice

- [Sobre o projeto](#sobre-o-projeto)
- [Demonstração e credenciais](#demonstração-e-credenciais)
- [Funcionalidades](#funcionalidades)
- [Stack e ferramentas](#stack-e-ferramentas)
- [Arquitetura](#arquitetura)
  - [Visão em camadas](#visão-em-camadas)
  - [Fluxo de dados (NgRx)](#fluxo-de-dados-ngrx)
  - [Estrutura de pastas](#estrutura-de-pastas)
  - [Decisões técnicas](#decisões-técnicas)
- [API REST](#api-rest)
- [Rotas](#rotas)
- [Design system](#design-system)
- [Acessibilidade](#acessibilidade)
- [Performance](#performance)
- [Testes](#testes)
- [Qualidade de código](#qualidade-de-código)
- [CI/CD](#cicd)
- [Como rodar](#como-rodar)
- [Scripts disponíveis](#scripts-disponíveis)
- [Próximos passos](#próximos-passos)
- [Documentação adicional](#documentação-adicional)

---

## Sobre o projeto

O Banking Dashboard reproduz a experiência de um banco digital para demonstrar domínio de Angular
moderno de ponta a ponta: roteamento com rotas públicas/privadas, formulários reativos com
validações customizadas (CPF/CNPJ e chave Pix), consumo de API REST, gerenciamento de estado com
NgRx, programação reativa com RxJS, renderização no servidor (SSR), design system em SCSS,
acessibilidade (WCAG/ARIA), otimizações de performance, testes automatizados e pipeline de CI.

A API é **fake**, servida pelo próprio processo Express do SSR (dados em memória), o que mantém o
projeto autocontido — não há backend externo para configurar.

## Demonstração e credenciais

Após subir a aplicação (`npm start`), acesse `http://localhost:4200/` e entre com:

| Campo             | Valor                                         |
| ----------------- | --------------------------------------------- |
| E-mail **ou** CPF | `ana@banking.dev` &nbsp;·&nbsp; `12345678909` |
| Senha             | `123456`                                      |

> Os dados são reiniciados a cada reinício do servidor (armazenamento em memória).

## Funcionalidades

- **Autenticação** — login por e-mail ou CPF, sessão persistida em `localStorage`, guards de rota
  (`authGuard` / `guestGuard`), interceptor que injeta o token `Bearer` e interceptor de erro
  global (401 encerra a sessão).
- **Dashboard** — saldo, entradas/saídas do mês, gráfico de gastos (SVG) e últimas movimentações,
  com estados de carregamento, vazio e erro. Atualiza após cada transferência.
- **Extrato** — listagem com busca por texto (debounce), filtros por tipo e status, ordenação,
  paginação e contagem de resultados — pipeline 100% RxJS (`combineLatest`, `debounceTime`,
  `distinctUntilChanged`).
- **Transferência Pix** — formulário reativo com validação de valor e de saldo, confirmação em
  diálogo, comprovante e feedback via snackbar. Debita o saldo e gera a transação no extrato.
- **Favorecidos (CRUD)** — listar, criar, editar, detalhar e excluir, com confirmação de exclusão.
  Validação de **CPF/CNPJ** (dígitos verificadores) e de **chave Pix** com seletor de tipo
  (Celular / CPF / CNPJ / E-mail / Aleatória) e máscara automática por tipo.
- **Cartões** — limites, status, compras recentes, ajuste de limite e bloqueio/desbloqueio.
- **Perfil**, **página 404** e estados reutilizáveis de loading/empty/error em toda a aplicação.

## Stack e ferramentas

| Categoria   | Tecnologias                                                                        |
| ----------- | ---------------------------------------------------------------------------------- |
| Framework   | Angular 21 (standalone components, signals, controle de fluxo `@if`/`@for`/`@let`) |
| SSR         | Angular SSR + Express 5                                                            |
| Estado      | NgRx Store, Effects e Entity                                                       |
| Reatividade | RxJS 7                                                                             |
| UI          | Angular Material + SCSS com design tokens                                          |
| Testes      | Vitest (via `@angular/build:unit-test`) + Testing utilities do Angular             |
| Qualidade   | ESLint (+ angular-eslint, regras de a11y de template) e Prettier                   |
| CI          | GitHub Actions (Node 22)                                                           |

## Arquitetura

Aplicação em camadas, com responsabilidades isoladas e estado centralizado em NgRx.

### Visão em camadas

```
┌─────────────────────────────────────────────────────────────┐
│ Componentes (features)  — apresentação, formulários, signals  │
├─────────────────────────────────────────────────────────────┤
│ NgRx (store/effects)    — estado global, side effects,        │
│                           selectors memoizados                │
├─────────────────────────────────────────────────────────────┤
│ Services (HTTP)         — HttpClient + API_BASE_URL +         │
│                           operador unwrapData                 │
├─────────────────────────────────────────────────────────────┤
│ API REST (Express SSR)  — endpoints /api/* (dados em memória) │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de dados (NgRx)

1. O componente faz `dispatch` de uma **action** (ou lê estado via **selector** + `toSignal`).
2. Um **effect** captura a action e chama o **service**.
3. O **service** consome a API e desempacota o envelope `ApiResponse<T>` com o operador
   `unwrapData()`.
4. O effect emite a action de **sucesso/falha**.
5. O **reducer** atualiza o estado; o componente reage automaticamente pelo selector.

Interceptors complementam o fluxo: `authInterceptor` adiciona o token `Bearer`; `errorInterceptor`
encerra a sessão em respostas `401`. Há 6 slices de estado: `auth`, `account`, `transactions`,
`beneficiaries`, `transfers` e `cards` (os de listas usam `@ngrx/entity`).

### Estrutura de pastas

```
src/
├─ environments/            # apiBaseUrl por ambiente (fileReplacements)
├─ server.ts                # Express SSR + API REST /api/*
├─ main.ts / main.server.ts # entradas client / servidor
├─ styles/                  # tokens, mixins, base, utilities (SCSS)
└─ app/
   ├─ core/
   │  ├─ guards/            # authGuard, guestGuard
   │  ├─ http/             # API_BASE_URL (token) + unwrapData (operador)
   │  ├─ interceptors/     # authInterceptor, errorInterceptor
   │  ├─ layout/           # AppShellComponent (sidebar + topbar)
   │  ├─ models/           # interfaces e tipos de domínio (banking.ts)
   │  ├─ services/         # um service por domínio
   │  ├─ store/            # NgRx: actions, reducer, effects, selectors por domínio
   │  ├─ utils/            # máscaras (CPF/CNPJ/celular)
   │  └─ validators/       # validadores de CPF/CNPJ e chave Pix
   ├─ features/            # uma pasta por rota (lazy-loaded)
   │  ├─ auth/  dashboard/  transactions/  transfers/
   │  ├─ beneficiaries/  cards/  profile/  not-found/
   └─ shared/
      ├─ components/       # PageHeader, SummaryCard, StatusBadge, estados, dialog
      ├─ pipes/            # pipes de status + signedCurrency
      └─ status/           # status-presentation (fonte única de rótulos/variantes)
```

### Decisões técnicas

- **Formatação sem duplicação:** moeda e data usam os pipes nativos (`CurrencyPipe`/`DatePipe`) com
  `LOCALE_ID=pt-BR` e `DEFAULT_CURRENCY_CODE=BRL`; rótulos e variantes de status vêm de uma
  configuração única (`shared/status`) exposta por **pipes puros** (memoizados sob `OnPush`).
- **Camada HTTP enxuta:** URL base injetável (`API_BASE_URL`) e operador `unwrapData` eliminam
  strings e `map(r => r.data)` repetidos nos services.
- **Change detection:** todos os componentes usam `ChangeDetectionStrategy.OnPush`; o estado é
  baseado em **signals** (`toSignal`, `computed`) e selectors memoizados.
- **Tipagem estrita:** sem `any`; respostas tipadas com `ApiResponse<T>`.
- **Lazy loading:** todas as features são carregadas sob demanda via `loadComponent`.

## API REST

Servida pelo Express do SSR, com envelope padrão `{ data, message? }` (`ApiResponse<T>`):

| Método | Endpoint                 | Descrição                                           |
| ------ | ------------------------ | --------------------------------------------------- |
| GET    | `/api/account`           | Dados da conta                                      |
| GET    | `/api/transactions`      | Lista de transações                                 |
| GET    | `/api/transactions/:id`  | Detalhe de transação                                |
| GET    | `/api/beneficiaries`     | Lista de favorecidos                                |
| GET    | `/api/beneficiaries/:id` | Detalhe de favorecido                               |
| POST   | `/api/beneficiaries`     | Criar favorecido                                    |
| PUT    | `/api/beneficiaries/:id` | Atualizar favorecido                                |
| DELETE | `/api/beneficiaries/:id` | Remover favorecido                                  |
| POST   | `/api/transfers`         | Criar transferência (debita saldo + gera transação) |
| GET    | `/api/cards`             | Lista de cartões                                    |
| PUT    | `/api/cards/:id`         | Atualizar cartão (limite/status)                    |

## Rotas

| Rota                          | Acesso                 | Componente            |
| ----------------------------- | ---------------------- | --------------------- |
| `/login`                      | público (`guestGuard`) | LoginPage             |
| `/app/dashboard`              | privado (`authGuard`)  | DashboardPage         |
| `/app/transactions`           | privado                | TransactionsPage      |
| `/app/transfers`              | privado                | TransfersPage         |
| `/app/beneficiaries`          | privado                | BeneficiariesPage     |
| `/app/beneficiaries/new`      | privado                | BeneficiaryFormPage   |
| `/app/beneficiaries/:id`      | privado                | BeneficiaryDetailPage |
| `/app/beneficiaries/:id/edit` | privado                | BeneficiaryFormPage   |
| `/app/cards`                  | privado                | CardsPage             |
| `/app/profile`                | privado                | ProfilePage           |
| `/**`                         | —                      | NotFoundPage          |

As rotas privadas são renderizadas dentro do `AppShellComponent` (sidebar + topbar).

## Design system

Tokens CSS (`src/styles/_tokens.scss`) definem cores, tipografia, espaçamentos, raios, sombras,
motion e z-index. Todos os estilos consomem esses tokens (sem valores hardcoded). Mixins de
responsividade (`mobile`, `tablet`) ficam em `_mixins.scss`.

## Acessibilidade

- Link "pular para o conteúdo" e foco visível global.
- Navegação principal com estado ativo anunciado e menu mobile controlado por `aria-expanded`/`inert`.
- Formulários com labels, mensagens de erro com `role="alert"` e feedbacks anunciáveis via
  `aria-live`.
- Filtros, badges e estados usam texto explícito, sem depender apenas de cor.
- Contraste de cores ajustado para atingir **WCAG AA** (≥ 4.5:1 em texto normal).
- Regras de acessibilidade de template habilitadas no ESLint (`angular-eslint`).

## Performance

- Features carregadas sob demanda (`loadComponent`).
- `ChangeDetectionStrategy.OnPush` em todos os componentes.
- Listas com `@for` + `track`.
- Estado reativo com signals, `computed` e selectors memoizados do NgRx; `@ngrx/entity` para listas
  normalizadas.
- Pipes puros no lugar de chamadas de função no template (evitam recálculo a cada ciclo de CD).
- Bundle acompanhado por budgets no `angular.json` (`npm run build`).

## Testes

Testes unitários com **Vitest** cobrindo as camadas críticas: **14 arquivos de spec, 49 testes**.

Cobertura inclui:

- **Services HTTP** — todos os 5 services (`HttpTestingController`).
- **Guards** — `authGuard` e `guestGuard`.
- **Interceptor** — `errorInterceptor` (401 → logout; demais erros repassados).
- **Store** — reducers/selectors de `beneficiaries` e `cards`; effects de `beneficiaries`
  (success/failure); reducer/selectors de `auth`.
- **Validadores** — CPF/CNPJ e chave Pix por tipo, além da inferência de tipo.
- **Pipes** — status (transação/favorecido/cartão/compra) e `signedCurrency`.
- **Componentes** — login, page-header, status-badge, summary-card e root.

Executar:

```bash
npm test
```

## Qualidade de código

- **ESLint** com `typescript-eslint` e `angular-eslint` (regras de template e de acessibilidade).
- **Prettier** (largura 100, aspas simples, parser Angular para HTML).
- Convenção de commits semânticos em pt-BR (`feat:`, `fix:`, `refactor:`, `perf:`, `test:`,
  `docs:`, `ci:`, `style:`).

```bash
npm run lint          # análise estática
npm run format        # formata o projeto
npm run format:check  # valida formatação (usado no CI)
```

## CI/CD

Pipeline em **GitHub Actions** ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)), executado
em `push` e `pull_request` para `main`, com Node 22 e cache de dependências:

1. `npm ci`
2. `npm run lint`
3. `npm run format:check`
4. `npm test`
5. `npm run build`

## Como rodar

### Pré-requisitos

- **Node.js 22+**
- **npm 11+**

### Instalação

```bash
git clone <url-do-repositorio>
cd banking-dashboard
npm install
```

### Desenvolvimento

```bash
npm start
```

Aplicação em `http://localhost:4200/`. Faça login com as
[credenciais de demonstração](#demonstração-e-credenciais).

### Build de produção (SSR) e execução

```bash
npm run build                       # gera dist/ (browser + server)
npm run serve:ssr:banking-dashboard # serve o build SSR
```

## Scripts disponíveis

| Script                                | Descrição                                               |
| ------------------------------------- | ------------------------------------------------------- |
| `npm start`                           | Servidor de desenvolvimento em `http://localhost:4200/` |
| `npm run build`                       | Build de produção com SSR em `dist/`                    |
| `npm run watch`                       | Build de desenvolvimento em modo watch                  |
| `npm test`                            | Testes unitários (Vitest)                               |
| `npm run lint`                        | ESLint                                                  |
| `npm run format`                      | Formata o projeto com Prettier                          |
| `npm run format:check`                | Verifica a formatação                                   |
| `npm run serve:ssr:banking-dashboard` | Serve o build SSR gerado                                |

## Próximos passos

- Testes end-to-end (Playwright) para os fluxos críticos.
- Persistência real (substituir os dados em memória por um backend/DB).
- Publicação de relatório de cobertura e auditoria Lighthouse no CI.

## Documentação adicional

- [`docs/`](docs/) — registro de decisões técnicas por funcionalidade:
  - [Planejamento do projeto](docs/01-planejamento.md)
  - [Setup técnico inicial](docs/02-setup-inicial.md)
  - [Design system e layout base](docs/03-design-system.md)
  - [Rotas, navegação e autenticação](docs/04-autenticacao-e-rotas.md)
  - [API REST e camada de serviços](docs/05-api-rest-e-servicos.md)
  - [CRUD de favorecidos](docs/06-favorecidos-crud.md)
  - [Cartões](docs/07-cartoes.md)
  - [Acessibilidade](docs/08-acessibilidade.md)
  - [Performance](docs/09-performance.md)
