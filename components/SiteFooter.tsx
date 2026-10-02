import Link from "next/link";
import { CONTACT, SOCIAL_LINKS } from "@/lib/contact";
import { AdireTexture } from "./Textures";

// Closing composition (Phase 5, phase-0-audit §7.9): a last line and the shop CTA,
// then contact, links and socials, and the oversized wordmark as the final graphic.
// The adire pattern appears once on the site — here, as a single band (style.md →
// Pattern & ornament).
const linkClass =
  "rounded-sm underline decoration-oat/30 underline-offset-4 transition-colors duration-200 hover:text-oat hover:decoration-plantain";
const headingClass = "text-eyebrow text-plantain";

export default function SiteFooter() {
  return (
    <footer className="on-dark relative overflow-hidden bg-cocoa text-oat">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* Closing line + CTA */}
        <div className="grid gap-10 pt-[clamp(5rem,3rem+6vw,9rem)] pb-16 lg:grid-cols-12 lg:items-end lg:gap-8">
          <p className="text-display-l serif-editorial lg:col-span-8">
            Bring back a <em className="text-plantain">memory.</em>
          </p>
          <div className="lg:col-span-4 lg:justify-self-end">
            <Link
              href="/#shop"
              className="press inline-flex h-14 items-center gap-3 rounded-full bg-plantain px-8 font-semibold text-cocoa hover:bg-oat"
            >
              Shop the snacks <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* The one deliberate pattern moment */}
      <div aria-hidden className="relative h-10 border-y border-oat/10 text-oat opacity-[0.12]">
        <AdireTexture id="footer-adire" />
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <h2 className={headingClass}>Get in touch</h2>
            <ul className="mt-5 space-y-3 text-oat/85">
              <li>
                Call{" "}
                <a href={CONTACT.phoneHref} className={linkClass}>
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Message us on WhatsApp<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a href={CONTACT.emailHref} className={`${linkClass} break-all`}>
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h2 className={headingClass}>How we serve</h2>
            <ul className="mt-5 space-y-3 text-oat/85">
              <li>Pickup, or delivery across the UK</li>
              <li>
                Custom snack packs for events, parties &amp; gifts —{" "}
                <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  ask us<span className="sr-only"> on WhatsApp (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label="Footer" className="lg:col-span-3 lg:col-start-10">
            <h2 className={headingClass}>Explore</h2>
            <ul className="mt-5 space-y-3 text-oat/85">
              <li>
                <Link href="/#shop" className={linkClass}>
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/#story" className={linkClass}>
                  Our story
                </Link>
              </li>
              <li>
                <Link href="/orders" className={linkClass}>
                  My orders
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Small print */}
        <div className="flex flex-col gap-3 border-t border-oat/15 py-6 text-sm text-oat/70 lg:flex-row lg:justify-between">
          <p>More coming soon: About us · Party catering · Gifts &amp; event packs · FAQs · Policies</p>
          <p className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {SOCIAL_LINKS.length === 0 ? (
              <span>Instagram · TikTok · Facebook — coming soon</span>
            ) : (
              SOCIAL_LINKS.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {link.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))
            )}
            <Link href="/privacy" className={linkClass}>
              Privacy
            </Link>
            <Link href="/credits" className={linkClass}>
              Photo credits
            </Link>
          </p>
        </div>
      </div>

      {/* Oversized wordmark — the final graphic element, cropped by the page edge. Drawn with
          CSS generated content: it's a decorative logotype, not text to read. */}
      <p
        aria-hidden
        className="pointer-events-none mx-auto -mb-[0.18em] max-w-[1440px] px-2 font-heading text-[clamp(4.5rem,1rem+17vw,17rem)] leading-[0.8] tracking-[-0.04em] whitespace-nowrap text-oat/[0.07] select-none sm:px-6 lg:px-10"
      >
        <span className="serif-editorial before:content-['Igbadun']" />
        <span className="text-plantain/40 before:content-['.']" />
        <span className="serif-editorial italic before:content-['Bites']" />
      </p>
    </footer>
  );
}
