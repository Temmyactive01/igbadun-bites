-- Igbadun Bites — shared basket: cart_items (groundwork for web + mobile sharing one cart)
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Additive and safe to re-run: creates a NEW table only. products, orders and
-- order_items are not touched, and Realtime is enabled for cart_items alone.
--
-- Nothing uses this table yet: the web basket still lives in the browser
-- (lib/cart-store.ts) and checkout still re-prices from products on the server.
-- Quantities here are not prices — prices are never stored in the cart.

-- ─────────────────────────────────────────────
-- cart_items — one row per product in a signed-in customer's basket
-- ─────────────────────────────────────────────
create table if not exists public.cart_items (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  -- Same 1–20 range as the basket and /api/checkout (MAX_QUANTITY)
  quantity integer not null check (quantity between 1 and 20),
  updated_at timestamptz not null default now(),
  -- One line per product per customer, so clients can upsert on (user_id, product_id)
  primary key (user_id, product_id)
);

-- Lookups by product (and the products foreign key's cascade)
create index if not exists cart_items_product_id_idx on public.cart_items (product_id);

-- Keep updated_at current on every change
create or replace function public.cart_items_set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists cart_items_set_updated_at on public.cart_items;
create trigger cart_items_set_updated_at
  before update on public.cart_items
  for each row execute function public.cart_items_set_updated_at();

-- ─────────────────────────────────────────────
-- Row Level Security — same pattern as orders (auth.uid() = user_id), but
-- customers may also write their own basket rows. Nobody can see or change
-- anyone else's basket; signed-out visitors (anon) get no access at all.
-- ─────────────────────────────────────────────
alter table public.cart_items enable row level security;

drop policy if exists "Users can read own cart items" on public.cart_items;
create policy "Users can read own cart items"
  on public.cart_items for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can add own cart items" on public.cart_items;
create policy "Users can add own cart items"
  on public.cart_items for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own cart items" on public.cart_items;
create policy "Users can update own cart items"
  on public.cart_items for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own cart items" on public.cart_items;
create policy "Users can delete own cart items"
  on public.cart_items for delete
  to authenticated
  using (auth.uid() = user_id);

-- Table privileges for signed-in users (RLS above still limits them to their own rows).
-- Explicit so this works even if the project's default privileges change.
grant select, insert, update, delete on public.cart_items to authenticated;

-- ─────────────────────────────────────────────
-- Realtime — cart_items ONLY. "add table" leaves every other table's Realtime
-- setting exactly as it is. Guarded so re-running doesn't error.
-- ─────────────────────────────────────────────
-- Full old row on UPDATE/DELETE events, so a client can tell which basket line changed
alter table public.cart_items replica identity full;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'cart_items'
  ) then
    alter publication supabase_realtime add table public.cart_items;
  end if;
end;
$$;

-- Check afterwards (should list cart_items, plus any tables that already had Realtime):
--   select schemaname, tablename from pg_publication_tables where pubname = 'supabase_realtime';
