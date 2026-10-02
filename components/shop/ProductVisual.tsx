import Image from "next/image";
import { productImageSrc } from "@/lib/product-images";
import type { Product } from "@/lib/types";

type Props = {
  product: Product;
  tint: string;
  sizes: string;
  large?: boolean;
  preload?: boolean;
};

// The image area of a product: the real product photo if one exists in
// public/images/products/, otherwise a typographic "label" — never a stock photo
// standing in for the product (style.md → Photography).
export default function ProductVisual({ product, tint, sizes, large = false, preload = false }: Props) {
  const photo = productImageSrc(product.name);
  const soldOut = !product.available;

  return (
    <div
      className={`zoom-frame relative aspect-[4/5] overflow-hidden rounded-[4px] ${soldOut ? "opacity-70 grayscale-[50%]" : ""}`}
      style={{ backgroundColor: tint }}
    >
      {photo ? (
        <Image src={photo} alt={product.name} fill sizes={sizes} preload={preload} className="object-cover" />
      ) : (
        // Label placeholder: the name set oversized and cropped by the frame, like an
        // editorial cover line. Sizes use container units (cqw) so it scales with the tile.
        <div aria-hidden className="@container absolute inset-0">
          <div className="absolute top-[7cqw] right-[7cqw] left-[7cqw] flex items-center justify-between">
            <span className="text-eyebrow flex items-center gap-3 text-cocoa-soft">
              <span className="h-px w-6 bg-terracotta" />
              {product.pack_size}
            </span>
            {!soldOut && <span className="text-eyebrow text-cocoa-soft">Igbadun Bites</span>}
          </div>
          <span
            className="serif-editorial absolute bottom-[3cqw] left-[6cqw] right-[-6cqw] block font-heading italic leading-[0.84] tracking-[-0.03em] text-cocoa/90 [overflow-wrap:normal]"
            style={{ fontSize: large ? "22cqw" : "24cqw" }}
          >
            {product.name}
          </span>
        </div>
      )}
      {soldOut && (
        <span className="text-eyebrow absolute top-[5cqw] right-[5cqw] rounded-full bg-oat px-3 py-1.5 text-cocoa">Sold out</span>
      )}
    </div>
  );
}
