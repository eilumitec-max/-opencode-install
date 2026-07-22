# GO AÇAÍ — Documentação Completa do Sistema

## Visão Geral

GO AÇAÍ é um SaaS multi-tenant de delivery para açaí, sorveterias e gelaterias. O sistema possui duas faces:

- **Admin Dashboard** (`/admin`): Painel administrativo com abas de Dashboard, Produtos, Categorias, Pedidos, Analytics e Configurações. Tema escuro.
- **Customer App** (`/app/[slug]`): Aplicativo de pedidos para o cliente final com fluxo de montagem de açaí (tipo → tamanho → coberturas → frutas → complementos → carrinho → checkout → tracking). Tema claro com cor dinâmica do tenant.

Cada loja (tenant) tem seu próprio slug, nome, logo (emoji), cor primária, endereço, taxa de entrega, pedido mínimo, produtos, categorias e pedidos.

---

## Tech Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| **Next.js** | 14.2.0 (App Router) | Framework principal — SSR, API Routes, Páginas |
| **React** | ^18.2.0 | UI |
| **TypeScript** | ^5.0 | Tipagem |
| **TailwindCSS** | ^3.4 | Estilização |
| **Framer Motion** | ^11.0 | Animações |
| **Lucide React** | ^0.344 | Ícones |
| **Supabase** | @supabase/supabase-js ^2.110 / @supabase/ssr ^0.12 | Banco de dados, auth, storage, realtime |
| **web-push** | ^3.6.7 | Notificações Push (server-side) |
| **Vercel** | — | Hospedagem e deploy |

---

## Estrutura do Projeto

```
go-acai/
├── .env.local                    # Variáveis de ambiente locais
├── .gitignore
├── .opencode/
│   └── skills/
│       └── go-acai.md            # Skill do opencode
├── CHANGELOG.md                  # Histórico de mudanças
├── next.config.js                # Config Next.js (remotePatterns imagens)
├── package.json                  # Dependências e scripts
├── postcss.config.js             # PostCSS config
├── run-dev.bat                   # Script para rodar dev no Windows
├── tailwind.config.js            # Tema Tailwind (cores, animações, fonts)
├── tsconfig.json                 # TypeScript config
├── vercel.json                   # Config de deploy Vercel
│
├── public/
│   ├── sw.js                     # Service Worker (cache, push, notificações)
│   ├── manifest.json             # PWA manifest
│   └── icons/
│       ├── icon-192.svg
│       ├── icon-512.svg
│       ├── icon-maskable.svg
│       └── apple-icon.svg
│
├── scripts/
│   ├── setup.sql                 # Script completo para criar tudo no Supabase
│   ├── enable_realtime.sql       # Habilita Realtime na tabela orders
│   ├── fix_missing_columns.sql   # Adiciona colunas faltantes
│   └── push_notifications.sql    # Tabela push_subscriptions (alternativa ao Storage)
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_schema.sql        # Schema: tenants, categories, products, orders
│   │   ├── 002_auth.sql          # tenant_users table
│   │   └── 003_customers.sql     # customers table + triggers
│   └── seed.sql                  # Dados iniciais das 3 lojas demo
│
└── src/
    ├── app/
    │   ├── globals.css            # Estilos globais + classes customizadas
    │   ├── layout.tsx             # Layout raiz (fonts, SEO, SW registration, InstallPrompt)
    │   ├── page.tsx               # Landing page (Navbar, Hero, Benefits, etc.)
    │   │
    │   ├── admin/
    │   │   └── page.tsx           # Dashboard admin (885 linhas — 6 abas: dashboard, products, categories, orders, analytics, settings)
    │   │
    │   ├── app/
    │   │   └── [slug]/
    │   │       └── page.tsx       # App do cliente (982 linhas — fluxo completo de pedido)
    │   │
    │   ├── api/
    │   │   ├── banner/
    │   │   │   └── route.ts       # GET/POST configurações via Storage (banner, stepMessages, itemIcons, itemPrices)
    │   │   ├── push/
    │   │   │   ├── subscribe/
    │   │   │   │   └── route.ts   # POST: salva subscription do push no Storage
    │   │   │   └── send/
    │   │   │       └── route.ts   # POST: envia push notification via web-push
    │   │   └── signup/
    │   │       └── route.ts       # POST: cria usuário + tenant + link
    │   │
    │   ├── demo/
    │   │   └── page.tsx           # Demo interativa do app
    │   ├── login/
    │   │   └── page.tsx           # Tela de login (demo com senha 123456 ou email/password Supabase)
    │   └── signup/
    │       └── page.tsx           # Tela de cadastro de nova loja
    │
    └── lib/
        ├── tenants.ts             # Dados mock dos tenants + interfaces TypeScript
        ├── supabase.ts            # Cliente Supabase anônimo
        ├── supabase-admin.ts      # Cliente Supabase com service_role
        ├── supabase-queries.ts    # Funções CRUD (fetchTenantBySlug, upsertProduct, insertOrder, etc.)
        ├── sound.ts               # Sons via Web Audio API para notificações no admin
        └── sound.ts

    └── components/
        ├── Navbar.tsx, Hero.tsx, Benefits.tsx, HowItWorks.tsx, Demo.tsx,
        │   Testimonials.tsx, Comparison.tsx, FAQ.tsx, Pricing.tsx, Footer.tsx
        │   PricingAndFAQ.tsx      # Componentes da landing page
        └── InstallPrompt.tsx      # Popup de instalação PWA
```

