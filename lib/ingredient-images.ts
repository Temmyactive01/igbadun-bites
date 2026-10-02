import type { StaticImageData } from "next/image";
import akara from "@/public/images/ingredients/akara-ogbomosho.jpg";
import babaDudu from "@/public/images/ingredients/baba-dudu.jpg";
import coconutCandy from "@/public/images/ingredients/coconut-candy.jpg";
import cocoyamChips from "@/public/images/ingredients/cocoyam-chips.jpg";
import condensedMilk from "@/public/images/ingredients/condensed-milk-sweet.jpg";
import dankwa from "@/public/images/ingredients/dankwa.jpg";
import flakesChinChin from "@/public/images/ingredients/flakes-chin-chin.jpg";
import gurundi from "@/public/images/ingredients/gurundi.jpg";
import kokoro from "@/public/images/ingredients/kokoro-egba.jpg";
import milkyChinChin from "@/public/images/ingredients/milky-chin-chin.jpg";
import peanuts from "@/public/images/ingredients/peanuts.jpg";
import plantainChips from "@/public/images/ingredients/plantain-chips.jpg";
import sisiPelebe from "@/public/images/ingredients/sisi-pelebe.jpg";

// Representative INGREDIENT photos shown on product tiles until real product
// photography exists (public/images/products/ always wins — see docs/content-guide.md).
// These deliberately never show a finished snack: presenting someone else's product
// as ours would be misleading (ASA / CAP Code). Licensed from Pexels; credits in
// public/images/ingredients/CREDITS.md. Keyed by productImageKey(product name).
//
// ⚠ Gurundi, Dankwa and Sisi Pelebe use best-guess ingredients — confirm with the
// owner along with their descriptions (prd.md open items).

export type IngredientImage = { src: StaticImageData; ingredient: string };

export const INGREDIENT_IMAGES: Record<string, IngredientImage> = {
  "cocoyam-chips": { src: cocoyamChips, ingredient: "cocoyam" },
  "plantain-chips": { src: plantainChips, ingredient: "plantains" },
  "akara-ogbomosho": { src: akara, ingredient: "black-eyed beans" },
  "kokoro-egba": { src: kokoro, ingredient: "dried maize" },
  "milky-chin-chin": { src: milkyChinChin, ingredient: "butter and cream" },
  "flakes-chin-chin": { src: flakesChinChin, ingredient: "dough" },
  gurundi: { src: gurundi, ingredient: "shredded coconut" },
  peanuts: { src: peanuts, ingredient: "groundnuts in their shells" },
  "sisi-pelebe": { src: sisiPelebe, ingredient: "dough" },
  "baba-dudu": { src: babaDudu, ingredient: "brown sugar" },
  "coconut-candy": { src: coconutCandy, ingredient: "fresh coconut" },
  dankwa: { src: dankwa, ingredient: "groundnuts" },
  "condensed-milk-sweet": { src: condensedMilk, ingredient: "milk" },
};
