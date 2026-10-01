// Gold diamond divider. Diamonds stagger in on load, then a slow shimmer wave
// travels along them (animation in globals.css: .diamond / .diamond-core).
export default function Divider({ count = 9, className = "" }: { count?: number; className?: string }) {
  const gap = 28;
  const width = count * gap;
  return (
    <svg
      viewBox={`0 0 ${width} 16`}
      className={`h-4 text-gold ${className}`}
      style={{ width }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <line x1="0" y1="8" x2={width} y2="8" strokeOpacity="0.35" />
      {Array.from({ length: count }, (_, i) => {
        const cx = i * gap + gap / 2;
        return (
          <g key={i} className="diamond" style={{ "--i": i } as React.CSSProperties}>
            <path d={`M${cx} 1l7 7-7 7-7-7z`} fill="var(--color-cream)" />
            <path
              className="diamond-core"
              d={`M${cx} 4.5l3.5 3.5-3.5 3.5-3.5-3.5z`}
              fill="currentColor"
              stroke="none"
              style={{ "--i": i } as React.CSSProperties}
            />
          </g>
        );
      })}
    </svg>
  );
}
