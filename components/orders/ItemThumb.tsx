import Image from "next/image";
import { productImageKey, productImageSrc } from "@/lib/product-images";
import { CHAPTERS, FALLBACK_TINT } from "@/lib/shop-content";
import { STAND_IN_IMAGES } from "@/lib/stand-in-images";

type Props = { name: string; category?: string; className?: string };

// Small square product image for basket and order lines: the real product photo when
// it exists, otherwise the stand-in, otherwise just the category colour. Decorative —
// the product name is always written next to it.
export default function ItemThumb({ name, category, className = "h-16 w-16" }: Props) {
  const photo = productImageSrc(name);
  const standIn = photo ? null : STAND_IN_IMAGES[productImageKey(name)];
  const tint = (category && CHAPTERS[category]?.tint) || FALLBACK_TINT;

  return (
    <span aria-hidden className={`relative block shrink-0 overflow-hidden rounded-md ${className}`} style={{ backgroundColor: tint }}>
      {(photo || standIn) && (
        <Image
          src={photo ?? standIn!.src}
          alt=""
          fill
          sizes="64px"
          style={{ objectPosition: standIn?.position ?? "50% 50%" }}
          className={`object-cover ${standIn ? "[filter:sepia(0.12)_saturate(0.9)_contrast(0.98)]" : ""}`}
        />
      )}
    </span>
  );
}
