-- Igbadun Bites — Phase 3: product details status + researched typical-recipe details
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Non-destructive and safe to re-run: adds a column if missing, then updates text fields by name.
--
-- IMPORTANT: the ingredients / allergens / storage below are RESEARCHED TYPICAL RECIPES
-- (2 Oct 2026), NOT confirmed by the owner or supplier. The site labels them as such while
-- details_status = 'researched'. Before taking real orders, the owner must confirm each
-- product (allergens especially) against her own recipe or supplier label, correct the text,
-- then mark it confirmed:
--   update public.products set details_status = 'confirmed' where name = 'Peanuts';
-- See docs/owner/ingredient-allergen-checklist.md.

alter table public.products
  add column if not exists details_status text not null default 'researched'
    check (details_status in ('researched', 'confirmed'));

update public.products set
  ingredients = 'Typical recipe: cocoyam (taro), vegetable oil, salt. Some versions add pepper or other seasoning.',
  allergens = 'Contains (typical recipe): no major allergen ingredient. May also contain: Peanuts (if fried in groundnut oil), Soya (if fried in soya oil), Celery or Mustard (if seasoned).',
  storage_guidance = 'Keep sealed in a cool, dry place out of direct sunlight. Once opened, reseal the bag or tip into an airtight container to keep it crunchy.'
where name = 'Cocoyam Chips' and details_status = 'researched';

update public.products set
  ingredients = 'Typical recipe: unripe plantain, vegetable oil (often palm or groundnut oil), salt. Sweeter versions add sugar.',
  allergens = 'Contains (typical recipe): no major allergen ingredient. May also contain: Peanuts (if fried in groundnut oil), Soya (if fried in soya oil), Sulphites (some packaged chips).',
  storage_guidance = 'Keep sealed in a cool, dry place out of direct sunlight. Once opened, reseal the bag or tip into an airtight container to keep it crunchy.'
where name = 'Plantain Chips' and details_status = 'researched';

update public.products set
  ingredients = 'Typical recipe: black-eyed beans (cowpeas), onion, chilli pepper, salt, fried in vegetable oil until crunchy. Some versions add flour for extra crunch.',
  allergens = 'Contains (typical recipe): no major allergen ingredient. May also contain: Cereals containing gluten (if wheat flour is added), Peanuts (if fried in groundnut oil), Soya (if fried in soya oil).',
  storage_guidance = 'Keep sealed in a cool, dry place out of direct sunlight. Once opened, reseal the bag or tip into an airtight container to keep it crunchy.'
where name = 'Akara Ogbomosho' and details_status = 'researched';

update public.products set
  ingredients = 'Typical recipe: maize (corn) flour, garri (cassava), sugar, salt, sometimes ginger or chilli, fried in vegetable oil. Kokoro Egba is the ring-shaped, cream-coloured kind from Abeokuta.',
  allergens = 'Contains (typical recipe): no major allergen ingredient. May also contain: Peanuts (some recipes add groundnut paste; groundnut frying oil), Cereals containing gluten (if wheat flour is added), Soya (if fried in soya oil).',
  storage_guidance = 'Keep sealed in a cool, dry place out of direct sunlight. Once opened, reseal the bag or tip into an airtight container to keep it crunchy.'
where name = 'Kokoro Egba' and details_status = 'researched';

update public.products set
  ingredients = 'Typical recipe: wheat flour, sugar, milk or milk powder, butter or margarine, egg, nutmeg, baking powder, fried in vegetable oil.',
  allergens = 'Contains (typical recipe): Cereals containing gluten (wheat), Milk, Eggs. May also contain: Soya (margarine or soya oil), Peanuts (if fried in groundnut oil).',
  storage_guidance = 'Keep sealed in a cool, dry place out of direct sunlight. Once opened, reseal the bag or tip into an airtight container to keep it crunchy.'
where name = 'Milky Chin Chin' and details_status = 'researched';

