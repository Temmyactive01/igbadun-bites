import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CartButton from "./cart/CartButton";
import SignInButton from "./SignInButton";

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
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden text-sm text-brown-soft sm:inline">
              Hello, <span className="font-semibold text-brown">{firstName}</span>
            </span>
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-forest font-heading text-sm font-semibold text-cream"
              title={claims.email}
              aria-hidden
            >
              {firstName.charAt(0).toUpperCase()}
            </span>
            <form action="/auth/signout" method="post">
              <button className="press rounded-full border border-brown/25 px-4 py-2 text-sm font-medium hover:border-brown hover:bg-brown hover:text-cream">
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <SignInButton />
        )}
        <CartButton />
        </div>
      </div>
    </header>
  );
}
