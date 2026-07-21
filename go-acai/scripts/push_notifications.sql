-- Create push_subscriptions table
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  subscription jsonb not null,
  created_at timestamptz default now()
);

-- Allow anonymous access (customer doesn't need auth)
alter table push_subscriptions enable row level security;

drop policy if exists "All access" on push_subscriptions;
create policy "All access" on push_subscriptions
  for all using (true) with check (true);

-- Add to realtime publication
alter publication supabase_realtime add table push_subscriptions;
