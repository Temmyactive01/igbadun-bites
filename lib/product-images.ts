import images from "@/lib/generated/product-images.json";

// Turns a product name into its photo file name (without extension):
// "Milky Chin Chin" → "milky-chin-chin". See docs/content-guide.md.
export function productImageKey(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // drop accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Public URL of the product's photo, or null if there isn't one yet
// (the card then shows its line-art icon instead).
export function productImageSrc(name: string): string | null {
  const file = (images as Record<string, string>)[productImageKey(name)];
  return file ? `/images/products/${file}` : null;
}
