import Link from "next/link";
import { EDITORIAL_CREDITS } from "@/lib/editorial-credits";
import { STAND_IN_IMAGES } from "@/lib/stand-in-images";

export const metadata = {
  title: "Photo credits — Igbadun Bites",
  description: "Credits and licences for the photographs used on the Igbadun Bites site.",
};

// Public attribution for every licensed photo (required by CC BY / BY-SA licences,
// and good practice for CC0 and Pexels too).
const linkClass = "underline decoration-terracotta/50 underline-offset-4 hover:decoration-terracotta";

function Credit({ title, author, license, licenseUrl, source }: { title: string; author: string; license: string; licenseUrl: string; source: string }) {
  return (
    <>
      <a href={source} target="_blank" rel="noopener noreferrer" className={linkClass}>
        “{title}”
      </a>{" "}
      by {author} —{" "}
      <a href={licenseUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {license}
      </a>
    </>
  );
}

export default function CreditsPage() {
  // List each source once, in case two tiles share a photo
  const productCredits = Object.entries(STAND_IN_IMAGES).filter(
    ([, img], i, all) => all.findIndex(([, other]) => other.credit.source === img.credit.source) === i
  );

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-8 sm:py-20">
        <p className="text-eyebrow text-cocoa-soft">Photo credits</p>
        <h1 className="text-display-l serif-editorial mt-5">With thanks.</h1>
        <p className="text-body-l mt-6 text-cocoa-soft">
          Until our own product photography is ready, the shop uses licensed photos from other photographers. They show
          typical versions of each snack — <strong className="font-medium text-cocoa">not Igbadun Bites&rsquo; own products</strong>.
        </p>

        <section aria-labelledby="product-photos" className="mt-12">
          <h2 id="product-photos" className="text-title serif-editorial">Product stand-in photos</h2>
          <ul className="mt-5 divide-y divide-cocoa/10 border-y border-cocoa/10">
            {productCredits.map(([key, img]) => (
              <li key={key} className="py-4 text-cocoa-soft">
                <span className="block text-sm font-medium text-cocoa">
                  {img.kind === "snack" ? `Shows ${img.shows}` : `Shows ${img.shows} (ingredient)`}
                </span>
                <Credit {...img.credit} />
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-cocoa-soft">
            Photos are cropped and colour-graded for display. Adaptations of CC BY-SA photos are shared under the same licence.
          </p>
        </section>

        <section aria-labelledby="editorial-photos" className="mt-12">
          <h2 id="editorial-photos" className="text-title serif-editorial">Other photography</h2>
          <ul className="mt-5 divide-y divide-cocoa/10 border-y border-cocoa/10">
            {EDITORIAL_CREDITS.map((c) => (
              <li key={c.source} className="py-4 text-cocoa-soft">
                <span className="block text-sm font-medium text-cocoa">{c.use}</span>
                <Credit {...c} />
              </li>
            ))}
          </ul>
        </section>

        <Link
          href="/#shop"
          className="press mt-12 inline-flex rounded-full bg-cocoa px-6 py-3 font-semibold text-oat hover:bg-terracotta"
        >
          Back to the shop
        </Link>
      </div>
    </main>
  );
}
