import Divider from "@/components/Divider";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { AdireTexture } from "@/components/Textures";
import { CONTACT } from "@/lib/contact";
import { categoryAnchor, getProducts, groupByCategory } from "@/lib/products";

const numberWords = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen"];

export default async function Home() {
  const { products, error } = await getProducts();
  const groups = groupByCategory(products);
  const countText = numberWords[products.length] ?? String(products.length);

  // Catalogue numbers run 01, 02, 03… across the whole shop, in display order:
  // each category starts where the previous one ended.
  const startNumbers = groups.map((_, gi) => groups.slice(0, gi).reduce((n, g) => n + g.products.length, 1));

  return (
    <>
      <main className="flex-1">
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden">
          <div className="texture-grid absolute inset-0" aria-hidden />
          <div
            className="absolute inset-y-0 right-0 w-full text-brown sm:w-2/3"
            style={{ maskImage: "linear-gradient(to left, black 10%, transparent 90%)" }}
            aria-hidden
          >
            <AdireTexture id="hero-adire" className="opacity-[0.07]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-16 sm:px-8 sm:pt-24 sm:pb-24">
            <Reveal>
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-forest">
                <span className="h-px w-10 bg-gold" />
                Nigerian snacks · Delivered across the UK
              </p>
            </Reveal>

            <h1 className="display mt-6 text-[clamp(3.25rem,11vw,9rem)] font-extrabold">
              <Reveal as="span" delay={80} className="block">
                Bringing back
              </Reveal>
              <Reveal as="span" delay={180} className="block">
                <em className="font-semibold text-terracotta">memories,</em>
              </Reveal>
              <Reveal as="span" delay={280} className="block">
                one bite at a time.
              </Reveal>
            </h1>

            <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-end">
              <Reveal delay={400} className="lg:col-span-5">
                <p className="text-lg leading-relaxed text-brown-soft sm:text-xl">
                  The chin chin from your auntie&rsquo;s party tray. The coconut candy from the school gate.
                  Nigerian snacks, packed with care and sent to your door.
                </p>
              </Reveal>
              <Reveal delay={500} className="lg:col-span-4 lg:col-start-9">
                <div className="flex flex-col items-start gap-5">
                  <Divider count={7} />
                  <a
                    href="#shop"
                    className="press inline-flex items-center gap-3 rounded-full bg-gold px-7 py-4 font-semibold text-brown shadow-warm hover:bg-brown hover:text-cream"
                  >
                    Shop the snacks
                    <span aria-hidden>↓</span>
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------- Shop (live catalog from Supabase) ---------- */}
        <section id="shop" className="relative scroll-mt-4 border-t border-brown/10 bg-cream-deep/40">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-8 sm:py-28">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <Reveal className="lg:col-span-7">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-forest">The shop</p>
                <h2 className="display mt-4 text-[clamp(2.5rem,6vw,4.75rem)] font-bold">
                  A taste of <em className="font-semibold text-gold-dark">home.</em>
                </h2>
              </Reveal>
              {products.length > 0 && (
                <Reveal delay={120} className="lg:col-span-4 lg:col-start-9">
                  <p className="text-brown-soft">
                    {countText} snacks across chips, crunchy bites and traditional sweets — pick your favourites.
                  </p>
                </Reveal>
              )}
            </div>

            {error ? (
              <div className="mt-12 rounded-[1.75rem] border border-dashed border-brown/25 p-10 text-center">
                <p className="font-heading text-2xl font-semibold">The shop is taking a short break.</p>
                <p className="mt-2 text-brown-soft">We couldn&rsquo;t load our snacks just now — please refresh in a moment.</p>
              </div>
            ) : (
              <>
                {/* Category jump links */}
                <nav aria-label="Snack categories" className="mt-10 flex flex-wrap gap-2.5">
                  {groups.map((g) => (
                    <a
                      key={g.category}
                      href={`#${categoryAnchor(g.category)}`}
                      className="press rounded-full border border-brown/20 bg-cream px-4 py-2 text-sm font-medium hover:border-brown hover:bg-brown hover:text-cream"
                    >
                      {g.category} <span className="text-brown-soft/70">· {g.products.length}</span>
                    </a>
                  ))}
                </nav>

                <div className="mt-12 space-y-14 sm:mt-14 sm:space-y-24">
                  {groups.map((group, groupIndex) => (
                    <section
                      key={group.category}
                      id={categoryAnchor(group.category)}
                      aria-labelledby={`${categoryAnchor(group.category)}-title`}
                      className="grid scroll-mt-6 gap-5 sm:gap-8 lg:grid-cols-12"
                    >
                      {/* Sticky editorial label on desktop; a simple heading on phones */}
                      <Reveal className="lg:col-span-3">
                        <div className="lg:sticky lg:top-8">
                          <p className="display font-heading text-5xl font-bold text-gold sm:text-7xl">
                            {String(groupIndex + 1).padStart(2, "0")}
                          </p>
                          <h3
                            id={`${categoryAnchor(group.category)}-title`}
                            className="display mt-2 text-3xl font-bold sm:text-4xl"
                          >
                            {group.category}
                          </h3>
                          <p className="mt-3 text-sm text-brown-soft">
                            {group.products.length} {group.products.length === 1 ? "snack" : "snacks"}
                          </p>
                        </div>
                      </Reveal>

                      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:col-span-9 xl:grid-cols-3">
                        {group.products.map((product, i) => (
                          <Reveal key={product.id} delay={(i % 3) * 100} className="h-full">
                            <ProductCard
                              product={product}
                              number={startNumbers[groupIndex] + i}
                              toneIndex={i + groupIndex}
                            />
                          </Reveal>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>

                {/* Quiet note: the catalog isn't exhaustive */}
                <div className="mt-14 grid sm:mt-16 lg:grid-cols-12">
                  <p className="flex items-start gap-3 border-t border-brown/10 pt-6 text-brown-soft lg:col-span-9 lg:col-start-4">
                    <span className="mt-[0.45em] h-2 w-2 shrink-0 rotate-45 border border-gold" aria-hidden />
                    <span>
                      Don&rsquo;t see what you&rsquo;re after?{" "}
                      <a
                        href={CONTACT.whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-brown underline decoration-gold/60 underline-offset-4 transition duration-200 ease-brand hover:text-gold-dark hover:decoration-gold"
                      >
                        Message us on WhatsApp
                      </a>{" "}
                      — we&rsquo;re happy to help.
                    </span>
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
