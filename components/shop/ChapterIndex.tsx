"use client";

import { useEffect, useRef, useState } from "react";

type Item = { id: string; title: string; count: number };

// Slim chapter index that sticks under the header while you browse the shop,
// highlighting the chapter currently on screen.
export default function ChapterIndex({ items }: { items: Item[] }) {
  const [active, setActive] = useState<string | null>(null);
  const listRef = useRef<HTMLOListElement>(null);

  // On phones the index is wider than the screen: keep the current chapter in view
  // (scrolls the index sideways only — never the page).
  useEffect(() => {
    const list = listRef.current;
    const link = active ? list?.querySelector<HTMLElement>(`a[href="#${active}"]`) : null;
    if (!list || !link) return;
    const target = link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2;
    list.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [active]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          setActive(visible[0].target.id);
          return;
        }
        // Scrolled back above the first chapter (intro / featured product): nothing is current.
        // Measured directly — a jump can skip past chapter 01 without it ever reporting a change.
        const first = items[0] ? document.getElementById(items[0].id) : null;
        if (first && first.getBoundingClientRect().top > window.innerHeight * 0.35) setActive(null);
      },
      // A chapter counts as "current" when it crosses the upper-middle of the screen
      { rootMargin: "-35% 0px -60% 0px" }
    );
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Shop chapters"
      className="sticky top-16 z-30 border-y border-cocoa/10 bg-oat/90 backdrop-blur-md lg:top-20"
    >
      <ol ref={listRef} className="mx-auto flex max-w-[1440px] gap-6 overflow-x-auto px-4 [scrollbar-width:none] sm:gap-10 sm:px-8 lg:px-12 [&::-webkit-scrollbar]:hidden">
        {items.map((item, i) => {
          const isActive = active === item.id;
          return (
            <li key={item.id} className="shrink-0">
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`relative flex items-baseline gap-2 py-4 text-sm transition-colors duration-300 ${
                  isActive ? "text-cocoa" : "text-cocoa-soft hover:text-cocoa"
                }`}
              >
                <span className="font-heading italic">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-medium">{item.title}</span>
                <span className="text-xs text-cocoa-soft tabular-nums">{item.count}</span>
                <span
                  aria-hidden
                  className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-terracotta transition-transform duration-500 ease-[var(--ease-out-soft)] ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
