# Banking Dashboard

Aplicação front-end bancária em Angular para consulta de saldo, extrato, cartões, favorecidos e transferências Pix, com foco em experiência de produto, arquitetura profissional e demonstração técnica para avaliação de vaga.

## Status do Projeto

Fase atual: **Fase 11 — Acessibilidade**.

A Fase 11 revisa acessibilidade transversal: navegação por teclado, foco visível, semântica, estados anunciáveis e contraste. A documentação detalhada está em [docs/fase-11.md](docs/fase-11.md).

## Objetivo Técnico

Demonstrar domínio de Angular moderno, rotas, formulários, API REST, NgRx, RxJS, responsividade, SCSS, acessibilidade, performance, testes, Git e CI/CD em um produto bancário realista.

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
