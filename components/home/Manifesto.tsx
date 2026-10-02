import Reveal from "@/components/Reveal";

// One oversized sentence with room to breathe — the brand's point of view.
export default function Manifesto() {
  return (
    <section aria-label="What Igbadun Bites is about" className="section-y">
      <div className="mx-auto grid max-w-[1440px] px-4 sm:px-8 lg:grid-cols-12 lg:px-12">
        <Reveal className="lg:col-span-10 lg:col-start-2">
          <p className="text-eyebrow text-cocoa-soft">
            <span className="mr-3 inline-block h-px w-10 translate-y-[-0.3em] bg-terracotta align-middle" aria-hidden />
            Igbadun Bites
          </p>
          <p className="text-display-m serif-editorial mt-8 max-w-[22ch] text-balance">
            The taste of Saturday parties, school gates and an auntie&rsquo;s kitchen —{" "}
            <em className="text-terracotta">wrapped up and brought back to you.</em>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
