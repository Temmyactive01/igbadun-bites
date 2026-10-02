"use client";

import { useEffect, useRef, useState } from "react";
import { cart, type CartItem } from "@/lib/cart-store";

type Props = {
  item: Omit<CartItem, "quantity">;
  soldOut?: boolean;
  // "tile": compact outline button for product tiles · "feature": large filled button
  variant?: "tile" | "feature";
};

// Phase 2 styling; Phase 3 turns this into a morphing quantity stepper.
export default function AddToCartButton({ item, soldOut = false, variant = "tile" }: Props) {
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function add() {
    cart.add(item);
    setJustAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setJustAdded(false), 1600);
  }

  const base = "press inline-flex items-center justify-center gap-2 rounded-full font-medium disabled:cursor-not-allowed";
  const size = variant === "feature" ? "px-7 py-4 text-base" : "px-4 py-2 text-sm";
  const state = soldOut
    ? "border border-cocoa/15 text-cocoa-soft"
    : justAdded
      ? "bg-leaf text-oat border border-leaf"
      : variant === "feature"
        ? "bg-cocoa text-oat border border-cocoa hover:bg-terracotta hover:border-terracotta"
        : "border border-cocoa/30 text-cocoa hover:bg-cocoa hover:text-oat hover:border-cocoa";

  return (
    <button
      type="button"
      onClick={add}
      disabled={soldOut}
      aria-live="polite"
      aria-label={soldOut ? `${item.name} is sold out` : justAdded ? `${item.name} added to basket` : `Add ${item.name} to basket`}
      className={`${base} ${size} ${state}`}
    >
      {soldOut ? "Sold out" : justAdded ? "Added ✓" : variant === "feature" ? "Add to basket" : "Add"}
      {!soldOut && !justAdded && <span aria-hidden>+</span>}
    </button>
  );
}
