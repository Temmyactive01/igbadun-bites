# Igbadun Bites — website completion audit

**Audited 9 October 2026** against commit `0731bee` (branch `fix/menu-snack-count`), the live
site at <https://igbadun-bites.netlify.app>, and the live Supabase catalogue.

**Scope decisions this audit assumes** (set by Temitope, 9 Oct 2026):

- The **mobile app is paused** — nothing here touches it.
- A **custom domain** (and therefore real email delivery) is deliberately **later**.
- An **owner admin panel** is deliberately **later**. Everything below is designed to work
  without one: where the owner must change data (sold-out, order status, prices), that happens
  in the Supabase table editor. Each workflow says so where it applies.

Status words used throughout: **Done** · **Partly** · **Missing**.

---

## Headline: four things block taking real orders

Everything else on this list is improvement. These four are the difference between a good
demo and a shop that can legally and safely take money from a UK customer.

1. **No product's allergens are confirmed.** All 14 products in the live database are
   `details_status = 'researched'` — researched typical recipes, labelled on the site as "not
   yet confirmed by our supplier". For food sold in the UK this has to be true of *our*
   product. Needs the owner, not code.
2. **Prices cannot actually be charged in pounds.** The shop quotes GBP; Paystack charges a
   naira equivalent at a made-up fixed rate (£1 = ₦2,000). In test mode that's harmless. Live,
   it means the site quotes a price it cannot honour. See §3.
3. **Delivery is sold without a price.** Checkout takes payment for items only, shows
   "Delivery — confirmed after ordering", and the delivery fee is £0 in the database. The
   customer pays, then gets asked for more money. UK consumer rules expect delivery charges to
   be clear *before* the order is placed.
4. **Almost no legal footing.** There's a privacy page and nothing else: no terms, no
   refunds/returns policy, no trading name or address anywhere on the site.

A fifth, operational: **the owner is never told an order came in.** The only email that exists
goes to the customer, and it goes through Mailgun's sandbox domain, which only delivers to
pre-authorised addresses. In practice nobody is reliably being emailed today.

---

## 1. Shopping

| Item | Status | Note |
|---|---|---|
| Product pages | **Missing** | There are no product routes. A product opens a panel at `#product/chin-chin` on the homepage — good UX, but a hash never reaches the server, so there is no page to title, describe, preview or index. This is the single highest-leverage gap on the list; §7 depends on it. |
| Categories | **Done** | Three chapters (Chips · Crunchy snacks · Traditional treats & sweets) from the `category` column, with a sticky chapter index and live per-chapter counts. |
| Search / filter | **Missing — recommend skipping** | At 14 products across 3 chapters, with the chapter index already pinned to the top of the shop, search would add a control nobody needs. Revisit past ~30 products. |
| Sold-out handling | **Partly** | `available = false` renders a "Sold out" badge, desaturates the photo, replaces the add button, and `/api/checkout` re-checks it server-side and refuses the line. What's missing is the next step for the customer — no "tell me when it's back", no nudge to WhatsApp. Also: the owner can only set this in the Supabase table editor. |
| Back-in-stock requests | **Missing** | Nothing. |
| Related products | **Missing** | The product panel ends at the add button; there's no "others in this chapter". |
| Coming-soon products | **Done** | `coming_soon = true` shows a product with photo and name, no price, no pack size, not purchasable. Currently no product uses it (Kokoro was switched to buyable). |
| Stand-in photography honesty | **Done** | 7 of 14 products have the owner's own photos. The rest use licensed stand-ins, labelled as such in the alt text and on `/credits`, never passed off as our product. |

## 2. Basket and checkout

