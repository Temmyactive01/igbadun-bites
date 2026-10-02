# Igbadun Bites — Style Guide

> **Status (2 Oct 2026):** this guide describes the **v2 creative direction**
> (premium editorial redesign). It is being implemented phase by phase — see
> `docs/redesign/phase-0-audit.md` for the full audit, tokens and homepage plan.
> Until a phase ships, that part of the live site still uses the **v1 style**
> summarised at the bottom of this file. When the two disagree for new work,
> follow v2.

## Brand tone
Warm, nostalgic, celebratory — and now also **premium and assured**.
"Bringing Back Memories, One Bite at a Time." This is about reconnecting with home,
sharing with family, joy. Copy is personal and sensory, never corporate, never
cutesy. Nigerian heritage, nostalgia, craftsmanship and modern British life,
expressed through food, typography, materials and storytelling — **not**
stereotypical "African website" tropes.

**Copy honesty:** never invent founder/business history, awards, sourcing claims or
reviews. Until the owner supplies the real story, brand copy speaks only about the
snacks, the memories they evoke, and services that actually exist.

## Creative direction (v2)
*A printed food magazine about Nigerian childhood snacks, published in London.*
Premium, distinctive, editorial, cinematic, warm, culturally authentic, contemporary.
It should sit comfortably beside premium international food and lifestyle brands.

Must **not** feel like: a template, generic ecommerce, a Tailwind component
showcase, a SaaS site, or a Shopify clone. Must **not** sacrifice usability.

### Art direction
- Oversized typography, editorial cropping, asymmetric composition, generous
  negative space, deliberate visual rhythm, layering and overlap.
- Every section is composed for its content — not content dropped into identical
  containers.
- Content breaks the grid on purpose: bleeding images, overhanging headlines,
  numerals in the margin.
- Depth from layering and colour blocks, **not** drop shadows. Small radii (4–8px)
  on images; no rounded "cards" for layout.

### Typography
- **Display / editorial:** Fraunces, used light-to-regular at large sizes with high
  optical size, the soft axis, and italics for emphasis (terracotta italic for the
  key word). Heavy/extrabold display is retired.
- **UI / body:** Instrument Sans (replacing Inter); tabular numerals for prices.
- No third typeface. Hierarchy through scale, weight, case and tracking.
- Type scale tokens: `display-xl`, `display-l`, `display-m`, `title`, `body-l`,
  `body`, `small`, `eyebrow`, `numeral` (values in the Phase 0 doc).

### Colour (roles, not decoration)
| Name | Hex | Role |
|---|---|---|
| Oat | `#F2E9DA` | Page canvas |
| Off-white | `#FBF7F0` | Raised surfaces, sheets, inputs |
| Cocoa | `#2B1A12` | Primary text; inverse sections |
| Cocoa soft | `#5E4536` | Secondary text |
| Terracotta | `#A84A24` | Accent: emphasis, links, key actions on light |
| Plantain gold | `#D9A23E` | Celebration/premium; on cocoa, or gold button with cocoa text |
| Leaf | `#4E6A48` | Availability, success, quiet accents |

- **Contrast rules (measured):** cocoa/oat 13.9:1, cocoa soft/oat 7.3:1,
  terracotta/oat 4.75:1, leaf/oat 5.0:1, gold/cocoa 7.3:1.
  **Plantain gold is never text on light backgrounds (1.9:1).**
- One accent per composition. Colour always means something — **no rotating
  "rainbow" card colours.** At most two cocoa (inverse) sections per page.
- Avoid pure white and pure black. No "ecommerce blue" anywhere.

### Photography
- Real product photos (`public/images/products/`, see `docs/content-guide.md`)
  always take priority.
- Licensed stock (Unsplash/Pexels licences) for **atmosphere only**: ingredients,
  textures, tabletop and sharing scenes, hands, natural light. Kept in
  `public/images/editorial/` with source + photographer in `CREDITS.md`.
- **Product tiles (owner decision, 2 Oct 2026):** until real product photography exists,
  tiles show **stand-in photos of each snack** (generic, not the owner's product) so they
  are recognisable. Conditions: licensed for commercial use only (Creative Commons /
  Pexels — never copied from other websites), no visible brands or labels, credited
  publicly on /credits, and the shop states clearly that they are stand-ins. Where no
  licensed snack photo exists, an ingredient photo stands in. Data: lib/stand-in-images.ts.
- **Photo direction (client, 2 Oct 2026):** authentic Nigerian / West African feel —
  market stalls, hawkers' trays, groundnuts roasting, food shared from one tray — over
  generic or export-catalogue studio shots, for stand-ins and atmosphere alike (hero
  excepted). Wikimedia Commons (Wiki Loves Africa entries by Nigerian photographers) is
  the best source; avoid identifiable faces where a hands/scene shot works.
- Warm grade, natural light, tight crops; 4:5 portrait for products, 3:2 / 21:9 for
  editorial.

### Pattern & ornament
Adire/mudcloth-inspired geometry may appear **once**, deliberately (e.g. one band or
the footer) — abstract, low contrast, never literal or costume-like.

### Motion
Slow in, quick to respond; motion explains, never decorates. CSS + IntersectionObserver
only. Hero intro once per visit; one-time section reveals; image scale inside a still
frame on hover; add-to-basket morphs into a quantity stepper; sheets slide from
bottom (mobile) / side (desktop). Everything reduced to fades or off under
`prefers-reduced-motion`. No scroll-jacking, nothing looping.

### Product presentation
Image-first tiles: image, name, short sensory description, price, add action. No
heavy borders, shadows or badges. Categories are magazine **chapters** (01 / 02 / 03)
with brand copy. Varied scales: featured product, larger + smaller tiles, horizontal
rails on phones. Ingredients, allergens and storage must be reachable from every
product (detail sheet).

### Responsive
Mobile-first and **art-directed separately** (different crops, rails instead of grids,
menu sheet, sticky bottom basket bar) — not desktop stacked. Patterns chosen to carry
over to a future mobile app. Touch targets ≥ 44px; primary actions within thumb reach.

### Accessibility (non-negotiable)
WCAG 2.2 AA contrast, semantic HTML landmarks and headings, full keyboard access,
visible focus (terracotta ring, gold on cocoa), meaningful alt text, reduced-motion
support, no information conveyed by colour alone.

## What to avoid
- Template/starter-kit looks, component-library showcases, SaaS styling.
- Generic ecommerce clichés: cart-icon badges, default blue links, "SALE" stickers.
- Rainbow colour rotation, heavy shadows, everything-rounded cards.
- Literal "African print" clipart or costume-like decoration.
- Stand-in photos without the on-page note that they are stand-ins, or without credits.

---

## v1 style (currently live until each redesign phase ships)
Cream `#FAF3E7` background, deep brown `#3B2416` text, gold `#C9972D` accents,
forest `#2F4A32`, terracotta `#B5542A`; Fraunces (bold) headings + Inter body;
rounded cards with warm shadows rotating gold/forest/terracotta; line-art snack
icons; adire-inspired textures and a diamond divider. Superseded by v2 above.
