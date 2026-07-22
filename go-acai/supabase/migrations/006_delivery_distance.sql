-- Add distance and pricing fields
alter table delivery_zones add column if not exists distance_km decimal(10,2) not null default 0;

alter table tenants add column if not exists price_per_km decimal(10,2) not null default 0;
alter table tenants add column if not exists latitude double precision;
alter table tenants add column if not exists longitude double precision;
