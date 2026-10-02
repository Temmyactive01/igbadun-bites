import type { StaticImageData } from "next/image";
import akara from "@/public/images/stand-in/akara-ogbomosho.jpg";
import babaDudu from "@/public/images/stand-in/baba-dudu.jpg";
import coconutCandy from "@/public/images/stand-in/coconut-candy.jpg";
import cocoyamChips from "@/public/images/stand-in/cocoyam-chips.jpg";
import condensedMilk from "@/public/images/stand-in/condensed-milk-sweet.jpg";
import dankwa from "@/public/images/stand-in/dankwa.jpg";
import gurundi from "@/public/images/stand-in/gurundi.jpg";
import kokoro from "@/public/images/stand-in/kokoro-egba.jpg";
import chinChin from "@/public/images/stand-in/milky-chin-chin.jpg";
import peanuts from "@/public/images/stand-in/peanuts.jpg";
import plantainChips from "@/public/images/stand-in/plantain-chips.jpg";
import sisiPelebe from "@/public/images/stand-in/sisi-pelebe.jpg";

// STAND-IN product photos, shown until the owner's own product photography exists
// (public/images/products/ always wins — see docs/content-guide.md).
//
// Decision (2 Oct 2026, owner/business): show generic photos of each snack so tiles
// are recognisable. Rules: licensed for commercial use only (never copied from other
// sites), no visible brands/labels, credited publicly on /credits, and the shop says
// these are stand-ins, not our own product.
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

const chinChinCredit = { title: "Bowl of chin-chin", author: "Kaldari", ...CC0, source: "https://commons.wikimedia.org/w/index.php?curid=37317796" };

export const STAND_IN_IMAGES: Record<string, StandIn> = {
  "cocoyam-chips": {
    src: cocoyamChips, kind: "snack", shows: "cocoyam (taro) chips",
    credit: { title: "Taro chips", author: "Fumikas Sagisavas", ...CC0, source: "https://commons.wikimedia.org/w/index.php?curid=151780193" },
  },
  "plantain-chips": {
    src: plantainChips, kind: "snack", shows: "plantain chips",
    credit: { title: "PLANTAIN CHIPS", author: "DromoTetteh", ...BY_SA_4, source: "https://commons.wikimedia.org/w/index.php?curid=36853980" },
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
    src: chinChin, kind: "snack", shows: "chin chin", position: "45% 50%", credit: chinChinCredit,
  },
  "flakes-chin-chin": {
    src: chinChin, kind: "snack", shows: "chin chin", position: "80% 30%",
    check: "Shows regular chin chin, not the flaked style — no licensed photo of flakes chin chin was found.",
    credit: chinChinCredit,
  },
  gurundi: {
    src: gurundi, kind: "snack", shows: "coconut biscuits",
    check: "Assumes gurundi is a coconut biscuit; the current description says “bean snack”.",
    credit: { title: "Coconut biscuits", author: "Gaurav Dhwaj Khadka", ...BY_SA_4, source: "https://commons.wikimedia.org/w/index.php?curid=77074309" },
  },
  peanuts: {
    src: peanuts, kind: "snack", shows: "roasted groundnuts",
    credit: { title: "A photo of roasted peanut", author: "Thamizhpparithi Maari", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/", source: "https://commons.wikimedia.org/w/index.php?curid=17908197" },
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
    src: coconutCandy, kind: "snack", shows: "coconut candy",
    credit: { title: "Coconut Candy Drying", author: "Vegan Feast Catering", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/", source: "https://www.flickr.com/photos/25128194@N02/4491844211" },
  },
  dankwa: {
    src: dankwa, kind: "snack", shows: "dankwa (dakuwa)",
    check: "Photo is titled “Dakuwa”; confirm it matches your dankwa.",
    credit: { title: "Dakuwa", author: "Saudarh2", ...CC0, source: "https://commons.wikimedia.org/w/index.php?curid=175611554" },
  },
  "condensed-milk-sweet": {
    src: condensedMilk, kind: "snack", shows: "milk toffee",
    credit: { title: "Milk Toffee", author: "Dan arndt", ...BY_SA_4, source: "https://commons.wikimedia.org/w/index.php?curid=128684041" },
  },
};
