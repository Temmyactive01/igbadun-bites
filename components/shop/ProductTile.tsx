import AddToCartButton from "@/components/cart/AddToCartButton";
import type { Product } from "@/lib/types";
import ProductVisual from "./ProductVisual";

type Props = { product: Product; tint: string };

// Familiar, easy-to-scan product tile: one image, name, price, add.
// (Phase 3 adds the detail sheet — description, ingredients, allergens — and the
// morphing add action.)
export default function ProductTile({ product, tint }: Props) {
  const price = `£${Number(product.price_gbp).toFixed(2)}`;
  const pence = Math.round(Number(product.price_gbp) * 100);

  return (
    <article aria-labelledby={`p-${product.id}`} className="group flex h-full flex-col">
      <ProductVisual product={product} tint={tint} sizes="(min-width: 768px) 30vw, 48vw" />

      <div className="mt-3 flex flex-1 flex-col sm:mt-4">
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <h3 id={`p-${product.id}`} className="font-heading text-lg leading-snug sm:text-xl lg:text-2xl">
            {product.name}
          </h3>
          <span className="shrink-0 font-medium tabular-nums">{price}</span>
        </div>
        <div className="mt-3 flex flex-1 items-end justify-between gap-2">
          <span className="text-xs text-cocoa-soft sm:text-sm">{product.pack_size}</span>
          <AddToCartButton
            soldOut={!product.available}
            item={{ productId: product.id, name: product.name, packSize: product.pack_size, category: product.category, pricePence: pence }}
          />
        </div>
      </div>
    </article>
  );
}