| Item | Status | Note |
|---|---|---|
| Basket | **Done** | Bottom sheet on phones / side panel on desktop, quantity steppers, sticky basket bar. Signed out it lives in `localStorage`; signed in it syncs to the `cart_items` table live across devices. |
| Guest checkout | **Missing** | Checkout *requires* Google sign-in — `/api/checkout` returns 401 without a session, and the order row has a `not null` foreign key to `auth.users`. Google-only is also a real exclusion: plenty of customers don't have or won't use a Google account. |
| Delivery vs pickup | **Done** | Radio choice; address fields appear only for delivery; stored on the order and shown on the confirmation, email and order history. |
| Delivery fees | **Missing** | `DELIVERY_FEE_GBP = 0` is a placeholder (`app/api/checkout/route.ts:16`). Customer is charged items only and told the fee comes later. See Headline #3. |
| Delivery areas | **Missing** | Copy says "delivery across the UK". No area logic, no postcode-to-zone check, no "we don't deliver there yet". |
| UK address & postcode checks | **Partly** | A sound postcode *format* regex, `required` fields, correct `autocomplete` attributes, server-side re-validation. No address lookup (so typos sail through), and format-valid ≠ real. |
| Order notes | **Missing** | No field. No column. For a food business ("leave with neighbour", "it's a gift", "no peanuts near it") this gets asked for constantly. |
| Minimum order | **Missing** | None. A single £3.50 bag of peanuts can be ordered for delivery. Caps exist at the other end (20 per line, 30 lines). |
| Payment fails | **Done** | Returns to `/checkout?payment=failed` with "you haven't been charged, your basket is still here"; the order is marked `failed` only after the server re-verifies with Paystack. |
| Payment abandoned | **Partly** | Safe but untidy: the order stays `pending` forever, is correctly hidden from order history, and nothing is ever charged. No recovery email, no cleanup job, so `pending` rows accumulate. |
| Price integrity | **Done** | The browser only ever sends product ids and quantities; every price is re-read from the database server-side. Editing the basket in devtools cannot change what anyone pays. |

## 3. Payments — what is actually happening

### What happens today

Prices are GBP everywhere a customer looks. At checkout the server converts the GBP total to
naira at a **fixed demo rate of £1 = ₦2,000** (`lib/payment-config.ts`) and asks Paystack to
charge that. The Paystack key is `sk_test_…`, so **no money moves at all** — the card is
simulated. Your £5 → ₦10,000 test matches this exactly. Checkout, the confirmation page and the
email all label it as a test payment at a demo rate, which is the honest thing to do.

### What a UK customer would actually be charged if this went live unchanged

- Paystack cannot charge GBP on this account (GBP returns "No active channel"). So the card
  would be charged **in naira**.
- Their bank converts naira → sterling at the card network rate on the day, then usually adds a
  **non-sterling transaction fee** — commonly around 2.75–3%, though it's 0% on some cards
  (Monzo, Starling, Chase).
- **The £5 price is not what leaves their account.** The demo rate is frozen at ₦2,000/£; the
  real rate moves. At ₦2,200/£ that ₦10,000 charge costs them about £4.55; at ₦1,800/£ it costs
  about £5.56 — plus the foreign fee. The site would be quoting a price it cannot honour.
- **On their statement** they'd see a sterling figure that doesn't match the price they agreed,
  the naira original, a non-sterling fee (sometimes a separate line, labelled something like
  "NON-STG TRANS FEE"), and a merchant descriptor pointing at Paystack / a Nigerian business —
  not "Igbadun Bites, UK".
- **Expect declines.** UK banks treat naira card payments to a Nigerian processor as higher
  risk: heavier 3-D Secure, fraud alerts, outright declines.
- **Settlement:** Paystack pays out in naira to a Nigerian bank account. Money from UK customers
  lands in Nigeria, in naira, needing a conversion to come back.

In short: for a UK brand selling to UK customers, charging in naira is wrong on price accuracy,
on trust, and on where the money ends up.

### Can Paystack just turn GBP on?

On the evidence, **no.** Paystack processes NGN, GHS, ZAR, KES and USD, and merchants must be
registered in Nigeria, Ghana, South Africa, Kenya or Côte d'Ivoire. GBP isn't on the list and a
UK business isn't an eligible merchant. Worth one email to Paystack support to get that in
writing, but plan for no.

