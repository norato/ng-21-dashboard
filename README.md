# Dashboard de Usuários

Aplicação de dashboard em Angular 20 com ferramentas modernas e biblioteca de componentes.

## Stack

- **Angular 20** - Framework
- **PrimeNG 20** - Biblioteca de componentes UI
- **@ngrx/signals** - Gerenciamento de estado baseado em Signals
- **@ngrx/store + @ngrx/effects** - Gerenciamento de estado Redux clássico
- **@angular-architects/ngrx-toolkit** - Debug do NgRx DevTools com ações nomeadas
- **Tailwind CSS v4** - Estilização
- **Vitest** - Testes unitários
- **Playwright** - Testes E2E
- **ng-mocks** - Utilitários de teste
- **Storybook** - Documentação de componentes

## Configuração do Projeto

### Variáveis de Ambiente
A aplicação utiliza o padrão de configuração de ambiente do Angular para gerenciar configurações específicas de ambiente:
- **environment.ts** - Configuração base (desenvolvimento)
- **environment.development.ts** - Configurações específicas de desenvolvimento
- **environment.production.ts** - Configurações específicas de produção

A configuração inclui `apiUrl` e outros valores específicos do ambiente. O processo de build utiliza `fileReplacements` no `angular.json` para trocar os ambientes com base na configuração de build.

### Path Resolution
Importações limpas usando aliases de caminho personalizados definidos em `tsconfig.json`:
- **`$env`** - Acesso direto à configuração do ambiente
- **`$core`** - Funcionalidades centrais (serviços, interceptors, constantes)
- **`$core/*`** - Acesso granular a módulos centrais
- **`$shared`** - Componentes compartilhados via barrel exports
- **`$shared/*`** - Acesso granular a módulos compartilhados

