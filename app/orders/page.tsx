import Link from "next/link";
import OrderLines from "@/components/orders/OrderLines";
import SignInButton from "@/components/SignInButton";
import PageIntro from "@/components/ui/PageIntro";
import { buttonMd, buttonPrimary, notice, panel, textLink } from "@/components/ui/styles";
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
      <main id="main" className="flex-1">
        <div className="mx-auto max-w-[1440px] px-4 py-[clamp(3.5rem,2rem+5vw,7rem)] sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <PageIntro eyebrow="My orders">
              Your snack <em>history.</em>
            </PageIntro>
            <div className="mt-12 max-w-lg border-t border-cocoa/15 pt-8">
              <h2 className="text-title serif-editorial">Sign in to see your orders</h2>
              <p className="mt-3 text-cocoa-soft">Use the same Google account you ordered with.</p>
              <SignInButton size="lg" label="Continue with Google" next="/orders" className="mt-8" />
            </div>
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
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-[1440px] px-4 py-[clamp(3.5rem,2rem+5vw,7rem)] sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <PageIntro eyebrow="My orders">
            Your snack <em>history.</em>
          </PageIntro>

          {error ? (
            <p role="alert" className={`${notice} mt-12`}>
              We couldn&rsquo;t load your orders just now — please refresh in a moment.
            </p>
          ) : orders.length === 0 ? (
            <div className="mt-12 max-w-lg border-t border-cocoa/15 pt-8">
              <h2 className="text-title serif-editorial">No orders yet.</h2>
              <p className="mt-3 text-cocoa-soft">When you place an order, it&rsquo;ll appear here.</p>
              <Link href="/#shop" className={`${buttonPrimary} ${buttonMd} mt-8`}>
                Browse the snacks
              </Link>
            </div>
          ) : (
            <>
              <p className="text-body-l mt-8 text-cocoa-soft">
                {orders.length} {orders.length === 1 ? "order" : "orders"} · newest first
              </p>
              <ul className="mt-10 space-y-8">
                {orders.map((order) => (
                  <li key={order.id}>
                    <article aria-labelledby={`order-${order.id}`} className={`${panel} p-6 sm:p-8`}>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h2 id={`order-${order.id}`} className="text-title serif-editorial">
                            Order {order.id.slice(0, 8).toUpperCase()}
                          </h2>
                          <p className="mt-1 text-sm text-cocoa-soft">
                            <time dateTime={order.paid_at ?? order.created_at}>
                              {dateFormat.format(new Date(order.paid_at ?? order.created_at))}
                            </time>
                          </p>
                        </div>
                        <p className="flex items-center gap-3 text-eyebrow">
                          <span className="flex items-center gap-1.5 text-leaf">
                            <span className="h-1.5 w-1.5 rounded-full bg-leaf" aria-hidden />
                            Paid
                          </span>
                          <span className="text-cocoa-soft">
                            {order.fulfilment === "pickup" ? "Pickup" : "Delivery"}
                          </span>
                        </p>
                      </div>

                      <OrderLines
                        className="mt-4 border-t border-cocoa/10"
                        lines={order.order_items.map((item) => ({
                          name: item.products?.name ?? "Snack",
                          packSize: item.products?.pack_size,
                          quantity: item.quantity,
                          unitPence: pence(item.unit_price_gbp),
                        }))}
                      />

                      <div className="flex items-baseline justify-between border-t border-cocoa/10 pt-4">
                        <span className="text-sm text-cocoa-soft">
                          {order.fulfilment === "delivery" && order.postcode
                            ? `Delivery to ${order.postcode}`
                            : "Total"}
                        </span>
                        <span className="font-heading text-2xl tabular-nums">
                          {formatPence(pence(order.total_gbp))}
                        </span>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </>
          )}

          <p className="mt-12 text-sm text-cocoa-soft">
            Question about an order?{" "}
            <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className={textLink}>
              Message us on WhatsApp
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
