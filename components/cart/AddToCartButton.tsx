"use client";

import { useEffect, useRef, useState } from "react";
import { cart, type CartItem } from "@/lib/cart-store";

type Props = {
  item: Omit<CartItem, "quantity">;
  soldOut?: boolean;
};

export default function AddToCartButton({ item, soldOut = false }: Props) {
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function add() {
    cart.add(item);
    setJustAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setJustAdded(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={add}
      disabled={soldOut}
      aria-live="polite"
      className={`press w-full rounded-full px-4 py-2.5 text-sm font-medium sm:px-5 sm:py-3 sm:text-base disabled:cursor-not-allowed disabled:bg-brown/20 disabled:text-brown/60 ${
        justAdded ? "bg-forest text-cream" : "bg-brown text-cream hover:bg-gold hover:text-brown"
      }`}
    >
      {soldOut ? "Sold out" : justAdded ? "Added to basket ✓" : "Add to basket"}
    </button>
  );
}
