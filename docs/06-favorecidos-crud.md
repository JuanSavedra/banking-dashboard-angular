# CRUD de Favorecidos

## Objetivo

Implementar o CRUD completo de favorecidos com rotas dedicadas, formulário reativo, NgRx, API REST e confirmação de exclusão.

## O que foi feito

- Rotas adicionadas:
  - `/app/beneficiaries/new`
  - `/app/beneficiaries/:id/edit`
- Formulário reativo criado para cadastro e edição.
- Validações adicionadas para nome, banco, documento e chave Pix.
- Listagem atualizada com ações de detalhe, edição e exclusão.
- Detalhe atualizado com dados cadastrais, edição e exclusão.
- Exclusão protegida por diálogo de confirmação.
- Store de favorecidos expandida com actions, effects e reducer para `PUT` e `DELETE`.
- Selectors e entity state mantidos como fonte de leitura das telas.
- Textos da feature revisados para linguagem bancária direta.

## Decisões Técnicas

- **Rotas dedicadas:** cadastro e edição têm URLs próprias, facilitando navegação e leitura do fluxo.
- **Formulário único:** a mesma página atende criação e edição, reduzindo duplicação.
- **NgRx como orquestrador:** componentes disparam actions e leem selectors; services permanecem responsáveis por HTTP.
- **Confirmação antes de excluir:** ação destrutiva exige decisão explícita do usuário.

## Fora de Escopo

- Máscaras avançadas de CPF/CNPJ.
- Validação bancária profunda de chave Pix.
- Busca e paginação na listagem de favorecidos.
- Atalho direto de transferência dentro do detalhe.

## Validações

Executar:

```bash
npm run lint
npm run format:check
npm test -- --watch=false
npm run build
```

Se o build precisar baixar fontes externas, repetir com rede liberada.

## Próximos Passos

Avançar para **cartões**, aprofundando status, limite, bloqueio, desbloqueio e compras recentes.
