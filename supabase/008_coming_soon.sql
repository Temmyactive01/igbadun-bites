-- Igbadun Bites — "Coming soon" products
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Additive and safe to re-run: adds one column; every existing product is unaffected
-- (coming_soon = false).
--
-- coming_soon = true → the product shows in the shop with its photo and name, marked
-- "Coming soon": no price, no pack size, no ingredients/allergens, and it can't be added
-- to the basket or bought (checkout rejects it). Use it for a product that's announced
-- before its price and details are ready. Keep available = false as well.
-- Compare: visible = false hides a product completely (006); available = false on its own
-- shows it as "Sold out".

alter table public.products
  add column if not exists coming_soon boolean not null default false;
