"use client";

import type { Ref } from "react";
import { MAX_QUANTITY } from "@/lib/cart-store";

type Props = {
  name: string; // product name, for accessible labels
  quantity: number;
  onChange: (next: number) => void;
  size?: "md" | "lg"; // md: 44px (tiles, basket) · lg: 56px (featured product, detail panel)
  plusRef?: Ref<HTMLButtonElement>; // lets callers keep keyboard focus on the control as it appears
  className?: string;
};

// − qty + control shared by the add-to-basket morph and the basket.
// Taking the quantity to 0 is the caller's "remove".
export default function QuantityStepper({ name, quantity, onChange, size = "md", plusRef, className = "" }: Props) {
  const lg = size === "lg";
  const step = `press flex ${lg ? "h-14 w-14 text-xl" : "h-11 w-11 text-lg"} items-center justify-center rounded-full hover:bg-oat/15 disabled:opacity-35 disabled:hover:bg-transparent`;

  return (
    <div
      role="group"
      aria-label={`${name} in basket`}
      className={`inline-flex ${lg ? "h-14" : "h-11"} items-center rounded-full bg-cocoa text-oat ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        className={step}
        aria-label={quantity === 1 ? `Remove ${name} from basket` : `One fewer ${name}`}
      >
        <span aria-hidden>−</span>
      </button>
      <span className={`${lg ? "min-w-10 text-lg" : "min-w-7"} text-center font-semibold tabular-nums`} aria-hidden>
        {quantity}
      </span>
      <button
        ref={plusRef}
        type="button"
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= MAX_QUANTITY}
        className={step}
        aria-label={quantity >= MAX_QUANTITY ? `Maximum of ${MAX_QUANTITY} ${name}` : `One more ${name} (${quantity} in basket)`}
      >
        <span aria-hidden>+</span>
      </button>
    </div>
  );
}
