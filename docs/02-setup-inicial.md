# Setup Técnico Inicial

## Objetivo

Preparar a base profissional do projeto sem implementar regras de negócio, rotas privadas ou telas funcionais. Esta fase remove o placeholder do Angular e deixa o repositório pronto para crescer nas próximas fases.

## O que foi feito

- Angular Material configurado manualmente com pacotes compatíveis com Angular 21.
- Provider assíncrono de animações adicionado para suportar componentes Material.
- Tema Material inicial criado em `src/styles.scss`, com tokens globais mínimos para a base visual.
- ESLint configurado com flat config, Angular ESLint e TypeScript ESLint.
- Scripts de lint e Prettier adicionados ao `package.json`.
- Estrutura de pastas criada para `core`, `shared` e `features`.
- Placeholder padrão do Angular removido.
- Componente raiz substituído por um shell placeholder com header, status da fase e `router-outlet`.
- Teste do componente raiz atualizado para o novo conteúdo.

## Decisões Técnicas

- **Material manual:** evita defaults automáticos do `ng add` e mantém controle sobre tema e arquivos alterados.
- **Tema inicial, não definitivo:** a etapa de design system ainda cobrirá sidebar, topbar, componentes compartilhados e o refinamento do `DESIGN.md`.
- **ESLint + Prettier separados:** ESLint valida código e templates; Prettier cuida da formatação.
- **Estrutura com `.gitkeep`:** permite versionar os diretórios planejados sem criar código prematuro.
- **Shell placeholder:** limpa o starter Angular sem antecipar rotas, autenticação ou layout completo.

## Estrutura Criada

```txt
src/app/
  core/
    guards/
    interceptors/
    layout/
    models/
    services/
    store/
  shared/
    components/
    directives/
    pipes/
    utils/
  features/
    auth/
    beneficiaries/
    cards/
    dashboard/
    profile/
    transactions/
    transfers/
```

## Validações

Ao concluir a implementação, executar:

```bash
npm run lint
npm run format:check
npm test
npm run build
```

Também conferir:

```bash
git status --short --ignored
```

`context.md`, `AGENTS.md`, skills locais e `node_modules/` devem permanecer fora do commit.

## Fora de Escopo

- Rotas públicas e privadas.
- Guards e interceptors reais.
- Autenticação.
- NgRx.
- MSW.
- Componentes compartilhados.
- Sidebar e topbar definitivas.
- Design system completo.

Esses itens pertencem às próximas etapas do projeto.
