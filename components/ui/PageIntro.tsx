import type { ReactNode } from "react";

type Props = { eyebrow: string; children: ReactNode; className?: string };

// Page opener for the basket/checkout/orders pages: eyebrow + editorial display heading,
// the same pairing the shop and homepage use. Put an <em> in the heading for the
// terracotta italic accent.
export default function PageIntro({ eyebrow, children, className = "" }: Props) {
  return (
    <div className={className}>
      <p className="text-eyebrow text-cocoa-soft">{eyebrow}</p>
      <h1 className="text-display-l serif-editorial mt-5 [&_em]:text-terracotta">{children}</h1>
    </div>
  );
}