---

## Supabase Setup

### Storage Buckets

- **`push-subs`**: Bucket público usado para armazenar:
  - Subscriptions de push (`{phone}.json`)
  - Configurações de cada tenant (`config-{tenantId}.json` — banner, stepMessages, itemIcons, itemPrices)

### Tabelas (via `scripts/setup.sql` ou `supabase/migrations/`)

| Tabela | PK | Descrição |
|---|---|---|
| `tenants` | `id text` | Lojas — slug, name, logo, primary_color, whatsapp, address, delivery_fee, min_order, working_hours, installments |
| `categories` | `(id, tenant_id)` | Categorias — name, icon, active, order |
| `products` | `(id, tenant_id)` | Produtos — name, category, price, old_price, stock, active, featured, sales |
| `orders` | `(id, tenant_id)` | Pedidos — customer, phone, items (jsonb), total, status (pending/preparing/shipped/delivered/cancelled), payment, method, date, address |
| `tenant_users` | `id uuid` | Link auth.users → tenants — user_id, tenant_id, email, role |
| `customers` | `phone text` | Clientes — name, tenant_id, cep, address, number, complement, neighborhood, city, state |
| `push_subscriptions` | `id uuid` | Alternativa ao Storage para push (não usado atualmente, o código usa Storage) |

### Realtime

- `alter publication supabase_realtime add table orders;` — Permite que o admin receba pedidos em tempo real via WebSocket Supabase.

### Row Level Security

- Todas as tabelas com RLS ativado
- Políticas permitem leitura pública e operações anônimas (all access) para a maioria das tabelas
- `tenant_users`: apenas o próprio usuário pode ler/inserir seu link (auth.uid())

### Script `scripts/setup.sql`

Script único que cria TUDO no Supabase: extensões, tabelas, RLS, políticas, seed data (3 lojas com produtos, categorias e pedidos de exemplo).

---

## Auth

### Admin Auth

- **Modo 1 — Demo**: Seleciona a loja e digita senha `123456`. Salva `localStorage('goacai_tenant')` e redireciona para `/admin`.
- **Modo 2 — Email/Password**: Usa `supabase.auth.signInWithPassword()`. Busca o `tenant_id` na tabela `tenant_users` vinculada ao user_id.
- **Signup**: `/api/signup` cria usuário via `auth.admin.createUser()`, cria tenant na tabela `tenants` e link na `tenant_users`.

### Customer Auth

- **Phone lookup**: Cliente digita o telefone na tela inicial do app (`NameScreen`). O sistema busca na tabela `customers` via `fetchCustomerByPhone()`.
- Se encontrado: cliente existente, vai direto para o pedido.
- Se não encontrado: mostra tela de cadastro (`register` phase), salva via `upsertCustomer()`.
- **Sem senha**: Autenticação baseada em telefone, sem credenciais.

