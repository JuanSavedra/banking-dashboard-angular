# Banking Dashboard

Aplicação front-end bancária em Angular que simula um dashboard financeiro completo, com foco em experiência de produto, arquitetura profissional e demonstração técnica para avaliação de vaga.

## Status do Projeto

Fase atual: **Fase 4 — API REST e camada de serviços**.

A Fase 4 conecta as telas principais a endpoints REST no servidor SSR Express. A documentação detalhada está em [docs/fase-4.md](docs/fase-4.md).

## Objetivo Técnico

Demonstrar domínio de Angular moderno, rotas, formulários, API REST, NgRx, RxJS, responsividade, SCSS, acessibilidade, performance, testes, Git e CI/CD em um produto bancário realista.

## Funcionalidades Planejadas

- Login com autenticação.
- Dashboard com saldo, resumo financeiro, últimas transações, atalhos e notificações.
- Extrato com filtros, busca e detalhe de transação.
- Transferência Pix, com validação, confirmação e comprovante.
- Favorecidos com listagem, cadastro, edição, remoção e detalhe.
- Cartões com status, limite e ações de bloqueio.
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
- [docs/fase-3.md](docs/fase-3.md): rotas, navegação real e autenticação fake.
- [docs/fase-4.md](docs/fase-4.md): API fake, services HTTP e telas conectadas.
