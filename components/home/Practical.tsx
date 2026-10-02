import Link from "next/link";

// Calm, honest reassurance — only things the shop actually does.
const POINTS = [
  {
    title: "Pickup & UK-wide delivery",
    body: "Collect from us or have it delivered anywhere in the UK — we'll confirm the details after you order.",
  },
  {
    title: "Secure payment",
    body: "Paid through Paystack. We never see your card details.",
  },
  {
    title: "Your orders, saved",
    body: (
      <>
        Sign in with Google to see your{" "}
        <Link href="/orders" className="text-cocoa underline decoration-terracotta/50 underline-offset-4 hover:decoration-terracotta">
          order history
        </Link>{" "}
        any time.
      </>
    ),
  },
];

export default function Practical() {
  return (
    <section aria-label="How ordering works" className="border-y border-cocoa/10 bg-offwhite">
      <ul className="mx-auto grid max-w-[1440px] divide-y divide-cocoa/10 px-4 sm:px-8 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-12">
        {POINTS.map((point, i) => (
          <li key={point.title} className="py-10 md:px-8 md:py-14 md:first:pl-0 md:last:pr-0">
            <span className="text-eyebrow text-terracotta">0{i + 1}</span>
            <h3 className="text-title serif-editorial mt-3">{point.title}</h3>
            <p className="mt-3 max-w-sm text-cocoa-soft">{point.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
