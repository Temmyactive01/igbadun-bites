// Credits for the editorial/atmosphere photos (hero, story, occasions, chapter
// openers). Pexels License or Wikimedia Commons (CC0 / CC BY-SA). Shown on /credits; mirrors public/images/editorial/CREDITS.md.
const PEXELS = { license: "Pexels License", licenseUrl: "https://www.pexels.com/license/" };
const CC0 = { license: "CC0 1.0 (public domain)", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/" };
const BY_SA_4 = { license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" };

export const EDITORIAL_CREDITS = [
  { use: "Homepage hero", title: "Peanuts in shells", author: "Pixabay", ...PEXELS, source: "https://www.pexels.com/photo/209371/" },
  { use: "Chapter 01 — Chips", title: "Chips made from plantain", author: "Daniel Paullll", ...BY_SA_4, source: "https://commons.wikimedia.org/w/index.php?curid=164455454" },
  { use: "Chapter 02 — Crunchy snacks", title: "Roasting", author: "Xahrashots1000", ...BY_SA_4, source: "https://commons.wikimedia.org/w/index.php?curid=146753661" },
  { use: "Chapter 03 — Treats & sweets", title: "Coconuts at Bakin Dogo Market in Kaduna state", author: "Inyor4mr", ...BY_SA_4, source: "https://commons.wikimedia.org/w/index.php?curid=163299511" },
  { use: "Our story", title: "WLA034 (Sallah celebration food, Hadejia)", author: "Rukayya Abdullahi", ...CC0, source: "https://commons.wikimedia.org/w/index.php?curid=186629900" },
  { use: "Parties, gifts & celebrations", title: "SmallChops", author: "Nimah salihu", ...BY_SA_4, source: "https://commons.wikimedia.org/w/index.php?curid=101382787" },
];