---

## Key Files — Explicação Detalhada

### `src/app/app/[slug]/page.tsx`

**O coração do sistema — App do cliente (982 linhas).**

Fluxo de etapas (state machine):

1. **`name`**: Tela de entrada — cliente digita telefone → lookup → cadastro se novo
2. **`type`**: Escolha da base (Açaí Tradicional, Zero Açúcar, Creme de Cupuaçu, Sorvetes)
3. **`size`**: Escolha do tamanho (300ml, 500ml, 700ml, 1 Litro) com preços
4. **`toppings`**: Coberturas (até 2 grátis, R$ 1,50 adicionais) — vindo do Supabase ou fallback hardcoded
5. **`fruits`**: Frutas (grátis ou com preço configurável)
6. **`extras`**: Complementos (R$ 2,00 cada)
7. **`cart`**: Resumo do pedido com valores, endereço, validação de nome/telefone
8. **`checkout`**: Endereço (com busca de CEP ViaCEP), forma de entrega (Entrega/Retirada), pagamento (Dinheiro/Cartão/PIX)
9. **`tracking`**: Acompanhamento em tempo real do pedido com 4 estágios e polling a cada 2s

**Customizações:**
- **Banner**: Mensagem no topo vinda do Storage (`/api/banner`)
- **Step Messages**: Texto animado em cada etapa configurável
- **Item Icons**: Emojis personalizados para cada item
- **Item Prices**: Preços de coberturas/frutas/complementos configuráveis
- **Nome animado**: Nome da loja com animação letra-por-letra
- **Categorias ativas/inativas**: Se uma categoria está desativada no admin, a etapa correspondente some

### `src/app/admin/page.tsx`

**Dashboard administrativo (885 linhas) — Tema escuro com sidebar retrátil.**

6 abas:

| Aba | Função |
|---|---|
| **Dashboard** | Cards de métricas (faturamento, pedidos, ticket médio, pendentes) + pedidos recentes + notificação sonora de novo pedido + Realtime via Supabase channel |
| **Produtos** | CRUD de produtos com busca, toggle ativo/inativo, edição inline, preço/estoque |
| **Categorias** | CRUD com toggle ativo/inativo, ícone (emojis), ordem |
| **Pedidos** | Lista completa com filtros por status, botões de avançar status (Preparar → Saiu → Entregue), cancelar, apagar. Envia push notification ao mudar status |
| **Analytics** | Gráficos mock de vendas por horário + produtos mais vendidos |
| **Configurações** | Banner, mensagens de etapa, dias/horários, link do app, preços dos itens, ícones, teste de conexão Supabase |

### `src/app/api/banner/route.ts`

**API de configuração via Storage.**

- `GET /api/banner?tenantId=X`: Baixa `config-{tenantId}.json` do bucket `push-subs` e retorna banner, stepMessages, itemIcons, itemPrices
- `POST /api/banner`: Faz merge dos campos recebidos no JSON existente e faz upload com `upsert: true`

### `src/app/api/push/subscribe/route.ts`

- `POST`: Recebe `{ phone, subscription }` e salva como `{phone}.json` no bucket `push-subs`

### `src/app/api/push/send/route.ts`

- `POST`: Recebe `{ phone, title, body, url }`, baixa a subscription do Storage, usa `web-push` para enviar a notificação VAPID
- Se o cliente cancelou a inscrição (HTTP 410), remove o arquivo do Storage

### `src/lib/supabase-admin.ts`

```ts
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
})
```
Usado nas API Routes que precisam de acesso irrestrito (banner, push subscribe/send, signup).

### `src/lib/supabase-queries.ts`

Funções de acesso a dados:
- `fetchTenantById(id)` / `fetchTenantBySlug(slug)` — Busca tenant + products + categories + orders
- `upsertProduct()` / `deleteProductById()` — CRUD produtos
- `upsertCategory()` / `deleteCategoryById()` — CRUD categorias
- `insertOrder()` / `updateOrderStatus()` / `deleteOrderById()` / `fetchOrdersByTenant()` — CRUD pedidos
- `upsertCustomer()` / `fetchCustomerByPhone()` — CRUD clientes (com `onConflict: 'phone'`)

