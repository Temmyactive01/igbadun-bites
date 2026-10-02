import Hero from "@/components/home/Hero";
import Manifesto from "@/components/home/Manifesto";
import Occasions from "@/components/home/Occasions";
import Practical from "@/components/home/Practical";
import ShopSection from "@/components/home/ShopSection";
import Story from "@/components/home/Story";

// Homepage composition (redesign Phase 1 — see docs/redesign/phase-0-audit.md §7).
// The shop section is still the v1 layout; Phase 2 replaces it with chapters.
export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Manifesto />
      <ShopSection />
      <Story />
      <Occasions />
      <Practical />
    </main>
  );
}
