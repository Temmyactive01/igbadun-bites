// What currency Paystack actually charges in. Safe to import anywhere (no secrets).
//
// DEMO WORKAROUND (decided 2026-10-01): the Paystack account can't take GBP yet
// ("No active channel"), so in TEST MODE we charge the naira equivalent at a
// fixed demo rate. Shop prices and order totals stay in GBP. lib/paystack.ts
// refuses to use this conversion with a live key.
// For real launch: get GBP enabled by Paystack (then set CHARGE_CURRENCY = "GBP")
// or switch provider — see architecture.md.
export const CHARGE_CURRENCY: "GBP" | "NGN" = "NGN";
export const DEMO_NGN_PER_GBP = 2000;

// Paystack amounts are in the smallest unit: pence for GBP, kobo for NGN.
// £1 = 100p → ₦2,000 = 200,000 kobo, so kobo = pence × rate.
export function chargeMinorUnits(gbpPence: number): number {
  return CHARGE_CURRENCY === "GBP" ? gbpPence : gbpPence * DEMO_NGN_PER_GBP;
}

export function formatCharge(gbpPence: number): string {
  if (CHARGE_CURRENCY === "GBP") return `£${(gbpPence / 100).toFixed(2)}`;
  const naira = chargeMinorUnits(gbpPence) / 100;
  return `₦${naira.toLocaleString("en-GB", { maximumFractionDigits: 0 })}`;
}
