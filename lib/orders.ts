import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEMO_NGN_PER_GBP } from "@/lib/payment-config";
import { verifyTransaction } from "@/lib/paystack";

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

    if (updated?.length) {
      // Step 7: send the Mailgun confirmation email here (runs exactly once per order).
    }
    return { status: "paid", orderId: order.id };
  }

  if (tx.status === "failed") {
    await admin.from("orders").update({ status: "failed" }).eq("id", order.id).eq("status", "pending");
    return { status: "failed", orderId: order.id };
  }

  // "abandoned" / "ongoing": customer hasn't finished paying — leave it pending.
  return { status: "pending", orderId: order.id };
}
