create table customers (
  phone text primary key,
  name text not null,
  tenant_id text not null references tenants(id) on delete cascade,
  cep text default '',
  address text default '',
  number text default '',
  complement text default '',
  neighborhood text default '',
  city text default '',
  state text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table customers enable row level security;
create policy "All access" on customers for all using (true) with check (true);

-- Auto-update updated_at
create extension if not exists moddatetime;
create trigger set_updated_at before update on customers
  for each row execute function moddatetime(updated_at);

-- Delete customers with no orders in 30 days
create or replace function cleanup_old_customers()
returns void as $$
begin
  delete from customers c
  where not exists (
    select 1 from orders o
    where o.tenant_id = c.tenant_id
    and o.customer = c.name
    and o.date >= (now() - interval '30 days')::text
  );
end;
$$ language plpgsql security definer;
