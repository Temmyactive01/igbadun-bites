"use client";

import type { ReactNode } from "react";
import { productSheet } from "@/lib/product-sheet";
import type { Product } from "@/lib/types";

type Props = {
  product: Product;
  tint: string;
  className?: string;
  label?: string; // accessible name when the visible content isn't descriptive enough
  tabIndex?: number;
  children: ReactNode;
};

// Opens the product detail panel (ingredients, allergens, storage).
export default function DetailsTrigger({ product, tint, className = "", label, tabIndex, children }: Props) {
  return (
    <button
      type="button"
      onClick={() => productSheet.open(product, tint)}
      aria-haspopup="dialog"
      aria-label={label}
      tabIndex={tabIndex}
      className={className}
    >
      {children}
    </button>
  );
}
