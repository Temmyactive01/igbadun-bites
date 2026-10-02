# Igbadun Bites redesign — Phase 0: audit & direction

Status: **proposal, awaiting approval.** Nothing in this document has been implemented.
Written 2 October 2026 against commit `878c3e7` (+ uncommitted content-guide work).

---

## 0. Before anything: timing and safety

- **The course deadline is today** (Friday 11:59 PM WAT, per prd.md). The current site
  works end to end. A redesign touches every customer-facing screen, so it must not
  be merged before the submission is safe.
- **Recommendation:** finish Step 9 (live end-to-end test), submit, then tag the
  submitted state (`v1-course-submission`). Do the redesign on a `redesign` branch.
  Netlify builds a **deploy preview** for each branch push, so every phase can be
  reviewed on a real URL without touching the live site, and merged to `main`
  only when approved.
- Business logic is out of scope for the redesign: Supabase, auth, cart store,
  checkout/payment routes, order emails and the orders query keep their behaviour.
  The redesign changes how things look and are composed, not what they do.

---

## 1. Current visual problems

1. **Rainbow card colours.** Cards rotate gold / forest / terracotta purely by
   position. The colour carries no meaning (category, product, mood) — it reads as
   decoration, which is exactly what the brief rules out.
2. **Placeholder art reads as clip-art.** Line-art icons on cream medallions over a
   basket-weave texture are tidy but generic; three icons cover 13 products, so a
   page of them feels repetitive rather than appetising.
3. **The "template" shell is still visible:** rounded-28px cards, drop shadows,
   uniform padding, pill buttons everywhere, a 3-up grid repeated per category. It
   is a well-customised component library, not a composed page.
4. **Typography has one register.** Fraunces is used almost entirely at heavy
   weights; the bold hero and bold section heads compete. There's little contrast
   in weight, tracking or scale between editorial moments and UI. Inter is a sound
   but very common UI choice.
5. **No imagery at all.** The hero is type on a grid texture. For a food brand the
   absence of appetite appeal is the single biggest gap.
6. **Pattern overuse.** The adire-inspired texture, the grid and the diamond
   divider appear in hero, cards and footer at once — the motif loses its meaning.
7. **Footer is a contact list on brown**, not a closing moment.
8. **Header** is functional but anonymous: wordmark + buttons, no relationship to
   the hero, and (since the overflow fix) a second row on phones that costs
   vertical space.

## 2. Current UX problems

1. **Ingredients, allergens and storage are never shown.** The data model has the
   fields (placeholder text for now) but no screen displays them. For food sold in
   the UK this is a real gap — customers with allergies have nowhere to look.
   *Highest-priority UX fix.*
2. **No product detail view.** Descriptions are clamped to two lines; there's no way
   to read more, see pack size context, or view a larger image.
3. **Long scroll on phones.** 13 cards in a single column (~4,500px). Category chips
   jump to sections but don't stay visible.
4. **Add-to-basket feedback is easy to miss** — a 1.6s text change; the basket count
   is in the header, often off-screen.
