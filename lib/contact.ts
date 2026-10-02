// Confirmed contact details from the business owner (see prd.md, MVP item 8).
// Single source of truth — reused by the footer and, later, confirmation emails.
export const CONTACT = {
  phoneDisplay: "+44 7709 870134",
  phoneHref: "tel:+447709870134",
  whatsappHref: "https://wa.me/447709870134",
  email: "igbadun_bites@yahoo.com",
  emailHref: "mailto:igbadun_bites@yahoo.com",

  // Social media — paste the FULL web address (starting https://) between the
  // quotes. Leave "" for any platform you don't have yet; the footer only shows
  // filled-in ones, and says "coming soon" while all three are empty.
  // See docs/content-guide.md.
  instagram: "",
  tiktok: "",
  facebook: "",
};

// The social links that have been filled in, in display order.
export const SOCIAL_LINKS = [
  { label: "Instagram", href: CONTACT.instagram },
  { label: "TikTok", href: CONTACT.tiktok },
  { label: "Facebook", href: CONTACT.facebook },
].filter((link) => link.href.trim() !== "");