### Options for proper GBP payments

1. **Stripe — recommended.** GBP-native, accepts UK sole traders and companies, settles GBP into
   a UK bank account, handles 3-D Secure / SCA. It maps 1:1 onto what's already built: hosted
   checkout page → redirect back → server-side verification → webhook. Needs a UK bank account
   and ID verification. **Does not need a custom domain**, so it isn't blocked by the deferred
   domain. Check Stripe's current UK rates directly.
2. **SumUp Online / Square.** Easier onboarding for a small food business, hosted checkout, less
   API flexibility. Fine if Stripe verification is a problem.
3. **PayPal (incl. Pay in 3).** High trust with UK shoppers, higher fees, clunkier flow. Good as
   a *second* button, not the only one.
4. **Interim with no card provider.** Keep the basket and order flow; take payment on collection
   or by bank transfer and mark the order paid by hand. Honest and legal, loses online
   conversion. Only worth it if 1–3 are all blocked.

**Recommendation:** Stripe, swapped in behind the existing `initializeTransaction` /
`confirmPayment` seam — the architecture already isolates the provider well, so this is a
contained change, not a rewrite. Whatever happens, never go live on the naira conversion;
`lib/paystack.ts` already refuses to run it with a live key, which is exactly right.

*Nothing in the Paystack or Supabase settings was changed during this audit — reads only.*

| Item | Status | Note |
|---|---|---|
| Hosted payment page (no card data on our server) | **Done** | Paystack's hosted checkout only. |
| Server-side verification | **Done** | An order becomes `paid` in exactly one place, and only after asking Paystack's API directly — never on a client callback. |
| Amount + currency re-checked | **Done** | A mismatch between what was charged and what this order expected marks it `failed`. Genuinely good. |
| GBP charging | **Missing** | See above. |
| Refunds | **Missing** | No refund path in code or policy. |

## 4. Customer account

| Item | Status | Note |
|---|---|---|
| My orders | **Done** | `/orders` lists paid orders newest-first with lines, totals, fulfilment and date. Protected by RLS plus an explicit `user_id` filter. |
| Order status | **Partly** | The database only knows `pending` / `paid` / `failed`. A customer can see "Paid" and nothing after that — no "being made", "dispatched", "ready for pickup", no tracking, no cancelled/refunded. |
| Reorder | **Missing** | No "order this again". Cheap to add and the most-used feature in repeat food buying. |
| Account details | **Missing** | No account page at all. Name and email come from Google and can't be viewed or corrected; the phone number is captured per order and never shown back. |
| Delete account and data (UK GDPR) | **Missing** | The privacy page says "ask us and we'll delete it" — a manual promise with no mechanism. Under UK GDPR that's thin: there's no self-service erasure, no data export, and no stated retention period. Also note orders must be *kept* for tax purposes, so "delete everything" needs a defined answer (anonymise the order, delete the account). |
| Sign-in | **Partly** | Google OAuth works cleanly, with a proper error page and a `safeNextPath` guard against open redirects. Google-only is the limitation — see guest checkout. |

## 5. Emails

Code can be written now; **delivery** waits for the domain. Today `MAILGUN_DOMAIN` is the
sandbox (`sandbox….mailgun.org`), which only delivers to addresses explicitly authorised in
Mailgun — so even the one email that exists is not reliably arriving.

