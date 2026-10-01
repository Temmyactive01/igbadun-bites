import { NextResponse, type NextRequest } from "next/server";
import { confirmPayment } from "@/lib/orders";
import { siteOrigin } from "@/lib/site-origin";

// Paystack sends the customer back here after they pay (callback_url).
// We never trust the redirect itself — confirmPayment() asks Paystack's API
// directly whether the payment really succeeded, and for the right amount.
export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference") ?? request.nextUrl.searchParams.get("trxref");
  const to = (path: string) => NextResponse.redirect(`${siteOrigin(request)}${path}`);

  if (!reference) return to("/checkout?payment=missing");

  const outcome = await confirmPayment(reference);
  if (outcome.status === "paid") return to(`/checkout/success?order=${outcome.orderId}`);
  if (outcome.status === "pending") return to(`/checkout/success?order=${outcome.orderId}`); // page explains "still processing"
  return to("/checkout?payment=failed");
}
