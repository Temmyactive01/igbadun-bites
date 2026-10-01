-- Igbadun Bites — MVP product catalog seed
-- Run AFTER schema.sql, in the Supabase SQL editor.
-- Prices are realistic PLACEHOLDERS from prd.md — confirm with the business
-- owner before real launch.

insert into public.products (name, category, description, pack_size, price_gbp)
values
  -- Chips
  ('Cocoyam Chips', 'Chips', 'Crispy cocoyam chips, lightly salted.', '150g', 4.50),
  ('Plantain Chips', 'Chips', 'Classic sweet-savoury plantain chips.', '150g', 4.00),

  -- Crunchy snacks
  ('Akara Ogbomosho', 'Crunchy snacks', 'Bean-based crunchy snack, Ogbomosho style.', '200g', 5.00),
  ('Kokoro Egba', 'Crunchy snacks', 'Crunchy corn-and-plantain snack sticks.', '200g', 4.50),
  ('Milky Chin Chin', 'Crunchy snacks', 'Sweet fried pastry snack with a milky twist.', '250g', 5.50),
  ('Flakes Chin Chin', 'Crunchy snacks', 'Crunchy flaked-style chin chin.', '250g', 5.00),
  ('Gurundi', 'Crunchy snacks', 'Traditional crunchy bean snack.', '150g', 4.00),
  ('Peanuts', 'Crunchy snacks', 'Roasted peanuts, a classic snack-time favourite.', '200g', 3.50),

  -- Traditional treats and sweets
  ('Sisi Pelebe', 'Traditional treats and sweets', 'Thin, crispy sweet snack.', '150g', 4.50),
  ('Baba Dudu', 'Traditional treats and sweets', 'Soft, chewy traditional sweet.', '150g', 4.00),
  ('Coconut Candy', 'Traditional treats and sweets', 'Sweet coconut candy, a nostalgic favourite.', '150g', 4.50),
  ('Dankwa', 'Traditional treats and sweets', 'Traditional sweet snack.', '150g', 4.00),
  ('Condensed Milk Sweet', 'Traditional treats and sweets', 'Rich, creamy condensed milk sweet.', '150g', 4.50)
on conflict do nothing;
