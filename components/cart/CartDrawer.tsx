"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { cart, formatPence, MAX_QUANTITY, useCart } from "@/lib/cart-store";

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

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} inert={!open}>
      {/* Backdrop */}
      <div
        onClick={cart.close}
        className={`absolute inset-0 bg-brown/40 backdrop-blur-[2px] transition-opacity duration-300 ease-brand ${open ? "opacity-100" : "opacity-0"}`}
        aria-hidden
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="basket-title"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream transition-[translate,box-shadow] duration-300 ease-brand ${
          open ? "translate-x-0 shadow-warm-lg" : "translate-x-full shadow-none"
        }`}
      >
        <div className="flex items-center justify-between border-b border-brown/10 px-6 py-5">
          <h2 id="basket-title" className="display text-3xl font-bold">
            Your basket
            {count > 0 && <span className="ml-2 font-sans text-base font-medium tracking-normal text-brown-soft">({count})</span>}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={cart.close}
            className="press flex h-10 w-10 items-center justify-center rounded-full border border-brown/20 text-lg hover:border-brown hover:bg-brown hover:text-cream"
            aria-label="Close basket"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="font-heading text-2xl font-semibold">Your basket is empty.</p>
            <p className="mt-2 text-brown-soft">The chin chin won&rsquo;t eat itself — pick a few favourites from the shop.</p>
            <button
              type="button"
              onClick={cart.close}
              className="press mt-6 rounded-full bg-gold px-6 py-3 font-semibold text-brown hover:bg-brown hover:text-cream"
            >
              Browse the snacks
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-brown/10 overflow-y-auto px-6">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4 py-5">
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-lg leading-tight font-semibold">{item.name}</p>
                    <p className="mt-0.5 text-sm text-brown-soft">
                      {item.packSize} · {formatPence(item.pricePence)} each
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="inline-flex items-center rounded-full border border-brown/20">
                        <button
                          type="button"
                          onClick={() => cart.setQuantity(item.productId, item.quantity - 1)}
                          className="press flex h-9 w-9 items-center justify-center rounded-full text-lg hover:bg-brown/10"
                          aria-label={`One fewer ${item.name}`}
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-semibold tabular-nums" aria-live="polite" aria-label={`${item.quantity} in basket`}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => cart.setQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= MAX_QUANTITY}
                          className="press flex h-9 w-9 items-center justify-center rounded-full text-lg hover:bg-brown/10 disabled:opacity-30"
                          aria-label={`One more ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => cart.remove(item.productId)}
                        className="text-sm text-brown-soft underline underline-offset-4 hover:text-terracotta"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="font-heading text-lg font-semibold tabular-nums">{formatPence(item.pricePence * item.quantity)}</p>
                </li>
              ))}
            </ul>

            <div className="border-t border-brown/10 bg-cream-deep/50 px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <div className="flex items-baseline justify-between">
                <span className="font-medium">Subtotal</span>
                <span className="font-heading text-2xl font-bold tabular-nums">{formatPence(subtotalPence)}</span>
              </div>
              <p className="mt-1 text-sm text-brown-soft">Choose pickup or delivery at checkout.</p>
              <Link
                href="/checkout"
                onClick={cart.close}
                className="press mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 font-semibold text-brown shadow-warm hover:bg-brown hover:text-cream"
              >
                Checkout <span aria-hidden>→</span>
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
