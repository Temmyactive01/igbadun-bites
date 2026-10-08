// Which product's detail panel is open (Phase 3). One panel is mounted for the whole
// shop (components/shop/ProductSheet.tsx); tiles and the featured product open it.
// The product stays set while the panel animates closed, so its content doesn't vanish.

import { useSyncExternalStore } from "react";
import type { Product } from "./types";

type SheetState = { product: Product | null; tint: string; open: boolean };

const CLOSED: SheetState = { product: null, tint: "", open: false };
let state: SheetState = CLOSED;
const listeners = new Set<() => void>();

function set(next: SheetState) {
  state = next;
  listeners.forEach((l) => l());
}

export const productSheet = {
  open(product: Product, tint: string) {
    set({ product, tint, open: true });
  },
  close() {
    set({ ...state, open: false });
  },
};

export function useProductSheet() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => CLOSED
  );
}

// The text to show for an ingredients / allergens / storage field, or null while it
// still holds the database placeholder ("Ingredients: TBC with supplier").
export function detailText(value: string | null | undefined): string | null {
  const text = (value ?? "").trim();
  if (!text || /\bTBC\b/i.test(text)) return null;
  return text.replace(/^(ingredients|allergens?|allergen info|storage)\s*:\s*/i, "");
}

// A product announced before its price and details exist (see supabase/008_coming_soon.sql)
export const isComingSoon = (product: Product): boolean => product.coming_soon === true;

// Safe default: only an explicit "confirmed" (owner sign-off) counts as confirmed.
export function isConfirmed(product: Product): boolean {
  return product.details_status === "confirmed";
}