| Email | Status | Note |
|---|---|---|
| Order confirmed (customer) | **Done** | Genuinely good: branded, table-based HTML plus a plain-text alternative, HTML-escaped customer input, sent exactly once even if the webhook and the redirect race, and a send failure can never undo a successful payment. |
| **New order (owner)** | **Missing** | The owner gets nothing. Highest-value missing email by far — without it the shop depends on someone watching the Supabase dashboard. |
| Dispatched / on its way | **Missing** | Needs the order statuses from §4 first. |
| Ready for pickup | **Missing** | Same. |
| Payment failed / basket abandoned | **Missing** | Nothing recovers an abandoned checkout. |
| Order cancelled / refunded | **Missing** | No status for it, so no email. |
| Back-in-stock notification | **Missing** | Depends on §1. |
| Account deleted / data export | **Missing** | Depends on §4. |
| Sender identity | **Partly** | `orders@<mailgun-sandbox>` today. Needs the real domain, SPF/DKIM, and a reply-to the owner actually reads. Deferred with the domain — but write the templates now. |

## 6. Legal and trust

| Item | Status | Note |
|---|---|---|
| Business name & contact details | **Partly** | Phone, WhatsApp and email are in the footer. Missing: the trading/legal name, a geographic trading address, and — if it's a limited company — company number, place of registration and registered office. UK rules expect a consumer to be able to find who they're buying from and where. Needs owner info and a decision about which address to publish. |
| Privacy policy | **Partly** | Exists, is readable and honest, and accurately describes what the site does. For UK GDPR Article 13 it's missing: who the controller legally is, the lawful basis for each use, how long data is kept, international transfers, and the right to complain to the ICO. |
| Terms & conditions | **Missing** | No page. |
| Refunds / returns (food rules) | **Missing** | No page, no policy. This needs care rather than a template: the 14-day distance-selling cancellation right generally does **not** apply to perishable food, but these are shelf-stable packaged snacks, so the honest answer is probably "yes for unopened packs, no for opened or perishable". Worth 20 minutes of proper advice before publishing. Owner decision. |
| Cookie notice | **Not needed today — will be** | The site sets only the Supabase sign-in cookie and a `localStorage` basket, both strictly necessary for a service the customer asked for. No analytics, no advertising, no trackers — so no banner is required right now. The moment analytics is added (§8) this changes, unless a cookieless tool is chosen. |
| Allergen information | **Partly — and this is the blocker** | The hard part is built and built well: ingredients, allergens and storage for every product, an unmissable "typical recipe — not yet confirmed" warning, a "don't rely on this if you have an allergy" line, and a WhatsApp route to ask. But **all 14 products are still `researched`; none is confirmed.** Owner info, per product, against her own recipes or supplier labels. `docs/owner/ingredient-allergen-checklist.md` is already written for exactly this. |
| Food business registration | **Unknown** | Selling food in the UK requires registration with the local council. Not a website task, but the site should probably say it. Owner question. |
| VAT | **Unknown** | Most food is zero-rated, but confectionery and savoury snacks — i.e. most of this catalogue — are standard-rated. Only matters above the registration threshold. Owner question for her accountant; don't guess. |
| Honest photography | **Done** | Stand-ins are labelled as stand-ins, credited on `/credits`, never presented as our product. |

## 7. Discovery and sharing

| Item | Status | Note |
|---|---|---|
| Page titles & descriptions | **Partly** | Every *route* has a sensible title; the homepage has a good description. But products aren't routes (§1), so there are **no per-product titles or descriptions** — 14 products share one homepage title. |
| Link previews (WhatsApp / Instagram) | **Missing** | No Open Graph or Twitter Card tags at all, and no OG image. Pasting any link — including a `#product/…` product link — into WhatsApp gives a bare, image-less preview of the homepage. For a business that will be shared mostly in WhatsApp, this is the most visible gap after product pages. |
| Sitemap | **Missing** | `/sitemap.xml` → 404. Next 16 supports `app/sitemap.ts`. |
| Robots | **Missing** | `/robots.txt` → 404. Next 16 supports `app/robots.ts`. |
| Canonical URLs | **Missing** | No canonical tag anywhere. Should be driven off an env var so the deferred domain switch is a one-line change. |
| Product structured data | **Missing** | No JSON-LD of any kind. No `Product`/`Offer` (so no price or availability in Google results), no `Organization`/`LocalBusiness`. Depends on product pages. |
| 404 page | **Partly** | The status code is correct (404, verified live) and the site header and footer wrap it, but the body is still Next's default "404: This page could not be found." — off-brand, no way back to the shop. |
| Shareable product links | **Partly** | `#product/chin-chin` is a real, shareable, back-button-aware link with a "Copy link" button, and old links survive product renames. Clever work — but a hash is invisible to servers and crawlers, so it buys nothing for previews or search. |

