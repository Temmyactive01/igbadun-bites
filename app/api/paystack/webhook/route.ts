import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { confirmPayment } from "@/lib/orders";

// Paystack calls this server-to-server when a payment completes — a backup
// for customers who close the tab before being redirected back to us.
// Only works once the site has a public URL (Step 8): set it in
// Paystack Dashboard → Settings → API Keys & Webhooks → Test Webhook URL.
export async function POST(request: NextRequest) {
  const raw = await request.text();

  // Reject anything not signed with our Paystack secret key
  const signature = request.headers.get("x-paystack-signature") ?? "";
  const expected = createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!).update(raw).digest("hex");
  const valid =
    signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) return new NextResponse("Invalid signature", { status: 401 });

  const event = JSON.parse(raw) as { event?: string; data?: { reference?: string } };
  if (event.event === "charge.success" && event.data?.reference) {
    // Still re-verifies with Paystack's API rather than trusting the payload alone
    await confirmPayment(event.data.reference);
  }

  return new NextResponse("ok"); // always 200 for valid events so Paystack doesn't retry forever
}
