import "server-only";
import { orderConfirmationEmail, type ConfirmationOrder } from "@/lib/emails/order-confirmation";
import { sendEmail } from "@/lib/mailgun";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEMO_NGN_PER_GBP } from "@/lib/payment-config";
import { verifyTransaction } from "@/lib/paystack";

// Emails the customer their order confirmation. A failed email must never undo
// or block a successful payment, so errors are logged rather than thrown.
async function sendConfirmationEmail(orderId: string) {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("orders")
      .select(
        "id, total_gbp, currency, fulfilment, customer_name, customer_email, address_line1, address_line2, city, postcode, order_items(quantity, unit_price_gbp, products(name, pack_size))"
      )
      .eq("id", orderId)
      .single();
    if (error || !data?.customer_email) throw new Error(error?.message ?? "order has no customer email");

    const row = data as unknown as Omit<ConfirmationOrder, "items"> & {
      customer_email: string;
      order_items: { quantity: number; unit_price_gbp: number; products: { name: string; pack_size: string } | null }[];
    };
    const email = orderConfirmationEmail({
      ...row,
      items: row.order_items.map((i) => ({
        name: i.products?.name ?? "Snack",
        pack_size: i.products?.pack_size ?? "",
        quantity: i.quantity,
        unit_price_gbp: i.unit_price_gbp,
      })),
    });
    await sendEmail({ to: row.customer_email, ...email });
    console.log(`Confirmation email sent for order ${orderId}`);
  } catch (err) {
    console.error(`Could not send confirmation email for order ${orderId}:`, err);
  }
}

export type PaymentOutcome = { status: "paid" | "pending" | "failed" | "not_found"; orderId?: string };

// The ONLY place an order becomes "paid". Used by both the customer's return
// from Paystack (/checkout/verify) and Paystack's webhook, so whichever arrives
// first does the work and the other is a harmless no-op.
export async function confirmPayment(reference: string): Promise<PaymentOutcome> {
  const admin = createAdminClient();

  const { data: order } = await admin
    .from("orders")
    .select("id, status, total_gbp, currency")
    .eq("paystack_reference", reference)
    .maybeSingle();
  if (!order) return { status: "not_found" };
  if (order.status === "paid") return { status: "paid", orderId: order.id };

  const result = await verifyTransaction(reference);
  if (!result.status) {
    console.error("Paystack verify failed:", result.message);
    return { status: "pending", orderId: order.id };
  }

  const tx = result.data;
  // What Paystack should have charged, in its smallest unit (pence or kobo)
  // (based on the currency recorded on THIS order when it was created)
  const totalPence = Math.round(Number(order.total_gbp) * 100);
  const expectedMinor = order.currency === "NGN" ? totalPence * DEMO_NGN_PER_GBP : totalPence;

  if (tx.status === "success") {
    // Paystack says it succeeded — but only accept it if they charged the
    // right amount in the right currency for THIS order.
    if (tx.amount !== expectedMinor || tx.currency !== order.currency) {
      console.error(
        `Payment mismatch for order ${order.id}: expected ${expectedMinor} ${order.currency}, got ${tx.amount} ${tx.currency}`
      );
      await admin.from("orders").update({ status: "failed" }).eq("id", order.id).eq("status", "pending");
      return { status: "failed", orderId: order.id };
    }

    // "status = pending" guard makes this safe if verify + webhook race.
    const { data: updated } = await admin
      .from("orders")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", order.id)
      .eq("status", "pending")
      .select("id");

    // Only the request that actually flipped pending → paid sends the email,
    // so each order gets exactly one confirmation even if verify + webhook race.
    if (updated?.length) await sendConfirmationEmail(order.id);
    return { status: "paid", orderId: order.id };
  }

  if (tx.status === "failed") {
    await admin.from("orders").update({ status: "failed" }).eq("id", order.id).eq("status", "pending");
    return { status: "failed", orderId: order.id };
  }

  // "abandoned" / "ongoing": customer hasn't finished paying — leave it pending.
  return { status: "pending", orderId: order.id };
}