## 8. Reach and growth

| Item | Status | Note |
|---|---|---|
| Social links | **Partly** | The plumbing is done — fill in `lib/contact.ts` and the footer shows them; empty, it says "coming soon". All three are currently empty. Owner info. |
| Visitor analytics | **Missing** | Nothing. No idea how many people visit or where they drop out. Pick a cookieless tool (Plausible, Fathom, Umami, or Netlify's own server-side analytics) to keep §6's "no banner needed" true. |
| Add to home screen (installable) | **Missing** | No web app manifest, no icons beyond the favicon, no install prompt. |
| Discount codes | **Missing** | Nothing. Note it must be applied and validated **server-side** in `/api/checkout`, same as prices. |
| Gift bundles | **Missing** | The footer and the Occasions section both advertise "custom snack packs for events, parties & gifts", but there is no bundle product and no way to buy one. |
| Party / bulk order enquiry form | **Missing** | Advertised in two places; the only route is WhatsApp. `/api/checkout` even tells large orders to "message us". |

## 9. Quality and safety

### Measured, not guessed

Lighthouse 12.8.2, mobile preset, run against the live site on 9 Oct 2026:

| Category | Score |
|---|---|
| Performance | **56** |
| Accessibility | **100** |
| Best practices | **96** |
| SEO | **100** |

FCP 2.1 s · LCP 3.0 s · **CLS 0** · Speed Index 7.0 s · total page weight 772 KiB.

| Item | Status | Note |
|---|---|---|
| Page speed (mobile) | **Partly** | 56 is the weak score. Three real causes, in order: (a) **server response 1,190 ms** — every page is fully dynamic, because the header reads the auth cookie and the shop queries Supabase on every request, so nothing is cached and every visitor waits on the database; (b) a **~206 KB HTML document**, most of it inline React payload, which then has to be parsed and hydrated on the main thread; (c) ~57 KB of oversized images and ~7 KB of legacy JS transforms. Next 16's Cache Components (`cacheComponents: true` + `use cache` / `cacheLife` on `getProducts`) is the right lever — cache the catalogue, keep the auth-dependent header dynamic. CLS of 0 is excellent and worth not breaking. *Caveat: the reported Total Blocking Time (~14 s) is inflated by 4× CPU throttling on a loaded machine — treat it as directional and re-run via PageSpeed Insights for field-representative numbers.* |
| Accessibility | ~~**Done, with one real exception**~~ → **Done** (workflow 1) | 100/100, and that's not luck: skip link, focus trap and scroll lock shared across all three dialogs, 44 px targets, `prefers-reduced-motion` honoured, live regions on basket changes, labelled landmarks. The exception was an axe check Lighthouse scores at **weight 0**, so it never dented the 100: **label-in-name** (WCAG 2.5.3, Level A). **Corrected 10 Oct:** this audit first reported 2 offending nodes — that was a truncated JSON read on my side. A full local run found **15**: the header basket button, and all 14 "Details & allergens" triggers (visible "Details **&** allergens" vs an aria-label reading "Details **and** allergens for X"). The sticky phone basket bar had the same bug, invisible to the audit because it only renders once the basket has items. Fixed in workflow 1 by appending screen-reader text to the visible label instead of overriding it with `aria-label`; verified 15 → 0 offending nodes. |
| Console errors | ~~**Partly**~~ → **Done** (workflow 1) | Every production page load logged a recoverable React hydration mismatch (**error #418**). **Corrected 10 Oct — not our bug, and not the cause this audit first guessed.** It is not the inline `js`-class script. **Netlify injects a marketing HTML comment into `<head>`** on production deploys, immediately after the charset meta; React counts that foreign node as a hydration mismatch. Proven by bisection: a local production build is clean, and the identical build serving Netlify's exact comment reproduces #418. Deploy previews are unaffected, which is why it never showed in review. Fixed in workflow 1 by removing the comment in the existing head script before hydration; re-verified against a local simulation of the injection. If Netlify ever stops injecting it, that code can be deleted. |
| Paystack webhook verification | **Done** | HMAC-SHA512 over the raw body, compared with `timingSafeEqual` behind a length guard, unsigned requests rejected 401, and the payload is *still* not trusted — it only triggers a fresh server-side verify. Textbook. **Unverified:** whether the webhook URL is actually configured in the Paystack dashboard. Worth checking. |
| Rate limiting | **Missing** | None anywhere. `/api/checkout` is the one that matters: a signed-in user can create unlimited `pending` orders and Paystack transactions in a loop. Bounded by requiring sign-in, so it's low risk, not no risk. |
| Database access rules | **Done** | RLS on all four tables. Products are world-readable only when `visible`; orders and order items are readable only by their owner; `cart_items` is per-user read/write; **no table grants insert or update on orders to any browser role** — orders are written exclusively by the service-role key after payment verification. The service-role key is fenced behind `server-only`. This is the strongest part of the codebase. |
| Error monitoring | **Missing** | `console.error` into Netlify's function logs, which nobody reads. A failed confirmation email, a Paystack mismatch or a webhook rejection currently happens in silence. |
| Secrets hygiene | **Done** | Netlify secret scanning is on with narrow, documented exceptions; only genuinely public keys are exempted; server secrets stay fully scanned. |
| Tests | **Missing** | No test suite. `npm run check:db` is the nearest thing, and it's stale — it asserts 13 products and there are now 14, so it fails. |

---

## Build order

Small workflows, one at a time, each testable on its own. **Needs** marks what has to come from
outside the code: **OWNER** = information only the business owner has, **YOU** = a decision from
Temitope.

### Start these conversations today — they have the longest lead time

Status as of 10 Oct 2026: **all six sent to the owner**; the payment provider is decided.

| | Ask | Needs | Status | Why it's first |
|---|---|---|---|---|
| A | **Confirm allergens + ingredients for all 14 products** against her own recipes or supplier labels. `docs/owner/ingredient-allergen-checklist.md` is ready to send. | OWNER | Sent, awaiting reply | Blocks real orders outright. Also the one item no amount of code can unblock. |
| B | **Delivery: what does it cost, and where?** Flat fee, by weight, by zone? Free over a threshold? Anywhere excluded? | OWNER | Sent, awaiting reply | Blocks workflow 3 and Headline #3. An interim safeguard is being chosen separately so no customer is ever billed after paying. |
| C | **Payment provider decision** — Stripe, or something else. | YOU | **Decided: Stripe.** Owner is creating the account; workflow 4 starts on Temitope's go-ahead | Blocks workflow 4; account verification takes days. |
| D | **Business identity** — trading name, legal structure, the address to publish, council food registration, VAT position. | OWNER | Sent, awaiting reply | Blocks workflow 5. |
| E | **Refunds/returns position** for opened vs unopened packs. | OWNER + YOU | Sent, awaiting reply | Blocks workflow 5. Get advice rather than copying a template. |
| F | **Social handles**, if they exist yet. | OWNER | Sent, awaiting reply | Unblocks part of workflow 17 (5 minutes of work). |

### Phase 1 — Quick wins, no owner input, do them while you wait

Progress: ☐ not started · ◐ in review · ☑ merged.

| # | | Workflow | Test it by |
|---|---|---|---|
| 1 | ◐ | **Quality sweep.** Fix label-in-name on the basket, basket-bar and "Details & allergens" buttons; fix the React #418 hydration error (cause: Netlify's injected head comment, not our script); custom branded 404 with a route back to the shop; fix `check:db` to stop asserting 13 products; delete the unused 2.7 MB `public/images/hero-placeholder.png`. | Re-run Lighthouse (a11y stays 100, no console errors); visit a bad URL; `npm run check:db` passes. |
| 2 | ☐ | **robots.txt + sitemap.xml + canonical URLs.** `app/robots.ts` and `app/sitemap.ts`, with the base URL from `NEXT_PUBLIC_SITE_URL` so the deferred domain is a one-line switch. | Both URLs return 200 with correct content; canonical tag in the page source. |

### Phase 2 — Make it a shop that can take real money

| # | Workflow | Needs | Test it by |
|---|---|---|---|
| 3 | **Delivery fees and areas, priced before payment.** Replace the £0 placeholder with the real rule, show it in the checkout summary, include it in the total, and refuse or warn on out-of-area postcodes. | B (OWNER) | Checkout total = items + the quoted fee; the order row and the email both show it; an out-of-area postcode is handled. |
| 4 | **GBP payments.** Swap the provider behind `initializeTransaction` / `confirmPayment`. Keep the hosted-page → verify → webhook shape and the amount/currency re-check; keep the naira guard until the old path is gone. | C (YOU) | A test-mode payment end-to-end: order is `paid`, amount matches in GBP, webhook verifies, confirmation email fires. |
| 5 | **Legal and trust pages.** Terms, refunds/returns, business identity in the footer, and a privacy policy upgraded for UK GDPR (controller, lawful basis, retention, ICO). | D, E (OWNER + YOU) | Every page reachable from the footer; a stranger can tell who they're buying from and what happens if an order is wrong. |
| 6 | **Owner gets told about orders.** An owner notification email on every verified payment. Write it now; it only delivers once the domain lands — until then point it at an address authorised in the Mailgun sandbox. | — | Place a test order, confirm the owner's copy is sent (Mailgun logs). |
| 7 | **Land the allergen confirmations.** Set `details_status = 'confirmed'` per product as answers arrive; the "not yet confirmed" warning disappears per product on its own. | A (OWNER) | A confirmed product shows no warning; an unconfirmed one still does. |

### Phase 3 — Be findable and shareable

| # | Workflow | Needs | Test it by |
|---|---|---|---|
| 8 | **Real product pages.** `/snacks/[slug]` server-rendered, with `generateMetadata` for a per-product title, description and canonical. Keep the sheet for quick looks; make the route the shareable, indexable truth, and keep `#product/…` links redirecting to it. | YOU (URL shape; whether the sheet stays) | Every product has its own URL, its own title in the tab, and works with JavaScript disabled. |
| 9 | **Link previews.** OG and Twitter tags site-wide, a brand OG image for the homepage, and a generated per-product image showing the photo, name and price. | — | Paste a product link into WhatsApp and into Facebook's debugger; image, name and price all appear. |
| 10 | **Product structured data.** `Product` + `Offer` (price, currency, availability) per product page, plus `Organization`/`LocalBusiness` site-wide. Then add products to the sitemap. | 8 | Google's Rich Results Test passes with no warnings. |
| 11 | **Performance pass.** Turn on Cache Components; `use cache` + `cacheLife` on `getProducts`; keep the auth-dependent header dynamic; resize the oversized images. | — | PageSpeed Insights mobile before/after; server response well under 1 s; CLS still 0. |

### Phase 4 — Serve customers properly after they've paid

| # | Workflow | Needs | Test it by |
|---|---|---|---|
| 12 | **Order status beyond "paid".** Extend the status vocabulary (being made → dispatched / ready for pickup → completed, plus cancelled and refunded), show it as a timeline in `/orders`. The owner changes status in the Supabase table editor until an admin panel exists — so keep the values few and obvious. | YOU (the vocabulary) | Change a status in Supabase; the customer's order page reflects it. |
| 13 | **Status emails.** Dispatched, ready for pickup, cancelled/refunded — triggered by the status change from workflow 12. | 12 | Flip a status, the right email is generated. |
| 14 | **Account basics + UK GDPR.** An account page (name, email, phone), data export, and self-service account deletion that anonymises orders rather than destroying records needed for tax. | YOU (retention policy) | Delete a test account: the login is gone, orders are anonymised, the export file is complete. |
| 15 | **Reorder.** "Order this again" on a past order, refilling the basket with what's still available. | — | Reorder a past order containing one now-unavailable item; the rest load, the missing one is explained. |
| 16 | **Guest checkout.** Email-address checkout with no account, keeping the server-side repricing and letting a guest order be claimed later by signing in with the same email. | YOU | Complete a purchase in a fresh private window without signing in. |

### Phase 5 — Growth, in rough value order

| # | Workflow | Needs | Note |
|---|---|---|---|
| 17 | **Analytics + social links.** Cookieless analytics (keeps "no cookie banner" true), plus the handles in `lib/contact.ts`. | F (OWNER), YOU (tool) | Smallest effort, biggest information gain. Worth pulling earlier than its number suggests. |
| 18 | **Party / bulk enquiry form.** Already advertised twice on the site with no way to act on it. Emails the owner; stores the enquiry. | — | Currently a dead end for the highest-value orders. |
| 19 | **Order notes + minimum order.** One field, one threshold, both validated server-side. | OWNER (threshold) | Small, frequently asked for. |
| 20 | **Back-in-stock requests.** Email capture on sold-out products, a table to hold them, a notification when `available` flips back. | — | Depends on nothing; needs no admin panel. |
| 21 | **Gift bundles.** Real bundle products — also advertised already and unbuyable. | OWNER (contents, prices) | |
| 22 | **Related products.** "Others in this chapter" at the foot of the product page. | 8 | Cheap once product pages exist. |
| 23 | **Discount codes.** Validated and applied server-side in `/api/checkout`, never client-side. | YOU (rules) | |
| 24 | **Installable (add to home screen).** Manifest, icons, offline shell. | — | Lower value while the mobile app is only paused, not cancelled. |
| 25 | **Error monitoring + rate limiting.** Sentry (or similar) on the payment and email paths, and a limit on `/api/checkout`. | YOU (tool) | Do this before any real marketing push, not after. |

### Deliberately not building

- **Search / filter** — 14 products and a chapter index. Revisit past ~30.
- **Cookie banner** — not required while there are no non-essential cookies. Re-decide with workflow 17.
- **Custom domain, real email delivery, owner admin panel** — out of scope by your decision. Workflows 6, 12 and 13 are written to work without them.

---

## Appendix — how this was checked

- **Code**: full read of `app/`, `components/`, `lib/`, `supabase/` and config at `0731bee`.
- **Live site**: status codes for 9 routes; homepage HTML inspected for metadata, structured
  data, image handling and rendered product data.
- **Database**: read-only queries against the live Supabase project — 14 products with their
  flags and `details_status`, plus order history (all `NGN`, all `delivery_fee_gbp = 0`).
  Nothing was written.
- **Lighthouse** 12.8.2, mobile preset, headless Edge, simulated throttling.
- **Static review**: a 343-check front-end audit of the live homepage. Its three "critical"
  non-HTTPS findings were **false positives** — the only `http://` strings on the page are SVG
  XML namespaces — and are excluded above.
- **Settings**: Paystack and Supabase settings were read, never modified. Paystack key confirmed
  as test mode; Mailgun confirmed as the sandbox domain.
- **Not verified**: whether the Paystack webhook URL is configured in the dashboard; whether the
  owner's address is in Mailgun's authorised recipients; real-world (field) performance data.
