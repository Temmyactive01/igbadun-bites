import Link from "next/link";
import AddToCartButton from "@/components/cart/AddToCartButton";
import Reveal from "@/components/Reveal";
import { INGREDIENT_IMAGES } from "@/lib/ingredient-images";
import { productImageKey, productImageSrc } from "@/lib/product-images";
import { categoryAnchor } from "@/lib/products";
import { CHAPTERS, FALLBACK_TINT } from "@/lib/shop-content";
import type { Product } from "@/lib/types";
import ProductVisual from "./ProductVisual";

// One product given a full composition: large visual, generous type, one action.
export default function FeaturedProduct({ product }: { product: Product }) {
  const chapter = CHAPTERS[product.category];
  const pence = Math.round(Number(product.price_gbp) * 100);
  // Large image, so say plainly when it shows an ingredient rather than the snack
  const ingredient = productImageSrc(product.name) ? null : INGREDIENT_IMAGES[productImageKey(product.name)];

  return (
    <section aria-labelledby="featured-title" className="border-y border-cocoa/10 bg-offwhite">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 py-16 sm:px-8 md:grid-cols-12 md:gap-8 lg:px-12 lg:py-24">
        <Reveal className="md:col-span-6 lg:col-span-5 lg:col-start-2">
          <ProductVisual
            product={product}
            tint={chapter?.tint ?? FALLBACK_TINT}
            sizes="(min-width: 768px) 45vw, 100vw"
            large
          />
          {ingredient && (
            <p className="mt-3 text-sm text-cocoa-soft">
              <span className="font-heading italic">Pictured:</span> {ingredient.ingredient} — an ingredient, not the
              finished snack.
            </p>
          )}
        </Reveal>

        <Reveal delay={120} className="md:col-span-6 lg:col-span-4 lg:col-start-8">
          <p className="text-eyebrow text-terracotta">Start here</p>
          <h3 id="featured-title" className="text-display-m serif-editorial mt-5">
            {product.name}
          </h3>
          <p className="text-body-l mt-6 max-w-md text-cocoa-soft">{product.description}</p>
          <p className="mt-8 flex items-baseline gap-4">
            <span className="font-heading text-3xl tabular-nums">£{Number(product.price_gbp).toFixed(2)}</span>
            <span className="text-sm text-cocoa-soft">{product.pack_size}</span>
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <AddToCartButton
              variant="feature"
              soldOut={!product.available}
              item={{ productId: product.id, name: product.name, packSize: product.pack_size, category: product.category, pricePence: pence }}
            />
            <Link
              href={`#${categoryAnchor(product.category)}`}
              className="rounded-sm text-sm font-medium underline decoration-terracotta/50 underline-offset-[6px] hover:decoration-terracotta"
            >
              More {(chapter?.title ?? product.category).toLowerCase()}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
