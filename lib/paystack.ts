import "server-only";
import { CHARGE_CURRENCY, chargeMinorUnits } from "@/lib/payment-config";

// Paystack server-side helpers. The secret key never leaves the server.
// Card details never touch our server either: customers pay on Paystack's
// hosted checkout page, then come back to /checkout/verify.
//
// Currency check via the API (2026-10-01, test mode, Card channel on):
// NGN works; GBP is recognised but has "No active channel" (not enabled on
// this account); USD is not supported. See lib/payment-config.ts.
export const CURRENCY = CHARGE_CURRENCY;

const API = "https://api.paystack.co";

type PaystackResponse<T> = { status: boolean; message: string; data: T };

async function call<T>(path: string, init?: RequestInit): Promise<PaystackResponse<T>> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });
  return (await res.json()) as PaystackResponse<T>;
}

// Starts a payment and returns the URL of Paystack's hosted checkout page.
export async function initializeTransaction(params: {
  email: string;
  totalPence: number; // order total in GBP pence — converted to the charge currency here
  reference: string;
  callbackUrl: string;
  metadata: Record<string, unknown>;
}) {
  // Safety: the GBP→NGN demo conversion must never charge real customers.
  if (CHARGE_CURRENCY !== "GBP" && process.env.PAYSTACK_SECRET_KEY?.startsWith("sk_live_")) {
    console.error("Refusing to charge in a demo-converted currency with a LIVE Paystack key.");
    return { status: false, message: "Demo currency conversion is test-mode only", data: null } as const;
  }

  return call<{ authorization_url: string; reference: string }>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: params.email,
      amount: chargeMinorUnits(params.totalPence), // smallest unit: pence (GBP) or kobo (NGN)
      currency: CHARGE_CURRENCY,
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });
}

// Asks Paystack directly what happened to a payment. This — not anything
// the browser tells us — is what decides whether an order is paid.
export function verifyTransaction(reference: string) {
  return call<{ status: "success" | "failed" | "abandoned" | string; amount: number; currency: string; reference: string }>(
    `/transaction/verify/${encodeURIComponent(reference)}`
  );
}
