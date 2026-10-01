// Lightweight repeating SVG textures. Each fills its positioned parent.
// Colour comes from `currentColor`, opacity from the className passed in.

// Abstracted from adire / mudcloth geometry: concentric "eleko" circles,
// crossed lines, rows of mark-making dashes, and small diamonds.
export function AdireTexture({ id, className = "" }: { id: string; className?: string }) {
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden>
      <defs>
        <pattern id={id} width="96" height="96" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
            <circle cx="24" cy="24" r="15" />
            <circle cx="24" cy="24" r="9" />
            <path d="M56 8l32 32M88 8L56 40" />
            <path d="M6 56v8M14 56v8M22 56v8M30 56v8M38 56v8M6 76v8M14 76v8M22 76v8M30 76v8M38 76v8" />
            <path d="M72 58l14 14-14 14-14-14z" />
          </g>
          <g fill="currentColor">
            <circle cx="24" cy="24" r="2.5" />
            <circle cx="72" cy="24" r="2" />
            <circle cx="72" cy="72" r="2" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

// Basket-weave texture for product placeholders: alternating blocks of
// horizontal and vertical strands, like woven raffia.
export function WovenTexture({ id, className = "" }: { id: string; className?: string }) {
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden>
      <defs>
        <pattern id={id} width="28" height="28" patternUnits="userSpaceOnUse">
          <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 3.5h10M2 7h10M2 10.5h10" />
            <path d="M17.5 2v10M21 2v10M24.5 2v10" />
            <path d="M3.5 16v10M7 16v10M10.5 16v10" />
            <path d="M16 17.5h10M16 21h10M16 24.5h10" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
