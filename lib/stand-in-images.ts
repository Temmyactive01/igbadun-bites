import type { StaticImageData } from "next/image";
import akara from "@/public/images/stand-in/akara-ogbomosho.jpg";
import coconutCandy from "@/public/images/stand-in/coconut-candy.jpg";
import condensedMilk from "@/public/images/stand-in/condensed-milk-sweet.jpg";
import flakesChinChin from "@/public/images/stand-in/flakes-chin-chin.jpg";
import gurundi from "@/public/images/stand-in/gurundi.jpg";
import peanuts from "@/public/images/stand-in/peanuts.jpg";
import plantainChips from "@/public/images/stand-in/plantain-chips.jpg";

// STAND-IN product photos, shown until the owner's own product photography exists
// (public/images/products/ always wins — see docs/content-guide.md). A product's entry
// is removed once her photo replaces it, which also removes its credit from /credits
// (Oct 2026: Cocoyam Chips, Kokoro Egba, Chin Chin, Sisi Pelebe, Babadudu, Donkwa).
//
// Decision (2 Oct 2026, owner/business): show generic photos of each snack so tiles
// are recognisable. Photo direction (2 Oct 2026, client): prefer photos taken in
// Nigeria / West Africa — market stalls, hawkers' trays, home kitchens — over generic
// studio shots, wherever an accurate one exists. Rules: licensed for commercial use
// only (never copied from other sites), no visible brands/labels, credited publicly
// on /credits, and the shop says these are stand-ins, not our own product.
//
// kind "snack": a generic photo of that snack · kind "ingredient": no licensed snack
// photo could be found, so an ingredient photo stands in.
// ⚠ check: the owner should confirm the photo matches her product.

export type StandIn = {
  src: StaticImageData;
  kind: "snack" | "ingredient";
  shows: string; // plain description, used in alt text and captions
  position?: string; // CSS object-position for the crop
  check?: string; // why the owner should confirm it
  credit: { title: string; author: string; license: string; licenseUrl: string; source: string };
};

const CC0 = { license: "CC0 1.0 (public domain)", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/" };
const BY_SA_4 = { license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" };

const NOT_NIGERIAN = "Not photographed in Nigeria — no licensed Nigerian photo of this snack was found.";

export const STAND_IN_IMAGES: Record<string, StandIn> = {

  "plantain-chips": {
    src: plantainChips, kind: "snack", shows: "plantain chips (ipekere) in a market basin", position: "50% 60%",
    credit: { title: "Ipekere", author: "Bibiire1", ...BY_SA_4, source: "https://commons.wikimedia.org/w/index.php?curid=115812555" },
  },
  "akara-ogbomosho": {
    src: akara, kind: "snack", shows: "crunchy akara",
    credit: { title: "AKARA", author: "Linason Blessing", ...BY_SA_4, source: "https://commons.wikimedia.org/w/index.php?curid=102907742" },
  },


  "flakes-chin-chin": {
    src: flakesChinChin, kind: "snack", shows: "chin chin crunch (flaked style)", position: "50% 55%",
    check: "Photo is titled “chin-chin crunch”; confirm it looks like your flakes chin chin.",
    credit: { title: "Chin-chin crunch", author: "Salma kyari", ...CC0, source: "https://commons.wikimedia.org/w/index.php?curid=173972964" },
  },
  gurundi: {
    src: gurundi, kind: "snack", shows: "coconut biscuits",
    check: `Research says gurundi is a thin coconut biscuit; confirm it matches yours. ${NOT_NIGERIAN}`,
    credit: { title: "Coconut biscuits", author: "Gaurav Dhwaj Khadka", ...BY_SA_4, source: "https://commons.wikimedia.org/w/index.php?curid=77074309" },
  },
  peanuts: {
    src: peanuts, kind: "snack", shows: "dry-fried groundnuts in a market sack",
    credit: { title: "Dry groundnut", author: "AgnesAbah", ...CC0, source: "https://commons.wikimedia.org/w/index.php?curid=159376092" },
  },


  "coconut-candy": {
    src: coconutCandy, kind: "snack", shows: "coconut candy balls",
    check: "Photo is titled “coconut balls (kwakumeti)”, a West African coconut sweet; confirm it is close to your coconut candy.",
    credit: { title: "Coconut balls (kwakumeti)", author: "Sir Ibee", ...CC0, source: "https://commons.wikimedia.org/w/index.php?curid=145807207" },
  },

  "condensed-milk-sweet": {
    src: condensedMilk, kind: "snack", shows: "a hawker’s tray of local milk sweets", position: "50% 20%",
    check: "A tray of Hausa local sweets; the cream-coloured blocks are milk sweets. Confirm they are close to your condensed milk sweet.",
    credit: { title: "Local hausa sweet", author: "Musa Vacho77", ...BY_SA_4, source: "https://commons.wikimedia.org/w/index.php?curid=100265847" },
  },
};
