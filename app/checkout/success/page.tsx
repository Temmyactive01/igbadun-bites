import Link from "next/link";
import { notFound } from "next/navigation";
import ClearBasket from "@/components/checkout/ClearBasket";
import { formatPence } from "@/lib/money";
import { DEMO_NGN_PER_GBP } from "@/lib/payment-config";
import { CONTACT } from "@/lib/contact";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Order confirmed — Igbadun Bites" };

type OrderRow = {
  id: string;
  status: "pending" | "paid" | "failed";
  total_gbp: number;
  currency: string;
  fulfilment: "pickup" | "delivery";
  customer_name: string | null;
  customer_email: string | null;
  address_line1: string | null;
  city: string | null;
  postcode: string | null;
  order_items: { quantity: number; unit_price_gbp: number; products: { name: string; pack_size: string } | null }[];
};

export default async function OrderSuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  const { order: orderId } = await searchParams;
  if (typeof orderId !== "string") notFound();

  // Customer's own session: Row Level Security only lets people read THEIR orders.
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select(
      "id, status, total_gbp, currency, fulfilment, customer_name, customer_email, address_line1, city, postcode, order_items(quantity, unit_price_gbp, products(name, pack_size))"
    )
    .eq("id", orderId)
    .maybeSingle();
  const order = data as OrderRow | null;
  if (!order) notFound();

  const paid = order.status === "paid";
  const firstName = order.customer_name?.split(" ")[0];
  const shortRef = order.id.slice(0, 8).toUpperCase();

  return (
    <main className="flex-1">
      {paid && <ClearBasket />}
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-8 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-forest">Order {shortRef}</p>

        {paid ? (
          <>
            <h1 className="display mt-4 text-[clamp(2.5rem,7vw,5rem)] font-bold">
              Thank you{firstName ? `, ${firstName}` : ""}. <em className="font-semibold text-terracotta">It&rsquo;s on its way.</em>
            </h1>
            <p className="mt-5 text-lg text-brown-soft">
              Your payment went through. A confirmation is heading to{" "}
              <span className="font-medium text-brown">{order.customer_email}</span>.{" "}
              {order.fulfilment === "pickup"
                ? "We’ll be in touch shortly with your pickup details."
                : "We’ll be in touch shortly to confirm your delivery fee and time."}
            </p>
          </>
        ) : order.status === "pending" ? (
          <>
            <h1 className="display mt-4 text-[clamp(2.5rem,7vw,4.5rem)] font-bold">Just confirming your payment…</h1>
            <p className="mt-5 text-lg text-brown-soft">
              Paystack hasn&rsquo;t confirmed this payment yet. This usually takes a few seconds — please refresh this page.
              If you weren&rsquo;t charged, you can go back to your basket and try again.
            </p>
          </>
        ) : (
          <>
            <h1 className="display mt-4 text-[clamp(2.5rem,7vw,4.5rem)] font-bold">This payment didn&rsquo;t go through.</h1>
            <p className="mt-5 text-lg text-brown-soft">You haven&rsquo;t been charged. Your basket is still saved — please try again.</p>
          </>
        )}

        <div className="mt-10 rounded-[1.75rem] bg-cream p-6 shadow-warm ring-1 ring-brown/5 sm:p-8">
          <h2 className="font-heading text-2xl font-semibold">Order summary</h2>
          <ul className="mt-4 divide-y divide-brown/10">
            {order.order_items.map((item, i) => (
              <li key={i} className="flex justify-between gap-4 py-3">
                <span>
                  <span className="font-medium">{item.products?.name ?? "Snack"}</span>
                  <span className="block text-sm text-brown-soft">
                    {item.quantity} × {formatPence(Math.round(Number(item.unit_price_gbp) * 100))}
                    {item.products?.pack_size ? ` · ${item.products.pack_size}` : ""}
                  </span>
                </span>
                <span className="font-medium tabular-nums">
                  {formatPence(Math.round(Number(item.unit_price_gbp) * 100) * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-baseline justify-between border-t border-brown/10 pt-4">
            <span className="font-semibold">{paid ? "Paid" : "Total"}</span>
            <span className="font-heading text-2xl font-bold tabular-nums">
              {formatPence(Math.round(Number(order.total_gbp) * 100))}
            </span>
          </div>
          {order.currency === "NGN" && (
            <p className="mt-2 text-right text-xs text-brown-soft">
              {`Test payment charged as ₦${(Number(order.total_gbp) * DEMO_NGN_PER_GBP).toLocaleString("en-GB")} (demo rate £1 = ₦${DEMO_NGN_PER_GBP.toLocaleString("en-GB")})`}
            </p>
          )}
          <p className="mt-4 text-sm text-brown-soft">
            {order.fulfilment === "pickup"
              ? "Pickup — we’ll message you with the details."
              : `Delivery to ${[order.address_line1, order.city, order.postcode].filter(Boolean).join(", ")}`}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href={paid ? "/#shop" : "/checkout"}
            className="press inline-flex justify-center rounded-full bg-gold px-6 py-3 font-semibold text-brown hover:bg-brown hover:text-cream"
          >
            {paid ? "Back to the shop" : "Back to checkout"}
          </Link>
          <p className="text-sm text-brown-soft">
            Questions?{" "}
            <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="font-medium text-brown underline decoration-gold/60 underline-offset-4">
              Message us on WhatsApp
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
