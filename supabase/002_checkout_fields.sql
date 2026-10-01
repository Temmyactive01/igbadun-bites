-- Igbadun Bites — Step 6: checkout details on orders
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Non-destructive and safe to re-run: only ADDS columns if they're missing.

alter table public.orders
  add column if not exists currency          text not null default 'GBP',
  add column if not exists fulfilment        text not null default 'pickup'
                                             check (fulfilment in ('pickup', 'delivery')),
  add column if not exists customer_name     text,
  add column if not exists customer_email    text,
  add column if not exists phone             text,
  add column if not exists address_line1     text,
  add column if not exists address_line2     text,
  add column if not exists city              text,
  add column if not exists postcode          text,
  add column if not exists delivery_fee_gbp  numeric(10, 2) not null default 0,
  add column if not exists paid_at           timestamptz;

-- Delivery orders must have an address
alter table public.orders drop constraint if exists orders_delivery_needs_address;
alter table public.orders add constraint orders_delivery_needs_address
  check (fulfilment = 'pickup' or (address_line1 is not null and city is not null and postcode is not null));

-- RLS is unchanged: customers can still only READ their own orders;
-- all writes happen server-side with the service role key.
