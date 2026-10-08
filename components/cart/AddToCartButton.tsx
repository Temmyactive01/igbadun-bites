"use client";

import { useEffect, useRef, useState } from "react";
import { cart, useCart, type CartItem } from "@/lib/cart-store";
import QuantityStepper from "./QuantityStepper";

type Props = {
  item: Omit<CartItem, "quantity">;
  soldOut?: boolean;
  comingSoon?: boolean; // announced, not yet for sale: shows "Coming soon", never adds
  // "tile": compact control for product tiles · "feature": large control (featured product, detail panel)
  variant?: "tile" | "feature";
};

// Add-to-basket that morphs into a − qty + stepper once the product is in the basket
// (Phase 3). The quantity comes from the basket itself, so the tile, the detail panel
// and the basket drawer always agree. Taking the quantity to 0 morphs back to "Add".
export default function AddToCartButton({ item, soldOut = false, comingSoon = false, variant = "tile" }: Props) {
  const { items } = useCart();
  const quantity = items.find((i) => i.productId === item.productId)?.quantity ?? 0;

  // Keep keyboard focus on the control when it swaps between Add and the stepper.
  // Only after the visitor's own click — never steal focus on page load.
  const addRef = useRef<HTMLButtonElement>(null);
  const plusRef = useRef<HTMLButtonElement>(null);
  const focusNext = useRef<"add" | "plus" | null>(null);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (focusNext.current === "plus") plusRef.current?.focus();
    if (focusNext.current === "add") addRef.current?.focus();
    focusNext.current = null;
  }, [quantity]);

  function change(next: number) {
    if (quantity === 0 && next > 0) focusNext.current = "plus";
    if (quantity > 0 && next === 0) focusNext.current = "add";
    if (quantity === 0) cart.add(item, next);
    else cart.setQuantity(item.productId, next);
    setAnnouncement(next === 0 ? `${item.name} removed from basket` : `${next} ${item.name} in basket`);
  }

  const feature = variant === "feature";
  const height = feature ? "h-14" : "h-11"; // ≥ 44px touch targets
  const live = (
    <span className="sr-only" aria-live="polite">
      {announcement}
    </span>
  );

  if (comingSoon || soldOut) {
    return (
      <span
        className={`inline-flex ${height} items-center rounded-full border border-cocoa/15 px-4 text-sm font-medium text-cocoa-soft`}
      >
        {comingSoon ? "Coming soon" : "Sold out"}
      </span>
    );
  }

  if (quantity === 0) {
    return (
      <>
        <button
          ref={addRef}
          type="button"
          onClick={() => change(1)}
          aria-label={`Add ${item.name} to basket`}
          className={`press morph-in inline-flex ${height} items-center justify-center gap-2 rounded-full font-medium ${
            feature
              ? "bg-cocoa px-8 text-base text-oat hover:bg-terracotta"
              : "border border-cocoa/30 px-4 text-sm text-cocoa hover:border-cocoa hover:bg-cocoa hover:text-oat"
          }`}
        >
          {feature ? "Add to basket" : "Add"}
          <span aria-hidden>+</span>
        </button>
        {live}
      </>
    );
  }

  return (
    <>
      <QuantityStepper
        name={item.name}
        quantity={quantity}
        onChange={change}
        size={feature ? "lg" : "md"}
        plusRef={plusRef}
        className="morph-in"
      />
      {live}
    </>
  );
}
