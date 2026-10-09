"use client";

import { cart, useCart } from "@/lib/cart-store";

// Header basket pill — a word and a count, not a generic cart-icon badge (style.md).
// `overlay`: light-on-dark version used while the header sits over the hero image.
export default function CartButton({ overlay = false }: { overlay?: boolean }) {
  const { count } = useCart();

  return (
    <button
      type="button"
      onClick={cart.open}
      aria-haspopup="dialog"
      className={`press inline-flex items-center gap-2 rounded-full py-1.5 pr-1.5 pl-4 text-sm font-medium ${
        overlay
          ? "bg-oat/10 text-oat ring-1 ring-oat/40 backdrop-blur-md hover:bg-oat/20"
          : "bg-cocoa text-oat hover:bg-cocoa-soft"
      }`}
    >
      Basket
      <span
        key={count} // re-mounts on change so the bump animation replays
        className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-semibold tabular-nums ${
          count > 0 ? "animate-bump bg-plantain text-cocoa" : "bg-oat/15 text-oat/80"
        }`}
      >
        {count}
      </span>
      {/* The accessible name is built from the visible text ("Basket 3") plus this, so it
          contains what a voice-control user can see — WCAG 2.5.3 Label in Name. An
          aria-label here would replace "Basket 3" instead of extending it.
          "has popup dialog" already tells a screen reader it opens the basket. */}
      <span className="sr-only">{count === 1 ? "item" : "items"}</span>
    </button>
  );
}
