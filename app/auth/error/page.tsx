import Link from "next/link";
import SignInButton from "@/components/SignInButton";
import PageIntro from "@/components/ui/PageIntro";
import { textLink } from "@/components/ui/styles";

export const metadata = { title: "Sign-in problem — Igbadun Bites" };

export default function AuthErrorPage() {
  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-[1440px] px-4 py-[clamp(3.5rem,2rem+5vw,7rem)] sm:px-8 lg:px-12">
        <div className="max-w-xl">
          <PageIntro eyebrow="Sign-in">
            That didn&rsquo;t <em>quite work.</em>
          </PageIntro>
          <p className="text-body-l mt-8 text-cocoa-soft">
            We couldn&rsquo;t finish signing you in with Google. It&rsquo;s usually a one-off — please try again.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <SignInButton size="lg" label="Try again with Google" />
            <Link href="/#shop" className={`${textLink} text-sm`}>
              Back to the shop
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
