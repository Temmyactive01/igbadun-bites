"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CartButton from "@/components/cart/CartButton";
import SignInButton from "@/components/SignInButton";
import MobileMenu from "./MobileMenu";

type Props = { signedIn: boolean; firstName: string };

export const NAV = [
  { href: "/#shop", label: "Shop" },
  { href: "/#story", label: "Our story" },
];

// Sticky site header. On the homepage it starts transparent over the hero image
// (light text), then settles into a solid oat bar once you scroll. Everywhere
// else it's the solid bar from the start.
export default function HeaderBar({ signedIn, firstName }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const overlay = pathname === "/" && !scrolled;
  const linkClass = `rounded-sm text-sm font-medium underline-offset-[6px] decoration-1 transition-colors duration-200 hover:underline ${
    overlay ? "text-oat/90 hover:text-oat" : "text-cocoa-soft hover:text-cocoa"
  }`;

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color,color] duration-500 ease-[var(--ease-out-soft)] ${
        overlay
          ? "on-dark border-b border-transparent bg-transparent text-oat"
          : "border-b border-cocoa/10 bg-oat/90 text-cocoa backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-3 px-4 sm:gap-6 sm:px-8 lg:h-20 lg:px-12">
        <Link href="/" className="shrink-0 font-heading text-[1.35rem] leading-none tracking-tight min-[360px]:text-[1.6rem]" aria-label="Igbadun Bites — home">
          <span className="serif-editorial font-normal">Igbadun</span>
          <span className={overlay ? "text-plantain" : "text-terracotta"}>.</span>
          <span className="serif-editorial font-normal italic">Bites</span>
        </Link>

        {/* Tablet & desktop */}
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass}>
              {item.label}
            </Link>
          ))}
          {signedIn ? (
            <>
              <Link href="/orders" className={linkClass}>
                My orders
              </Link>
              <form action="/auth/signout" method="post">
                <button className={`${linkClass} cursor-pointer`}>Sign out</button>
              </form>
            </>
          ) : (
            <SignInButton />
          )}
          <CartButton overlay={overlay} />
        </nav>

        {/* Phones */}
        <div className="flex items-center gap-1 min-[360px]:gap-2 md:hidden">
          <CartButton overlay={overlay} />
          <MobileMenu signedIn={signedIn} firstName={firstName} overlay={overlay} />
        </div>
      </div>
    </header>
  );
}
