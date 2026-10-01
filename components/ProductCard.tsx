import type { Product } from "@/lib/types";
import { CrunchyIcon, iconForCategory } from "./SnackIcons";
import { WovenTexture } from "./Textures";

// Rotating tones so neighbouring cards never share a colour
const tones = [
  { bg: "bg-gold", icon: "text-gold-dark" },
  { bg: "bg-forest", icon: "text-forest" },
  { bg: "bg-terracotta", icon: "text-terracotta" },
];

type Props = {
  product: Product;
  number: number; // catalogue number shown on the card (1-based)
  toneIndex: number;
};

export default function ProductCard({ product, number, toneIndex }: Props) {
  const tone = tones[toneIndex % tones.length];
  const Icon = iconForCategory[product.category as keyof typeof iconForCategory] ?? CrunchyIcon;
  const soldOut = !product.available;

  return (
    <article className="group flex h-full flex-row overflow-hidden sm:flex-col rounded-[1.75rem] bg-cream shadow-warm ring-1 ring-brown/5 transition duration-300 ease-brand hover:-translate-y-1 hover:shadow-warm-lg">
      {/* Placeholder visual: woven texture + line-art icon on a cream medallion */}
      <div className={`relative flex w-[38%] shrink-0 items-center justify-center overflow-hidden sm:aspect-[4/3] sm:w-auto ${tone.bg} ${soldOut ? "grayscale-[60%]" : ""}`}>
        <WovenTexture id={`weave-${product.id}`} className="text-cream opacity-[0.16]" />
        <span className="absolute top-3 left-3.5 font-heading text-xs sm:top-4 sm:left-5 sm:text-sm font-semibold text-cream/85">
          {String(number).padStart(2, "0")}
        </span>
        {soldOut && (
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-cream px-2.5 py-1 text-[0.65rem] sm:top-3.5 sm:right-4 sm:bottom-auto sm:left-auto sm:translate-x-0 sm:px-3 sm:text-xs font-semibold uppercase tracking-wider text-terracotta">
            Sold out
          </span>
        )}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-cream ring-1 ring-cream/40 ring-offset-4 sm:h-32 sm:w-32 sm:ring-offset-8 ring-offset-transparent transition duration-500 ease-brand group-hover:scale-105 group-hover:rotate-3">
          <span className={`absolute inset-2 rounded-full border border-dashed border-current opacity-30 ${tone.icon}`} />
          <Icon className={`h-12 w-12 sm:h-20 sm:w-20 ${tone.icon}`} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-6">
        <div className="flex items-baseline justify-between gap-3 sm:gap-4">
          <h3 className="text-lg leading-tight font-semibold sm:text-2xl">{product.name}</h3>
          <span className="shrink-0 font-heading text-base font-semibold sm:text-xl">£{Number(product.price_gbp).toFixed(2)}</span>
        </div>
        <p className="mt-0.5 text-xs text-brown-soft sm:mt-1 sm:text-sm">{product.pack_size}</p>
        <p className="mt-2 line-clamp-2 text-sm leading-snug sm:mt-3 sm:text-[0.95rem] sm:leading-relaxed text-brown-soft">{product.description}</p>
        <div className="mt-auto pt-3 sm:pt-5">
          <button
            disabled={soldOut}
            className="press w-full rounded-full bg-brown px-4 py-2.5 text-sm font-medium sm:px-5 sm:py-3 sm:text-base text-cream hover:bg-gold hover:text-brown disabled:cursor-not-allowed disabled:bg-brown/20 disabled:text-brown/60 disabled:hover:bg-brown/20"
          >
            {soldOut ? "Sold out" : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
