# Fase 4 — API Fake e Camada de Serviços

## Objetivo

Criar uma API REST fake, services Angular tipados e conexão das telas principais aos dados simulados.

## O que foi feito

- API fake implementada no servidor Express SSR em `src/server.ts`.
- Responses padronizadas com `{ data, message? }`.
- Erros padronizados com `{ error: { code, message } }`.
- Models TypeScript criados para conta, transações, favorecidos, transferências e cartões.
- Services Angular criados com `HttpClient`:
  - `AccountService`
  - `TransactionsService`
  - `BeneficiariesService`
  - `TransfersService`
  - `CardsService`
- Dashboard conectado a conta e últimas transações.
- Extrato conectado à listagem de transações.
- Favorecidos conectado à listagem, criação demo e detalhe.
- Transferência conectada a um `POST` demo com comprovante fake.
- Cartões conectado à listagem e atualização simples de status.
- Rotas autenticadas ajustadas para `RenderMode.Server`, evitando prerender de páginas com HTTP runtime.

## Endpoints

```txt
GET    /api/account
GET    /api/transactions
GET    /api/transactions/:id
GET    /api/beneficiaries
GET    /api/beneficiaries/:id
POST   /api/beneficiaries
PUT    /api/beneficiaries/:id
DELETE /api/beneficiaries/:id
POST   /api/transfers
GET    /api/cards
PUT    /api/cards/:id
```

## Decisões Técnicas

- **Express SSR:** aproveita o servidor já existente, sem dependência extra e com endpoints REST reais.
- **Dados em memória:** suficiente para demonstrar GET, POST, PUT e DELETE sem persistência.
- **Services antes de NgRx:** mantém separação de responsabilidades e prepara a Fase 5.
- **UI conectada sem CRUD completo:** demonstra consumo HTTP sem antecipar formulários mais complexos.

## Fora de Escopo

- Persistência em arquivo ou banco.
- NgRx.
- Filtros avançados no extrato.
- Formulários completos de cadastro/edição.
- Validações bancárias profundas.

## Validações da Fase

Executar:

```bash
npm run lint
npm run format:check
npm test -- --watch=false
npm run build
```

Se o build falhar ao baixar fontes do Google, repetir com rede liberada para permitir o inline de fontes.

## Próxima Fase

Avançar para **Fase 5 — NgRx e gerenciamento de estado**, conectando os services atuais a stores, effects e selectors.
