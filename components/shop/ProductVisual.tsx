import Image from "next/image";
import { productImageKey, productImageSrc } from "@/lib/product-images";
import { isComingSoon } from "@/lib/product-sheet";
import { STAND_IN_IMAGES } from "@/lib/stand-in-images";
import type { Product } from "@/lib/types";

type Props = {
  product: Product;
  tint: string; // background behind the label fallback
  sizes: string;
  large?: boolean;
  preload?: boolean;
};

// The image area of a product, in order of preference:
//   1. the real product photo (public/images/products/)
//   2. a licensed stand-in photo (lib/stand-in-images.ts) — a generic photo of the snack,
//      or an ingredient where none exists; labelled as a stand-in on the page
//   3. a typographic label, for any new product without either yet
// Every option uses the same 4:5 crop, subtle radius and warm grade so the grid reads as one.
export default function ProductVisual({ product, tint, sizes, large = false, preload = false }: Props) {
  const photo = productImageSrc(product.name);
  const standIn = photo ? null : STAND_IN_IMAGES[productImageKey(product.name)];
  // Coming soon: full colour (it isn't sold out), labelled instead
  const comingSoon = isComingSoon(product);
  const soldOut = !product.available && !comingSoon;

  return (
    <div
      className={`zoom-frame relative aspect-[4/5] overflow-hidden rounded-lg ${soldOut ? "opacity-70 grayscale-[50%]" : ""}`}
      style={{ backgroundColor: tint }}
    >
      {photo ? (
        <Image src={photo} alt={product.name} fill sizes={sizes} preload={preload} className="object-cover" />
      ) : standIn ? (
        <Image
          src={standIn.src}
          alt={
            standIn.kind === "snack"
              ? `Stand-in photo of ${standIn.shows} — not Igbadun Bites’ own product`
              : `Ingredient photo: ${standIn.shows} (not the finished ${product.name})`
          }
          fill
          sizes={sizes}
          preload={preload}
          placeholder="blur"
          style={{ objectPosition: standIn.position ?? "50% 50%" }}
          className="object-cover [filter:sepia(0.12)_saturate(0.9)_contrast(0.98)]"
        />
      ) : (
        <div aria-hidden className="@container absolute inset-0">
          <span className="text-eyebrow absolute top-[7cqw] left-[7cqw] text-cocoa-soft">{product.pack_size}</span>
          <span
            className="serif-editorial absolute bottom-[3cqw] left-[6cqw] right-[-6cqw] block font-heading italic leading-[0.84] tracking-[-0.03em] text-cocoa/90"
            style={{ fontSize: large ? "22cqw" : "24cqw" }}
          >
            {product.name}
          </span>
        </div>
      )}
      {(soldOut || comingSoon) && (
        <span className="text-eyebrow absolute top-3 right-3 rounded-full bg-oat px-3 py-1.5 text-cocoa">
          {comingSoon ? "Coming soon" : "Sold out"}
        </span>
      )}
    </div>
  );
}
