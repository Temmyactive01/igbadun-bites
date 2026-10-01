"use client";

import { cart, useCart } from "@/lib/cart-store";

// Header basket pill — a word and a count, not a generic cart-icon badge (style.md).
export default function CartButton() {
  const { count } = useCart();

  return (
    <button
      type="button"
      onClick={cart.open}
      aria-haspopup="dialog"
      aria-label={`Open basket, ${count} ${count === 1 ? "item" : "items"}`}
      className="press inline-flex items-center gap-2 rounded-full bg-brown py-2 pr-2 pl-4 text-sm font-medium text-cream hover:bg-forest"
    >
      Basket
      <span
        key={count} // re-mounts on change so the bump animation replays
        className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-semibold ${
          count > 0 ? "animate-bump bg-gold text-brown" : "bg-cream/15 text-cream/80"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
