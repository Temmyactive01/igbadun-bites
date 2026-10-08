import type { Product } from "./types";

// Product states used by server and client components alike — keep this file free of
// React hooks and other client-only code.

// A product announced before its price and details exist (see supabase/008_coming_soon.sql)
export const isComingSoon = (product: Product): boolean => product.coming_soon === true;
