// Simple line-art snack icons for placeholder cards until real photos arrive.
// Keyed by category so every product in the catalog gets a sensible icon in Step 3.

const base = {
  viewBox: "0 0 80 80",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

// A small mound of chin chin cubes
export function CrunchyIcon({ className = "" }: { className?: string }) {
  const cubes = [
    [22, 48, -12], [36, 50, 8], [50, 47, -6], [28, 36, 18], [43, 35, -14], [36, 23, 5], [56, 58, 14], [16, 59, -4],
  ];
  return (
    <svg {...base} className={className}>
      {cubes.map(([x, y, r], i) => (
        <rect key={i} x={x - 6} y={y - 6} width="12" height="12" rx="3" transform={`rotate(${r} ${x} ${y})`} />
      ))}
      <path d="M12 68h56" strokeOpacity="0.5" />
    </svg>
  );
}

// Overlapping plantain chip slices, each with a ridge line
export function ChipsIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <ellipse cx="30" cy="44" rx="17" ry="11" transform="rotate(-20 30 44)" />
      <path d="M18 48c7-3 17-8 24-11" strokeOpacity="0.6" />
      <ellipse cx="48" cy="34" rx="17" ry="11" transform="rotate(15 48 34)" />
      <path d="M35 31c8 1 17 4 26 7" strokeOpacity="0.6" />
      <ellipse cx="46" cy="56" rx="15" ry="9.5" transform="rotate(-5 46 56)" />
      <path d="M33 57c8-1 17-2 26-2" strokeOpacity="0.6" />
    </svg>
  );
}

// A twist-wrapped sweet with coconut-shred texture inside
export function TreatIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <g transform="rotate(-18 40 40)">
        <rect x="24" y="28" width="32" height="24" rx="10" />
        <path d="M24 40l-12-10v20zM56 40l12-10v20z" />
        <path d="M15 34l4 2M15 46l4-2M65 34l-4 2M65 46l-4-2" strokeOpacity="0.6" />
        <path d="M31 35l5 3M41 33l4 4M33 45l4-3M44 44l5 1M48 37l2 4" strokeOpacity="0.7" />
      </g>
    </svg>
  );
}

export const iconForCategory = {
  Chips: ChipsIcon,
  "Crunchy snacks": CrunchyIcon,
  "Traditional treats and sweets": TreatIcon,
} as const;
