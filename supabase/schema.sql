-- Igbadun Bites — MVP schema
-- Run this in the Supabase SQL editor (Project: "Igbadun bites") before seeding.

-- ─────────────────────────────────────────────
-- products
-- ─────────────────────────────────────────────
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text not null default '',
  pack_size text not null,
  price_gbp numeric(10, 2) not null,
  ingredients text not null default 'Ingredients: TBC with supplier',
  allergens text not null default 'Allergen info: TBC with supplier',
  storage_guidance text not null default 'Storage: TBC with supplier',
  available boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Products are public read-only data — anyone (including anon/browser) can
-- read available products. No one can insert/update/delete from the client;
-- catalog changes go through the Supabase dashboard or a service-role script.
drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
  on public.products for select
  using (true);

-- ─────────────────────────────────────────────
-- orders
-- ─────────────────────────────────────────────
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  paystack_reference text unique,
  total_gbp numeric(10, 2) not null,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- A signed-in user can read their OWN orders. No client-side inserts/updates —
-- per architecture.md, orders are only ever written by server-side logic using
-- the service role key, after Paystack verification. No policy below grants
-- insert/update/delete to anon or authenticated roles, so RLS blocks those by
-- default; only the service role (which bypasses RLS) can write.
drop policy if exists "Users can read own orders" on public.orders;
create policy "Users can read own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- order_items
-- ─────────────────────────────────────────────
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null references public.products (id),
  quantity integer not null check (quantity > 0),
  unit_price_gbp numeric(10, 2) not null
);

alter table public.order_items enable row level security;

-- A signed-in user can read line items belonging to their own orders.
-- Writes are server-side only (service role), same reasoning as orders above.
drop policy if exists "Users can read own order items" on public.order_items;
create policy "Users can read own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );
