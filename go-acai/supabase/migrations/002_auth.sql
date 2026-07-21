-- Users to tenants link
create table tenant_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  tenant_id text not null references tenants(id) on delete cascade,
  email text not null,
  role text not null default 'admin',
  created_at timestamptz default now()
);

alter table tenant_users enable row level security;
create policy "Users can read own link" on tenant_users for select using (auth.uid() = user_id);
create policy "Users can insert own link" on tenant_users for insert with check (auth.uid() = user_id);
