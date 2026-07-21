-- Add missing created_at columns (if tables were created without them)
do $$ begin
  if not exists (select 1 from information_schema.columns where table_name='orders' and column_name='created_at') then
    alter table orders add column created_at timestamptz default now();
  end if;
  if not exists (select 1 from information_schema.columns where table_name='products' and column_name='created_at') then
    alter table products add column created_at timestamptz default now();
  end if;
  if not exists (select 1 from information_schema.columns where table_name='categories' and column_name='created_at') then
    alter table categories add column created_at timestamptz default now();
  end if;
  if not exists (select 1 from information_schema.columns where table_name='tenants' and column_name='created_at') then
    alter table tenants add column created_at timestamptz default now();
  end if;
  if not exists (select 1 from information_schema.columns where table_name='customers' and column_name='created_at') then
    alter table customers add column created_at timestamptz default now();
  end if;
  if not exists (select 1 from information_schema.columns where table_name='customers' and column_name='updated_at') then
    alter table customers add column updated_at timestamptz default now();
  end if;
end $$;
