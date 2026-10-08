-- Igbadun Bites — hide a product from customers (e.g. a new one still waiting for its details)
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Additive and safe to re-run: adds one column (every existing product stays visible) and
-- narrows the public read rule. No rows are changed or removed.
--
-- visible = false → the product can't be read by customers at all: it doesn't appear in the
-- website's shop or the mobile app, its link (#product/…) opens nothing, and checkout rejects
-- it (checkout re-prices through the customer's own connection, so it can't see it either).
-- The Supabase dashboard and service-role scripts still see and edit it.
-- This is different from available = false, which still shows the product as "Sold out".

alter table public.products
  add column if not exists visible boolean not null default true;

-- Was: using (true) — everyone could read every product (schema.sql)
drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
  on public.products for select
  using (visible);
