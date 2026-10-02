-- Igbadun Bites — product descriptions (2 Oct 2026)
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Safe to re-run: each line only replaces the ORIGINAL seed placeholder, so it never
-- overwrites a description the owner has since edited.
--
-- These describe the typical version of each snack (see 003_product_details.sql and
-- docs/owner/ingredient-allergen-checklist.md). Three placeholders were wrong:
-- Gurundi is a coconut biscuit (not a bean snack), Kokoro Egba is maize rings (no
-- plantain), Sisi Pelebe is a groundnut toffee. The owner should confirm all of them.

update public.products set description = 'Thin slices of cocoyam fried golden and lightly salted: earthier than a potato crisp, with a proper snap.'
where name = 'Cocoyam Chips' and description = 'Crispy cocoyam chips, lightly salted.';

update public.products set description = 'Unripe plantain sliced thin and fried until crisp: savoury, lightly salted and gently sweet at the edges.'
where name = 'Plantain Chips' and description = 'Classic sweet-savoury plantain chips.';

update public.products set description = 'Bean fritters fried small and dry until they crunch all the way through: the snackable cousin of breakfast akara, Ogbomosho style.'
where name = 'Akara Ogbomosho' and description = 'Bean-based crunchy snack, Ogbomosho style.';

update public.products set description = 'Crunchy rings of fried maize dough, lightly sweet with a hint of spice, the way they make them in Abeokuta.'
where name = 'Kokoro Egba' and description = 'Crunchy corn-and-plantain snack sticks.';

update public.products set description = 'Golden, crunchy and lightly sweet with a milky richness: the bowl everyone hovers around at every party.'
where name = 'Milky Chin Chin' and description = 'Sweet fried pastry snack with a milky twist.';

update public.products set description = 'Chin chin rolled paper-thin and fried into crisp, golden flakes: lighter, crunchier and gone faster.'
where name = 'Flakes Chin Chin' and description = 'Crunchy flaked-style chin chin.';

update public.products set description = 'Thin coconut biscuits baked until golden and crisp: sweet, toasty and very hard to stop at one.'
where name = 'Gurundi' and description = 'Traditional crunchy bean snack.';

update public.products set description = 'Dry-roasted groundnuts with a pinch of salt: the party-tray essential for long journeys and late conversations.'
where name = 'Peanuts' and description = 'Roasted peanuts, a classic snack-time favourite.';

update public.products set description = 'Groundnut toffee: roasted groundnuts set in caramelised sugar and cut into long, slim diamonds. Sisi pelebe means "skinny lady".'
where name = 'Sisi Pelebe' and description = 'Thin, crispy sweet snack.';

update public.products set description = 'Dark, chewy coconut caramel, cooked slowly until it''s almost black. That''s how it got its name: baba dudu, "the dark old man".'
where name = 'Baba Dudu' and description = 'Soft, chewy traditional sweet.';

update public.products set description = 'Grated coconut cooked with sugar until it sets into sweet, chewy pieces: the one you counted out in your palm.'
where name = 'Coconut Candy' and description = 'Sweet coconut candy, a nostalgic favourite.';

update public.products set description = 'Roasted groundnuts and grain pounded with ginger and a little pepper, then pressed into balls: sweet, nutty, with a gentle warmth.'
where name = 'Dankwa' and description = 'Traditional sweet snack.';

update public.products set description = 'Milk sweets made with condensed milk: rich, creamy and soft enough to melt on your tongue.'
where name = 'Condensed Milk Sweet' and description = 'Rich, creamy condensed milk sweet.';
