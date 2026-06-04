# Banking Dashboard

Aplicação front-end bancária em Angular para consulta de saldo, extrato, cartões, favorecidos e transferências Pix, com foco em experiência de produto, arquitetura profissional e demonstração técnica para avaliação de vaga.

## Status do Projeto

Fase atual: **Fase 12 — Performance**.

A Fase 12 aplica otimizações conservadoras de performance com lazy loading, `OnPush`, listas rastreadas, análise de bundle e checklist Lighthouse. A documentação detalhada está em [docs/fase-12.md](docs/fase-12.md).

## Objetivo Técnico

Demonstrar domínio de Angular moderno, rotas, formulários, API REST, NgRx, RxJS, responsividade, SCSS, acessibilidade, performance, testes, Git e CI/CD em um produto bancário realista.

## Arquitetura

Aplicação em camadas, com responsabilidades isoladas e estado centralizado em NgRx:

```
Componentes (features)  →  apresentação, formulários reativos, signals
        ↓ dispatch / select
NgRx (store/effects)    →  estado global, side effects, selectors memoizados
        ↓
Services (HTTP)         →  acesso à API via HttpClient + API_BASE_URL + unwrapData
        ↓
API REST (Express SSR)  →  endpoints /api/* com dados em memória
```

Fluxo típico: o componente faz `dispatch` de uma action → o **effect** chama o **service** →
o service consome a API e devolve o `data` (operador `unwrapData`) → o effect emite
`success`/`failure` → o **reducer** atualiza o estado → o componente lê via **selector**
(`toSignal`). Interceptors tratam autenticação (`Bearer`) e erros globais (401 → logout).

### Estrutura de pastas

```
src/
  environments/            # apiBaseUrl por ambiente (fileReplacements)
  server.ts                # Express SSR + API REST /api/*
  styles/                  # tokens, mixins, base, utilities (SCSS)
  app/
    core/
      guards/              # authGuard, guestGuard
      http/                # API_BASE_URL (token) + unwrapData (operador)
      interceptors/        # authInterceptor, errorInterceptor
      layout/              # AppShellComponent
      models/              # interfaces e tipos de domínio
      services/            # um service por domínio
      store/               # NgRx: actions, reducer, effects, selectors por domínio
    features/              # uma pasta por rota (lazy-loaded)
    shared/
      components/          # PageHeader, SummaryCard, StatusBadge, estados, dialog
      pipes/               # pipes de status + signedCurrency
      status/              # status-presentation (fonte única de rótulos/variantes)
```

### Decisões técnicas

- **Sem duplicação de formatação:** moeda e data usam os pipes nativos (`CurrencyPipe`/`DatePipe`)
  com `LOCALE_ID=pt-BR` e `DEFAULT_CURRENCY_CODE=BRL`; rótulos/variantes de status vêm de uma
  configuração única (`shared/status`) exposta por pipes puros (memoizados sob `OnPush`).
- **Camada HTTP enxuta:** URL base injetável (`API_BASE_URL`) e operador `unwrapData` eliminam
  strings e `map` repetidos nos services.
- **Tipagem estrita:** sem `any`; envelopes de resposta tipados (`ApiResponse<T>`).

## Funcionalidades Planejadas

- Login com autenticação.
- Dashboard com saldo, resumo financeiro, últimas transações, atalhos e notificações.
- Extrato com filtros, busca e detalhe de transação.
- Transferência Pix, com validação, confirmação e comprovante.
- Favorecidos com listagem, cadastro, edição, remoção e detalhe.
- Cartões com status, limite, compras recentes e ações de bloqueio.
- Perfil com dados pessoais, preferências e segurança.
- Página 404 e estados de loading, empty, error e success.

## Stack Planejada

- Angular 21 com standalone components e SSR.
- Angular Router para rotas públicas, privadas e fallback 404.
- Angular Material com tema customizado.
- SCSS para tokens, tema, mixins e responsividade.
- RxJS para fluxos assíncronos.
- NgRx para gerenciamento de estado.
- Express SSR para API REST em `/api/*`.
- Vitest via Angular builder para testes unitários.
- Prettier para formatação.

## Comandos

```bash
npm start
```

Inicia o servidor local em `http://localhost:4200/`.

```bash
npm run build
```

Gera o build de produção com SSR em `dist/`.

```bash
npm test
```

Executa os testes unitários com Vitest.

```bash
npm run lint
```

Executa ESLint no projeto.

```bash
npm run format:check
```

Valida a formatação com Prettier sem reescrever arquivos.

```bash
npm run serve:ssr:banking-dashboard
```

Serve o build SSR gerado.

## API REST

A API roda no servidor Express do Angular SSR e expõe endpoints REST em `/api/*`:

- `GET /api/account`
- `GET /api/transactions` e `GET /api/transactions/:id`
- `GET /api/beneficiaries`, `POST /api/beneficiaries`, `PUT /api/beneficiaries/:id`, `DELETE /api/beneficiaries/:id`
- `POST /api/transfers`
- `GET /api/cards` e `PUT /api/cards/:id`

## Acessibilidade

- Foco visível global e link para pular direto ao conteúdo principal.
- Navegação principal com estado ativo anunciado e menu mobile controlado por `aria-expanded`.
- Formulários com labels, mensagens de erro claras e feedbacks de submissão anunciáveis.
- Filtros, badges e estados usam texto explícito, sem depender apenas de cor.
- Validação planejada com ESLint de templates, Lighthouse e axe DevTools.

## Performance

- Features carregadas sob demanda por `loadComponent`.
- Componentes estáveis usam `ChangeDetectionStrategy.OnPush`.
- Listas usam `@for` com `track` para reduzir recriação de DOM.
- Estado reativo baseado em signals, computeds e selectors memoizados do NgRx.
- Bundle acompanhado pelo `npm run build` e Lighthouse documentado para auditoria local.

## CI/CD

Pipeline em GitHub Actions ([.github/workflows/ci.yml](.github/workflows/ci.yml)) executado em
`push` e `pull_request` para `main`, com Node 22 e cache de dependências:

1. `npm ci`
2. `npm run lint`
3. `npm run format:check`
4. `npm test`
5. `npm run build`

## Credenciais de Acesso

Use qualquer uma das opções abaixo para acessar o fluxo autenticado local:

- E-mail: `ana@banking.dev`
- CPF: `12345678909`
- Senha: `123456`

## Diretrizes de Produto e Design

- [PRODUCT.md](PRODUCT.md): estratégia, público, propósito, personalidade e princípios do produto.
- [DESIGN.md](DESIGN.md): sistema visual com tokens e componentes da interface.
- [docs/fase-0.md](docs/fase-0.md): escopo fechado da Fase 0.
- [docs/fase-1.md](docs/fase-1.md): setup técnico inicial e validações.
- [docs/fase-2.md](docs/fase-2.md): design system, shell preview e componentes compartilhados.
- [docs/fase-3.md](docs/fase-3.md): rotas, navegação real e autenticação.
- [docs/fase-4.md](docs/fase-4.md): API REST, services HTTP e telas conectadas.
- [docs/fase-9.md](docs/fase-9.md): CRUD de favorecidos com rotas e formulários.
- [docs/fase-10.md](docs/fase-10.md): gestão de cartões, limites e compras recentes.
- [docs/fase-11.md](docs/fase-11.md): acessibilidade transversal e checklist WCAG.
- [docs/fase-12.md](docs/fase-12.md): performance, bundle e checklist Lighthouse.
