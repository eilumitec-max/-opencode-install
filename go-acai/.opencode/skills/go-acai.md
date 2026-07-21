---
name: go-acai
description: GO AÇAÍ - Multi-tenant SaaS delivery system (Next.js 14, Supabase, TailwindCSS)
---

# GO AÇAÍ Project Context

## Stack
- Next.js 14 App Router, TypeScript, TailwindCSS, Framer Motion, Lucide icons
- Supabase (optional): tenants, categories, products, orders tables
- Sounds via Web Audio API (`src/lib/sound.ts`)

## Multi-tenant
3 mock clients stored in `src/lib/tenants.ts`:
- **Açaí do Miqueias** 🍇 (`acai-do-miqueias`, `#7c3aed`)
- **Gelateria Bella** 🍦 (`gelateria-bella`, `#e11d48`)
- **Açaí da Maria** 💜 (`acai-da-maria`, `#6d28d9`)

## Routes
| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/login` | Tenant selection + password (`123456`) |
| `/admin` | Admin dashboard (requires login) |
| `/app/[slug]` | Customer ordering app |
| `/demo` | Interactive demo |

## Key Patterns
- Admin ↔ Customer communication via `localStorage('goacai_tracking')` polling every 2s
- Login saves `localStorage('goacai_tenant')` as `{ id: string }`
- Tenant's `primaryColor` used throughout for dynamic theming
- All admin CRUD operations sync to Supabase when available (fallback to local state)

## Data Types (`src/lib/tenants.ts`)
- `Tenant`: id, slug, name, logo, primaryColor, whatsapp, address, deliveryFee, minOrder, products[], categories[], orders[]
- `TenantProduct`: id, name, category, price, oldPrice, stock, active, featured, sales
- `TenantCategory`: id, name, icon, active, order
- `TenantOrder`: id, customer, items[], total, status, payment, method, date, address

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npx next build --no-lint` — Build without linting
- `npx next start -p 3000` — Start production server

## Style
- Admin: dark theme (`bg-dark-950`, `bg-dark-900`, `border-dark-800`)
- Customer app: white cards with tenant's `primaryColor`
- Custom classes: `btn-primary`, `btn-outline`, `input-dark`, `font-display`

## Supabase
- `.env.local` contains `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `src/lib/supabase.ts` — client
- `src/lib/supabase-queries.ts` — CRUD functions
- `supabase/migrations/001_schema.sql` — schema
- `supabase/seed.sql` — initial data
