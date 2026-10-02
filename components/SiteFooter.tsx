import Link from "next/link";
import { CONTACT, SOCIAL_LINKS } from "@/lib/contact";
import { AdireTexture } from "./Textures";

const linkClass =
  "underline decoration-gold/50 underline-offset-4 transition duration-200 ease-brand hover:text-gold hover:decoration-gold";

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-brown text-cream">
      <AdireTexture id="footer-adire" className="text-cream opacity-[0.05]" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="display font-heading text-5xl font-bold sm:text-7xl">
              Igbadun<span className="text-gold">.</span>Bites
            </p>
            <p className="mt-4 font-heading text-xl italic text-cream/85">Bringing Back Memories, One Bite at a Time.</p>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-gold" style={{ fontFamily: "var(--font-sans)" }}>
              Get in touch
            </h2>
            <ul className="mt-4 space-y-2.5 text-cream/90">
              <li>
                Call{" "}
                <a href={CONTACT.phoneHref} className={linkClass}>
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Message us on WhatsApp
                </a>
              </li>
              <li>
                <a href={CONTACT.emailHref} className={`${linkClass} break-all`}>
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-gold" style={{ fontFamily: "var(--font-sans)" }}>
              How we serve
            </h2>
            <ul className="mt-4 space-y-2.5 text-cream/90">
              <li>Pickup &amp; delivery</li>
              <li>
                Custom snack packs for events, parties &amp; gifts —{" "}
                <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  ask us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-cream/15 pt-6 text-sm text-cream/60 sm:flex-row sm:justify-between">
          <p>More coming soon: About us · Party catering · Gifts &amp; event packs · FAQs · Policies</p>
          <p>
            {SOCIAL_LINKS.length === 0
              ? "Instagram · TikTok · Facebook — coming soon"
              : SOCIAL_LINKS.map((link, i) => (
                  <span key={link.label}>
                    {i > 0 && " · "}
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-cream/30 underline-offset-4 transition duration-200 ease-brand hover:text-cream hover:decoration-gold"
                    >
                      {link.label}
                    </a>
                  </span>
                ))}
            <span className="mx-2 text-cream/30" aria-hidden>
              |
            </span>
            <Link href="/privacy" className="underline decoration-cream/30 underline-offset-4 transition duration-200 ease-brand hover:text-cream hover:decoration-gold">
              Privacy
            </Link>
            <span className="mx-2 text-cream/30" aria-hidden>
              |
            </span>
            <Link href="/credits" className="underline decoration-cream/30 underline-offset-4 transition duration-200 ease-brand hover:text-cream hover:decoration-gold">
              Photo credits
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
