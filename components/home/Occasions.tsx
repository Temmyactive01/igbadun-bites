import Image from "next/image";
import Reveal from "@/components/Reveal";
import partyImage from "@/public/images/editorial/small-chops.jpg";
import { CONTACT } from "@/lib/contact";

// Custom snack packs (a confirmed service) — image-led, with a direct WhatsApp route.
export default function Occasions() {
  return (
    <section aria-labelledby="occasions-title" className="section-y">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-4 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12">
        <div className="lg:col-span-5 lg:col-start-2">
          <Reveal>
            <p className="text-eyebrow text-cocoa-soft">Parties, gifts &amp; celebrations</p>
            <h2 id="occasions-title" className="text-display-l serif-editorial mt-6">
              Snack packs for the moments that <em className="text-terracotta">matter.</em>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-body-l mt-8 max-w-lg text-cocoa-soft">
              Birthdays, weddings, naming ceremonies, office treats or a gift for someone far from home — tell us what
              you&rsquo;re celebrating and we&rsquo;ll put together a custom snack pack.
            </p>
            <a
              href={CONTACT.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="press mt-10 inline-flex items-center gap-3 rounded-full bg-cocoa px-7 py-4 text-base font-semibold text-oat hover:bg-terracotta"
            >
              Plan a pack on WhatsApp
              <span aria-hidden>↗</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </Reveal>
        </div>

        <Reveal delay={80} className="lg:col-span-5 lg:col-start-8">
          <figure className="zoom-frame relative aspect-[4/5] rounded-[4px] lg:-mr-12 lg:aspect-[5/6]">
            <Image
              src={partyImage}
              alt="A party tray of small chops — puff puff, samosas and spring rolls"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              placeholder="blur"
              className="object-cover"
            />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
