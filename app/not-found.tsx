import Link from "next/link";
import PageIntro from "@/components/ui/PageIntro";
import { buttonMd, buttonPrimary, buttonSecondary, textLink } from "@/components/ui/styles";
import { CONTACT } from "@/lib/contact";

// Shown for any address that doesn't exist, and wherever the code calls notFound()
// (e.g. /checkout/success without a real order). Renders inside the root layout, so the
// header, footer and basket come along — the default Next.js 404 did not look like us.
export const metadata = { title: "Page not found — Igbadun Bites" };

export default function NotFound() {
  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-[1440px] px-4 py-[clamp(3.5rem,2rem+5vw,7rem)] sm:px-8 lg:px-12">
        <div className="max-w-xl">
          <PageIntro eyebrow="Page not found">
            That page has <em>gone walkabout.</em>
          </PageIntro>
          <p className="text-body-l mt-8 text-cocoa-soft">
            The link might be old, or we may have moved things around. The snacks are all still
            here though.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href="/#shop" className={`${buttonPrimary} ${buttonMd}`}>
              Browse the snacks
            </Link>
            <Link href="/" className={`${buttonSecondary} ${buttonMd}`}>
              Back to the start
            </Link>
          </div>

          <p className="mt-12 text-sm text-cocoa-soft">
            Looking for something in particular?{" "}
            <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className={textLink}>
              Message us on WhatsApp
              <span className="sr-only"> (opens in a new tab)</span>
            </a>{" "}
            and we&rsquo;ll point you to it.
          </p>
        </div>
      </div>
    </main>
  );
}
