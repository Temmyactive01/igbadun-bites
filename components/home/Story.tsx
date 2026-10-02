import Image from "next/image";
import Reveal from "@/components/Reveal";
import sharingImage from "@/public/images/editorial/buffet-plate.jpg";

// Editorial brand story on cocoa. Copy is deliberately non-specific: the founder's
// real story is an open item (prd.md) and is shown as "coming soon" until supplied.
// See docs/redesign/brand-copy.md.
//
// Photo (2 Oct 2026): a guest's plate filled at a Nigerian party buffet — clean surface,
// hands only. Any replacement must clear the hygiene and authenticity bars in
// style.md → Photography; if none does, use a text-only layout instead.
export default function Story() {
  return (
    <section id="story" aria-labelledby="story-title" className="on-dark section-y scroll-mt-16 bg-cocoa text-oat lg:scroll-mt-20">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12">
        <Reveal className="lg:col-span-6 lg:row-span-2">
          <figure className="zoom-frame relative aspect-[4/5] rounded-[4px] md:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src={sharingImage}
              alt="A guest’s plate being filled at a Nigerian party buffet: fried rice, samosa, meat and coleslaw"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              placeholder="blur"
              style={{ objectPosition: "45% 50%" }}
              className="object-cover"
            />
          </figure>
        </Reveal>

        <div className="lg:col-span-5 lg:col-start-8 lg:self-center">
          <Reveal>
            <p className="text-eyebrow text-plantain">Our story</p>
            <h2 id="story-title" className="text-display-l serif-editorial mt-6">
              Made for <em>sharing.</em>
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <blockquote className="mt-10 border-l border-plantain/60 pl-6">
              <p className="text-title serif-editorial italic text-oat/95">
                &ldquo;Every snack here comes with a memory attached — a party, a journey, a person.&rdquo;
              </p>
            </blockquote>
          </Reveal>

          <Reveal delay={200}>
            <div className="text-body-l mt-10 space-y-5 text-oat/80">
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
      </div>
    </section>
  );
}
