import Link from "next/link";
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
    <section className="border-t border-brown/10 pt-8">
      <h2 className="font-heading text-2xl font-semibold">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-brown-soft [&_strong]:font-semibold [&_strong]:text-brown">
        {children}
      </div>
    </section>
  );
}

const linkClass = "font-medium text-brown underline decoration-gold/60 underline-offset-4 hover:decoration-gold";

export default function PrivacyPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-8 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-forest">Privacy</p>
        <h1 className="display mt-4 text-[clamp(2.5rem,7vw,4.25rem)] font-bold">
          Your information, <em className="font-semibold text-terracotta">looked after.</em>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-brown-soft">
          We only ask for what we need to get your snacks to you. Here&rsquo;s what that is, and what we do with it.
        </p>
        <p className="mt-2 text-sm text-brown-soft/80">Last updated {LAST_UPDATED}</p>

        <div className="mt-12 space-y-10">
          <Section title="What we collect">
            <p>
              <strong>When you sign in with Google:</strong> your name and email address. Google also shares a link to your
              profile picture, which is stored with your account, but we don&rsquo;t use it.
            </p>
            <p>
              <strong>When you place an order:</strong> your phone number (so we can arrange pickup or delivery), what you
              ordered and how much you paid.
            </p>
            <p>
              <strong>Only if you choose delivery:</strong> your delivery address.
            </p>
          </Section>

          <Section title="How we use it">
            <p>To process your order, send you an order confirmation email, and contact you about your pickup or delivery.</p>
            <p>That&rsquo;s it — no marketing emails, and no adverts.</p>
          </Section>

          <Section title="Where it's kept">
            <p>We use a few trusted services to run the shop:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Supabase</strong> stores your account and order details in our database.
              </li>
              <li>
                <strong>Paystack</strong> handles your payment. You enter your card details on Paystack&rsquo;s secure page — we
                never see or store them.
              </li>
              <li>
                <strong>Mailgun</strong> sends your order confirmation email.
              </li>
            </ul>
            <p>
              Your basket is saved in your own browser so it&rsquo;s still there when you come back, and a small cookie keeps
              you signed in.
            </p>
          </Section>

          <Section title="Who we share it with">
            <p>
              <strong>Nobody else.</strong> We don&rsquo;t sell your information, and we don&rsquo;t share it with anyone
              beyond the services above, which only use it to do their job for us.
            </p>
          </Section>

          <Section title="Your choices">
            <p>
              You can ask us what information we hold about you, ask us to correct it, or ask us to delete it. Just get in
              touch.
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

        <Link href="/" className="press mt-12 inline-flex rounded-full bg-gold px-6 py-3 font-semibold text-brown hover:bg-brown hover:text-cream">
          Back to the shop
        </Link>
      </div>
    </main>
  );
}
