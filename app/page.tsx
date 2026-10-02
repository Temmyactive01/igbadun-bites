import Hero from "@/components/home/Hero";
import Manifesto from "@/components/home/Manifesto";
import Occasions from "@/components/home/Occasions";
import Practical from "@/components/home/Practical";
import ShopSection from "@/components/shop/ShopSection";
import Story from "@/components/home/Story";

// Homepage composition (redesign Phase 1 — see docs/redesign/phase-0-audit.md §7).
// Shop: chapters + featured product (Phase 2).
export default function Home() {
  return (
    <main id="main" className="flex-1">
      <Hero />
      <Manifesto />
      <ShopSection />
      <Story />
      <Occasions />
      <Practical />
    </main>
  );
}
