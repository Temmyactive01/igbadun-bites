import type { StaticImageData } from "next/image";
import akara from "@/public/images/stand-in/akara-ogbomosho.jpg";
import babaDudu from "@/public/images/stand-in/baba-dudu.jpg";
import coconutCandy from "@/public/images/stand-in/coconut-candy.jpg";
import cocoyamChips from "@/public/images/stand-in/cocoyam-chips.jpg";
import condensedMilk from "@/public/images/stand-in/condensed-milk-sweet.jpg";
import dankwa from "@/public/images/stand-in/dankwa.jpg";
import flakesChinChin from "@/public/images/stand-in/flakes-chin-chin.jpg";
import gurundi from "@/public/images/stand-in/gurundi.jpg";
import kokoro from "@/public/images/stand-in/kokoro-egba.jpg";
import milkyChinChin from "@/public/images/stand-in/milky-chin-chin.jpg";
import peanuts from "@/public/images/stand-in/peanuts.jpg";
import plantainChips from "@/public/images/stand-in/plantain-chips.jpg";
import sisiPelebe from "@/public/images/stand-in/sisi-pelebe.jpg";

// STAND-IN product photos, shown until the owner's own product photography exists
// (public/images/products/ always wins — see docs/content-guide.md).
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
const PEXELS = { license: "Pexels License", licenseUrl: "https://www.pexels.com/license/" };

const NOT_NIGERIAN = "Not photographed in Nigeria — no licensed Nigerian photo of this snack was found.";

export const STAND_IN_IMAGES: Record<string, StandIn> = {
  "cocoyam-chips": {
    src: cocoyamChips, kind: "snack", shows: "cocoyam (taro) chips",
    check: NOT_NIGERIAN,
    credit: { title: "Taro chips", author: "Fumikas Sagisavas", ...CC0, source: "https://commons.wikimedia.org/w/index.php?curid=151780193" },
  },
  "plantain-chips": {
    src: plantainChips, kind: "snack", shows: "plantain chips (ipekere) in a market basin", position: "50% 60%",
    credit: { title: "Ipekere", author: "Bibiire1", ...BY_SA_4, source: "https://commons.wikimedia.org/w/index.php?curid=115812555" },
  },
  "akara-ogbomosho": {
    src: akara, kind: "snack", shows: "crunchy akara",
    credit: { title: "AKARA", author: "Linason Blessing", ...BY_SA_4, source: "https://commons.wikimedia.org/w/index.php?curid=102907742" },
  },
  "kokoro-egba": {
    src: kokoro, kind: "snack", shows: "kokoro", position: "50% 40%",
    credit: { title: "Nigerian snack (kokoro)", author: "1qfoodplatter", ...BY_SA_4, source: "https://commons.wikimedia.org/w/index.php?curid=35886524" },
  },
  "milky-chin-chin": {
    src: milkyChinChin, kind: "snack", shows: "freshly fried chin chin in a basket",
    credit: { title: "A fried chin chin", author: "Linason Blessing", ...BY_SA_4, source: "https://commons.wikimedia.org/w/index.php?curid=104623113" },
  },
  "flakes-chin-chin": {
    src: flakesChinChin, kind: "snack", shows: "chin chin crunch (flaked style)", position: "50% 55%",
    check: "Photo is titled “chin-chin crunch”; confirm it looks like your flakes chin chin.",
    credit: { title: "Chin-chin crunch", author: "Salma kyari", ...CC0, source: "https://commons.wikimedia.org/w/index.php?curid=173972964" },
  },
  gurundi: {
    src: gurundi, kind: "snack", shows: "coconut biscuits",
    check: `Assumes gurundi is a coconut biscuit; the current description says “bean snack”. ${NOT_NIGERIAN}`,
    credit: { title: "Coconut biscuits", author: "Gaurav Dhwaj Khadka", ...BY_SA_4, source: "https://commons.wikimedia.org/w/index.php?curid=77074309" },
  },
  peanuts: {
    src: peanuts, kind: "snack", shows: "dry-fried groundnuts in a market sack",
    credit: { title: "Dry groundnut", author: "AgnesAbah", ...CC0, source: "https://commons.wikimedia.org/w/index.php?curid=159376092" },
  },
  "sisi-pelebe": {
    src: sisiPelebe, kind: "ingredient", shows: "dough being rolled",
    check: "No licensed photo of sisi pelebe was found, and the product itself is unconfirmed — ingredient photo for now.",
    credit: { title: "Hands rolling dough", author: "Arina Krasnikova", ...PEXELS, source: "https://www.pexels.com/photo/5119847/" },
  },
  "baba-dudu": {
    src: babaDudu, kind: "ingredient", shows: "brown sugar",
    check: "No licensed photo of baba dudu was found — ingredient photo for now.",
    credit: { title: "Brown sugar crystals", author: "Eva Bronzini", ...PEXELS, source: "https://www.pexels.com/photo/6086210/" },
  },
  "coconut-candy": {
    src: coconutCandy, kind: "snack", shows: "coconut candy balls",
    check: "Photo is titled “coconut balls (kwakumeti)”, a West African coconut sweet; confirm it is close to your coconut candy.",
    credit: { title: "Coconut balls (kwakumeti)", author: "Sir Ibee", ...CC0, source: "https://commons.wikimedia.org/w/index.php?curid=145807207" },
  },
  dankwa: {
    src: dankwa, kind: "snack", shows: "dankwa (dakuwa)",
    check: "Photo is titled “Dakuwa”; confirm it matches your dankwa.",
    credit: { title: "Dakuwa", author: "Saudarh2", ...CC0, source: "https://commons.wikimedia.org/w/index.php?curid=175611554" },
  },
  "condensed-milk-sweet": {
    src: condensedMilk, kind: "snack", shows: "a hawker’s tray of local milk sweets", position: "50% 20%",
    check: "A tray of Hausa local sweets; the cream-coloured blocks are milk sweets. Confirm they are close to your condensed milk sweet.",
    credit: { title: "Local hausa sweet", author: "Musa Vacho77", ...BY_SA_4, source: "https://commons.wikimedia.org/w/index.php?curid=100265847" },
  },
};
