// Shared v2 class recipes for buttons, form fields and notices (Phase 4), so the
// basket, checkout and orders pages match the shop: cocoa primary that warms to
// terracotta, hairline outlines, no shadows. See style.md.

// Primary action (checkout, pay, browse). Add a size: buttonLg or buttonMd.
export const buttonPrimary =
  "press inline-flex items-center justify-center gap-2 rounded-full bg-cocoa font-semibold text-oat hover:bg-terracotta disabled:cursor-wait disabled:opacity-70";
// Secondary action: outline that fills on hover
export const buttonSecondary =
  "press inline-flex items-center justify-center gap-2 rounded-full border border-cocoa/30 font-medium text-cocoa hover:border-cocoa hover:bg-cocoa hover:text-oat";
export const buttonLg = "h-14 px-8 text-base";
export const buttonMd = "h-12 px-6 text-sm";

// Text link in body copy
export const textLink = "font-medium text-cocoa underline decoration-terracotta/50 underline-offset-4 hover:decoration-terracotta";

// Form field + label
export const fieldLabel = "block text-sm font-medium text-cocoa";
export const fieldInput =
  "mt-2 h-12 w-full rounded-md border border-cocoa/20 bg-offwhite px-4 text-base text-cocoa placeholder:text-cocoa-soft/60 transition-colors duration-200 hover:border-cocoa/40 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/25";
export const fieldHint = "mt-1.5 block text-xs font-normal text-cocoa-soft";

// Calm notice (warnings, failed payments): terracotta rule, no box shadow
export const notice = "border-l-2 border-terracotta bg-terracotta/[0.06] px-4 py-3 text-cocoa";

// The quiet raised surface used for summaries (order summary, basket footer)
export const panel = "rounded-lg border border-cocoa/10 bg-offwhite";
