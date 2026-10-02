import CheckoutForm from "@/components/checkout/CheckoutForm";
import SignInButton from "@/components/SignInButton";
import PageIntro from "@/components/ui/PageIntro";
import { notice } from "@/components/ui/styles";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Checkout — Igbadun Bites" };

export default async function CheckoutPage({ searchParams }: PageProps<"/checkout">) {
  const { payment } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  const meta = (user?.user_metadata ?? {}) as { full_name?: string; name?: string };

  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-[1440px] px-4 py-[clamp(3.5rem,2rem+5vw,7rem)] sm:px-8 lg:px-12">
        <PageIntro eyebrow="Checkout">
          Almost <em>yours.</em>
        </PageIntro>

        {payment === "failed" && (
          <p role="alert" className={`${notice} mt-10 max-w-2xl`}>
            That payment didn&rsquo;t go through, and you haven&rsquo;t been charged. Please try again — your basket is still here.
          </p>
        )}

        {user ? (
          <CheckoutForm defaultName={meta.full_name ?? meta.name ?? ""} email={user.email ?? ""} />
        ) : (
          <div className="mt-12 max-w-lg border-t border-cocoa/15 pt-8">
            <h2 className="text-title serif-editorial">Sign in to check out</h2>
            <p className="mt-3 text-cocoa-soft">
              We use your Google account so we can send your order confirmation and keep track of your order. Your basket
              will be right here when you come back.
            </p>
            <SignInButton size="lg" label="Continue with Google" next="/checkout" className="mt-8" />
          </div>
        )}
      </div>
    </main>
  );
}
