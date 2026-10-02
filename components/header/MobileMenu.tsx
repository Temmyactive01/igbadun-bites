"use client";

import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import SignInButton from "@/components/SignInButton";
import { CONTACT } from "@/lib/contact";
import { useDialog } from "@/lib/use-dialog";

type Props = { signedIn: boolean; firstName: string; overlay: boolean };

const noop = () => () => {};

const LINKS = [
  { href: "/#shop", label: "Shop", note: "Thirteen snacks, three chapters" },
  { href: "/#story", label: "Our story", note: "Made for sharing" },
];

// Phone navigation: a full-screen editorial sheet instead of a cramped header.
export default function MobileMenu({ signedIn, firstName, overlay }: Props) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = () => setOpen(false);
  // Escape / focus trap / scroll lock / focus back to the Menu button (lib/use-dialog.ts)
  useDialog({ open, onClose: close, containerRef: dialogRef, initialFocusRef: closeRef });
  // The sheet is portalled to <body>: the header uses backdrop-filter, which would
  // otherwise trap a "position: fixed" child inside the header bar.
  const isClient = useSyncExternalStore(noop, () => true, () => false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`press min-h-11 rounded-full px-2 text-sm font-medium min-[360px]:px-3 ${overlay ? "text-oat" : "text-cocoa"}`}
      >
        Menu
      </button>

      {isClient && createPortal(
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className={`fixed inset-0 z-50 flex flex-col bg-oat text-cocoa transition-[opacity,translate] duration-500 ease-[var(--ease-out-soft)] motion-reduce:translate-y-0 motion-reduce:duration-200 ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <span className="font-heading text-[1.6rem] leading-none">
            <span className="serif-editorial">Igbadun</span>
            <span className="text-terracotta">.</span>
            <span className="serif-editorial italic">Bites</span>
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className="press min-h-11 rounded-full px-4 text-sm font-medium hover:bg-cocoa/5"
          >
            Close
          </button>
        </div>

        <nav aria-label="Main" className="flex flex-1 flex-col justify-center gap-2 px-6">
          {LINKS.map((link, i) => (
            <Link key={link.href} href={link.href} onClick={close} className="group block border-b border-cocoa/10 py-5">
              <span className="text-eyebrow text-cocoa-soft">0{i + 1}</span>
              <span className="serif-editorial mt-1 block font-heading text-5xl tracking-tight group-hover:italic">
                {link.label}
              </span>
              <span className="mt-1 block text-sm text-cocoa-soft">{link.note}</span>
            </Link>
          ))}
          {signedIn && (
            <Link href="/orders" onClick={close} className="group block border-b border-cocoa/10 py-5">
              <span className="text-eyebrow text-cocoa-soft">03</span>
              <span className="serif-editorial mt-1 block font-heading text-5xl tracking-tight group-hover:italic">
                My orders
              </span>
            </Link>
          )}
        </nav>

        <div className="space-y-4 px-6 pt-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
          {signedIn ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-cocoa-soft">
                Signed in as <span className="font-semibold text-cocoa">{firstName}</span>
              </span>
              <form action="/auth/signout" method="post">
                <button className="press min-h-11 rounded-full border border-cocoa/25 px-5 text-sm font-medium">Sign out</button>
              </form>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-cocoa-soft">Sign in to check out and see your orders.</span>
              <SignInButton />
            </div>
          )}
          <p className="text-sm text-cocoa-soft">
            Questions?{" "}
            <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="font-medium text-cocoa underline decoration-terracotta/50 underline-offset-4">
              WhatsApp us
            </a>
          </p>
        </div>
      </div>
      , document.body)}
    </>
  );
}
