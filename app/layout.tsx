import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
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
    "Bringing Back Memories, One Bite at a Time. Chin chin, plantain chips, kokoro, coconut candy and more — Nigerian snacks for pickup or delivery.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${fraunces.variable} ${instrument.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Marks that JS is running, so scroll-reveal only hides content when it can reveal it again */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
        <CartDrawer />
      </body>
    </html>
  );
}
