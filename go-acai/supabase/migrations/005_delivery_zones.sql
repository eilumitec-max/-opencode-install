-- Delivery zones: per-neighborhood pricing
create table if not exists delivery_zones (
  id text not null,
  tenant_id text not null references tenants(id) on delete cascade,
  name text not null,
  fee decimal(10,2) not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (id, tenant_id)
);

alter table delivery_zones enable row level security;

create policy "tenant can manage own zones"
  on delivery_zones for all
  using (tenant_id = (select id from tenants where id = tenant_id))
  with check (tenant_id = (select id from tenants where id = tenant_id));
