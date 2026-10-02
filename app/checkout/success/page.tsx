import Link from "next/link";
import { notFound } from "next/navigation";
import ClearBasket from "@/components/checkout/ClearBasket";
import OrderLines from "@/components/orders/OrderLines";
import PageIntro from "@/components/ui/PageIntro";
import { buttonMd, buttonPrimary, panel, textLink } from "@/components/ui/styles";
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
      <div className="mx-auto max-w-[1440px] px-4 py-[clamp(3.5rem,2rem+5vw,7rem)] sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          {paid ? (
            <>
              <PageIntro eyebrow={`Order ${shortRef}`}>
                Thank you{firstName ? `, ${firstName}` : ""}. <em>It&rsquo;s on its way.</em>
              </PageIntro>
              <p className="text-body-l mt-8 max-w-2xl text-cocoa-soft">
                Your payment went through. A confirmation is heading to{" "}
                <span className="font-medium text-cocoa">{order.customer_email}</span>.{" "}
                {order.fulfilment === "pickup"
                  ? "We’ll be in touch shortly with your pickup details."
                  : "We’ll be in touch shortly to confirm your delivery fee and time."}
              </p>
            </>
          ) : order.status === "pending" ? (
            <>
              <PageIntro eyebrow={`Order ${shortRef}`}>Just confirming your payment…</PageIntro>
              <p className="text-body-l mt-8 max-w-2xl text-cocoa-soft">
                Paystack hasn&rsquo;t confirmed this payment yet. This usually takes a few seconds — please refresh this
                page. If you weren&rsquo;t charged, you can go back to your basket and try again.
              </p>
            </>
          ) : (
            <>
              <PageIntro eyebrow={`Order ${shortRef}`}>This payment didn&rsquo;t go through.</PageIntro>
              <p className="text-body-l mt-8 max-w-2xl text-cocoa-soft">
                You haven&rsquo;t been charged. Your basket is still saved — please try again.
              </p>
            </>
          )}

          <section aria-labelledby="summary-title" className={`${panel} mt-12 p-6 sm:p-8`}>
            <h2 id="summary-title" className="text-title serif-editorial">
              Order summary
            </h2>
            <OrderLines
              className="mt-3"
              lines={order.order_items.map((item) => ({
                name: item.products?.name ?? "Snack",
                packSize: item.products?.pack_size,
                quantity: item.quantity,
                unitPence: Math.round(Number(item.unit_price_gbp) * 100),
              }))}
            />
            <div className="flex items-baseline justify-between border-t border-cocoa/10 pt-4">
              <span className="text-eyebrow text-cocoa">{paid ? "Paid" : "Total"}</span>
              <span className="font-heading text-3xl tabular-nums">
                {formatPence(Math.round(Number(order.total_gbp) * 100))}
              </span>
            </div>
            {order.currency === "NGN" && (
              <p className="mt-2 text-right text-xs text-cocoa-soft">
                {`Test payment charged as ₦${(Number(order.total_gbp) * DEMO_NGN_PER_GBP).toLocaleString("en-GB")} (demo rate £1 = ₦${DEMO_NGN_PER_GBP.toLocaleString("en-GB")})`}
              </p>
            )}
            <p className="mt-5 border-t border-cocoa/10 pt-4 text-sm text-cocoa-soft">
              {order.fulfilment === "pickup"
                ? "Pickup — we’ll message you with the details."
                : `Delivery to ${[order.address_line1, order.city, order.postcode].filter(Boolean).join(", ")}`}
            </p>
          </section>

          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
            <Link href={paid ? "/#shop" : "/checkout"} className={`${buttonPrimary} ${buttonMd}`}>
              {paid ? "Back to the shop" : "Back to checkout"}
            </Link>
            {paid && (
              <Link href="/orders" className={textLink}>
                See my orders
              </Link>
            )}
            <p className="text-sm text-cocoa-soft">
              Questions?{" "}
              <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className={textLink}>
                Message us on WhatsApp
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
