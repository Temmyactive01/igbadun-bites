-- Igbadun Bites — product names in the owner's spelling (October 2026)
-- Run AFTER the website change that adds these names (lib/product-images.ts →
-- RENAMED_PRODUCT_KEYS) is live, so photos, links and the featured product keep working.
-- Safe to re-run: each line only renames a product that still has its old name.
--
-- The owner's photos are stored under the new names (public/images/products/), and the
-- old product links (#product/baba-dudu, #product/milky-chin-chin, #product/dankwa) keep
-- opening these products. Orders store product ids, so past orders show the new names.

update public.products set name = 'Babadudu' where name = 'Baba Dudu';
update public.products set name = 'Chin Chin' where name = 'Milky Chin Chin';
update public.products set name = 'Donkwa'   where name = 'Dankwa';
