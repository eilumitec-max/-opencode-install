-- Sizes table
create table sizes (
  id text not null,
  tenant_id text not null references tenants(id) on delete cascade,
  name text not null,
  price decimal(10,2) not null,
  "order" integer default 0,
  active boolean default true,
  primary key (id, tenant_id)
);

-- Types (flavors/bases)
create table types (
  id text not null,
  tenant_id text not null references tenants(id) on delete cascade,
  name text not null,
  emoji text not null default '🫐',
  base text not null default 'Açaí',
  "order" integer default 0,
  active boolean default true,
  primary key (id, tenant_id)
);

-- Payment methods
create table payment_methods (
  id text not null,
  tenant_id text not null references tenants(id) on delete cascade,
  name text not null,
  icon text not null default '💵',
  active boolean default true,
  primary key (id, tenant_id)
);

-- RLS
alter table sizes enable row level security;
alter table types enable row level security;
alter table payment_methods enable row level security;

create policy "Public read access" on sizes for select using (true);
create policy "Public read access" on types for select using (true);
create policy "Public read access" on payment_methods for select using (true);

create policy "Anon all access" on sizes for all using (true) with check (true);
create policy "Anon all access" on types for all using (true) with check (true);
create policy "Anon all access" on payment_methods for all using (true) with check (true);
