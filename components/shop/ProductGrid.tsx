import { Children, type ReactNode } from "react";

type Props = {
  label: string; // e.g. "Crunchy snacks"
  pair?: boolean; // 1–2 products: give them more room on desktop
  children: ReactNode;
};

// A plain vertical grid on every screen — no horizontal scrolling or swiping, so it
// behaves the same for everyone. Phones: 2 columns. Desktop: 3 columns with the
// middle column set slightly lower (the editorial stagger approved in Phase 2).
export default function ProductGrid({ label, pair = false, children }: Props) {
  const items = Children.toArray(children);

  return (
    <ul
      aria-label={`${label}: ${items.length} ${items.length === 1 ? "product" : "products"}`}
      className={`grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:gap-y-14 ${
        pair
          ? "lg:mx-auto lg:max-w-4xl lg:gap-x-8"
          : "md:grid-cols-3 lg:gap-x-8 lg:gap-y-16 lg:pb-24 lg:[&>li:nth-child(3n+2)]:translate-y-24"
      }`}
    >
      {items.map((child, i) => (
        <li key={i}>{child}</li>
      ))}
    </ul>
  );
}
