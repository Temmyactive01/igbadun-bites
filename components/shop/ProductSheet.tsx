"use client";

import { useEffect, useRef } from "react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { CONTACT } from "@/lib/contact";
import { detailText, isConfirmed, productSheet, useProductSheet } from "@/lib/product-sheet";
import ProductVisual from "./ProductVisual";

// Product detail panel (Phase 3): description, ingredients, allergens, storage and
// pack size for every product, plus the add control. Bottom sheet on phones, side
// panel from md up. Behaves like the basket drawer: Escape / backdrop close, focus
// moves in and returns to the button that opened it, page behind doesn't scroll.
export default function ProductSheet() {
  const { product, tint, open } = useProductSheet();
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusTo = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    returnFocusTo.current = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && productSheet.close();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      (returnFocusTo.current as HTMLElement | null)?.focus?.();
    };
  }, [open]);

  const ingredients = detailText(product?.ingredients);
  const allergens = detailText(product?.allergens);
  const storage = detailText(product?.storage_guidance);
  // Researched typical-recipe info is labelled as such until the owner confirms it
  const researched = !!product && !isConfirmed(product) && !!(ingredients || allergens || storage);
  const pending = <span className="italic">Not yet confirmed — we&rsquo;re checking this with our supplier.</span>;

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} inert={!open}>
      <div
        onClick={productSheet.close}
        className={`absolute inset-0 bg-cocoa/40 backdrop-blur-[2px] transition-opacity duration-300 ease-brand ${open ? "opacity-100" : "opacity-0"}`}
        aria-hidden
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-sheet-title"
        className={`absolute flex flex-col bg-oat text-cocoa transition-[translate] duration-300 ease-brand motion-reduce:transition-none
          inset-x-0 bottom-0 max-h-[90dvh] rounded-t-2xl
          md:inset-x-auto md:inset-y-0 md:right-0 md:max-h-none md:w-full md:max-w-lg md:rounded-none
          ${open ? "translate-x-0 translate-y-0" :"translate-y-full md:translate-y-0 md:translate-x-full"}`}
      >
        {product && (
          <>
            <div className="flex items-center justify-between gap-4 border-b border-cocoa/10 px-5 py-4 sm:px-6">
              <p className="text-eyebrow text-cocoa-soft">{product.category}</p>
              <button
                ref={closeRef}
                type="button"
                onClick={productSheet.close}
                className="press flex h-11 w-11 items-center justify-center rounded-full border border-cocoa/20 text-lg hover:border-cocoa hover:bg-cocoa hover:text-oat"
                aria-label="Close product details"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-6 pb-8 sm:px-6">
              <div className="grid grid-cols-[7rem_1fr] items-start gap-5 sm:grid-cols-[9rem_1fr]">
                <ProductVisual product={product} tint={tint} sizes="9rem" />
                <div>
                  <h2 id="product-sheet-title" className="text-display-m serif-editorial text-[clamp(1.75rem,1.25rem+2vw,2.5rem)]">
                    {product.name}
                  </h2>
                  <p className="mt-3 flex items-baseline gap-3">
                    <span className="font-heading text-2xl tabular-nums">£{Number(product.price_gbp).toFixed(2)}</span>
                    <span className="text-sm text-cocoa-soft">{product.pack_size}</span>
                  </p>
                </div>
              </div>

              {product.description && <p className="text-body-l mt-6 text-cocoa-soft">{product.description}</p>}

              {researched && (
                <p className="mt-8 rounded-lg bg-oat-deep px-4 py-3 text-sm text-cocoa">
                  <strong className="font-semibold">Typical recipe — not yet confirmed by our supplier.</strong>{" "}
                  We researched how this snack is usually made. Recipes and frying oils vary, so our own product may
                  differ, and traces of other allergens (especially peanuts) are possible. Please don&rsquo;t rely on
                  this if you have an allergy.
                </p>
              )}

              <dl className={`${researched ? "mt-6" : "mt-8"} divide-y divide-cocoa/10 border-y border-cocoa/10`}>
                <div className="py-4">
                  <dt className="text-eyebrow text-cocoa">Ingredients</dt>
                  <dd className="mt-2 text-cocoa-soft">{ingredients ?? pending}</dd>
                </div>
                <div className="py-4">
                  <dt className="text-eyebrow text-terracotta">Allergens</dt>
                  <dd className="mt-2 text-cocoa-soft">
                    {allergens ? <strong className="font-semibold text-cocoa">{allergens}</strong> : pending}
                  </dd>
                </div>
                <div className="py-4">
                  <dt className="text-eyebrow text-cocoa">Storage</dt>
                  <dd className="mt-2 text-cocoa-soft">{storage ?? pending}</dd>
                </div>
                <div className="py-4">
                  <dt className="text-eyebrow text-cocoa">Pack size</dt>
                  <dd className="mt-2 text-cocoa-soft">{product.pack_size}</dd>
                </div>
              </dl>

              <p className="mt-6 border-l-2 border-terracotta pl-4 text-sm text-cocoa">
                <strong className="font-semibold">Allergies or dietary needs?</strong> Please{" "}
                <a
                  href={CONTACT.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline decoration-terracotta/60 underline-offset-4 hover:decoration-terracotta"
                >
                  message us on WhatsApp
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>{" "}
                before ordering and we&rsquo;ll check the details for you.
              </p>
            </div>

            <div className="border-t border-cocoa/10 bg-oat-deep/60 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
              <AddToCartButton
                variant="feature"
                soldOut={!product.available}
                item={{
                  productId: product.id,
                  name: product.name,
                  packSize: product.pack_size,
                  category: product.category,
                  pricePence: Math.round(Number(product.price_gbp) * 100),
                }}
              />
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
