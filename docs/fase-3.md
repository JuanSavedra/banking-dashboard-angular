# Fase 3 — Rotas, Navegação e Autenticação

## Objetivo

Conectar a base visual da Fase 2 ao Angular Router, criando navegação real, login, guards, interceptor de autenticação e página 404.

## O que foi feito

- `App` simplificado para atuar como raiz com `router-outlet`.
- Shell visual movido para `core/layout/app-shell`.
- Sidebar convertida para navegação real com `routerLink` e `routerLinkActive`.
- Fluxo de logout adicionado ao shell.
- Login criado com Reactive Forms, Angular Material e validações básicas.
- Autenticação persistida em `localStorage`.
- Guards criados:
  - `authGuard` para proteger `/app/*`.
  - `guestGuard` para bloquear `/login` quando já autenticado.
- Interceptor criado para adicionar `Authorization: Bearer <token>` em chamadas futuras.
- Rotas criadas para:
  - `/login`
  - `/app/dashboard`
  - `/app/transactions`
  - `/app/transfers`
  - `/app/beneficiaries`
  - `/app/beneficiaries/:id`
  - `/app/cards`
  - `/app/profile`
  - `/**`
- Páginas privadas criadas como placeholders úteis, sem API ou regra de negócio real.
- Página 404 contextual criada com destino para Dashboard ou Login conforme sessão.

## Credenciais de Acesso

- E-mail: `ana@banking.dev`
- CPF: `12345678909`
- Senha: `123456`

## Decisões Técnicas

- **Service + localStorage:** permite testar sessão após reload sem antecipar NgRx.
- **ReturnUrl preservado:** usuário que tenta acessar rota privada volta para a rota original após login.
- **Interceptor preparado:** já adiciona token em chamadas futuras, mas sem depender de API nesta fase.
- **Placeholders úteis:** cada rota valida navegação e layout sem invadir Fase 4.

## Fora de Escopo

- API REST com endpoints de apoio.
- Services HTTP reais.
- NgRx.
- CRUD de favorecidos.
- Transferência funcional.
- Dados dinâmicos de extrato, cartões ou perfil.

## Validações da Fase

Executar:

```bash
npm run lint
npm run format:check
npm test -- --watch=false
npm run build
```

Também conferir:

```bash
git status --short --ignored
```

`context.md`, `AGENTS.md`, skills locais, `.angular/`, `dist/` e `node_modules/` devem permanecer fora do commit.

## Próxima Fase

Avançar para **Fase 4 — API REST e camada de serviços**, conectando os placeholders atuais a endpoints REST e services Angular tipados.
