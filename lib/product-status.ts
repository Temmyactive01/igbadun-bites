import type { Product } from "./types";

// Product states used by server and client components alike — keep this file free of
// React hooks and other client-only code.

// A product announced before its price and details exist (see supabase/008_coming_soon.sql)
export const isComingSoon = (product: Product): boolean => product.coming_soon === true;

// How many of these products are on sale — coming-soon products aren't counted
export const countForSale = (products: Product[]): number => products.filter((p) => !isComingSoon(p)).length;
