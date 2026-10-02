"use client";

import { Children, useRef, useState, type ReactNode } from "react";

type Props = {
  label: string; // e.g. "Crunchy snacks"
  pair?: boolean; // 1–2 products: give them more room on desktop
  children: ReactNode;
};

// Phones: a horizontal scroll-snap rail (next tile peeks in, counter below).
// Tablet/desktop: an editorial grid where the middle column sits lower.
export default function ProductRail({ label, pair = false, children }: Props) {
  const items = Children.toArray(children);
  const railRef = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(1);

  function onScroll() {
    const rail = railRef.current;
    const first = rail?.firstElementChild as HTMLElement | null;
    if (!rail || !first) return;
    const step = first.offsetWidth + parseFloat(getComputedStyle(rail).columnGap || "0");
    setCurrent(Math.min(items.length, Math.round(rail.scrollLeft / step) + 1));
  }

  function scrollBy(direction: 1 | -1) {
    const rail = railRef.current;
    const first = rail?.firstElementChild as HTMLElement | null;
    if (rail && first) rail.scrollBy({ left: direction * (first.offsetWidth + 16), behavior: "smooth" });
  }

  return (
    <div>
      <ul
        ref={railRef}
        onScroll={onScroll}
        tabIndex={0}
        aria-label={`${label}: ${items.length} ${items.length === 1 ? "product" : "products"}`}
        className={`-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 md:mx-0 md:grid md:gap-x-8 md:gap-y-16 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden ${
          pair
            ? "md:grid-cols-2 lg:mx-auto lg:max-w-4xl"
            : "md:grid-cols-2 lg:grid-cols-3 lg:pb-24 lg:[&>li:nth-child(3n+2)]:translate-y-24"
        }`}
      >
        {items.map((child, i) => (
          <li key={i} className="w-[78%] shrink-0 snap-start min-[480px]:w-[60%] md:w-auto">
            {child}
          </li>
        ))}
      </ul>

      {/* Phone-only position + controls */}
      {items.length > 1 && (
        <div className="mt-6 flex items-center justify-between md:hidden">
          <p className="text-eyebrow text-cocoa-soft" aria-live="polite">
            {String(current).padStart(2, "0")} <span className="text-cocoa/30">/</span> {String(items.length).padStart(2, "0")}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={current === 1}
              aria-label={`Previous ${label.toLowerCase()}`}
              className="press flex h-11 w-11 items-center justify-center rounded-full border border-cocoa/25 disabled:opacity-30"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={current === items.length}
              aria-label={`Next ${label.toLowerCase()}`}
              className="press flex h-11 w-11 items-center justify-center rounded-full border border-cocoa/25 disabled:opacity-30"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
