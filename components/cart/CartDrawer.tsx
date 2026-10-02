"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import ItemThumb from "@/components/orders/ItemThumb";
import { buttonLg, buttonPrimary, buttonSecondary, buttonMd } from "@/components/ui/styles";
import { cart, formatPence, useCart } from "@/lib/cart-store";
import QuantityStepper from "./QuantityStepper";

// The basket (Phase 4 restyle): bottom sheet on phones, side panel from md up — the
// same sheet pattern as the product detail panel. Behaviour unchanged.
export default function CartDrawer() {
  const { items, open, count, subtotalPence } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusTo = useRef<Element | null>(null);

  // While open: Escape closes, page behind doesn't scroll, focus moves into
  // the drawer and returns to where it was when the drawer closes.
  useEffect(() => {
    if (!open) return;
    returnFocusTo.current = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cart.close();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      (returnFocusTo.current as HTMLElement | null)?.focus?.();
    };
  }, [open]);

  function setQuantity(productId: string, next: number) {
    cart.setQuantity(productId, next);
    // The row (and the button that was focused) disappears at 0 — keep focus in the basket
    if (next <= 0) requestAnimationFrame(() => closeRef.current?.focus());
  }

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} inert={!open}>
      <div
        onClick={cart.close}
        className={`absolute inset-0 bg-cocoa/40 backdrop-blur-[2px] transition-opacity duration-300 ease-brand ${open ? "opacity-100" : "opacity-0"}`}
        aria-hidden
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="basket-title"
        className={`absolute flex flex-col bg-oat text-cocoa transition-[translate] duration-300 ease-brand motion-reduce:transition-none
          inset-x-0 bottom-0 max-h-[90dvh] rounded-t-2xl
          md:inset-x-auto md:inset-y-0 md:right-0 md:max-h-none md:w-full md:max-w-md md:rounded-none
          ${open ? "translate-x-0 translate-y-0" : "translate-y-full md:translate-y-0 md:translate-x-full"}`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-cocoa/10 px-5 py-4 sm:px-6">
          <h2 id="basket-title" className="font-heading text-3xl serif-editorial">
            Your basket
            {count > 0 && <span className="ml-2 font-sans text-base tracking-normal text-cocoa-soft">({count})</span>}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={cart.close}
            className="press flex h-11 w-11 items-center justify-center rounded-full border border-cocoa/20 text-lg hover:border-cocoa hover:bg-cocoa hover:text-oat"
            aria-label="Close basket"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
            <p className="text-title serif-editorial">Your basket is empty.</p>
            <p className="mt-3 text-cocoa-soft">The chin chin won&rsquo;t eat itself — pick a few favourites from the shop.</p>
            <button type="button" onClick={cart.close} className={`${buttonSecondary} ${buttonMd} mt-8`}>
              Browse the snacks
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-cocoa/10 overflow-y-auto overscroll-contain px-5 sm:px-6">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4 py-5">
                  <ItemThumb name={item.name} category={item.category} className="h-20 w-20" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-heading text-lg leading-snug">{item.name}</p>
                      <p className="font-medium tabular-nums">{formatPence(item.pricePence * item.quantity)}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-cocoa-soft">
                      {item.packSize} · {formatPence(item.pricePence)} each
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <QuantityStepper
                        name={item.name}
                        quantity={item.quantity}
                        onChange={(next) => setQuantity(item.productId, next)}
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity(item.productId, 0)}
                        className="rounded-sm text-sm text-cocoa-soft underline decoration-cocoa/25 underline-offset-4 hover:text-terracotta hover:decoration-terracotta"
                      >
                        Remove<span className="sr-only"> {item.name}</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-cocoa/10 bg-oat-deep/60 px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6">
              <div className="flex items-baseline justify-between">
                <span className="text-eyebrow text-cocoa">Subtotal</span>
                <span className="font-heading text-2xl tabular-nums">{formatPence(subtotalPence)}</span>
              </div>
              <p className="mt-1 text-sm text-cocoa-soft">Choose pickup or delivery at checkout.</p>
              <Link href="/checkout" onClick={cart.close} className={`${buttonPrimary} ${buttonLg} mt-5 w-full`}>
                Checkout <span aria-hidden>→</span>
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
