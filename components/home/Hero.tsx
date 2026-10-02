import Image from "next/image";
import Link from "next/link";
import heroImage from "@/public/images/editorial/hero-peanuts-warm.jpg";

// Cinematic first viewport. The photo (groundnuts in warm, low light) bleeds
// edge to edge; the statement sits in its dark negative space. The header
// floats over it (see HeaderBar), so the section pulls up underneath it.
const LINES = [
  { text: "Bringing back", italic: false },
  { text: "memories,", italic: true },
  { text: "one bite", italic: false },
  { text: "at a time.", italic: false },
];

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="on-dark relative -mt-16 flex min-h-[100svh] flex-col overflow-hidden bg-cocoa text-oat lg:-mt-20"
    >
      <Image
        src={heroImage}
        alt=""
        fill
        preload
        sizes="100vw"
        placeholder="blur"
        className="hero-image object-cover object-[78%_75%] md:object-[70%_80%]"
      />
      {/* Scrims keep the type at full contrast over every crop of the photo */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgb(43_26_18/0.78)_0%,rgb(43_26_18/0.35)_42%,rgb(43_26_18/0.3)_58%,rgb(43_26_18/0.78)_76%,rgb(43_26_18/0.92)_100%)] md:bg-[linear-gradient(100deg,rgb(43_26_18/0.86)_0%,rgb(43_26_18/0.55)_42%,rgb(43_26_18/0.05)_70%),linear-gradient(0deg,rgb(43_26_18/0.7)_0%,transparent_35%)]"
      />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-between px-4 pt-28 pb-8 sm:px-8 lg:px-12 lg:pt-32 lg:pb-10">
        <div>
          <p className="text-eyebrow fade-up text-oat/80" style={{ "--d": "200ms" } as React.CSSProperties}>
            Nigerian snacks <span className="mx-2 text-plantain">·</span> Made for sharing
          </p>
          {/* Size also capped by viewport height so the CTA stays above the fold on laptops */}
          <h1
            id="hero-title"
            className="text-display-xl serif-editorial mt-6 max-w-[11ch] lg:mt-8"
            style={{ fontSize: "clamp(3rem, min(0.5rem + 10.5vw, 12.5svh), 10rem)" }}
          >
            {LINES.map((line, i) => (
              <span key={line.text} className="hero-line">
                <span
                  className={line.italic ? "italic text-plantain" : undefined}
                  style={{ "--d": `${350 + i * 110}ms` } as React.CSSProperties}
                >
                  {line.text}
                </span>
              </span>
            ))}
          </h1>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-12 md:items-end lg:mt-10">
          <div className="fade-up md:col-span-6 lg:col-span-5" style={{ "--d": "900ms" } as React.CSSProperties}>
            <p className="text-body-l max-w-md text-oat/85">
              Chin chin, plantain chips, coconut candy and the rest of the party tray — for pickup, or delivered
              across the UK.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href="#shop"
                className="press inline-flex items-center gap-3 rounded-full bg-plantain px-7 py-4 text-base font-semibold text-cocoa hover:bg-oat"
              >
                Shop the snacks
                <span aria-hidden>↓</span>
              </Link>
              <Link
                href="#story"
                className="rounded-sm text-sm font-medium text-oat underline decoration-oat/40 underline-offset-[6px] transition-colors hover:decoration-plantain"
              >
                Our story
              </Link>
            </div>
          </div>

          <p
            className="fade-up hidden text-right text-sm leading-relaxed text-oat/70 md:col-span-4 md:col-start-9 md:block"
            style={{ "--d": "1100ms" } as React.CSSProperties}
          >
            <span className="text-eyebrow block text-oat/60">Pictured</span>
            <span className="serif-editorial font-heading text-lg italic text-oat/85">
              Groundnuts — a party-tray essential.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
