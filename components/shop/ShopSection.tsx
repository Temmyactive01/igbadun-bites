import Reveal from "@/components/Reveal";
import { CONTACT } from "@/lib/contact";
import { categoryAnchor, getProducts, groupByCategory } from "@/lib/products";
import { CHAPTERS, FEATURED_PRODUCT_NAME } from "@/lib/shop-content";
import Chapter from "./Chapter";
import ChapterIndex from "./ChapterIndex";
import FeaturedProduct from "./FeaturedProduct";

const numberWords = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"];

// Product discovery (redesign Phase 2): intro, sticky chapter index, a featured
// product, then one magazine "chapter" per category.
export default async function ShopSection() {
  const { products, error } = await getProducts();
  const groups = groupByCategory(products);
  const featured =
    products.find((p) => p.name === FEATURED_PRODUCT_NAME && p.available) ?? products.find((p) => p.available);
  const count = numberWords[products.length] ?? String(products.length);

  return (
    <section id="shop" aria-labelledby="shop-title" className="scroll-mt-16 lg:scroll-mt-20">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 pt-[clamp(4rem,2rem+6vw,8rem)] pb-14 sm:px-8 lg:grid-cols-12 lg:items-end lg:px-12">
        <Reveal className="lg:col-span-7">
          <p className="text-eyebrow text-cocoa-soft">The shop</p>
          <h2 id="shop-title" className="text-display-l serif-editorial mt-6">
            A taste of <em className="text-terracotta">home.</em>
          </h2>
        </Reveal>
        {!error && products.length > 0 && (
          <Reveal delay={120} className="lg:col-span-4 lg:col-start-9">
            <p className="text-body-l text-cocoa-soft">
              {count} snacks in {groups.length} chapters — from the crunch of the party tray to the sweets you saved
              for later.
            </p>
            <p className="mt-4 text-sm text-cocoa-soft">
              Photos show ingredients, not the finished snacks — product photography is coming soon.
            </p>
          </Reveal>
        )}
      </div>

      {error ? (
        <div className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-8 lg:px-12">
          <div className="border-y border-cocoa/15 py-16 text-center">
            <p className="text-title serif-editorial">The shop is taking a short break.</p>
            <p className="mt-3 text-cocoa-soft">We couldn&rsquo;t load our snacks just now — please refresh in a moment.</p>
          </div>
        </div>
      ) : (
        <>
          <ChapterIndex
            items={groups.map((g) => ({
              id: categoryAnchor(g.category),
              title: CHAPTERS[g.category]?.title ?? g.category,
              shortTitle: CHAPTERS[g.category]?.shortTitle ?? g.category,
              count: g.products.length,
            }))}
          />

          {featured && <FeaturedProduct product={featured} />}

          {groups.map((group, i) => (
            <Chapter key={group.category} number={i + 1} category={group.category} products={group.products} />
          ))}

          {/* Quiet note: the catalogue isn't exhaustive */}
          <div className="mx-auto max-w-[1440px] px-4 pb-[clamp(4rem,2rem+6vw,8rem)] sm:px-8 lg:px-12">
            <p className="border-t border-cocoa/15 pt-8 text-body-l text-cocoa-soft">
              Don&rsquo;t see what you&rsquo;re after?{" "}
              <a
                href={CONTACT.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-cocoa underline decoration-terracotta/50 underline-offset-4 hover:decoration-terracotta"
              >
                Message us on WhatsApp
                <span className="sr-only"> (opens in a new tab)</span>
              </a>{" "}
              — we&rsquo;re happy to help.
            </p>
          </div>
        </>
      )}
    </section>
  );
}
