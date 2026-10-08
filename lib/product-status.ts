import type { Product } from "./types";

// Product states used by server and client components alike — keep this file free of
// React hooks and other client-only code.

// A product announced before its price and details exist (see supabase/008_coming_soon.sql)
export const isComingSoon = (product: Product): boolean => product.coming_soon === true;

// How many of these products are on sale — coming-soon products aren't counted
export const countForSale = (products: Product[]): number => products.filter((p) => !isComingSoon(p)).length;

const NUMBER_WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"];

// 14 → "Fourteen" (digits above twenty)
export const numberWord = (n: number): string => NUMBER_WORDS[n] ?? String(n);

// "Fourteen snacks, three chapters" — the phone menu's note under "Shop", from the live list
export function shopSummary(products: Product[]): string {
  const chapters = new Set(products.map((p) => p.category)).size;
  const snacks = countForSale(products);
  return `${numberWord(snacks)} ${snacks === 1 ? "snack" : "snacks"}, ${numberWord(chapters).toLowerCase()} ${chapters === 1 ? "chapter" : "chapters"}`;
}