### `public/sw.js`

**Service Worker (cache-first com fallback, push, notification click).**

- **Cache**: Estratégia network-first. Em fetch, tenta a rede e salva no cache (`goacai-v3`); se falha, usa o cache. Navegação (mode === 'navigate') tenta rede, fallback para `/`.
- **Install**: `self.skipWaiting()`
- **Activate**: Limpa todos os caches antigos, `self.clients.claim()`
- **Message**: Se recebe 'force', força atualização imediata do SW
- **Push**: Mostra notificação com title, body, icon, badge, vibrate
- **Notification Click**: Abre a URL da notificação

### `src/components/InstallPrompt.tsx`

Popup de instalação PWA que aparece:
- Em rotas `/app/...`
- Se o app não está rodando em standalone
- Se o usuário não dispensou antes
- Detecta iOS (Safari) e mostra instruções alternativas (compartilhar → adicionar à tela de início)
- Usa `beforeinstallprompt` event

### `src/app/layout.tsx`

**Root layout.**
- Carrega fonts Inter e Space Grotesk
- Meta tags SEO + OpenGraph + Twitter
- Viewport config
- **Service Worker registration via inline script**: Registra `/sw.js?v=3`, força atualização, recarrega a página quando o SW muda
- Inclui `<InstallPrompt />` globalmente

### `src/lib/tenants.ts`

**Dados mock e interfaces TypeScript.** Contém:
- Interfaces `Tenant`, `TenantProduct`, `TenantCategory`, `TenantOrder`
- Array `tenants` com 3 lojas pré-cadastradas
- Funções `getTenantBySlug(slug)` e `getTenantById(id)`

---

## Environment Variables (`.env.local`)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ycotetlwwqgxdzvnoojs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...

