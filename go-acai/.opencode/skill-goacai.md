---
name: go-acai
description: GO AÇAÍ - SaaS multi-tenant de delivery para açaí, sorveterias e gelaterias (Next.js 14, Supabase, TailwindCSS, PWA)
---

# GO AÇAÍ — Skill opencode

## Propósito e Arquitetura

GO AÇAÍ é um SaaS de delivery multi-tenant. Cada loja (tenant) tem seu próprio sub-app em `/app/[slug]` e um painel admin em `/admin`. O sistema suporta dados mock (`src/lib/tenants.ts`) com fallback para Supabase.

**Fluxo cliente**: Telefone → Lookup/Cadastro → Tipo → Tamanho → Coberturas → Frutas → Complementos → Carrinho → Checkout → Tracking

**Fluxo admin**: Login (demo/email) → Dashboard → Produtos/Categorias/Pedidos/Configurações

---

## Estrutura de Diretórios

```
go-acai/
├── src/
│   ├── app/
│   │   ├── page.tsx                      # Landing page institucional
│   │   ├── layout.tsx                    # Root layout + SW registration
│   │   ├── admin/page.tsx                # Admin dashboard (885 linhas, 6 abas)
│   │   ├── app/[slug]/page.tsx           # App do cliente (982 linhas)
│   │   ├── login/page.tsx                # Tela de login
│   │   ├── signup/page.tsx               # Cadastro de nova loja
│   │   ├── demo/page.tsx                 # Demo interativa
│   │   ├── api/
│   │   │   ├── banner/route.ts           # GET/POST config (banner, messages, icons, prices)
│   │   │   ├── push/subscribe/route.ts   # Salvar push subscription
│   │   │   ├── push/send/route.ts        # Enviar push notification (web-push + VAPID)
│   │   │   └── signup/route.ts           # Criar usuário + tenant
│   │   └── globals.css
│   ├── lib/
│   │   ├── tenants.ts                    # Interfaces + dados mock (3 lojas)
│   │   ├── supabase.ts                   # Cliente anônimo
│   │   ├── supabase-admin.ts             # Cliente service_role
│   │   ├── supabase-queries.ts           # Funções CRUD
│   │   └── sound.ts                      # Sons via Web Audio API
│   └── components/
│       ├── InstallPrompt.tsx             # Popup de instalação PWA
│       └── (landing: Navbar, Hero, Benefits, HowItWorks, Demo, Testimonials, Comparison, FAQ, Pricing, Footer)
├── public/
│   ├── sw.js                             # Service Worker
│   ├── manifest.json                     # PWA manifest
│   └── icons/
├── scripts/
│   ├── setup.sql                         # Script completo Supabase (tabelas + seed)
│   ├── enable_realtime.sql               # Habilitar Realtime na tabela orders
│   ├── fix_missing_columns.sql           # Adicionar colunas faltantes
│   └── push_notifications.sql            # Tabela alternativa para push
├── supabase/
│   ├── migrations/001_schema.sql         # Schema: tenants, categories, products, orders
│   ├── migrations/002_auth.sql           # tenant_users
│   ├── migrations/003_customers.sql      # customers + triggers
│   └── seed.sql                          # Seed data
├── .env.local                            # Env vars (NÃO COMMITAR)
├── next.config.js
├── tailwind.config.js
├── vercel.json
└── package.json
```

---

## Interfaces TypeScript (`src/lib/tenants.ts`)

```ts
Tenant           { id, slug, name, logo, primaryColor, whatsapp, address, deliveryFee, minOrder, workingHours, installments, banner?, products[], categories[], orders[] }
TenantProduct    { id, name, category, price, oldPrice?, stock, image, active, featured, sales }
TenantCategory   { id, name, icon, active, order }
TenantOrder      { id, customer, phone?, items[], total, status, payment, method, date, address }
```

---

## Rotas da Aplicação

| Path | Descrição |
|---|---|
| `/` | Landing page |
| `/login` | Login (demo senha `123456` ou email/password Supabase Auth) |
| `/signup` | Cadastro de nova loja |
| `/admin` | Dashboard admin (requer login) |
| `/app/[slug]` | App do cliente |
| `/demo` | Demo interativa |

---

## Supabase

### Tabelas
- `tenants`, `categories`, `products`, `orders`, `tenant_users`, `customers`

### Storage Buckets
- `push-subs`: subscriptions push (`{phone}.json`) + configs (`config-{tenantId}.json`)

### Realtime
```sql
alter publication supabase_realtime add table orders;
```
**Obrigatório** para o dashboard receber pedidos em tempo real.

### Env vars necessárias
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY
```

---

## Tarefas Comuns

### Adicionar um produto
1. Vá em Admin → Produtos → "Novo Produto"
2. Preencha nome, categoria, preço, estoque
3. O produto aparece no app se a categoria estiver ativa

### Alterar preços de coberturas/frutas/complementos
1. Vá em Admin → Configurações → Preços dos Itens
2. Ajuste os valores (0 = grátis)
3. Clique "Salvar" ao lado do banner (ou salve tudo)

### Personalizar mensagens do app
1. Vá em Admin → Configurações → Mensagens de cada etapa
2. Edite o texto desejado (deixe vazio para usar o padrão)
3. Clique "Salvar"

### Ativar/desativar categoria
1. Vá em Admin → Categorias
2. Use o toggle switch ao lado do nome
3. Categorias inativas são puladas automaticamente no fluxo do app

### Corrigir Service Worker desatualizado
1. No navegador, abra DevTools → Application → Service Workers
2. Clique "Unregister"
3. Faça um hard refresh (Ctrl+Shift+R)
4. Ou mude a versão no registro: `/sw.js?v=NOVO_NUMERO` em `src/app/layout.tsx`

### Forçar atualização do SW em produção
- No `layout.tsx`, o inline script já força `postMessage('force')` e recarrega a página automaticamente
- Se não funcionar, limpe o cache do navegador manualmente

### Deploy no Vercel
```bash
npm run build          # Verificar se compila
vercel --prod          # Fazer deploy
```
Configure as 5 env vars no dashboard do Vercel.

### Setup do Supabase do zero
1. Crie um projeto no Supabase
2. Atualize as env vars no `.env.local`
3. Execute `scripts/setup.sql` no SQL Editor
4. Execute `scripts/enable_realtime.sql`
5. Crie o bucket `push-subs` no Storage (público)

### Adicionar nova loja (tenant)
1. Via interface: `/signup` — cria automaticamente tenant + usuário + link
2. Via SQL: insira manualmente nas tabelas `tenants`, `categories`, `products`, depois crie um usuário auth e link em `tenant_users`

---

## Comandos

```bash
npm run dev           # Servidor dev
npm run build         # Build produção
npm run start         # Rodar build
npm run lint          # Lint
npx next build --no-lint  # Build sem lint
```

---

## Observações Técnicas

- As cores dos tenants (`primaryColor`) são usadas dinamicamente em todo o app via style inline
- O cache do SW é versionado (`goacai-v3`). Ao alterar o SW, incremente a versão no cache e no registro
- O VAPID public key está hardcoded em `src/app/app/[slug]/page.tsx:824` — atualize se regenerar as chaves
- O sistema funciona sem Supabase usando dados mock, mas pedidos não persistem
- A tabela `orders` precisa de Realtime ativado para o dashboard receber pedidos ao vivo
- Sons de notificação usam Web Audio API (`src/lib/sound.ts`) — tocam no admin ao receber/mudar pedidos
