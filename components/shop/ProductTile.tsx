import AddToCartButton from "@/components/cart/AddToCartButton";
import type { Product } from "@/lib/types";
import ProductVisual from "./ProductVisual";

type Props = { product: Product; tint: string };

// Image-first product tile: no borders, shadows or badges — the image and the
// type do the work. (Phase 3 adds the detail sheet and the morphing add action.)
export default function ProductTile({ product, tint }: Props) {
  const price = `£${Number(product.price_gbp).toFixed(2)}`;
  const pence = Math.round(Number(product.price_gbp) * 100);

  return (
    <article aria-labelledby={`p-${product.id}`} className="group">
      <ProductVisual product={product} tint={tint} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 78vw" />

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 id={`p-${product.id}`} className="text-title serif-editorial">
          {product.name}
        </h3>
        <span className="shrink-0 text-base font-medium tabular-nums">{price}</span>
      </div>
      <p className="mt-2 line-clamp-2 text-cocoa-soft">{product.description}</p>
      <div className="mt-5 flex items-center justify-between gap-4">
        <span className="text-eyebrow text-cocoa-soft">{product.pack_size}</span>
        <AddToCartButton
          soldOut={!product.available}
          item={{ productId: product.id, name: product.name, packSize: product.pack_size, category: product.category, pricePence: pence }}
        />
      </div>
    </article>
  );
}
