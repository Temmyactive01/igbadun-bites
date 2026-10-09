import AddToCartButton from "@/components/cart/AddToCartButton";
import type { Product } from "@/lib/types";
import { isComingSoon } from "@/lib/product-status";
import DetailsTrigger from "./DetailsTrigger";
import ProductVisual from "./ProductVisual";

type Props = { product: Product; tint: string };

// Familiar, easy-to-scan product tile: one image, name, price, add.
// The image, the name and "Details & allergens" all open the product detail panel
// (ingredients, allergens, storage); the add control morphs into a quantity stepper.
export default function ProductTile({ product, tint }: Props) {
  const comingSoon = isComingSoon(product);
  const price = `£${Number(product.price_gbp).toFixed(2)}`;
  const pence = Math.round(Number(product.price_gbp) * 100);

  return (
    <article aria-labelledby={`p-${product.id}`} className="group flex h-full flex-col">
      {/* Image and name are mouse/touch shortcuts; "Details & allergens" is the one keyboard stop */}
      <DetailsTrigger product={product} tint={tint} tabIndex={-1} label={`${product.name}: details and allergens`} className="block w-full cursor-pointer text-left">
        <ProductVisual product={product} tint={tint} sizes="(min-width: 768px) 30vw, 48vw" />
      </DetailsTrigger>

      <div className="mt-3 flex flex-1 flex-col sm:mt-4">
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <h3 id={`p-${product.id}`} className="font-heading text-lg leading-snug sm:text-xl lg:text-2xl">
            <DetailsTrigger
              product={product}
              tint={tint}
              tabIndex={-1}
              className="rounded-sm text-left decoration-terracotta/50 underline-offset-4 hover:underline"
            >
              {product.name}
            </DetailsTrigger>
          </h3>
          {/* Coming soon: no price yet */}
          {!comingSoon && <span className="shrink-0 font-medium tabular-nums">{price}</span>}
        </div>
        {/* The product name is added as screen-reader-only text after the visible label
            instead of as an aria-label, so the accessible name still contains the visible
            "Details & allergens" (WCAG 2.5.3 Label in Name). An aria-label of "Details and
            allergens for X" replaced it, and "and" never matches the visible "&". */}
        <DetailsTrigger
          product={product}
          tint={tint}
          className="mt-1 self-start rounded-sm text-xs text-cocoa-soft underline decoration-cocoa/25 underline-offset-4 hover:text-cocoa hover:decoration-terracotta sm:text-sm"
        >
          {comingSoon ? "Details" : <>Details &amp; allergens</>}
          <span className="sr-only"> for {product.name}</span>
        </DetailsTrigger>
        <div className="mt-3 flex flex-1 flex-wrap items-end justify-between gap-2">
          {/* Coming soon: no pack size yet (keeps the button on the right) */}
          <span className="text-xs text-cocoa-soft sm:text-sm">{comingSoon ? "" : product.pack_size}</span>
          <AddToCartButton
            comingSoon={comingSoon}
            soldOut={!product.available}
            item={{ productId: product.id, name: product.name, packSize: product.pack_size, category: product.category, pricePence: pence }}
          />
        </div>
      </div>
    </article>
  );
}
