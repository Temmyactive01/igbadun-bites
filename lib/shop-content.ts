import type { StaticImageData } from "next/image";
import coconutImage from "@/public/images/editorial/coconuts-market.jpg";
import groundnutImage from "@/public/images/editorial/groundnut-roasting.jpg";
import plantainChipsImage from "@/public/images/editorial/plantain-chips-tray.jpg";

// Editorial content for the shop's category "chapters" (docs/redesign/brand-copy.md).
// Keyed by the category name stored in Supabase. A category without an entry
// still appears, with a plain title and no image.

export type ChapterContent = {
  title: string; // display title (can differ from the database category name)
  shortTitle: string; // used in the chapter index, so it fits a phone screen without scrolling
  kicker: string; // one-line headline
  body: string;
  image?: { src: StaticImageData; alt: string; caption: string };
  tint: string; // background for product labels in this chapter (meaningful, not decorative rotation)
};

export const CHAPTERS: Record<string, ChapterContent> = {
  Chips: {
    title: "Chips",
    shortTitle: "Chips",
    kicker: "Golden, thin and loud.",
    body: "Plantain and cocoyam chips with that unmistakable snap — the bag that never makes it home unopened.",
    image: { src: plantainChipsImage, alt: "Plantain chips in small clear bags, fanned out on a hawker’s tray", caption: "Plantain chips, bagged up on a hawker’s tray" },
    tint: "#ead7ae", // plantain wash
  },
  "Crunchy snacks": {
    title: "Crunchy snacks",
    shortTitle: "Crunchy",
    kicker: "The sound of every party tray.",
    body: "Chin chin, kokoro, akara, gurundi and groundnuts — for long journeys, late conversations and “just one more handful”.",
    image: { src: groundnutImage, alt: "A woman roasting groundnuts in a pan over a coal pot", caption: "Groundnuts roasting over a coal pot" },
    tint: "#e3d3ba", // groundnut
  },
  "Traditional treats and sweets": {
    title: "Traditional treats & sweets",
    shortTitle: "Treats",
    kicker: "The sweets you saved for later.",
    body: "Coconut candy, baba dudu, condensed milk sweets and more — the ones you counted out in your palm and made last all afternoon.",
    image: { src: coconutImage, alt: "Coconuts piled on a wooden market stall", caption: "Coconuts at Bakin Dogo Market, Kaduna" },
    tint: "#ebd2c2", // terracotta wash
  },
};

export const FALLBACK_TINT = "#e8dbc5";

// The product given its own spread at the top of the shop ("Start here").
// Change this name to feature a different product; if it isn't found or is sold
// out, the first available product is used instead.
export const FEATURED_PRODUCT_NAME = "Milky Chin Chin";
