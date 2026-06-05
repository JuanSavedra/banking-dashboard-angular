# Acessibilidade

## Objetivo

Revisar a aplicação inteira para fortalecer acessibilidade real, com foco em WCAG AA, navegação por teclado, semântica, contraste e feedbacks compreensíveis.

## O que foi feito

- Link “pular para conteúdo principal” adicionado ao shell autenticado.
- Conteúdo principal identificado com `id` e foco programável.
- Sidebar mobile ajustada para não receber foco quando estiver fechada.
- Navegação principal passou a anunciar a rota ativa com `aria-current="page"`.
- Botão de menu mobile conectado à sidebar com `aria-controls` e `aria-expanded`.
- Filtros do extrato passaram a expor seleção com `aria-pressed`.
- Ícones decorativos foram ocultados de tecnologias assistivas.
- Ações repetidas de favorecidos e cartões receberam labels com contexto.
- Formulários de transferência, favorecidos e cartões passaram a anunciar submissão.
- Contraste do token informativo foi reforçado para atingir WCAG AA.
- README ganhou seção específica sobre acessibilidade.

## Decisões Técnicas

- **Sem redesign:** a fase preserva a identidade visual e corrige acessibilidade dentro do sistema atual.
- **Sem dependência nova:** Lighthouse e axe ficam como checklist manual, evitando aumentar escopo.
- **ARIA com propósito:** atributos foram adicionados apenas onde complementam semântica nativa ou estado dinâmico.
- **Teclado como critério:** sidebar, filtros, formulários e ações sensíveis foram priorizados.

## Checklist Manual

Executar com o app local:

- Navegar por teclado em login, dashboard, extrato, transferência, favorecidos, cartões e perfil.
- Confirmar foco visível em links, botões, inputs, chips, sidebar e ações de página.
- Validar se o link “pular para conteúdo principal” aparece ao receber foco.
- Rodar Lighthouse na categoria Accessibility.
- Rodar axe DevTools nas rotas principais.
- Conferir se status, erros e submissões são compreensíveis sem depender apenas de cor.

## Validações

Executar:

```bash
npm run lint
npm run format:check
npm test -- --watch=false
npm run build
```

Também revisar buscas estáticas por `any`, termos proibidos e botões de ícone sem nome acessível.

## Próximos Passos

Avançar para **performance**, mantendo as regras de acessibilidade como requisito de regressão.
