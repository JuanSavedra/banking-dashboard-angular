# Fase 2 — Design System e Layout Base

## Objetivo

Construir a primeira base visual real do projeto antes das regras de negócio. Esta fase entrega tokens, tema Material refinado, shell preview responsivo e componentes compartilhados reutilizáveis.

## O que foi feito

- Tokens SCSS modulares criados em `src/styles/`.
- Tema global do Angular Material mantido e alinhado à paleta do produto.
- Base global de CSS, utilitários e mixins de responsividade criada.
- Shell preview implementado com sidebar fixa no desktop e menu na topbar mobile.
- Dashboard visual estático criado para validar hierarquia, estados e componentes.
- Material Icons configurado no documento HTML.
- Componentes compartilhados criados:
  - `PageHeaderComponent`
  - `SummaryCardComponent`
  - `LoadingStateComponent`
  - `EmptyStateComponent`
  - `ErrorStateComponent`
  - `ConfirmDialogComponent`
  - `StatusBadgeComponent`
- Testes básicos adicionados para componentes críticos.
- `DESIGN.md` atualizado de seed para documento real da base visual implementada.

## Decisões Técnicas

- **Shell preview estático:** valida layout e responsividade sem antecipar autenticação ou rotas privadas.
- **Material como base:** Angular Material fornece acessibilidade e interações, enquanto tokens próprios controlam a identidade visual.
- **SCSS modular:** tokens, base e utilitários ficam separados para facilitar evolução na Fase 3 e além.
- **Flat by default:** profundidade vem de borda, superfície e contraste tonal; sombras não são decoração.
- **Componentes standalone:** cada componente compartilhado pode ser importado diretamente por futuras features.

## Fora de Escopo

- Autenticação.
- Guards, interceptors e rotas privadas.
- MSW e services.
- NgRx.
- Formulários reais.
- Integração com dados dinâmicos.

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

Arquivos locais como `context.md`, `AGENTS.md`, skills, `.angular/`, `dist/` e `node_modules/` devem permanecer fora do commit.

## Próxima Fase

Avançar para **Fase 3 — Rotas, navegação e autenticação**, conectando o shell visual a rotas públicas/privadas, login, auth guard e página 404.
