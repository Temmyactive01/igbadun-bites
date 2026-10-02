import Link from "next/link";
import PageIntro from "@/components/ui/PageIntro";
import { buttonMd, buttonSecondary, textLink } from "@/components/ui/styles";
import { CONTACT } from "@/lib/contact";

export const metadata = {
  title: "Privacy — Igbadun Bites",
  description: "How Igbadun Bites collects, uses and looks after your information.",
};

// Plain-language privacy notice. Keep it in step with what the site actually
// does — if checkout starts collecting something new, update this page too.
const LAST_UPDATED = "1 October 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-cocoa/10 pt-8">
      <h2 className="text-title serif-editorial">{title}</h2>
      <div className="mt-4 space-y-3 leading-relaxed text-cocoa-soft [&_strong]:font-semibold [&_strong]:text-cocoa">
        {children}
      </div>
    </section>
  );
}

const linkClass = textLink;

export default function PrivacyPage() {
  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-[1440px] px-4 py-[clamp(3.5rem,2rem+5vw,7rem)] sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <PageIntro eyebrow="Privacy">
            Your information, <em>looked after.</em>
          </PageIntro>
          <p className="text-body-l mt-8 text-cocoa-soft">
            We only ask for what we need to get your snacks to you. Here&rsquo;s what that is, and what we do with it.
          </p>
          <p className="mt-3 text-sm text-cocoa-soft">Last updated {LAST_UPDATED}</p>

          <div className="mt-12 space-y-10">
            <Section title="What we collect">
              <p>
                <strong>When you sign in with Google:</strong> your name and email address. Google also shares a link to
                your profile picture, which is stored with your account, but we don&rsquo;t use it.
              </p>
              <p>
                <strong>When you place an order:</strong> your phone number (so we can arrange pickup or delivery), what
                you ordered and how much you paid.
              </p>
              <p>
                <strong>Only if you choose delivery:</strong> your delivery address.
              </p>
            </Section>

            <Section title="How we use it">
              <p>
                To process your order, send you an order confirmation email, and contact you about your pickup or
                delivery.
              </p>
              <p>That&rsquo;s it — no marketing emails, and no adverts.</p>
            </Section>

            <Section title="Where it's kept">
              <p>We use a few trusted services to run the shop:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Supabase</strong> stores your account and order details in our database.
                </li>
                <li>
                  <strong>Paystack</strong> handles your payment. You enter your card details on Paystack&rsquo;s secure
                  page — we never see or store them.
                </li>
                <li>
                  <strong>Mailgun</strong> sends your order confirmation email.
                </li>
              </ul>
              <p>
                Your basket is saved in your own browser so it&rsquo;s still there when you come back, and a small
                cookie keeps you signed in.
              </p>
            </Section>

            <Section title="Who we share it with">
              <p>
                <strong>Nobody else.</strong> We don&rsquo;t sell your information, and we don&rsquo;t share it with
                anyone beyond the services above, which only use it to do their job for us.
              </p>
            </Section>

            <Section title="Your choices">
              <p>
                You can ask us what information we hold about you, ask us to correct it, or ask us to delete it. Just
                get in touch.
              </p>
            </Section>

            <Section title="Questions?">
              <p>
                Email us at{" "}
                <a href={CONTACT.emailHref} className={linkClass}>
                  {CONTACT.email}
                </a>{" "}
                and we&rsquo;ll be happy to help.
              </p>
            </Section>
          </div>

          <Link href="/#shop" className={`${buttonSecondary} ${buttonMd} mt-12`}>
            Back to the shop
          </Link>
        </div>
      </div>
    </main>
  );
}
