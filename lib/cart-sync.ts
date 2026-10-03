// Keeps a signed-in customer's basket in Supabase `cart_items` (Workflow 3, Step 1).
// Started once by lib/cart-store.ts in the browser. Signed-out visitors never reach the
// network from here — their basket stays in localStorage exactly as before.
//
// Rules (agreed decisions):
// - On sign-in the browser's signed-out basket is merged into the account basket once:
//   quantity = min(20, browser + account); then the browser copy is deleted.
// - On sign-out the visible basket is emptied and no signed-in copy is left behind.
// - Prices are never stored in cart_items; names/prices are joined from products.

import type { RealtimeChannel, Session } from "@supabase/supabase-js";
import { cartSyncHooks as store, MAX_QUANTITY, type CartChange, type CartItem } from "@/lib/cart-store";
import { createClient } from "@/lib/supabase/client";

type Row = {
  product_id: string;
  quantity: number;
  products: { name: string; pack_size: string; category: string; price_gbp: number } | null;
};

const supabase = createClient();
let started = false;
let activeUser: string | null = null; // whose basket this module is syncing
let sessionTask: Promise<void> = Promise.resolve();
let channel: RealtimeChannel | null = null;

// Writes run one after another, in the order they were made, so an older write can
// never land after a newer one. Server refreshes wait until the queue is empty.
let writes: Promise<void> = Promise.resolve();
let pendingWrites = 0;
let refreshTimer: ReturnType<typeof setTimeout> | undefined;

export function startCartSync() {
  if (started) return;
  started = true;

  store.onChange(enqueueWrite);

  supabase.auth.getSession().then(({ data }) => onSession(data.session));
  supabase.auth.onAuthStateChange((_event, session) => {
    // Don't call Supabase from inside this callback (it can deadlock) — defer.
    setTimeout(() => onSession(session), 0);
  });

  // Catch up after the tab has been in the background
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && activeUser) scheduleRefresh();
  });
}

// Handle sign-in / sign-out / account switch, one at a time
function onSession(session: Session | null) {
  sessionTask = sessionTask.then(() => applySession(session?.user?.id ?? null)).catch((err) => {
    console.error("Basket sync:", err);
  });
}

async function applySession(next: string | null) {
  if (next === activeUser) return; // e.g. token refresh — nothing changed

  if (activeUser) {
    unsubscribe();
    activeUser = null;
  }

  if (!next) {
    // Signed out (or never signed in). Only touch the basket if it was a signed-in one.
    if (store.currentUser()) store.leaveUser();
    return;
  }

  // Signing in, or a page load that is already signed in
  if (store.currentUser() && store.currentUser() !== next) store.leaveUser(); // different account
  store.enterUser(next);
  activeUser = next;

  await mergeSignedOutBasket(next);
  await refresh(next);
  subscribe(next);
}

// Decision 1: add the signed-out basket into the account basket once, capped at 20
async function mergeSignedOutBasket(user: string) {
  const local = store.signedOutItems();
  if (local.length === 0) return;

  // Skip anything that's no longer in the shop (would break the products foreign key)
  const ids = local.map((i) => i.productId);
  const { data: known, error: productsError } = await supabase.from("products").select("id").in("id", ids);
  if (productsError) throw new Error(`could not check products: ${productsError.message}`);
  const knownIds = new Set((known ?? []).map((p) => p.id as string));

  const { data: existing, error: readError } = await supabase
    .from("cart_items")
    .select("product_id, quantity")
    .eq("user_id", user)
    .in("product_id", ids);
  if (readError) throw new Error(`could not read basket: ${readError.message}`);
  const accountQty = new Map((existing ?? []).map((r) => [r.product_id as string, r.quantity as number]));

  const rows = local
    .filter((i) => knownIds.has(i.productId))
    .map((i) => ({
      user_id: user,
      product_id: i.productId,
      quantity: Math.min(MAX_QUANTITY, i.quantity + (accountQty.get(i.productId) ?? 0)),
    }));

  if (rows.length > 0) {
    const { error } = await supabase.from("cart_items").upsert(rows, { onConflict: "user_id,product_id" });
    // Keep the browser copy if this failed, so the next visit can retry without losing anything
    if (error) throw new Error(`could not merge basket: ${error.message}`);
  }
  store.forgetSignedOutBasket(); // merged exactly once
}

// Load the account basket from the server (names and prices joined from products)
async function refresh(user: string) {
  const { data, error } = await supabase
    .from("cart_items")
    .select("product_id, quantity, products(name, pack_size, category, price_gbp)")
    .eq("user_id", user)
    .order("updated_at", { ascending: true });
  if (error) {
    console.error("Basket sync: could not load basket:", error.message);
    return;
  }
  if (user !== activeUser || pendingWrites > 0) return; // stale — a newer state is on its way

  const fresh: CartItem[] = (data as unknown as Row[])
    .filter((r) => r.products)
    .map((r) => ({
      productId: r.product_id,
      name: r.products!.name,
      packSize: r.products!.pack_size,
      category: r.products!.category,
      pricePence: Math.round(Number(r.products!.price_gbp) * 100),
      quantity: r.quantity,
    }));

  // Keep lines where they already are on screen; new ones go at the end
  const order = new Map(store.items().map((item, i) => [item.productId, i]));
  fresh.sort((a, b) => (order.get(a.productId) ?? Infinity) - (order.get(b.productId) ?? Infinity));
  store.replaceItems(fresh);
}

function scheduleRefresh() {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    if (pendingWrites > 0 || !activeUser) return; // the write queue refreshes when it drains
    void refresh(activeUser);
  }, 150);
}

// Live updates from other tabs and devices. Any change → reload the basket (keeps the
// products join correct). Our own writes echo back too; reloading them is harmless.
function subscribe(user: string) {
  channel = supabase
    .channel(`cart:${user}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "cart_items", filter: `user_id=eq.${user}` }, () =>
      scheduleRefresh()
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") scheduleRefresh(); // (re)connected — catch up on anything missed
    });
}

function unsubscribe() {
  clearTimeout(refreshTimer);
  if (channel) void supabase.removeChannel(channel);
  channel = null;
}

// A change made in this tab while signed in → write it to cart_items (absolute quantities)
function enqueueWrite(change: CartChange, user: string) {
  pendingWrites++;
  writes = writes
    .then(() => write(change, user))
    // On failure the refresh below puts the screen back in line with the database
    .catch((err) => console.error("Basket sync: could not save change:", err))
    .finally(() => {
      pendingWrites--;
      if (pendingWrites === 0 && activeUser === user) scheduleRefresh();
    });
}

async function write(change: CartChange, user: string) {
  if (change.type === "clear") {
    const { error } = await supabase.from("cart_items").delete().eq("user_id", user);
    if (error) throw new Error(error.message);
    return;
  }
  if (change.quantity <= 0) {
    const { error } = await supabase.from("cart_items").delete().eq("user_id", user).eq("product_id", change.productId);
    if (error) throw new Error(error.message);
    return;
  }
  const { error } = await supabase
    .from("cart_items")
    .upsert(
      { user_id: user, product_id: change.productId, quantity: Math.min(MAX_QUANTITY, change.quantity) },
      { onConflict: "user_id,product_id" }
    );
  if (error) throw new Error(error.message);
}
