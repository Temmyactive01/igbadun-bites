import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

// Display order for the shop (matches prd.md). Any category not listed here
// is shown after these, so a new category added in Supabase still appears.
export const CATEGORY_ORDER = ["Chips", "Crunchy snacks", "Traditional treats and sweets"];

export type CategoryGroup = { category: string; products: Product[] };

export async function getProducts(): Promise<{ products: Product[]; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").order("name");
  if (error) {
    console.error("Failed to load products:", error.message);
    return { products: [], error: error.message };
  }
  return { products: data as Product[], error: null };
}

export function groupByCategory(products: Product[]): CategoryGroup[] {
  const rank = (c: string) => {
    const i = CATEGORY_ORDER.indexOf(c);
    return i === -1 ? CATEGORY_ORDER.length : i;
  };
  const groups = new Map<string, Product[]>();
  for (const p of products) groups.set(p.category, [...(groups.get(p.category) ?? []), p]);
  return [...groups.entries()]
    .map(([category, products]) => ({ category, products }))
    .sort((a, b) => rank(a.category) - rank(b.category) || a.category.localeCompare(b.category));
}

export function categoryAnchor(category: string) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
