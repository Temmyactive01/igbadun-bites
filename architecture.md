# Igbadun Bites — Architecture & Constraints

## Stack
- **Framework:** Next.js (App Router) — needed because this app has real secrets
  (payment keys, auth secrets) that must stay server-side, unlike the earlier
  plain-HTML todo app.
- **Database + Auth:** Supabase (Postgres + built-in Google OAuth support).
- **Payments:** Paystack — test mode for all development; confirm whether this
  Paystack account supports GBP settlement before going live. If it doesn't,
  flag this back to the business owner before launch, don't silently default to NGN.
  - **Currency finding (2026-10-01):** with Card enabled in test mode, the account
    takes **NGN only**. GBP is recognised but returns "No active channel"; USD is
    not supported. **Decision for the course submission:** shop prices and order
    totals stay in GBP; in test mode only, Paystack is charged the naira equivalent
    at a fixed demo rate (£1 = ₦2,000), clearly labelled at checkout. Config lives in
    `lib/payment-config.ts`, and the conversion is refused if a live key is used.
    **Before live launch:** get GBP enabled by Paystack, or move to a GBP-native
    provider (e.g. Stripe). Flagged to the business owner in prd.md.
- **Transactional email:** Mailgun — sandbox domain for now (can only send to
  pre-authorized test addresses), real domain verification pending business
  owner's domain.
- **Deployment:** Netlify (already set up and familiar from the earlier todo app).

## Accounts already created (credentials held by Temitope, not committed to git)
- Paystack (test mode) — account name "FastTrack"
- Supabase project: "Igbadun bites" — EU West (Ireland) region
- Google Cloud project: "Igbadun bites" — OAuth client created, consent screen in
  Testing mode (needs Publish once we have a live domain for the App domain fields)
- Mailgun account — sandbox domain active, custom domain setup pending

## Environment variables needed (put real values in `.env.local`, never commit, never
paste into chat again — screenshot sharing during setup was fine for a private
session, but going forward treat all of these as secrets)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
PAYSTACK_SECRET_KEY=
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
MAILGUN_API_KEY=
MAILGUN_DOMAIN=
```

## Non-negotiable security rules
1. Card data never touches our server — use Paystack's hosted
   Checkout/Inline/Popup only.
2. A payment is only marked "paid" in Supabase after our server verifies it
   directly with Paystack's API (or via webhook) — never trust a client-side
   "success" callback alone.
3. All the keys above live in Netlify's environment variable settings in
   production, and `.env.local` (gitignored) in development. Never in client-side
   code, never in a committed file.
4. Supabase Row Level Security (RLS) is ON — orders table should only be
   readable/writable through server-side logic using the service role key, not
   directly from the browser with the anon key.

## Data model (minimum for MVP)
- `products` — id, name, category, description, pack_size, price_gbp, ingredients,
  allergens, storage_guidance, available (boolean)
- `orders` — id, user_id (from Supabase Auth), status (pending/paid/failed),
  paystack_reference, total_gbp, created_at
- `order_items` — id, order_id, product_id, quantity, unit_price_gbp

## Build order (so each step is independently testable)
1. Scaffold Next.js app, Tailwind, brand theme (colors/fonts from style.md)
2. Supabase client setup + products table seeded with the MVP catalog
3. Shop page rendering products from Supabase
4. Google sign-in via Supabase Auth
5. Cart (client-side state is fine for MVP)
6. Checkout page + Paystack integration + server-side verification route
7. On verified payment: write order to Supabase + trigger Mailgun confirmation email
8. Deploy to Netlify, add the live URL to Google OAuth's App domain fields, Publish
   the OAuth consent screen
9. End-to-end test with a real test-mode payment before calling it done
