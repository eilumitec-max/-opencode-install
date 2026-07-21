-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Tenants table
create table tenants (
  id text primary key,
  slug text unique not null,
  name text not null,
  logo text not null,
  primary_color text not null,
  whatsapp text not null,
  address text not null,
  delivery_fee decimal(10,2) not null default 0,
  min_order decimal(10,2) not null default 0,
  working_hours text not null,
  installments text not null,
  created_at timestamptz default now()
);

-- Categories table (composite PK)
create table categories (
  id text not null,
  tenant_id text not null references tenants(id) on delete cascade,
  name text not null,
  icon text not null default '📦',
  active boolean default true,
  "order" integer default 0,
  created_at timestamptz default now(),
  primary key (id, tenant_id)
);

-- Products table (composite PK)
create table products (
  id text not null,
  tenant_id text not null references tenants(id) on delete cascade,
  name text not null,
  category text not null,
  price decimal(10,2) not null,
  old_price decimal(10,2),
  stock integer default 0,
  image text default '',
  active boolean default true,
  featured boolean default false,
  sales integer default 0,
  created_at timestamptz default now(),
  primary key (id, tenant_id)
);

-- Orders table (composite PK)
create table orders (
  id text not null,
  tenant_id text not null references tenants(id) on delete cascade,
  customer text not null,
  items jsonb not null default '[]',
  total decimal(10,2) not null,
  status text not null default 'pending' check (status in ('pending','preparing','shipped','delivered','cancelled')),
  payment text not null,
  method text not null,
  date text not null,
  address text not null,
  created_at timestamptz default now(),
  primary key (id, tenant_id)
);

-- Row Level Security
alter table tenants enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;

-- Allow public read access
create policy "Public read access" on tenants for select using (true);
create policy "Public read access" on categories for select using (true);
create policy "Public read access" on products for select using (true);
create policy "Public read access" on orders for select using (true);

-- Allow all operations for anon (since we don't have auth for now)
create policy "Anon all access" on tenants for all using (true) with check (true);
create policy "Anon all access" on categories for all using (true) with check (true);
create policy "Anon all access" on products for all using (true) with check (true);
create policy "Anon all access" on orders for all using (true) with check (true);
