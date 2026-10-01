"use client";

import { useEffect } from "react";
import { cart } from "@/lib/cart-store";

// Empties the basket once an order is confirmed as paid.
export default function ClearBasket() {
  useEffect(() => {
    cart.clear();
  }, []);
  return null;
}
