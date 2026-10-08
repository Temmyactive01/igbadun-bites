import { CONTACT } from "@/lib/contact";
import { formatPence } from "@/lib/money";
import { DEMO_NGN_PER_GBP } from "@/lib/payment-config";

export type ConfirmationOrder = {
  id: string;
  total_gbp: number;
  currency: string;
  fulfilment: "pickup" | "delivery";
  customer_name: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  postcode: string | null;
  items: { name: string; pack_size: string; quantity: number; unit_price_gbp: number }[];
};

// Customer-entered text (name, address) goes into HTML, so escape it.
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const pence = (gbp: number) => Math.round(Number(gbp) * 100);

// Brand colours from style.md. Email clients ignore most CSS, so styles are
// inline and the layout uses tables; Georgia stands in for the heading font.
const C = { cream: "#FAF3E7", creamDeep: "#F1E4CC", brown: "#3B2416", brownSoft: "#6B4A36", gold: "#C9972D", terracotta: "#B5542A" };
const serif = "Georgia, 'Times New Roman', serif";
const sans = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

export function orderConfirmationEmail(order: ConfirmationOrder) {
  const ref = order.id.slice(0, 8).toUpperCase();
  const firstName = order.customer_name?.trim().split(/\s+/)[0] ?? "";
  const total = formatPence(pence(order.total_gbp));
  const isTestNaira = order.currency === "NGN";
  const naira = `₦${(Number(order.total_gbp) * DEMO_NGN_PER_GBP).toLocaleString("en-GB")}`;
  const address = [order.address_line1, order.address_line2, order.city, order.postcode].filter(Boolean).join(", ");

  const nextSteps =
    order.fulfilment === "pickup"
      ? "We'll message you shortly with your pickup details."
      : "We'll be in touch shortly to confirm your delivery fee and time.";

  const subject = `Your Igbadun Bites order ${ref} is confirmed`;

  // ---------- Plain text (for clients that don't show HTML) ----------
  const text = [
    `Thank you${firstName ? `, ${firstName}` : ""}!`,
    "",
    `Your order ${ref} is confirmed and paid.`,
    "",
    ...order.items.map((i) => `${i.quantity} x ${i.name}${i.pack_size ? ` (${i.pack_size})` : ""} — ${formatPence(pence(i.unit_price_gbp) * i.quantity)}`),
    "",
    `Total paid: ${total}${isTestNaira ? ` (test payment charged as ${naira} at a demo rate)` : ""}`,
    order.fulfilment === "pickup" ? "Pickup" : `Delivery to: ${address}`,
    "",
    nextSteps,
    "",
    `Questions? Call or WhatsApp ${CONTACT.phoneDisplay}, or email ${CONTACT.email}.`,
    "",
    "Igbadun Bites — Bringing Back Memories, One Bite at a Time.",
  ].join("\n");

  // ---------- HTML ----------
  const rows = order.items
    .map(
      (i) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid ${C.creamDeep};font-family:${sans};font-size:15px;color:${C.brown};">
          <strong style="font-family:${serif};font-size:16px;">${esc(i.name)}</strong><br>
          <span style="color:${C.brownSoft};font-size:13px;">${i.quantity} × ${formatPence(pence(i.unit_price_gbp))}${i.pack_size ? ` · ${esc(i.pack_size)}` : ""}</span>
        </td>
        <td align="right" style="padding:12px 0;border-bottom:1px solid ${C.creamDeep};font-family:${sans};font-size:15px;color:${C.brown};white-space:nowrap;">
          ${formatPence(pence(i.unit_price_gbp) * i.quantity)}
        </td>
      </tr>`
    )
    .join("");

  const html = `<!doctype html>
<html lang="en-GB">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${C.cream};">
  <div style="display:none;max-height:0;overflow:hidden;">Thank you for your order — here are the details.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <tr><td style="padding-bottom:24px;font-family:${serif};font-size:24px;font-weight:bold;color:${C.brown};">
          Igbadun<span style="color:${C.gold};">.</span>Bites
        </td></tr>

        <tr><td style="background:#FFFDF8;border-radius:20px;padding:32px 28px;border:1px solid ${C.creamDeep};">
          <p style="margin:0 0 6px;font-family:${sans};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#2F4A32;font-weight:bold;">Order ${ref}</p>
          <h1 style="margin:0 0 14px;font-family:${serif};font-size:32px;line-height:1.1;color:${C.brown};">
            Thank you${firstName ? `, ${esc(firstName)}` : ""}.<br><em style="color:${C.terracotta};font-weight:normal;">It's on its way.</em>
          </h1>
          <p style="margin:0 0 24px;font-family:${sans};font-size:15px;line-height:1.6;color:${C.brownSoft};">
            Your payment went through and your order is confirmed. ${nextSteps}
          </p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}
            <tr>
              <td style="padding-top:16px;font-family:${sans};font-size:15px;font-weight:bold;color:${C.brown};">Total paid</td>
              <td align="right" style="padding-top:16px;font-family:${serif};font-size:22px;font-weight:bold;color:${C.brown};">${total}</td>
            </tr>
          </table>
          ${
            isTestNaira
              ? `<p style="margin:8px 0 0;text-align:right;font-family:${sans};font-size:12px;color:${C.brownSoft};">Test payment charged as ${naira} (demo rate £1 = ₦${DEMO_NGN_PER_GBP.toLocaleString("en-GB")})</p>`
              : ""
          }

          <p style="margin:24px 0 0;padding:14px 16px;background:${C.cream};border-radius:12px;font-family:${sans};font-size:14px;color:${C.brown};">
            <strong>${order.fulfilment === "pickup" ? "Pickup" : "Delivery"}</strong><br>
            <span style="color:${C.brownSoft};">${order.fulfilment === "pickup" ? "We'll message you with the details." : esc(address)}</span>
          </p>
        </td></tr>

        <tr><td style="padding:24px 4px 0;font-family:${sans};font-size:14px;line-height:1.7;color:${C.brownSoft};">
          Questions about your order? Call or WhatsApp
          <a href="${CONTACT.whatsappHref}" style="color:${C.brown};white-space:nowrap;">${CONTACT.phoneDisplay}</a>,
          or email <a href="${CONTACT.emailHref}" style="color:${C.brown};">${CONTACT.email}</a>.
        </td></tr>

        <tr><td style="padding:24px 4px 0;font-family:${serif};font-style:italic;font-size:15px;color:${C.brown};">
          Bringing Back Memories, One Bite at a Time.
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}
