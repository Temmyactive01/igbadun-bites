// Client-side basket. Components read it with the useCart() hook.
//
// Signed out: saved in the visitor's browser (localStorage) so it survives refreshes.
// Signed in: the account's basket in Supabase (`cart_items`) is the source of truth and
// stays in sync live across tabs and devices — see lib/cart-sync.ts. This file keeps a
// per-user copy in localStorage only as a cache, so the basket shows instantly on load.
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

// syncing: a signed-in basket is still loading for the first time on this browser
// (nothing cached yet) — screens show a loading state instead of "basket is empty".
type CartState = { items: CartItem[]; open: boolean; syncing: boolean };

export const MAX_QUANTITY = 20;
const STORAGE_KEY = "igbadun-basket-v1"; // signed-out basket
const USER_CACHE_PREFIX = `${STORAGE_KEY}:user:`; // + user id — cache of a signed-in basket
const ACTIVE_USER_KEY = `${STORAGE_KEY}:active-user`; // which signed-in basket was last shown
const EMPTY: CartState = { items: [], open: false, syncing: false };
const SYNC_TIMEOUT_MS = 5000; // never show "loading" longer than this, whatever happens

let state: CartState = EMPTY;
let loaded = false;
let userId: string | null = null; // null = signed-out basket
const listeners = new Set<() => void>();

const storageKey = () => (userId ? USER_CACHE_PREFIX + userId : STORAGE_KEY);

function readItems(key: string): CartItem[] {
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(saved) ? saved.filter(isValidItem) : [];
  } catch {
    return []; // Storage unavailable or corrupted — start with an empty basket.
  }
}

function removeKey(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Storage unavailable — nothing to remove.
  }
}

// Supabase keeps the login session in a cookie (sb-<project>-auth-token, sometimes split
// into .0/.1 chunks). Only its presence is checked — no parsing, no network.
function hasAuthCookie() {
  return /(?:^|;\s*)sb-[^=;]+-auth-token(?:\.\d+)?=/.test(document.cookie);
}

// Wipe every cached signed-in basket from this browser (sign-out on a shared computer).
function forgetSignedInBaskets() {
  try {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(USER_CACHE_PREFIX) || key === ACTIVE_USER_KEY) localStorage.removeItem(key);
    }
  } catch {
    // Storage unavailable — nothing cached.
  }
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;

  // Decide synchronously which basket to show first, so a signed-in visitor never sees
  // an empty basket flash while the session loads. lib/cart-sync.ts confirms it.
  let lastUser: string | null = null;
  try {
    lastUser = localStorage.getItem(ACTIVE_USER_KEY);
  } catch {
    lastUser = null;
  }
  if (lastUser && hasAuthCookie()) {
    userId = lastUser;
  } else if (lastUser) {
    forgetSignedInBaskets(); // signed out since the last visit
  }
  const items = readItems(storageKey());
  // Signed in but nothing cached on this browser yet: the server basket is on its way
  const syncing = hasAuthCookie() && items.length === 0;
  state = { ...state, items, syncing };
  if (syncing) setTimeout(() => cartSyncHooks.doneSyncing(), SYNC_TIMEOUT_MS);

  // Keep the basket in sync if the visitor has the shop open in two tabs
  window.addEventListener("storage", (e) => {
    if (e.key !== storageKey()) return;
    state = { ...state, items: readItems(storageKey()) };
    emit();
  });

  // Signed-in sync lives in its own module, loaded only in the browser
  void import("./cart-sync").then((m) => m.startCartSync());
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
      localStorage.setItem(storageKey(), JSON.stringify(state.items));
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

// ---- Signed-in changes are handed to lib/cart-sync.ts to write to Supabase ----
export type CartChange = { type: "set"; productId: string; quantity: number } | { type: "clear" };
type ChangeHandler = (change: CartChange, forUser: string) => void;
let changeHandler: ChangeHandler | null = null;
let heldChanges: { change: CartChange; forUser: string }[] = []; // made before the sync module loaded

function notify(change: CartChange) {
  if (!userId) return; // signed-out basket: browser only, as before
  if (changeHandler) changeHandler(change, userId);
  else heldChanges.push({ change, forUser: userId });
}

export const cart = {
  add(item: Omit<CartItem, "quantity">, quantity = 1) {
    load();
    const existing = state.items.find((i) => i.productId === item.productId);
    const items = existing
      ? state.items.map((i) => (i.productId === item.productId ? { ...i, quantity: clamp(i.quantity + quantity) } : i))
      : [...state.items, { ...item, quantity: clamp(quantity) }];
    setState({ ...state, items });
    const next = items.find((i) => i.productId === item.productId);
    notify({ type: "set", productId: item.productId, quantity: next?.quantity ?? 0 });
  },
  setQuantity(productId: string, quantity: number) {
    load();
    const q = clamp(quantity);
    const items =
      q === 0
        ? state.items.filter((i) => i.productId !== productId)
        : state.items.map((i) => (i.productId === productId ? { ...i, quantity: q } : i));
    setState({ ...state, items });
    notify({ type: "set", productId, quantity: q });
  },
  remove(productId: string) {
    load();
    setState({ ...state, items: state.items.filter((i) => i.productId !== productId) });
    notify({ type: "set", productId, quantity: 0 });
  },
  clear() {
    load();
    setState({ ...state, items: [] });
    notify({ type: "clear" });
  },
  open() {
    setState({ ...state, open: true }, false);
  },
  close() {
    setState({ ...state, open: false }, false);
  },
};

// ---- Internal hooks for lib/cart-sync.ts only — not for components ----
export const cartSyncHooks = {
  currentUser: () => userId,
  items: () => state.items,
  signedOutItems: () => readItems(STORAGE_KEY),
  forgetSignedOutBasket: () => removeKey(STORAGE_KEY),

  // Switch to a signed-in basket. Shows that user's cached copy — or, on the very first
  // sign-in on this browser, keeps today's basket on screen until the merge finishes.
  enterUser(id: string) {
    if (userId === id) return;
    userId = id;
    try {
      localStorage.setItem(ACTIVE_USER_KEY, id);
    } catch {
      // Storage unavailable — the basket still syncs for this visit.
    }
    const cached = readItems(storageKey());
    setState({ ...state, items: cached.length ? cached : state.items }, false);
  },

  // Signed out: empty the visible basket and leave nothing signed-in behind in this browser.
  leaveUser() {
    userId = null;
    forgetSignedInBaskets();
    removeKey(STORAGE_KEY);
    setState({ ...state, items: [], syncing: false }, false);
  },

  // Replace the basket with the server's copy (and refresh the per-user cache)
  replaceItems(items: CartItem[]) {
    if (userId) setState({ ...state, items, syncing: false });
  },

  // First load finished (or failed, or turned out to be signed out) — stop showing "loading"
  doneSyncing() {
    if (state.syncing) setState({ ...state, syncing: false }, false);
  },

  onChange(handler: ChangeHandler) {
    changeHandler = handler;
    const held = heldChanges;
    heldChanges = [];
    held.forEach(({ change, forUser }) => handler(change, forUser));
  },
};

export function useCart() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const count = snapshot.items.reduce((n, i) => n + i.quantity, 0);
  const subtotalPence = snapshot.items.reduce((n, i) => n + i.pricePence * i.quantity, 0);
  return { ...snapshot, count, subtotalPence };
}

export { formatPence } from "./money";
