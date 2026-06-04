# Banking Dashboard

Aplicação front-end bancária em Angular que simula um dashboard financeiro completo, com foco em experiência de produto, arquitetura profissional e demonstração técnica para avaliação de vaga.

## Status do Projeto

Fase atual: **Fase 0 — Planejamento do projeto**.

A Fase 0 define escopo, stack, entidades, telas e wireframes textuais antes de avançar para setup técnico e implementação de interface. A documentação detalhada está em [docs/fase-0.md](docs/fase-0.md).

## Objetivo Técnico

Demonstrar domínio de Angular moderno, rotas, formulários, API REST simulada, NgRx, RxJS, responsividade, SCSS, acessibilidade, performance, testes, Git e CI/CD em um produto bancário realista.

## Funcionalidades Planejadas

- Login com autenticação fake.
- Dashboard com saldo, resumo financeiro, últimas transações, atalhos e notificações.
- Extrato com filtros, busca e detalhe de transação.
- Transferência Pix simulada, com validação, confirmação e comprovante.
- Favorecidos com listagem, cadastro, edição, remoção e detalhe.
- Cartões com status, limite e ações simuladas.
- Perfil com dados pessoais, preferências e segurança.
- Página 404 e estados de loading, empty, error e success.

## Stack Planejada

- Angular 21 com standalone components e SSR.
- Angular Router para rotas públicas, privadas e fallback 404.
- Angular Material com tema customizado.
- SCSS para tokens, tema, mixins e responsividade.
- RxJS para fluxos assíncronos.
- NgRx para gerenciamento de estado.
- MSW para API fake.
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

## Diretrizes de Produto e Design

- [PRODUCT.md](PRODUCT.md): estratégia, público, propósito, personalidade e princípios do produto.
- [DESIGN.md](DESIGN.md): seed do sistema visual para orientar a criação da interface.
- [docs/fase-0.md](docs/fase-0.md): escopo fechado da Fase 0.
- [docs/fase-1.md](docs/fase-1.md): setup técnico inicial e validações.