# Web Push (VAPID)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BDsAxsonMQdBCRNRaWQrHQOjg2FdJMqkeo96mz-jINy6tScA-ew_qYiVaaL9_XU7t6v--WTkXtIpCnfAoJd8Fso
VAPID_PRIVATE_KEY=nSBpC20Y2GOzxT-QReUcZPGtlU1B7mV_qhZ2KuLt3qw
```

As chaves VAPID foram geradas com o pacote `web-push` e o email configurado é `contato@goacai.com.br`.

---

## Deployment (Vercel)

### `vercel.json`
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

### Passos
1. `npm i -g vercel`
2. `vercel --prod` (na raiz `go-acai/`)
3. Configurar as 5 env vars no Vercel Dashboard (as mesmas do `.env.local`)

### Comandos Úteis
```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção
npm run start      # Rodar build localmente
npx next build --no-lint  # Build ignorando lint
```

---

## Customization Points

### 1. Mensagens de cada etapa (Step Messages)
- **Onde**: Admin → Configurações → Mensagens de cada etapa
- **Storage**: `config-{tenantId}.json` → `stepMessages` object
- **Exemplo**: `type: "🍇 Escolha 1 base para começar seu pedido!"`
- **Fallback**: Mensagens hardcoded no código em `src/app/app/[slug]/page.tsx`

### 2. Banner
- **Onde**: Admin → Configurações → Mensagem / Banner do App
- **Storage**: `config-{tenantId}.json` → `banner` string
- **Aparece**: No topo do app, abaixo do header, nas etapas de pedido

### 3. Ícones dos itens (Emojis)
- **Onde**: Admin → Configurações → Ícones dos Itens
- **Storage**: `config-{tenantId}.json` → `itemIcons` object
- **Fallback**: `defaultIcons` em `src/app/app/[slug]/page.tsx` (linha 28)

### 4. Preços dos itens
- **Onde**: Admin → Configurações → Preços dos Itens
- **Storage**: `config-{tenantId}.json` → `itemPrices` object (`toppingPrice`, `fruitPrice`, `extraPrice`)
- **Zero**: Item gratuito

### 5. Nome da loja animado
- **Onde**: `src/app/app/[slug]/page.tsx` — componente `AnimatedText`
- **Efeito**: Letras aparecem com blur e queda, uma a uma

### 6. Ativar/desativar categorias
- **Onde**: Admin → Categorias → toggle switch
- **Efeito**: Se uma categoria está inativa, a etapa correspondente (coberturas, frutas, complementos) é pulada no app

### 7. Cores da loja
- **Onde**: `primaryColor` no tenant
- **Efeito**: Usado em todo o app como cor de destaque (botões, progresso, toggles, etc.)

### 8. Dias e horários de funcionamento
- **Onde**: Admin → Configurações → Dias e Horários
- **Nota**: Visual only — não bloqueia pedidos atualmente

---

## Pontos de Atenção

### Service Worker e Cache
- O SW tem cache versionado (`goacai-v3`). Se mudar o SW, mude a versão do cache e o ?v= no registro (`/sw.js?v=3` no layout)
- Para forçar atualização do SW: `navigator.serviceWorker.register('/sw.js?v=4')`
- O `activate` event limpa TODOS os caches — cuidado se tiver outros caches
- Se a página não atualizar, o código no layout força `location.reload()` no `controllerchange`

### Realtime no Supabase
- **IMPORTANTE**: A publicação `supabase_realtime` precisa ter a tabela `orders` adicionada:
  ```sql
  alter publication supabase_realtime add table orders;
  ```
- Sem isso, o dashboard não recebe pedidos em tempo real

### Fallback sem Supabase
- Se o Supabase não estiver configurado, o sistema funciona apenas com dados mock do `tenants.ts`
- As operações CRUD no admin tentam salvar no Supabase, mas não quebram se falhar
- `fetchTenantBySlug` e `fetchTenantById` tem try/catch com fallback para mock

### Notificações Push
- O cliente precisa estar na tela de tracking para se inscrever no push
- A subscription é armazenada no Storage do Supabase (não em tabela)
- O VAPID public key está hardcoded no app (`src/app/app/[slug]/page.tsx` linha 824) — deve ser atualizado se mudar

### Build sem env vars
- `supabase.ts` usa fallback `|| ''` para não quebrar build quando as env vars não estão presentes

---

## Fluxo de Pedido (Customer App)

```
[Telefone] → lookup → [Novo? Cadastro] → [Tipo] → [Tamanho] → [Coberturas] → [Frutas] → [Complementos]
→ [Carrinho] → [Checkout: Endereço + Pagamento] → [Confirmar] → [Tracking em tempo real]
```

**Tracking**: 4 estágios — Pedido recebido → Em preparo → Saiu para entrega → Entregue.
- Polling a cada 2s na tabela `orders` do Supabase
- Admin muda o status manualmente nos botões
- Cliente recebe push notification quando o status muda

---

## Fluxo de Admin

```
[Login: Demo (123456) ou Email/Password] → [Dashboard com métricas + Realtime]
  ├─ Produtos (CRUD, ativar/desativar)
  ├─ Categorias (CRUD, ativar/desativar)
  ├─ Pedidos (listar, filtrar, avançar status, cancelar, apagar)
  ├─ Analytics (mock)
  └─ Configurações (banner, mensagens, horários, preços, ícones, teste BD)
```

---

## API Routes Summary

| Rota | Método | Descrição |
|---|---|---|
| `/api/banner?tenantId=X` | GET | Retorna config do tenant (banner, messages, icons, prices) |
| `/api/banner` | POST | Salva config do tenant |
| `/api/push/subscribe` | POST | Salva subscription push |
| `/api/push/send` | POST | Envia push notification |
| `/api/signup` | POST | Cria nova loja (usuário + tenant + link) |

---

## Scripts Úteis

### Setup completo do Supabase
Execute `scripts/setup.sql` no SQL Editor do Supabase.

### Habilitar Realtime
```sql
alter publication supabase_realtime add table orders;
```
(conteúdo de `scripts/enable_realtime.sql`)

### Corrigir colunas faltantes
Execute `scripts/fix_missing_columns.sql` se as tabelas foram criadas sem `created_at`/`updated_at`.

### Criar tabela de push (alternativa ao Storage)
Execute `scripts/push_notifications.sql` se quiser usar tabela em vez do Storage para subscriptions.
