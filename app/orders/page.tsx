import Link from "next/link";
import SignInButton from "@/components/SignInButton";
import { CONTACT } from "@/lib/contact";
import { formatPence } from "@/lib/money";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "My orders — Igbadun Bites" };

type OrderRow = {
  id: string;
  status: "pending" | "paid" | "failed";
  created_at: string;
  paid_at: string | null;
  total_gbp: number;
  fulfilment: "pickup" | "delivery";
  postcode: string | null;
  order_items: { quantity: number; unit_price_gbp: number; products: { name: string; pack_size: string } | null }[];
};

const pence = (gbp: number) => Math.round(Number(gbp) * 100);

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/London",
});

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;

  if (!user) {
    return (
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-8 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-forest">My orders</p>
          <h1 className="display mt-4 text-[clamp(2.5rem,7vw,4.25rem)] font-bold">Your snack history.</h1>
          <div className="mt-10 max-w-lg rounded-[1.75rem] bg-cream p-8 shadow-warm ring-1 ring-brown/5">
            <h2 className="text-2xl font-semibold">Sign in to see your orders</h2>
            <p className="mt-2 text-brown-soft">Use the same Google account you ordered with.</p>
            <SignInButton label="Continue with Google" next="/orders" className="mt-6" />
          </div>
        </div>
      </main>
    );
  }

  // Row Level Security already limits this to the signed-in customer's own
  // orders; the explicit user_id filter is a second safeguard. Only paid
  // orders are listed — abandoned/cancelled checkouts aren't real orders.
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, status, created_at, paid_at, total_gbp, fulfilment, postcode, order_items(quantity, unit_price_gbp, products(name, pack_size))"
    )
    .eq("user_id", user.id)
    .eq("status", "paid")
    .order("created_at", { ascending: false });
  const orders = (data ?? []) as unknown as OrderRow[];

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-8 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-forest">My orders</p>
        <h1 className="display mt-4 text-[clamp(2.5rem,7vw,4.25rem)] font-bold">
          Your snack <em className="font-semibold text-terracotta">history.</em>
        </h1>

        {error ? (
          <p role="alert" className="mt-10 rounded-2xl border border-terracotta/30 bg-terracotta/10 px-5 py-4">
            We couldn&rsquo;t load your orders just now — please refresh in a moment.
          </p>
        ) : orders.length === 0 ? (
          <div className="mt-10 max-w-lg rounded-[1.75rem] bg-cream p-8 shadow-warm ring-1 ring-brown/5">
            <h2 className="text-2xl font-semibold">No orders yet.</h2>
            <p className="mt-2 text-brown-soft">When you place an order, it&rsquo;ll appear here.</p>
            <Link
              href="/#shop"
              className="press mt-6 inline-flex rounded-full bg-gold px-6 py-3 font-semibold text-brown hover:bg-brown hover:text-cream"
            >
              Browse the snacks
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-5 text-brown-soft">
              {orders.length} {orders.length === 1 ? "order" : "orders"} · newest first
            </p>
            <ul className="mt-8 space-y-6">
              {orders.map((order) => (
                <li key={order.id}>
                  <article className="rounded-[1.75rem] bg-cream p-6 shadow-warm ring-1 ring-brown/5 sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="font-heading text-xl font-semibold">
                          Order {order.id.slice(0, 8).toUpperCase()}
                        </h2>
                        <p className="mt-0.5 text-sm text-brown-soft">
                          <time dateTime={order.paid_at ?? order.created_at}>
                            {dateFormat.format(new Date(order.paid_at ?? order.created_at))}
                          </time>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <span className="rounded-full bg-forest px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cream">
                          Paid
                        </span>
                        <span className="rounded-full border border-brown/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brown-soft">
                          {order.fulfilment === "pickup" ? "Pickup" : "Delivery"}
                        </span>
                      </div>
                    </div>

                    <ul className="mt-5 divide-y divide-brown/10 border-t border-brown/10">
                      {order.order_items.map((item, i) => (
                        <li key={i} className="flex justify-between gap-4 py-3">
                          <span>
                            <span className="font-medium">{item.products?.name ?? "Snack"}</span>
                            <span className="block text-sm text-brown-soft">
                              {item.quantity} × {formatPence(pence(item.unit_price_gbp))}
                              {item.products?.pack_size ? ` · ${item.products.pack_size}` : ""}
                            </span>
                          </span>
                          <span className="font-medium tabular-nums">
                            {formatPence(pence(item.unit_price_gbp) * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-baseline justify-between border-t border-brown/10 pt-4">
                      <span className="text-sm text-brown-soft">
                        {order.fulfilment === "delivery" && order.postcode ? `Delivery to ${order.postcode}` : "Total"}
                      </span>
                      <span className="font-heading text-2xl font-bold tabular-nums">
                        {formatPence(pence(order.total_gbp))}
                      </span>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </>
        )}

        <p className="mt-10 text-sm text-brown-soft">
          Question about an order?{" "}
          <a
            href={CONTACT.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brown underline decoration-gold/60 underline-offset-4"
          >
            Message us on WhatsApp
          </a>
        </p>
      </div>
    </main>
  );
}
