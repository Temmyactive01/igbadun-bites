import Image from "next/image";
import Reveal from "@/components/Reveal";
import { categoryAnchor } from "@/lib/products";
import { CHAPTERS, FALLBACK_TINT } from "@/lib/shop-content";
import type { Product } from "@/lib/types";
import ProductRail from "./ProductRail";
import ProductTile from "./ProductTile";

type Props = { number: number; category: string; products: Product[] };

// A magazine-style chapter: an opening spread (numeral, title, copy, ingredient
// photo — alternating sides), then that category's products.
export default function Chapter({ number, category, products }: Props) {
  const content = CHAPTERS[category];
  const id = categoryAnchor(category);
  const title = content?.title ?? category;
  const flip = number % 2 === 0; // alternate the image side on desktop

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section-y scroll-mt-28 lg:scroll-mt-36">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* Opening spread */}
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className={`lg:col-span-6 ${flip ? "lg:order-2 lg:col-start-7" : "lg:col-start-1"}`}>
            <div className="flex items-start gap-4 sm:gap-6">
              <span aria-hidden className="text-numeral serif-editorial -mt-2 text-terracotta/90">
                {String(number).padStart(2, "0")}
              </span>
              <div className="pt-1">
                <p className="text-eyebrow text-cocoa-soft">
                  Chapter {String(number).padStart(2, "0")} · {products.length} {products.length === 1 ? "snack" : "snacks"}
                </p>
                <h2 id={`${id}-title`} className="text-display-l serif-editorial mt-4">
                  {title}
                </h2>
              </div>
            </div>
            {content && (
              <div className="mt-8 max-w-xl lg:mt-12">
                <p className="text-title serif-editorial italic">{content.kicker}</p>
                <p className="text-body-l mt-4 text-cocoa-soft">{content.body}</p>
              </div>
            )}
          </Reveal>

          {content?.image && (
            <Reveal delay={100} className={`lg:col-span-5 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-8"}`}>
              <figure>
                <div className="zoom-frame relative aspect-[4/3] overflow-hidden rounded-[4px] lg:aspect-[5/4]">
                  <Image
                    src={content.image.src}
                    alt={content.image.alt}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    placeholder="blur"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-sm text-cocoa-soft">
                  <span className="font-heading italic">Pictured:</span> {content.image.caption.toLowerCase()}
                </figcaption>
              </figure>
            </Reveal>
          )}
        </div>

        {/* Products */}
        <div className="mt-16 lg:mt-24">
          <ProductRail label={title} pair={products.length <= 2}>
            {products.map((product) => (
              <ProductTile key={product.id} product={product} tint={content?.tint ?? FALLBACK_TINT} />
            ))}
          </ProductRail>
        </div>
      </div>
    </section>
  );
}
