import CheckoutForm from "@/components/checkout/CheckoutForm";
import SignInButton from "@/components/SignInButton";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Checkout — Igbadun Bites" };

export default async function CheckoutPage({ searchParams }: PageProps<"/checkout">) {
  const { payment } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  const meta = (user?.user_metadata ?? {}) as { full_name?: string; name?: string };

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-forest">Checkout</p>
        <h1 className="display mt-4 text-[clamp(2.5rem,6vw,4.5rem)] font-bold">
          Almost <em className="font-semibold text-terracotta">yours.</em>
        </h1>

        {payment === "failed" && (
          <p role="alert" className="mt-8 rounded-2xl border border-terracotta/30 bg-terracotta/10 px-5 py-4 text-brown">
            That payment didn&rsquo;t go through, and you haven&rsquo;t been charged. Please try again — your basket is still here.
          </p>
        )}

        {user ? (
          <CheckoutForm defaultName={meta.full_name ?? meta.name ?? ""} email={user.email ?? ""} />
        ) : (
          <div className="mt-10 max-w-lg rounded-[1.75rem] bg-cream p-8 shadow-warm ring-1 ring-brown/5">
            <h2 className="text-2xl font-semibold">Sign in to check out</h2>
            <p className="mt-2 text-brown-soft">
              We use your Google account so we can send your order confirmation and keep track of your order. Your basket
              will be right here when you come back.
            </p>
            <SignInButton label="Continue with Google" next="/checkout" className="mt-6" />
          </div>
        )}
      </div>
    </main>
  );
}
