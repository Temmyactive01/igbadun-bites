"use client";

import { usePathname } from "next/navigation";
import { cart, formatPence, useCart } from "@/lib/cart-store";

// Phones only: once something is in the basket, a slim bar stays at the bottom of the
// screen (thumb reach) so the basket is one tap away after scrolling (Phase 0 audit §2.5).
// Hidden on checkout (the page is the basket) and while the basket itself is open.
// A spacer in the page flow stops it covering the end of the footer.
export default function BasketBar() {
  const pathname = usePathname();
  const { count, subtotalPence, open } = useCart();
  if (count === 0 || pathname.startsWith("/checkout")) return null;

  return (
    <>
      <div aria-hidden className="h-20 md:hidden" />
      <div
        inert={open}
        className={`fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-[translate,opacity] duration-300 ease-brand motion-reduce:transition-none md:hidden ${
          open ? "pointer-events-none translate-y-full opacity-0" : "morph-in"
        }`}
      >
        {/* No aria-label: the visible text ("Basket 3 £13.50 View") is the accessible name,
            so it matches what a voice-control user can say — WCAG 2.5.3 Label in Name.
            Nothing is appended because the visible text ends in "View", and inserting words
            mid-way would break the match. "has popup dialog" covers the rest. */}
        <button
          type="button"
          onClick={cart.open}
          aria-haspopup="dialog"
          className="press flex h-14 w-full items-center justify-between gap-3 rounded-full bg-cocoa pr-2 pl-5 text-oat shadow-[0_8px_24px_rgb(43_26_18/0.25)]"
        >
          <span className="flex items-center gap-2.5 text-sm font-medium">
            Basket
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-plantain px-1.5 text-xs font-semibold tabular-nums text-cocoa">
              {count}
            </span>
          </span>
          <span className="flex items-center gap-3">
            <span className="font-heading text-lg tabular-nums">{formatPence(subtotalPence)}</span>
            <span className="flex h-10 items-center rounded-full bg-oat px-4 text-sm font-semibold text-cocoa">View</span>
          </span>
        </button>
      </div>
    </>
  );
}
