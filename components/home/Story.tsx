import Reveal from "@/components/Reveal";

// Editorial brand story on cocoa. Copy is deliberately non-specific: the founder's
// real story is an open item (prd.md) and is shown as "coming soon" until supplied.
// See docs/redesign/brand-copy.md.
//
// Text-only by decision (2 Oct 2026): no licensed photo of a shared meal was found that
// is both clean (no food near bare ground — a hygiene read for a food brand) and
// authentically Nigerian, so the pull quote carries the section. Add a photo back only
// if it clears both bars (style.md → Photography).
export default function Story() {
  return (
    <section id="story" aria-labelledby="story-title" className="on-dark section-y scroll-mt-16 bg-cocoa text-oat lg:scroll-mt-20">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 sm:px-8 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-16 lg:px-12">
        <Reveal className="lg:col-span-5 lg:col-start-2">
          <p className="text-eyebrow text-plantain">Our story</p>
          <h2 id="story-title" className="text-display-l serif-editorial mt-6">
            Made for <em>sharing.</em>
          </h2>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-10 lg:col-start-2">
          <blockquote className="relative">
            <span aria-hidden className="text-numeral serif-editorial block h-[0.45em] text-plantain">
              &ldquo;
            </span>
            <p className="text-display-m serif-editorial mt-4 max-w-[22ch] italic text-oat/95">
              Every snack here comes with a memory attached — a party, a journey, a person.
            </p>
          </blockquote>
        </Reveal>

        <Reveal delay={200} className="lg:col-span-5 lg:col-start-7">
          <div className="text-body-l space-y-5 border-t border-plantain/40 pt-8 text-oat/80">
            <p>
              For many of us, Nigerian snacks were never just snacks. They were the bowl passed around at a party,
              the paper bag bought on the way home, the treat an aunty pressed into your hand.
            </p>
            <p>
              Igbadun Bites brings those flavours together in one place — for the moments you want to share them
              again, wherever you are now.
            </p>
          </div>
          <p className="mt-10 flex items-center gap-3 text-sm text-oat/60">
            <span className="h-1.5 w-1.5 rounded-full bg-plantain" aria-hidden />
            Our founder&rsquo;s story is coming soon.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