5. **No persistent basket access on mobile** after scrolling (header isn't sticky).
6. **Checkout and orders are visually a different site** from the homepage — plain
   forms in rounded cards.
7. **Sold-out state** desaturates the card but the reason/next step (e.g. "message us")
   isn't offered.
8. Minor: "Basket" pill, "Sign in to check out" row and category chips all compete
   for attention on small screens.

## 3. Keep as-is (logic and/or markup worth preserving)

| Area | Files | Why |
|---|---|---|
| Data & auth | `lib/supabase/*`, `proxy.ts`, `app/auth/*`, `lib/safe-redirect.ts`, `lib/site-origin.ts` | Working, tested, security-sensitive |
| Payments & orders | `app/api/*`, `app/checkout/verify`, `lib/orders.ts`, `lib/paystack.ts`, `lib/payment-config.ts`, `lib/mailgun.ts`, `lib/emails/*` | Server-verified, idempotent; no visual surface (email aside) |
| Basket state | `lib/cart-store.ts`, `lib/money.ts` | Solid store; the redesign only changes its UI |
| Product data | `lib/products.ts` (`getProducts`, `groupByCategory`) | Reused by the new discovery layout |
| Photos | `lib/product-images.ts`, `scripts/list-product-images.mjs`, `public/images/products/` | Exactly the "drop in real photos later" hook the brief needs |
| Motion primitive | `components/Reveal.tsx` | Lightweight IntersectionObserver reveal; will be extended, not replaced |
| Contact | `lib/contact.ts` | Single source for phone/WhatsApp/email/socials |
| Sign-in behaviour | `components/SignInButton.tsx` (logic) | Restyle only |

## 4. Needs full redesign

| Component / page | Current | Direction |
|---|---|---|
| Hero (`app/page.tsx`) | Type over grid texture | Cinematic image-led statement (§7) |
| Shop section (`app/page.tsx`) | Category chips + sticky heading + 3-up grid | Chapters, featured product, rails (§7) |
| `ProductCard` | Rainbow block, icon, shadowed rounded card | Image-first, borderless, morphing add action (§5, §6) |
| `AddToCartButton` | Text swap | Morphs into quantity stepper (§8) |
| `SiteHeader` | Static bar, 2 rows on phone | Overlay-on-hero, compact sticky state, mobile basket bar |
| `SiteFooter` | Contact list | Closing composition (§7) |
| `CartDrawer` | Side drawer everywhere | Side panel desktop, bottom sheet mobile; restyle |
| Checkout / success / orders / privacy / error pages | Rounded cards | Reskin to the new system (structure mostly kept) |
| `Divider`, `Textures`, `SnackIcons` | Used everywhere | Retire from main UI; at most one pattern used once, deliberately |
| New: product detail sheet | — | Description, ingredients, allergens, storage, pack size |
| New: brand story section | — | Editorial storytelling (§7) |

---

## 5. Proposed visual direction

**One-line idea:** *a printed food magazine about Nigerian childhood snacks, published
in London.* Warm paper, confident type, generous space, photography doing the
heavy lifting, colour used like ink — sparingly and on purpose.

### Typography
- **Display / editorial: Fraunces** (already loaded) — but used very differently:
  light and regular weights at very large sizes, high optical size, the *soft*
  axis, and italics for emphasis. Elegant and food-warm rather than heavy.
  The current extrabold look goes.
- **UI / body: Instrument Sans** (Google Fonts, free) replacing Inter. Slightly
  narrower and more characterful, excellent at small sizes, tabular numerals for
  prices.
- No third typeface. Contrast comes from scale, weight, case and tracking.

### Colour (contrast measured against WCAG 2.2)

| Name | Hex | Role | Notes |
|---|---|---|---|
| Oat | `#F2E9DA` | Page canvas | Replaces current cream |
| Off-white | `#FBF7F0` | Raised surfaces, sheets, inputs | |
| Cocoa | `#2B1A12` | Primary text, inverse sections | 13.9:1 on oat |
| Cocoa soft | `#5E4536` | Secondary text | 7.3:1 on oat |
| Terracotta | `#A84A24` | Accent: links, italic emphasis, key CTAs on light | 4.75:1 on oat — AA body text |
| Plantain gold | `#D9A23E` | Highlights **on cocoa**, gold buttons with cocoa text | 7.3:1 with cocoa; **1.9:1 on oat — never as text on light** |
| Leaf | `#4E6A48` | Availability, success, quiet accents | 5.0:1 on oat |

Rules: one accent per composition; colour marks meaning (terracotta = action/emphasis,
leaf = good news, gold = celebration/premium), never rotation. Inverse (cocoa) sections
create rhythm — at most two per page.

### Photography
- **Real product photos** (from `public/images/products/`) always win.
- **Licensed stock (Unsplash / Pexels licences, free for commercial use)** for
  *atmosphere*: ingredients (plantain, coconut, groundnuts, cocoyam), textures,
  tabletop and sharing scenes, hands, light. Stored in `public/images/editorial/`
  with a `CREDITS.md` noting source and photographer.
- **Honesty rule:** stock must not be presented as Igbadun Bites' actual product
  (e.g. another brand's chin chin on the chin chin card). UK advertising rules treat
  that as misleading. So product cards without a real photo use an **ingredient
  portrait** (e.g. raw plantain for plantain chips) or a refined typographic
  "label" — never a lookalike product shot.
- Treatment: warm grade, natural light, tight editorial crops, consistent aspect
  ratios (4:5 portrait for products, 3:2 / 21:9 for editorial).

### Layout
- 12-column grid on desktop (max 1440px, 24px gutters), 4-column on phones (16px
  margins). Content deliberately breaks the grid: images bleed, headlines overhang
  columns, numerals sit in the margin.
- Corners: small (4–8px) on images, none on sections; pills only for compact controls.
- Shadows: essentially gone. Depth from layering, overlap and colour blocks.

---

## 6. Proposed design system (tokens)

### Type scale (fluid, `clamp()` between 360px and 1440px viewports)

| Token | Size | Line height | Tracking | Use |
|---|---|---|---|---|
| `display-xl` | 56 → 176px | 0.88 | -0.04em | Hero statement |
| `display-l` | 44 → 104px | 0.92 | -0.03em | Chapter titles, closing statement |
| `display-m` | 36 → 64px | 1.0 | -0.02em | Section heads, featured product name |
| `title` | 24 → 32px | 1.15 | -0.01em | Product names (serif) |
| `body-l` | 18 → 21px | 1.55 | 0 | Editorial paragraphs |
| `body` | 16px | 1.55 | 0 | UI text |
| `small` | 14px | 1.45 | 0.005em | Meta, pack sizes |
| `eyebrow` | 12px | 1.2 | 0.22em, uppercase, 600 | Labels, chapter kickers |
| `numeral` | 72 → 200px | 0.8 | -0.05em | Chapter numbers (Fraunces, light) |

### Spacing (4px base)
`1`=4 · `2`=8 · `3`=12 · `4`=16 · `6`=24 · `8`=32 · `12`=48 · `16`=64 · `24`=96 · `32`=128 · `40`=160
Section rhythm: `clamp(96px, 12vw, 192px)` vertical padding; tight internal spacing
inside components so the space *between* sections reads as intentional.

### Colour roles
`canvas` oat · `surface` off-white · `ink` cocoa · `ink-muted` cocoa soft ·
`accent` terracotta · `celebrate` plantain gold · `positive` leaf ·
`inverse-canvas` cocoa · `inverse-ink` oat · `focus` terracotta 2px ring + 3px offset
(gold on inverse).

### Motion
`duration-press` 120ms · `duration-hover` 240ms · `duration-reveal` 800ms ·
`ease-out-soft` `cubic-bezier(0.22, 1, 0.36, 1)` · `ease-in-out` for sheets.

### Components (new system)
Button (primary gold-on-cocoa / secondary outline / text link) · ProductTile (sizes
S/M/L/feature) · Chapter opener · Rail (scroll-snap) · Sheet (bottom on mobile, side on
desktop) · Quantity stepper · Eyebrow/Numeral/Caption text styles · Field (checkout).

---

## 7. Proposed homepage composition

1. **Header** — transparent over the hero, wordmark left, `Shop · Our story` and
   basket right; becomes a slim oat bar on scroll. Phones: wordmark + basket only; sign
   in / orders move into a menu sheet. Sticky mobile basket bar appears once the
   basket has items.
2. **Hero (100svh)** — asymmetric: a tall, editorially cropped image (warm macro of
   snacks being shared / hands / table) occupying ~7 columns and bleeding off the
   right edge; the statement *"Bringing back / memories, / one bite at a time."* set
   in `display-xl`, overlapping the image edge, with *memories* in terracotta italic.
   Small caption block (eyebrow + one line + "Shop the snacks" CTA) anchored bottom
   left. Phones: image fills the top ~62svh, headline overlaps its lower edge on an
   oat band, CTA within thumb reach.
3. **Manifesto line** — a single oversized italic sentence across the page, generous
   space around it, e.g. *"The taste of Saturday parties, school gates and an
   auntie's kitchen — packed up and posted across the UK."*
4. **Featured product** — one product given a full composition: large portrait
   image, name in `display-m`, sensory description, price, add action. Rotatable
   later (e.g. "this month's favourite").
5. **Chapters 01 / 02 / 03** — each opens with a chapter spread: huge light numeral
   in the margin, chapter title (*Chips*, *Crunchy snacks*, *Traditional treats &
   sweets*), two lines of brand copy, one atmosphere image. Products follow in a
   varied rhythm — one larger tile + smaller tiles on desktop; a horizontal
   scroll-snap rail on phones (with a visible next-card peek and "4 of 6" counter).
   A slim sticky chapter index (01 · 02 · 03) replaces the chip row.
6. **Brand story** — an editorial spread on cocoa: an image pair, a pull quote, and
   2–3 short paragraphs. Uses only true, non-specific copy until the owner provides
   the founder story (prd.md open item) — the layout is built for that story.
7. **Occasions** — "Parties, gifts & celebrations": custom snack packs (a real
   service) with a WhatsApp CTA. Image-led, not a form.
8. **Practical strip** — pickup & delivery, secure payment, order history; small,
   calm, honest.
9. **Footer** — a closing statement in `display-l` (*"Bring back a memory."*), shop
   CTA, then contact, links (privacy, orders), socials (from `lib/contact.ts`), and
   the oversized wordmark as the final graphic element.

Product detail: tapping a product opens a **sheet** (no page reload, shareable URL via
`?product=`) with larger image, full description, ingredients, **allergens**, storage
and pack size.

---

## 8. Animation & motion strategy

Principles: slow in, quick to respond; motion explains (where something went), never
decorates for its own sake. CSS + IntersectionObserver only — no animation library.

- **Hero intro (once per visit):** image reveals with a soft clip-path wipe (~900ms);
  headline lines rise through masks with 90ms stagger; caption fades last.
- **Section entrances:** existing `Reveal` extended with variants (rise, fade, mask);
  triggered once, ~600–800ms, never re-animating on scroll back.
- **Images:** hover/focus scales the image inside its frame (1.04 over 700ms); the
  frame stays still, so layout never shifts.
- **Add to basket:** the button morphs into an inline quantity stepper (width +
  content cross-fade, ~280ms); a small dot travels to the basket and the count ticks
  up. Second tap adjusts quantity in place — fewer trips to the drawer.
- **Sheets:** slide from bottom (mobile) / right (desktop), backdrop fade, focus trap.
- **Subtle depth:** hero image drifts slightly on scroll using CSS scroll-driven
  animation (`animation-timeline: view()`), ignored by browsers without support.
- **Accessibility:** all of it disabled or reduced to fades under
  `prefers-reduced-motion`; nothing auto-plays indefinitely; no scroll-jacking.

## 9. Responsive strategy

- **Mobile-first and art-directed, not stacked:** different crops (portrait hero image
  on phones, landscape on desktop via `<picture>`/`sizes`), different composition
  (rails instead of grids), different navigation (menu sheet + bottom basket bar).
- **Breakpoints:** 360 base · 640 · 1024 · 1280 · 1440 max. Fluid type/spacing in
  between, so there's no "awkward tablet" size.
- **Touch targets** ≥ 44px; primary actions in the lower half of the screen on phones.
- **App-ready patterns:** bottom sheets, rails, sticky action bar, stepper — the same
  components map directly onto a future React Native / mobile app.
- **Verification each phase:** automated overflow/contrast checks at 320–1440px,
  keyboard-only walkthrough, reduced-motion check, Lighthouse accessibility ≥ 95.

---

## 10. Implementation phases (each reviewed on a Netlify deploy preview)

1. **Foundations + Homepage** — tokens, fonts, header, hero, manifesto, story,
   occasions (with temporary product section).
2. **Product discovery** — chapters, featured product, rails, chapter index.
3. **Product cards & detail sheet** — new tile, morphing add action, allergen sheet.
4. **Cart, checkout, orders** — reskin drawer/sheet, forms, success, history.
5. **Footer + polish** — closing composition, final motion/accessibility pass.

### Decisions needed from you
1. Approve the direction (fonts, palette, honesty rule for stock imagery).
2. Branch + deploy-preview workflow, starting **after** the course submission.
3. Brand copy: I'll draft manifesto/chapter/story copy for your review; anything about
   the founder or business history waits for the owner's real story.
