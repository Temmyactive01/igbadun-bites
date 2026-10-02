"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Options = {
  open: boolean;
  onClose: () => void;
  containerRef: RefObject<HTMLElement | null>; // the dialog element
  initialFocusRef?: RefObject<HTMLElement | null>; // focused on open (defaults to the first focusable)
};

// Shared modal behaviour for the basket, the product panel and the mobile menu:
// focus moves in on open and is kept inside (Tab / Shift+Tab wrap), Escape closes,
// the page behind doesn't scroll, and focus returns to where it was on close.
export function useDialog({ open, onClose, containerRef, initialFocusRef }: Options) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    const returnTo = document.activeElement as HTMLElement | null;
    const focusables = () =>
      container ? [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.getClientRects().length > 0) : [];

    (initialFocusRef?.current ?? focusables()[0])?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !container) return;
      const els = focusables();
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      const active = document.activeElement;
      if (!container.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      returnTo?.focus?.();
    };
  }, [open, containerRef, initialFocusRef]);
}
