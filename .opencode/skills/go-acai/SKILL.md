---
name: go-acai
description: Complete multi-tenant delivery SaaS for aÃ§aÃ­ shops. Use when working on the Go AÃ§aÃ­ project at go-acai/. Covers PWA customer app, admin dashboard, Supabase, Vercel deploy, push notifications, SMTP email, signup flow, database schema, and all features implemented so far.
---

# Go AÃ§aÃ­ â€" Multi-tenant Delivery SaaS

## Project Overview
Multi-tenant SaaS platform for aÃ§aÃ­/dessert shops. Each tenant gets:
- A customer-facing PWA app (`/app/[slug]`) for ordering
- An admin dashboard (`/admin`) for managing orders, products, categories, sizes, flavors, payments, and settings
- Push notifications, email welcome, printable receipts

## Tech Stack
- **Framework**: Next.js 14 (App Router, React 18)
- **Styling**: Tailwind CSS + custom dark theme
- **Animation**: Framer Motion
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **Deploy**: Vercel (production: `https://go-acai.vercel.app`)
- **Auth**: Supabase Auth (email/password for store owners; phone lookup for customers)
- **PWA**: Service Worker at `/sw.js` (network-first, no HTML caching), manifest generated per tenant
- **Email**: Nodemailer via Gmail SMTP for welcome emails
- **Push**: Web Push API with VAPID keys

## Supabase Project
- URL: `https://ycotetlwwqgxdzvnoojs.supabase.co`
- Anon key: `(NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local)`
- Service role key: `(SUPABASE_SERVICE_ROLE_KEY in .env.local)`

## Vercel
- Team: `mikes-projects-1ebe9e8c`
- Project: `go-acai`
- Production: `https://go-acai.vercel.app`
- GitHub: `github.com/eilumitec-max/-opencode-install.git` (branch `main`)
- SMTP env vars set on Vercel: `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_USER=eilumitec@gmail.com`, `SMTP_PASS=(SMTP_PASS in .env.local)`, `SMTP_FROM=eilumitec@gmail.com`

## VAPID Keys
- Public: `(NEXT_PUBLIC_VAPID_PUBLIC_KEY in .env.local)`
- Private: `(VAPID_PRIVATE_KEY in .env.local)`

---

## Database Tables

### tenants
| Column | Type | Notes |
|--------|------|-------|
| id | text PK | |
| slug | text UNIQUE | Used in URL `/app/[slug]` |
| name | text | Store name |
| logo | text | Emoji logo |
| primary_color | text | Hex color |
| whatsapp | text | |
| address | text | |
| delivery_fee | decimal | |
| min_order | decimal | |
| working_hours | text | Saved as "Dia: HH:mm Ã s HH:mm; ..." from admin settings |
| installments | text | |

### categories, products, sizes, types, payment_methods
All use composite PK `(id, tenant_id)` with `tenant_id` FK -> tenants(id) ON DELETE CASCADE.
Each has `active` boolean. All have RLS policies for public read + anon all access.

### orders
Composite PK `(id, tenant_id)`. Status: `pending | preparing | shipped | delivered | cancelled`.
JSONB `items` array. Fields: customer, phone, total, payment, method, date, address.

### tenant_users
Links auth.users to tenants. Columns: id (uuid PK), user_id (uuid FK->auth.users, UNIQUE), tenant_id, email, role.

### customers
PK: phone. Fields: name, tenant_id, cep, address, number, complement, neighborhood, city, state.

### push_subscriptions
Columns: id (uuid PK), phone, subscription (jsonb).

---

## Key Source Files

### Customer App
- `src/app/app/[slug]/page.tsx` (~1000 lines): Multi-step ordering (name â†' type â†' size â†' toppings â†' fruits â†' extras â†' cart â†' checkout â†' tracking). Reads sizes/types/payment_methods/products from DB. Shows "Em breve" when no data. Plays sound on preparing/shipped status. Polls tracking every 2s. Push subscription.
- `src/app/app/[slug]/manifest.ts`: Dynamic PWA manifest per tenant (name, theme color).
- `src/app/app/[slug]/layout.tsx`: Server component for dynamic manifest link metadata.

### Admin Dashboard
- `src/app/admin/page.tsx` (~1100 lines): 9 tabs all inline. Dashboard metrics, CRUD for products/categories/sizes/types/payments, orders with print receipt (hidden iframe), settings that persist to DB.

### API Routes
- `src/app/api/signup/route.ts`: Creates auth user + tenant + tenant_users + seeds defaults (3 categories, 28 products, 4 sizes, 6 types, 3 payment methods) + welcome email.
- `src/app/api/banner/route.ts`: GET/POST banner JSON config in Supabase Storage.
- `src/app/api/push/send/route.ts`: Send push by phone. Requires Bearer token.
- `src/app/api/push/subscribe/route.ts`: Store push subscription.

### Lib
- `src/lib/supabase-queries.ts`: All DB CRUD functions for all tables.
- `src/lib/tenants.ts`: TypeScript interfaces + hardcoded fallback tenants.
- `src/lib/email.ts`: Nodemailer welcome email with tenant info.

### PWA
- `public/sw.js`: Network-first SW, no HTML caching, push/notificationclick handlers.
- `public/manifest.json`: Static fallback manifest.
- `src/components/InstallPrompt.tsx`: Global install popup for `/app/*` routes, shows tenant name.

### Supabase
- `supabase/migrations/001_schema.sql`: tenants, categories, products, orders.
- `supabase/migrations/002_auth.sql`: tenant_users.
- `supabase/migrations/003_customers.sql`: customers table + cleanup function.
- `supabase/migrations/004_store_config.sql`: sizes, types, payment_methods.

---

## Architecture & Data Flow

### Ordering Flow
1. Name+phone -> select type (from `types` table) -> select size (from `sizes` table) -> customize toppings/fruits/extras (from `products` where category matches Coberturas/Frutas/Complementos)
2. Cart -> delivery method (Entrega/Retirada) -> address (ViaCEP auto-fill) -> payment method (from `payment_methods` table)
3. Confirm -> insert order + upsert customer -> tracking screen (polls status every 2s, plays sound on preparing/shipped)

### Admin Flow
1. Login via Supabase Auth -> session -> fetch tenant from `tenant_users`
2. Dashboard: real-time metrics from `orders` via polling + Supabase Realtime
3. Status changes: DB update + push notification + sound + localStorage tracking
4. Settings save: banner config (Storage JSON) + tenant fields (name, address, fees, hours)
5. Print order: hidden iframe renders receipt -> `print()` dialog -> iframe removed

### Signup Flow
1. POST `/api/signup` with email, password, storeName
2. Creates auth user (email confirmed), tenant, tenant_users link
3. Seeds all defaults (categories, products, sizes, types, payment methods)
4. Sends welcome email (silent fail if SMTP not configured)

---

## Common Commands
```bash
npm run build          # Build
vercel --prod --yes     # Deploy production
npm run dev             # Dev server
```

## Pending
- Realtime SQL: `alter publication supabase_realtime add table orders;` (run in Supabase SQL Editor if not already done)

## Environment Variables (.env.local)
All in `.env.local` file at project root. Ask the user for it if needed.
