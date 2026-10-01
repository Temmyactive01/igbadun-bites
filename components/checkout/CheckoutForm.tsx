"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { formatPence, useCart } from "@/lib/cart-store";
import { CHARGE_CURRENCY, DEMO_NGN_PER_GBP, formatCharge } from "@/lib/payment-config";

type Props = { defaultName: string; email: string };
type Fulfilment = "pickup" | "delivery";

const noop = () => () => {};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-brown/20 bg-cream px-4 py-3 text-brown placeholder:text-brown-soft/50 transition duration-200 ease-brand focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";

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

  if (!isClient) return <div className="mt-10 h-96 animate-pulse rounded-[1.75rem] bg-cream-deep/60" aria-hidden />;

  if (items.length === 0) {
    return (
      <div className="mt-10 max-w-lg rounded-[1.75rem] bg-cream p-8 shadow-warm ring-1 ring-brown/5">
        <h2 className="text-2xl font-semibold">Your basket is empty.</h2>
        <p className="mt-2 text-brown-soft">Add a few snacks first, then come back here to check out.</p>
        <Link
          href="/#shop"
          className="press mt-6 inline-flex rounded-full bg-gold px-6 py-3 font-semibold text-brown hover:bg-brown hover:text-cream"
        >
          Browse the snacks
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="space-y-10 lg:col-span-7">
        {/* Pickup or delivery */}
        <fieldset>
          <legend className="font-heading text-2xl font-semibold">How would you like your snacks?</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(
              [
                { value: "pickup", title: "Pickup", note: "Collect from us — we’ll message you with the details." },
                { value: "delivery", title: "Delivery", note: "Delivery fee confirmed by phone or WhatsApp after you order." },
              ] as const
            ).map((option) => (
              <label
                key={option.value}
                className={`press cursor-pointer rounded-2xl border-2 p-5 ${
                  fulfilment === option.value ? "border-gold bg-gold/10" : "border-brown/15 bg-cream hover:border-brown/40"
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
                  <span className="font-heading text-xl font-semibold">{option.title}</span>
                  <span
                    className={`h-5 w-5 rounded-full border-2 ${
                      fulfilment === option.value ? "border-gold bg-gold shadow-[inset_0_0_0_3px_var(--color-cream)]" : "border-brown/30"
                    }`}
                    aria-hidden
                  />
                </span>
                <span className="mt-1.5 block text-sm text-brown-soft">{option.note}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Contact */}
        <fieldset className="space-y-4">
          <legend className="font-heading text-2xl font-semibold">Your details</legend>
          <label className="block text-sm font-medium">
            Full name
            <input name="name" required maxLength={100} defaultValue={defaultName} autoComplete="name" className={inputClass} />
          </label>
          <label className="block text-sm font-medium">
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
            <span className="mt-1 block text-xs font-normal text-brown-soft">So we can arrange your {fulfilment}.</span>
          </label>
          <p className="text-sm text-brown-soft">
            Confirmation goes to <span className="font-medium text-brown">{email}</span>
          </p>
        </fieldset>

        {/* Address — only for delivery */}
        {fulfilment === "delivery" && (
          <fieldset className="space-y-4">
            <legend className="font-heading text-2xl font-semibold">Delivery address</legend>
            <label className="block text-sm font-medium">
              Address line 1
              <input name="line1" required maxLength={120} autoComplete="address-line1" className={inputClass} />
            </label>
            <label className="block text-sm font-medium">
              Address line 2 <span className="font-normal text-brown-soft">(optional)</span>
              <input name="line2" maxLength={120} autoComplete="address-line2" className={inputClass} />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Town / city
                <input name="city" required maxLength={80} autoComplete="address-level2" className={inputClass} />
              </label>
              <label className="block text-sm font-medium">
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
        <div className="rounded-[1.75rem] bg-cream p-6 shadow-warm ring-1 ring-brown/5 sm:p-8 lg:sticky lg:top-8">
          <h2 className="font-heading text-2xl font-semibold">Your order</h2>
          <ul className="mt-5 divide-y divide-brown/10">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-4 py-3">
                <span>
                  <span className="font-medium">{item.name}</span>
                  <span className="block text-sm text-brown-soft">
                    {item.quantity} × {formatPence(item.pricePence)} · {item.packSize}
                  </span>
                </span>
                <span className="font-medium tabular-nums">{formatPence(item.pricePence * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-brown/10 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-brown-soft">Subtotal</dt>
              <dd className="tabular-nums">{formatPence(subtotalPence)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brown-soft">{fulfilment === "delivery" ? "Delivery" : "Pickup"}</dt>
              <dd>{fulfilment === "delivery" ? "Confirmed after ordering" : "Free"}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-brown/10 pt-3 text-base">
              <dt className="font-semibold">Total to pay now</dt>
              <dd className="font-heading text-2xl font-bold tabular-nums">{formatPence(subtotalPence)}</dd>
            </div>
          </dl>

          {error && (
            <p role="alert" className="mt-5 rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="press mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 font-semibold text-brown shadow-warm hover:bg-brown hover:text-cream disabled:cursor-wait disabled:opacity-70"
          >
            {submitting ? "Taking you to secure payment…" : `Pay ${formatPence(subtotalPence)}`}
          </button>
          <p className="mt-3 text-center text-xs text-brown-soft">
            Secure payment by Paystack. We never see your card details.
          </p>
          {CHARGE_CURRENCY !== "GBP" && (
            <p className="mt-4 rounded-xl border border-dashed border-gold/60 bg-gold/10 px-4 py-3 text-xs leading-relaxed text-brown">
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
