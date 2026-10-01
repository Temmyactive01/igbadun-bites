// Client-side basket, saved in the visitor's browser (localStorage) so it
// survives refreshes. Components read it with the useCart() hook.
//
// IMPORTANT: prices stored here are for DISPLAY only. At checkout the server
// re-reads every price from Supabase — never trust prices sent from the browser.

import { useSyncExternalStore } from "react";

export type CartItem = {
  productId: string;
  name: string;
  packSize: string;
  category: string;
  pricePence: number; // whole pence avoids floating-point rounding errors (4.5 * 3 etc.)
  quantity: number;
};

type CartState = { items: CartItem[]; open: boolean };

export const MAX_QUANTITY = 20;
const STORAGE_KEY = "igbadun-basket-v1";
const EMPTY: CartState = { items: [], open: false };

let state: CartState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function readSavedItems(): CartItem[] {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(saved) ? saved.filter(isValidItem) : [];
  } catch {
    return []; // Storage unavailable or corrupted — start with an empty basket.
  }
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  state = { ...state, items: readSavedItems() };
  // Keep the basket in sync if the visitor has the shop open in two tabs
  window.addEventListener("storage", (e) => {
    if (e.key !== STORAGE_KEY) return;
    state = { ...state, items: readSavedItems() };
    emit();
  });
}

function isValidItem(i: unknown): i is CartItem {
  const item = i as CartItem;
  return (
    typeof item?.productId === "string" &&
    typeof item.name === "string" &&
    Number.isInteger(item.pricePence) &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

function emit() {
  listeners.forEach((l) => l());
}

function setState(next: CartState, persist = true) {
  state = next;
  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // Private browsing / storage full — basket still works for this visit.
    }
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  load();
  return state;
}

function getServerSnapshot() {
  return EMPTY;
}

const clamp = (q: number) => Math.max(0, Math.min(MAX_QUANTITY, Math.floor(q)));

export const cart = {
  add(item: Omit<CartItem, "quantity">, quantity = 1) {
    load();
    const existing = state.items.find((i) => i.productId === item.productId);
    const items = existing
      ? state.items.map((i) => (i.productId === item.productId ? { ...i, quantity: clamp(i.quantity + quantity) } : i))
      : [...state.items, { ...item, quantity: clamp(quantity) }];
    setState({ ...state, items });
  },
  setQuantity(productId: string, quantity: number) {
    const q = clamp(quantity);
    const items =
      q === 0
        ? state.items.filter((i) => i.productId !== productId)
        : state.items.map((i) => (i.productId === productId ? { ...i, quantity: q } : i));
    setState({ ...state, items });
  },
  remove(productId: string) {
    setState({ ...state, items: state.items.filter((i) => i.productId !== productId) });
  },
  clear() {
    setState({ ...state, items: [] });
  },
  open() {
    setState({ ...state, open: true }, false);
  },
  close() {
    setState({ ...state, open: false }, false);
  },
};

export function useCart() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const count = snapshot.items.reduce((n, i) => n + i.quantity, 0);
  const subtotalPence = snapshot.items.reduce((n, i) => n + i.pricePence * i.quantity, 0);
  return { ...snapshot, count, subtotalPence };
}

export { formatPence } from "./money";
