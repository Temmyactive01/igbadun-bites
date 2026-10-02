"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import OrderLines from "@/components/orders/OrderLines";
import { buttonLg, buttonMd, buttonPrimary, fieldHint, fieldInput, fieldLabel, notice, panel } from "@/components/ui/styles";
import { formatPence, useCart } from "@/lib/cart-store";
import { CHARGE_CURRENCY, DEMO_NGN_PER_GBP, formatCharge } from "@/lib/payment-config";

type Props = { defaultName: string; email: string };
type Fulfilment = "pickup" | "delivery";

const noop = () => () => {};

const inputClass = fieldInput;
const legendClass = "text-title serif-editorial";

export default function CheckoutForm({ defaultName, email }: Props) {
  const { items, subtotalPence } = useCart();
  // The basket lives in the browser, so wait until we're in the browser before
  // deciding it's empty (avoids an "empty basket" flash on load).
  const isClient = useSyncExternalStore(noop, () => true, () => false);

  const [fulfilment, setFulfilment] = useState<Fulfilment>("pickup");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Only ids + quantities — the server looks up real prices itself
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          fulfilment,
          name: form.get("name"),
          phone: form.get("phone"),
          address: {
            line1: form.get("line1"),
            line2: form.get("line2"),
            city: form.get("city"),
            postcode: form.get("postcode"),
          },
        }),
      });
      const data = (await res.json()) as { authorizationUrl?: string; error?: string };
      if (!res.ok || !data.authorizationUrl) throw new Error(data.error ?? "Something went wrong — please try again.");
      window.location.assign(data.authorizationUrl); // Paystack's secure payment page
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong — please try again.");
      setSubmitting(false);
    }
  }

  if (!isClient) return <div className="mt-12 h-96 animate-pulse rounded-lg bg-oat-deep/60" aria-hidden />;

  if (items.length === 0) {
    return (
      <div className="mt-12 max-w-lg border-t border-cocoa/15 pt-8">
        <h2 className="text-title serif-editorial">Your basket is empty.</h2>
        <p className="mt-3 text-cocoa-soft">Add a few snacks first, then come back here to check out.</p>
        <Link href="/#shop" className={`${buttonPrimary} ${buttonMd} mt-8`}>
          Browse the snacks
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="space-y-12 lg:col-span-7">
        {/* Pickup or delivery */}
        <fieldset>
          <legend className={legendClass}>How would you like your snacks?</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(
              [
                { value: "pickup", title: "Pickup", note: "Collect from us — we’ll message you with the details." },
                { value: "delivery", title: "Delivery", note: "Delivery fee confirmed by phone or WhatsApp after you order." },
              ] as const
            ).map((option) => (
              <label
                key={option.value}
                className={`press cursor-pointer rounded-lg border p-5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-terracotta has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-oat ${
                  fulfilment === option.value
                    ? "border-cocoa bg-offwhite shadow-[inset_0_0_0_1px_var(--color-cocoa)]"
                    : "border-cocoa/15 hover:border-cocoa/40"
                }`}
              >
                <input
                  type="radio"
                  name="fulfilment"
                  value={option.value}
                  checked={fulfilment === option.value}
                  onChange={() => setFulfilment(option.value)}
                  className="sr-only"
                />
                <span className="flex items-center justify-between">
                  <span className="font-heading text-xl">{option.title}</span>
                  <span
                    className={`h-5 w-5 rounded-full border ${
                      fulfilment === option.value
                        ? "border-terracotta bg-terracotta shadow-[inset_0_0_0_4px_var(--color-offwhite)]"
                        : "border-cocoa/30"
                    }`}
                    aria-hidden
                  />
                </span>
                <span className="mt-2 block text-sm text-cocoa-soft">{option.note}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Contact */}
        <fieldset className="space-y-5">
          <legend className={legendClass}>Your details</legend>
          <label className={`${fieldLabel} pt-4`}>
            Full name
            <input name="name" required maxLength={100} defaultValue={defaultName} autoComplete="name" className={inputClass} />
          </label>
          <label className={fieldLabel}>
            Phone number
            <input
              name="phone"
              type="tel"
              required
              maxLength={30}
              autoComplete="tel"
              placeholder="07700 900123"
              className={inputClass}
            />
            <span className={fieldHint}>So we can arrange your {fulfilment}.</span>
          </label>
          <p className="text-sm text-cocoa-soft">
            Confirmation goes to <span className="font-medium text-cocoa">{email}</span>
          </p>
        </fieldset>

        {/* Address — only for delivery */}
        {fulfilment === "delivery" && (
          <fieldset className="morph-in space-y-5">
            <legend className={legendClass}>Delivery address</legend>
            <label className={`${fieldLabel} pt-4`}>
              Address line 1
              <input name="line1" required maxLength={120} autoComplete="address-line1" className={inputClass} />
            </label>
            <label className={fieldLabel}>
              Address line 2 <span className="font-normal text-cocoa-soft">(optional)</span>
              <input name="line2" maxLength={120} autoComplete="address-line2" className={inputClass} />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={fieldLabel}>
                Town / city
                <input name="city" required maxLength={80} autoComplete="address-level2" className={inputClass} />
              </label>
              <label className={fieldLabel}>
                Postcode
                <input
                  name="postcode"
                  required
                  maxLength={10}
                  autoComplete="postal-code"
                  className={`${inputClass} uppercase`}
                />
              </label>
            </div>
          </fieldset>
        )}
      </div>

      {/* Order summary */}
      <aside className="lg:col-span-5">
        <div className={`${panel} p-6 sm:p-8 lg:sticky lg:top-28`}>
          <h2 className={legendClass}>Your order</h2>
          <OrderLines
            className="mt-3"
            lines={items.map((item) => ({
              name: item.name,
              packSize: item.packSize,
              category: item.category,
              quantity: item.quantity,
              unitPence: item.pricePence,
            }))}
          />
          <dl className="space-y-2 border-t border-cocoa/10 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-cocoa-soft">Subtotal</dt>
              <dd className="tabular-nums">{formatPence(subtotalPence)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-cocoa-soft">{fulfilment === "delivery" ? "Delivery" : "Pickup"}</dt>
              <dd>{fulfilment === "delivery" ? "Confirmed after ordering" : "Free"}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-cocoa/10 pt-4 text-base">
              <dt className="text-eyebrow text-cocoa">Total to pay now</dt>
              <dd className="font-heading text-3xl tabular-nums">{formatPence(subtotalPence)}</dd>
            </div>
          </dl>

          {error && (
            <p role="alert" className={`${notice} mt-6 text-sm`}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`${buttonPrimary} ${buttonLg} mt-6 w-full`}
          >
            {submitting ? "Taking you to secure payment…" : `Pay ${formatPence(subtotalPence)}`}
          </button>
          <p className="mt-3 text-center text-xs text-cocoa-soft">
            Secure payment by Paystack. We never see your card details.
          </p>
          {CHARGE_CURRENCY !== "GBP" && (
            <p className="mt-5 rounded-md border border-dashed border-plantain-deep/50 bg-plantain/10 px-4 py-3 text-xs leading-relaxed text-cocoa">
              <span className="font-semibold">Test payment:</span> Paystack will show{" "}
              <span className="font-semibold">{formatCharge(subtotalPence)}</span> — the naira equivalent at a demo rate of
              £1 = ₦{DEMO_NGN_PER_GBP.toLocaleString("en-GB")}. No real money is taken.
            </p>
          )}
        </div>
      </aside>
    </form>
  );
}
