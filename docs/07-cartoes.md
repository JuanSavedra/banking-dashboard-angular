# Cartões

## Objetivo

Aprofundar o domínio de cartões com limites, status, bloqueio, desbloqueio e compras recentes.

## O que foi feito

- Model de cartões expandido com compras recentes.
- API REST de cartões atualizada para retornar lançamentos por cartão.
- Store de cartões ajustada com estado de submissão para atualizações.
- Tela de cartões reestruturada em página única.
- Ajuste de limite disponível adicionado com formulário reativo.
- Bloqueio e desbloqueio protegidos por diálogo de confirmação.
- Compras recentes exibidas dentro de cada cartão.
- Estados de loading, erro e vazio preservados com componentes compartilhados.

## Decisões Técnicas

- **Página única:** mantém a área de cartões objetiva e evita rotas extras.
- **Compras no payload do cartão:** a tela recebe todas as informações necessárias em `GET /api/cards`.
- **PUT centralizado:** limite disponível e status usam o mesmo endpoint `PUT /api/cards/:id`.
- **NgRx como fonte de estado:** componentes leem selectors e disparam actions para atualização.

## Fora de Escopo

- Rota de detalhe por cartão.
- Parcelamento, fatura fechada e contestação de compra.
- Persistência permanente das alterações.
- Validação financeira profunda de limite.

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

Com as funcionalidades planejadas concluídas, avançar para revisão final, polimento visual, acessibilidade, performance e CI/CD.