Isso elimina importações relativas profundas como `../../../../` e melhora a manutenibilidade do código.

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (http://localhost:4200)
npm run dev

# Executar testes unitários
npm test

# Executar testes E2E
npm run test:e2e
npm run test:e2e:ui  # com UI

# Storybook (http://localhost:6006)
npm run storybook
```

## Build

```bash
npm run build
```

## Funcionalidades

- Alternância de tema Dark/Light com persistência
- Listagem de usuários da API JSONPlaceholder
- Busca de usuários com debounce e cancelamento de requisição
- Listagem de posts com NgRx classic store
- Componentes standalone
- Gerenciamento de estado baseado em Signals com ações nomeadas para melhor debug
- Arquitetura DDD (Domain-Driven Design)
- Componente de skeleton para estados de carregamento (melhor UX que spinners)
- Notificações Toast para mensagens de erro amigáveis ao usuário
- Cobertura abrangente de testes

## Arquitetura de Gerenciamento de Estado

Este projeto demonstra proficiência com abordagens NgRx modernas e tradicionais:

### Feature de Usuários - Signal Store (`@ngrx/signals`)
A feature de Usuários implementa a abordagem moderna baseada em signals usando `@ngrx/signals`. Esta é a abordagem preferida para novas aplicações devido a:
- API simplificada com menos boilerplate
- Melhor inferência de TypeScript
- Composição reativa com `rxMethod`
- Integração perfeita com Angular signals
- Ações nomeadas via `@angular-architects/ngrx-toolkit` para depuração aprimorada

### Feature de Posts - Classic Store (`@ngrx/store` + `@ngrx/effects`)
Para demonstrar conhecimento abrangente do NgRx, a feature de Posts implementa o padrão Redux tradicional com:
- Actions criadas com `createAction`
- Reducers usando `createReducer`
- Effects com `createEffect` para efeitos colaterais
- Selectors usando `createSelector`

Ambas as implementações seguem os mesmos princípios arquiteturais (separação de preocupações, testabilidade e manutenibilidade), enquanto exibem diferentes paradigmas de gerenciamento de estado dentro do ecossistema NgRx.

## Sistema de Cache

A aplicação implementa um mecanismo de cache no lado do cliente para reduzir chamadas redundantes à API e fornecer acesso imediato aos dados, utilizando persistência no `localStorage` com validação de TTL e um padrão Message Bus para comunicação eficiente entre componentes.

### Princípios da Arquitetura

- **Padrão Message Bus**: O serviço `CacheMessageBus` atua como um hub de comunicação central para eventos relacionados ao cache
- **Persistência no localStorage**: Dados armazenados no lado do cliente com validação de TTL para garantir a atualização
- **Responsabilidade em Nível de Página**: As páginas de feature registram sua store ativa e lidam com solicitações de recarregamento
- **Acoplamento Zero**: Os componentes do cabeçalho interagem apenas com o `CacheMessageBus`, não com stores específicas

### Lógica de Cache em Nível de Store (Fluxo Interno)

Cada store de feature gerencia seu próprio cache de dados dentro de seu estado, garantindo a atualização dos dados e o desempenho ideal:

1. **Carregamento Inicial e Verificação de Cache**: Ao carregar dados, a store primeiro verifica se os dados existem em seu estado e valida o timestamp `cachedAt` contra um TTL de 30 minutos. Se dados válidos forem encontrados, eles são usados imediatamente sem fazer uma chamada à API.

2. **Busca de Dados em Caso de Cache Miss**: Se o cache estiver vazio ou expirado, a store inicia uma solicitação à API para buscar dados atualizados do backend.

3. **Atualização da Store e Timestamp**: Em resposta bem-sucedida da API, a store atualiza seu estado com os novos dados e registra o timestamp atual, marcando os dados como atualizados.

4. **Persistência no LocalStorage**: O estado completo da store, incluindo dados e timestamp `cachedAt`, é automaticamente persistido no `localStorage`, garantindo disponibilidade entre sessões do navegador.

5. **Invalidação de Cache ao Resetar**: Quando uma ação de "limpar cache" é acionada, a store reseta seu estado, limpando dados e anulando o timestamp `cachedAt`, forçando a próxima requisição a buscar dados atualizados.

### Componentes Chave

- **`CacheMessageBus`** (`src/app/core/services/cache-message-bus.service.ts`): Barramento de eventos central que rastreia a store atualmente ativa via `BehaviorSubject`
- **`CacheStatusComponent`** (`src/app/shared/components/cache-status/`): Componente de UI unificado que exibe a idade dos dados e um botão de recarregar. Utiliza `interval()` do RxJS com `takeUntilDestroyed()` para atualizações periódicas (a cada 60s), fornecendo limpeza automática sem gerenciamento manual do ciclo de vida
- **Páginas de Feature**: `UserListComponent` e `PostListComponent` registram qual store estão utilizando
- **Stores/Effects**: `UserStore` e `PostEffects` notificam quando os dados são salvos

### Fluxo de Cache (Comunicação Externa)

Esta seção descreve como componentes interagem com o sistema de cache:

1. **Ativação da Página**: Quando uma página de feature é inicializada, ela registra sua store de dados no `CacheMessageBus`, informando ao sistema qual conjunto de dados está atualmente ativo para monitoramento de cache.

2. **Listener de Recarregamento**: As páginas de feature se inscrevem para solicitações de recarregamento de sua store registrada. Quando acionado, os dados são limpos do `localStorage` e o mecanismo de carregamento da store é ativado, seguindo a lógica interna de cache para buscar dados atualizados.

3. **Notificação de Dados Salvos**: Após carregamento de dados bem-sucedido e atualização da store, a store notifica o `CacheMessageBus` que dados atualizados foram salvos.

4. **Atualizações Automáticas da UI**: O `CacheStatusComponent` escuta o `CacheMessageBus` para mudanças na store ativa e notificações de dados salvos, atualizando dinamicamente para mostrar a idade dos dados.

5. **Recarregamento Manual**: O botão de recarregar limpa dados relevantes do `localStorage` e despacha uma solicitação de recarregamento via `CacheMessageBus`, acionando uma busca de dados atualizados.

### Integração com Gerenciamento de Estado

**NgRx baseado em Signals (UserStore)**:
- Chama `cacheBus.notifyDataSaved()` no handler de sucesso `tapResponse`
- Usa `rxMethod` para carregamento reativo de dados
- A persistência é tratada por um `effect` do Angular que salva o estado completo no `localStorage`

**NgRx Clássico (PostEffects)**:
- Chama `cacheBus.notifyDataSaved()` em um effect dedicado `notifyOnSuccess$`
- Usa `createEffect` com o operador `tap`
- A persistência é tratada pelo reducer que inicializa a partir do `localStorage` e atualiza `postsCachedAt` em `loadPostsSuccess`

## Tratamento de Erros

A aplicação implementa uma estratégia de tratamento de erros em duas camadas usando PrimeNG Toast:

### Interceptor de Erros Global
Erros HTTP com códigos de status 404 e 500 são tratados globalmente pelo `errorInterceptor`:
- Exibe mensagens toast genéricas e amigáveis ao usuário
- Centralizado em `src/app/core/constants/global-errors.ts` para fácil manutenção
- Adicionar novos códigos de erro globais requer apenas a atualização do array `GLOBAL_ERROR_CODES`

### Tratamento de Erros Local
Todos os outros erros HTTP são tratados localmente em suas respectivas stores:
- **UserStore** (@ngrx/signals): Lida com erros específicos do usuário com mensagens contextuais
- **PostEffects** (@ngrx/effects): Lida com erros específicos de posts com mensagens contextuais
- As stores verificam em relação a `GLOBAL_ERROR_CODES` para evitar notificações toast duplicadas

### Benefícios
- **Mensagens amigáveis ao usuário**: Mensagens de erro genéricas e não técnicas que não expõem detalhes de implementação
- **UX Consistente**: Todos os erros da API são exibidos via notificações toast no canto superior direito da tela
- **Segurança**: Detalhes técnicos do erro (error.message) são mantidos no estado da aplicação para depuração, mas não são mostrados aos usuários finais
- **Manutenibilidade**: Códigos de erro globais centralizados em uma única constante para fácil atualização
