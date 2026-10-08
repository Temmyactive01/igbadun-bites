import images from "@/lib/generated/product-images.json";

// Products renamed to the owner's spelling (Oct 2026): old key → new key. Lookups go
// through this, so photos and product links work under either name, and old shared
// links (#product/baba-dudu) still open the product.
export const RENAMED_PRODUCT_KEYS: Record<string, string> = {
  "baba-dudu": "babadudu", // Baba Dudu → Babadudu
  "milky-chin-chin": "chin-chin", // Milky Chin Chin → Chin Chin
  dankwa: "donkwa", // Dankwa → Donkwa
};

// The current key for a key that may be from an old product name
export const currentProductKey = (key: string): string => RENAMED_PRODUCT_KEYS[key] ?? key;

// Turns a product name into its photo file name (without extension) and link:
// "Chin Chin" → "chin-chin". See docs/content-guide.md.
export function productImageKey(name: string): string {
  return currentProductKey(
    name
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "") // drop accents
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}

// Public URL of the product's photo, or null if there isn't one yet
// (the card then shows its line-art icon instead).
export function productImageSrc(name: string): string | null {
  const file = (images as Record<string, string>)[productImageKey(name)];
  return file ? `/images/products/${file}` : null;
}
