import Link from "next/link";
import SignInButton from "@/components/SignInButton";

export const metadata = { title: "Sign-in problem — Igbadun Bites" };

export default function AuthErrorPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="max-w-md text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-terracotta">Sign-in</p>
        <h1 className="display mt-4 text-5xl font-bold">That didn&rsquo;t quite work.</h1>
        <p className="mt-4 text-brown-soft">
          We couldn&rsquo;t finish signing you in with Google. It&rsquo;s usually a one-off — please try again.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <SignInButton label="Try again with Google" />
          <Link href="/" className="text-sm font-medium text-brown-soft underline underline-offset-4 hover:text-brown">
            Back to the shop
          </Link>
        </div>
      </div>
    </main>
  );
}
