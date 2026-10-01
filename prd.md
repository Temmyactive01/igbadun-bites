# Igbadun Bites — Product Requirements (Course Submission Build)

## Context
This is for HNG15 Lesson 2: "Build a website for a shop. Add a checkout page. Persist
everything in a database using Supabase/Neon. Send confirmation emails using Mailgun.
Do Google auth using Google Cloud Console." Deadline: Friday 11:59 PM WAT.

The real business brief (Igbadun Bites, UK-based Nigerian snack brand) is much bigger
than this — nine planned pages, catering quote forms, gift enquiries, reviews, etc.
**We are NOT building all of that by Friday.** We are building the smallest real,
working, good-looking slice that satisfies the course requirement and gives the
business owner something genuinely usable to build on afterward.

## MVP scope (must ship by Friday)
1. **Home / Shop page** — brand intro (tagline, short description), product grid
   pulling from the real Igbadun Bites catalog (see Products below).
2. **Product cards** — photo placeholder, name, category, pack size, price, short
   description, "Add to cart."
3. **Cart** — simple drawer or page, quantities, remove item, subtotal.
4. **Checkout page** — delivery/collection choice (simple toggle for now), order
   summary, Paystack payment (test mode now, live once business verification clears).
5. **Google sign-in** — required before checkout (via Supabase Auth + Google OAuth).
6. **Order persistence** — on successful payment (server-verified via Paystack),
   write the order + line items to Supabase.
7. **Confirmation email** — sent via Mailgun after a verified successful payment,
   using the Mailgun sandbox domain until the business owner's real domain is
   verified.
8. **Basic footer** — tagline, "Bringing Back Memories, One Bite at a Time," social
   placeholders, note that full site (About, Party Catering, Gifts, FAQs, Policies,
   Contact) is "coming soon" — do not fake these pages, just don't build them yet.
   **Confirmed contact details (from the business owner):**
   - Call/WhatsApp: 07709870134
   - Email: igbadun_bites@yahoo.com
   - Services: pickup & delivery, plus custom snack packs for events, parties and
     gifting (enquiries by phone/WhatsApp/email until the enquiry form is built in
     Phase 2)

## Explicitly deferred to Phase 2 (after Friday)
- About Us (founder story) — needs real content from business owner anyway
- Party Catering quotation form
- Gifts & Event Packs page
- Delivery & Collection detail page
- FAQs
- Contact Us page with form
- Policies page
- Customer reviews
- Custom snack-pack enquiry form

These aren't cut because they don't matter — they matter a lot for the real
business — but they need content (founder story, delivery areas, policies) we
don't have yet, and trying to fake them would look worse than not having them.

## Product catalog (placeholder prices — CONFIRM WITH BUSINESS OWNER)
All prices are realistic placeholders in GBP, clearly flagged for the business
owner to correct before real launch.

### Chips
- Cocoyam Chips — £4.50 (150g)
- Plantain Chips — £4.00 (150g)

### Crunchy snacks
- Akara Ogbomosho — £5.00 (200g)
- Kokoro Egba — £4.50 (200g)
- Milky Chin Chin — £5.50 (250g)
- Flakes Chin Chin — £5.00 (250g)
- Gurundi — £4.00 (150g)
- Peanuts — £3.50 (200g)

### Traditional treats and sweets
- Sisi Pelebe — £4.50 (150g)
- Baba Dudu — £4.00 (150g)
- Coconut Candy — £4.50 (150g)
- Dankwa — £4.00 (150g)
- Condensed Milk Sweet — £4.50 (150g)

Each product should still have fields for: ingredients, allergen info, storage
guidance, availability — even if placeholder text for now ("Ingredients: TBC with
supplier" etc.) — so the data model is ready for real content later, not rebuilt.

## Open items to collect from the business owner (not blockers for Friday)
- Real product photos + logo
- Confirmed prices and pack sizes
- Confirm/correct the product descriptions for Gurundi, Kokoro Egba, Dankwa, and
  Sisi Pelebe — the current ones are placeholder guesses, not the real copy
- Founder story / business location
- Social handles (phone and email now confirmed — see footer, MVP item 8)
- Delivery areas, charges, collection arrangements
- Payment/booking/cancellation terms
- Preferred domain name
