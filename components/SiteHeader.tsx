import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CartButton from "./cart/CartButton";
import SignInButton from "./SignInButton";

// Signed-in account links. Rendered in the top row on tablet/desktop, and in
// their own row under the logo on phones (where they'd otherwise overflow).
function AccountLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`items-center gap-2 sm:gap-3 ${className}`}>
      <Link
        href="/orders"
        className="press whitespace-nowrap rounded-full px-2 py-2 text-sm font-medium underline decoration-gold/60 underline-offset-4 hover:decoration-gold sm:px-3"
      >
        My orders
      </Link>
      <form action="/auth/signout" method="post">
        <button className="press whitespace-nowrap rounded-full border border-brown/25 px-3 py-1.5 text-sm font-medium hover:border-brown hover:bg-brown hover:text-cream sm:px-4 sm:py-2">
          Sign out
        </button>
      </form>
    </div>
  );
}

// Reads the signed-in user (if any) from the session cookie on the server,
// so the header renders the right state with no flicker.
export default async function SiteHeader() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  const meta = (claims?.user_metadata ?? {}) as { full_name?: string; name?: string };
  const fullName = meta.full_name ?? meta.name ?? claims?.email ?? "";
  const firstName = fullName.split(/[\s@]/)[0];

  return (
    <header className="relative z-10 border-b border-brown/10 bg-cream/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <Link href="/" className="font-heading text-2xl font-bold tracking-tight">
          Igbadun<span className="text-gold">.</span>Bites
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {claims ? (
            <>
              <span className="hidden text-sm text-brown-soft md:inline">
                Hello, <span className="font-semibold text-brown">{firstName}</span>
              </span>
              <span
                className="hidden h-9 w-9 items-center justify-center rounded-full bg-forest font-heading text-sm font-semibold text-cream sm:flex"
                title={claims.email}
                aria-hidden
              >
                {firstName.charAt(0).toUpperCase()}
              </span>
              <AccountLinks className="hidden sm:flex" />
            </>
          ) : (
            <div className="hidden sm:block">
              <SignInButton />
            </div>
          )}
          <CartButton />
        </div>
      </div>

      {/* Phones: account row under the logo + basket, so nothing overflows */}
      <div className="flex items-center justify-between gap-3 border-t border-brown/10 px-4 py-1.5 sm:hidden">
        {claims ? (
          <>
            <span className="truncate text-sm text-brown-soft">
              Hello, <span className="font-semibold text-brown">{firstName}</span>
            </span>
            <AccountLinks className="flex" />
          </>
        ) : (
          <>
            <span className="text-sm text-brown-soft">Sign in to check out</span>
            <SignInButton />
          </>
        )}
      </div>
    </header>
  );
}
