# Content guide — product photos & social links

How to add real product photos and social media links to the Igbadun Bites
site yourself. No code changes needed — just add files / fill in addresses,
then publish (see [Publishing your change](#publishing-your-change)).

---

## 1. Product photos

### Where they go

```
public/images/products/
```

Put each photo directly in that folder (no sub-folders).

### File names

The file name is the **product's name in lowercase, with hyphens instead of
spaces**, plus `.jpg`. It must match the product name in Supabase exactly
(apart from capitals and spaces).

| Product (as in Supabase) | Photo file name |
|---|---|
| Akara Ogbomosho | `akara-ogbomosho.jpg` |
| Babadudu | `babadudu.jpg` ✓ added |
| Chin Chin | `chin-chin.jpg` ✓ added |
| Coconut Candy | `coconut-candy.jpg` |
| Cocoyam Chips | `cocoyam-chips.jpg` ✓ added |
| Condensed Milk Sweet | `condensed-milk-sweet.jpg` |
| Donkwa | `donkwa.jpg` ✓ added |
| Flakes Chin Chin | `flakes-chin-chin.jpg` |
| Gurundi | `gurundi.jpg` |
| Kokoro | `kokoro.jpg` — ready in `pending-photos/` (not in git); move it here when Kokoro launches |
| Kokoro Egba | `kokoro-egba.jpg` ✓ added |
| Peanuts | `peanuts.jpg` |
| Plantain Chips | `plantain-chips.jpg` |
| Sisi Pelebe | `sisi-pelebe.jpg` ✓ added |

✓ added = the owner's own photo is in place (October 2026).

**New product added in Supabase later?** Same rule: "Chin Chin Gift Box" →
`chin-chin-gift-box.jpg`. Any character that isn't a letter or number becomes
a hyphen (so "Kuli-Kuli & Co" → `kuli-kuli-co.jpg`).

**Renamed a product in Supabase?** Rename its photo file to match, or the card
will go back to showing the icon.

### Photo format

- **Shape:** landscape, **4:3** — ideally **1200 × 900 pixels**.
- **Subject centred:** on phones the photo area is narrower, so the left and
  right edges get cropped. Keep the snack in the middle.
- **File type:** `.jpg` recommended. (`.jpeg`, `.png` and `.webp` also work.)
- **File size:** aim for **under 300 KB** each so the shop loads quickly on
  mobile data. The site resizes photos automatically, but smaller originals
  still help.
- **One photo per product.** If there are two (e.g. `peanuts.jpg` and
  `peanuts.png`), only one is used.

### What happens

- Product **has** a photo → its card shows the photo.
- Product **doesn't** have one yet → its card keeps the current pattern + icon.

So you can add photos one at a time — there's no need to wait until all 13 are
ready.

### If a photo doesn't show up

1. Check the file name against the table above — a single typo, extra space or
   capital letter in the wrong place stops it matching. `Peanuts.JPG` is fine;
   `peanut.jpg` or `peanuts .jpg` is not.
2. Check it's directly inside `public/images/products/`, not in a sub-folder.
3. Make sure you've published the change (below). Photos only appear after a
   new build, so a file saved on your computer won't show on the live site
   until it's pushed. Locally, restart `npm run dev`.

---

## 2. Social media links

### Where they go

File: **`lib/contact.ts`** — these three lines:

```ts
  instagram: "",
  tiktok: "",
  facebook: "",
```

### Format

Paste the **full web address**, starting with `https://`, between the quotes:

```ts
  instagram: "https://www.instagram.com/igbadunbites",
  tiktok: "https://www.tiktok.com/@igbadunbites",
  facebook: "https://www.facebook.com/igbadunbites",
```

(Those handles are examples — use the real ones.)

- Use the full address, **not** just `@igbadunbites`.
- Keep the quotes and the comma at the end of each line.
- Don't have one of them yet? Leave it as `""` — the footer simply won't show
  that platform.

### What happens in the footer

- **All three empty** → "Instagram · TikTok · Facebook — coming soon"
- **Any filled in** → only those appear, as clickable links that open in a new tab

Want a different platform (e.g. X or YouTube)? That needs a small code change
— ask for it.

---

## Publishing your change

The live site is built from GitHub, so changes go live once they're pushed.
Netlify then rebuilds automatically (about 2–4 minutes).

**Option A — VS Code (no typing commands):**

1. Open the **Source Control** panel (the branch icon on the left, or
   `Ctrl+Shift+G`).
2. You'll see your new photos / edited file listed. Type a short message in
   the box at the top, e.g. `Add product photos`.
3. Click **Commit**, then **Sync Changes** (or **Push**).

**Option B — terminal:**

```
git add public/images/products lib/contact.ts
git commit -m "Add product photos and social links"
git push
```

Then check https://igbadun-bites.netlify.app after a few minutes. To preview
locally first, run `npm run dev` and open http://localhost:3000.

---

## Under the hood (for whoever maintains the code)

- `scripts/list-product-images.mjs` runs automatically before `npm run dev` and
  `npm run build`. It lists the files in `public/images/products/` and writes
  `lib/generated/product-images.json` (generated, git-ignored). This is needed
  because on Netlify the running site can't look inside `public/`. It also writes
  the same list to `public/product-images.json` (generated, git-ignored), which
  the mobile app reads — so a photo added here shows in the app too.
- `lib/product-images.ts` turns a product name into its file name and returns
  the photo URL (or `null`). `components/ProductCard.tsx` shows the photo with
  `next/image` when there is one, otherwise the icon.
- Social links: `CONTACT` and `SOCIAL_LINKS` in `lib/contact.ts`, rendered in
  `components/SiteFooter.tsx`.
