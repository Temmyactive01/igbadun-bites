// Runs automatically before `npm run dev` and `npm run build` (see package.json).
// Lists the photos in public/images/products/ so product cards know which
// products have a photo. (On Netlify the running site can't look inside
// public/, so this has to happen at build time.)
//
// Writes lib/generated/product-images.json, e.g. { "milky-chin-chin": "milky-chin-chin.jpg" }
// That file is generated — don't edit it, and it isn't committed to git.
import { mkdirSync, readdirSync, writeFileSync, existsSync } from "node:fs";

const DIR = "public/images/products";
const OUT_DIR = "lib/generated";
const ALLOWED = /\.(jpe?g|png|webp)$/i;

const files = existsSync(DIR) ? readdirSync(DIR).filter((f) => ALLOWED.test(f)) : [];
const map = {};
for (const file of files.sort()) {
  const key = file.replace(ALLOWED, "").toLowerCase();
  if (map[key]) console.warn(`[product images] Two photos for "${key}": using ${map[key]}, ignoring ${file}`);
  else map[key] = file;
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(`${OUT_DIR}/product-images.json`, JSON.stringify(map, null, 2) + "\n");
console.log(`[product images] ${files.length} photo(s) found in ${DIR}`);
