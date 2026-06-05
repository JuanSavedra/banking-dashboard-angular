# Performance

## Objetivo

Otimizar o que já existe sem alterar contratos, fluxos ou regras de negócio. A prioridade foi reduzir trabalho de renderização com mudanças seguras e validar o bundle de produção.

## O que foi feito

- `ChangeDetectionStrategy.OnPush` aplicado em componentes estáveis e páginas baseadas em signals.
- Shell, componentes compartilhados, widgets do dashboard, dashboard, extrato, cartões, perfil e 404 receberam detecção conservadora.
- Lazy loading das features foi revisado e mantido com `loadComponent`.
- Listas foram revisadas para confirmar uso de `@for` com `track`.
- Uso de signals, computeds e selectors memoizados do NgRx foi mantido.
- Assets públicos revisados: não há imagens ou fontes locais pesadas além do favicon.
- README ganhou seção específica de performance.

## Decisões Técnicas

- **Otimização conservadora:** transferência, login e CRUD de favorecidos não receberam `OnPush` nesta etapa por terem formulários, dialogs, snackbars e subscriptions de sucesso.
- **Sem refatoração reativa ampla:** trocar `toSignal` por `async pipe` não traria ganho claro e aumentaria risco.
- **Sem dependência nova:** Lighthouse permanece como checklist manual para execução local.
- **Sem alteração de API:** endpoints, payloads, actions, reducers e selectors públicos foram preservados.

## Bundle e Assets

O bundle deve ser acompanhado por:

```bash
npm run build
```

Usar o resumo do Angular para conferir tamanho inicial, lazy chunks e warnings de budgets. Como não há imagens públicas relevantes, não houve compressão ou troca de formato nesta fase.

## Checklist Lighthouse

Executar localmente com o app servido pelo usuário:

- Performance em login e dashboard.
- Performance em extrato com filtros.
- Performance em transferência, favorecidos e cartões.
- Confirmar ausência de regressões em acessibilidade após as otimizações.
- Registrar resultados principais para documentação final.

## Validações

Executar:

```bash
npm run lint
npm run format:check
npm test -- --watch=false
npm run build
```

Também revisar buscas estáticas por `any`, listas sem `track` e termos proibidos.

## Próximos Passos

Avançar para **testes**, ampliando cobertura para proteger as otimizações e fluxos principais.
