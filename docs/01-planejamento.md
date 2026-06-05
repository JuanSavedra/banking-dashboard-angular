# Planejamento do Projeto

## Nome do Projeto

**Banking Dashboard**

## Descrição Curta

Dashboard bancário brasileiro em Angular para consulta de saldo, extrato, cartões, favorecidos e transferências Pix, com foco em uma experiência confiável, clara e precisa.

## Objetivo

Criar uma aplicação front-end bancária completa o suficiente para demonstrar domínio técnico em Angular moderno, arquitetura de features, rotas, formulários, API REST, NgRx, RxJS, SCSS, acessibilidade, responsividade, testes, Git e CI/CD.

O produto atende dois públicos: o usuário funcional, que precisa operar tarefas bancárias com clareza, e o avaliador técnico, que precisa enxergar maturidade de implementação e organização.

## Escopo Funcional

- Login com autenticação e validação de formulário.
- Dashboard com saldo, conta, cartões de resumo, últimas transações, atalhos e notificações.
- Extrato com busca, filtros por período/tipo/status e detalhe de transação.
- Transferência Pix com seleção de favorecido, valor, confirmação e comprovante.
- Favorecidos com listagem, cadastro, edição, remoção e tela de detalhe.
- Cartões com limite, status, vencimento, bloqueio/desbloqueio e visualização de dados básicos.
- Perfil com dados pessoais, preferências básicas, segurança e notificações.
- Página 404 para rotas inválidas.
- Estados planejados para loading, empty, error, success, disabled e skeleton.

## Stack Definida

- **Framework:** Angular 21 com standalone components e SSR.
- **UI:** Angular Material com tema customizado pelo `DESIGN.md`.
- **Estilos:** SCSS com tokens, mixins responsivos e organização por feature.
- **Rotas:** Angular Router com áreas pública e privada.
- **Formulários:** Reactive Forms.
- **Estado:** NgRx para domínios principais a partir da fase dedicada.
- **Assíncrono:** RxJS.
- **API REST:** endpoints de apoio para consumo HTTP no browser.
- **Testes:** Vitest via Angular builder.
- **Formatação:** Prettier.
- **Idioma e domínio:** pt-BR, BRL, Pix, CPF/CNPJ e contexto bancário brasileiro.

## Entidades Principais

- `User`: dados pessoais, e-mail, CPF e preferências.
- `Account`: saldo, agência, conta, tipo e limites.
- `Transaction`: valor, data, tipo, categoria, status e contraparte.
- `Beneficiary`: nome, CPF/CNPJ, chave Pix, banco e conta.
- `Transfer`: origem, destino, valor, data, status e comprovante.
- `Card`: bandeira, final, limite, status e vencimento.
- `Notification`: tipo, mensagem, data, leitura e severidade.

## Telas Principais

- **Login:** entrada pública com formulário, validação e feedback de erro.
- **Dashboard:** visão inicial privada com resumo financeiro e atalhos.
- **Extrato:** lista de transações com filtros e busca.
- **Transferência:** fluxo Pix com revisão antes de confirmar.
- **Favorecidos:** listagem e manutenção de contatos bancários.
- **Detalhes do favorecido:** dados, histórico relacionado e ações.
- **Cartões:** visualização de cartões, limite e ações de controle.
- **Perfil:** dados do usuário, preferências e segurança.
- **Página 404:** fallback simples para rotas inexistentes.

## Wireframes Textuais

### Login

- Cabeçalho simples com nome do produto.
- Painel central com e-mail/CPF, senha, erro de autenticação e botão `Entrar`.
- Área de apoio com avisos operacionais.

### Shell Privado

- Sidebar com Dashboard, Extrato, Transferência, Favorecidos, Cartões e Perfil.
- Topbar com nome da tela, busca opcional, notificações e usuário atual.
- Conteúdo principal com largura responsiva e estados visuais consistentes.

### Dashboard

- Linha superior com saldo disponível, conta e ações rápidas.
- Resumos financeiros de entradas, saídas e limite.
- Lista curta de últimas transações.
- Painel de notificações e alertas importantes.

### Extrato

- Título e filtros por período, tipo, status e busca textual.
- Lista/tabela de transações com valor, data, descrição e status.
- Detalhe lateral ou seção expandida para a transação selecionada.

### Transferência

- Etapa 1: selecionar favorecido ou informar chave Pix.
- Etapa 2: informar valor e descrição.
- Etapa 3: revisar dados antes de confirmar.
- Etapa 4: exibir sucesso e comprovante.

### Favorecidos

- Lista com busca e ação `Adicionar favorecido`.
- Formulário com nome, CPF/CNPJ, chave Pix, banco e conta.
- Detalhe com dados principais, ações de editar/remover e histórico relacionado.

### Cartões

- Lista de cartões com final, bandeira, status e limite.
- Detalhe com vencimento, limite utilizado e ações de controle.
- Estados para cartão bloqueado, ativo e vencido.

### Perfil

- Dados pessoais e contato.
- Preferências de notificações.
- Seção de segurança com informações de acesso.

### Página 404

- Mensagem direta de rota não encontrada.
- Botão para voltar ao Dashboard.

## Critérios de Conclusão

- Escopo completo documentado.
- Stack definida sem dependências instaladas nesta fase.
- Entidades principais listadas.
- Telas principais descritas.
- Wireframes textuais criados.
- README inicial atualizado.
- Nenhuma implementação de UI, rota, serviço ou dependência nova iniciada.

## Próximos Passos

Avançar para o **setup técnico inicial** somente após este planejamento estar revisado e commitado.