update public.products set
  ingredients = 'Typical recipe: wheat flour, sugar, butter or margarine, often milk and egg, rolled thin and fried in vegetable oil into crisp flakes.',
  allergens = 'Contains (typical recipe): Cereals containing gluten (wheat), Milk. May also contain: Eggs, Soya (margarine or soya oil), Peanuts (if fried in groundnut oil).',
  storage_guidance = 'Keep sealed in a cool, dry place out of direct sunlight. Once opened, reseal the bag or tip into an airtight container to keep it crunchy.'
where name = 'Flakes Chin Chin' and details_status = 'researched';

update public.products set
  ingredients = 'Typical recipe: grated coconut, cassava (tapioca) starch, sugar and a pinch of nutmeg, rolled thin and baked crisp. Some versions use wheat flour and butter.',
  allergens = 'Contains (typical recipe): coconut (not one of the 14 UK allergens). May also contain: Cereals containing gluten (if wheat flour is used), Milk (butter), Eggs.',
  storage_guidance = 'Keep sealed in a cool, dry place out of direct sunlight. Once opened, reseal the bag or tip into an airtight container to keep it crunchy.'
where name = 'Gurundi' and details_status = 'researched';

update public.products set
  ingredients = 'Typical recipe: groundnuts (peanuts) and salt, dry-roasted.',
  allergens = 'Contains: Peanuts. May also contain: other allergens if coated or flavoured.',
  storage_guidance = 'Keep sealed in a cool, dry place out of direct sunlight. Once opened, reseal the bag or tip into an airtight container to keep it crunchy.'
where name = 'Peanuts' and details_status = 'researched';

update public.products set
  ingredients = 'Typical recipe: roasted groundnuts (peanuts), sugar and a pinch of salt, caramelised into a groundnut toffee, rolled thin and cut into long diamond shapes.',
  allergens = 'Contains (typical recipe): Peanuts. May also contain: Milk or Soya (if butter or margarine is added).',
  storage_guidance = 'Keep in a cool, dry place out of direct sunlight. Once opened, store in an airtight container, and in warm weather keep away from heat so it doesn''t soften or stick.'
where name = 'Sisi Pelebe' and details_status = 'researched';

update public.products set
  ingredients = 'Typical recipe: coconut milk or cream and sugar, cooked slowly to a dark caramel, with a pinch of salt. Some versions add butter or milk.',
  allergens = 'Contains (typical recipe): coconut (not one of the 14 UK allergens). May also contain: Milk (if butter or milk is added), Sulphites (some brown sugars or syrups).',
  storage_guidance = 'Keep in a cool, dry place out of direct sunlight. Once opened, store in an airtight container, and in warm weather keep away from heat so it doesn''t soften or stick.'
where name = 'Baba Dudu' and details_status = 'researched';

update public.products set
  ingredients = 'Typical recipe: grated coconut and sugar, cooked until it sets, sometimes with food colouring. Some versions add milk or condensed milk.',
  allergens = 'Contains (typical recipe): coconut (not one of the 14 UK allergens). May also contain: Milk (if milk or condensed milk is added), Sulphites (if preserved desiccated coconut is used).',
  storage_guidance = 'Keep in a cool, dry place out of direct sunlight. Once opened, store in an airtight container, and in warm weather keep away from heat so it doesn''t soften or stick.'
where name = 'Coconut Candy' and details_status = 'researched';

update public.products set
  ingredients = 'Typical recipe: roasted groundnuts (peanuts) and roasted maize or millet flour, sugar, ginger, chilli pepper and salt, pounded and pressed into balls.',
  allergens = 'Contains (typical recipe): Peanuts. May also contain: Cereals containing gluten (if wheat or barley is used), Sesame (sometimes added).',
  storage_guidance = 'Keep in an airtight container in a cool, dry place out of direct sunlight. Best eaten fresh: it can dry out once opened.'
where name = 'Dankwa' and details_status = 'researched';

update public.products set
  ingredients = 'Typical recipe: sweetened condensed milk, sugar and butter; sometimes milk powder or vanilla.',
  allergens = 'Contains (typical recipe): Milk. May also contain: Soya (margarine or emulsifiers).',
  storage_guidance = 'Keep in a cool, dry place out of direct sunlight. Once opened, store in an airtight container, and in warm weather keep away from heat so it doesn''t soften or stick.'
where name = 'Condensed Milk Sweet' and details_status = 'researched';
