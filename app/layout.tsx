import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import BasketBar from "@/components/cart/BasketBar";
import CartDrawer from "@/components/cart/CartDrawer";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

// Variable Fraunces with optical size + "soft" axes, so large display headlines
// can be tuned to feel crafted rather than default.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
});

// UI / body face (v2): restrained, characterful, tabular figures for prices
const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Igbadun Bites — Nigerian snacks, made with love",
  description:
    "Bringing Back Memories, One Bite at a Time. Chin chin, plantain chips, kokoro, coconut candy and more — Nigerian snacks for pickup or delivery across the UK.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${fraunces.variable} ${instrument.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Runs while <head> is still parsing, before React hydrates. Two jobs:
            1. Mark that JS is running, so scroll-reveal only hides content when it can
               reveal it again.
            2. Remove the marketing comment Netlify injects into <head> on production
               deploys (right after the charset meta). React hydration counts that
               foreign node as a mismatch and logs recoverable error #418 on every page
               load. Verified: with the comment present React reports #418, without it
               the console is clean. Deploy previews aren't affected — Netlify only
               injects it on the production URL. Safe to delete if Netlify stops. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js');
for (var n of Array.prototype.slice.call(document.head.childNodes)) {
  if (n.nodeType === 8 && n.nodeValue.indexOf('hosted on Netlify') !== -1) {
    var before = n.previousSibling, after = n.nextSibling;
    if (after && after.nodeType === 3 && !after.nodeValue.trim()) after.remove();
    if (before && before.nodeType === 3 && !before.nodeValue.trim()) before.remove();
    n.remove();
  }
}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Keyboard users can jump straight past the header (every page's <main> has id="main") */}
        <a
          href="#main"
          className="sr-only rounded-full bg-cocoa px-5 py-3 font-medium text-oat focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60]"
        >
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <BasketBar />
        <CartDrawer />
      </body>
    </html>
  );
}
