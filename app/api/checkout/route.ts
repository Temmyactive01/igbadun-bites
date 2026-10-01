import { NextResponse, type NextRequest } from "next/server";
import { CURRENCY, initializeTransaction } from "@/lib/paystack";
import { siteOrigin } from "@/lib/site-origin";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// POST /api/checkout
// Creates a "pending" order and returns Paystack's hosted payment page URL.
//
// Security: the browser sends ONLY product ids + quantities (and delivery
// details). Every price is re-read from Supabase here, so editing the basket
// in the browser can't change what anyone pays.

const MAX_QUANTITY = 20;
const MAX_LINES = 30;
const DELIVERY_FEE_GBP = 0; // Placeholder until the owner confirms charges (prd.md open items)
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;
const PHONE = /^\+?[\d\s()-]{7,20}$/;

type Body = {
  items?: { productId?: unknown; quantity?: unknown }[];
  fulfilment?: unknown;
  name?: unknown;
  phone?: unknown;
  address?: { line1?: unknown; line2?: unknown; city?: unknown; postcode?: unknown };
};

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const fail = (message: string, status = 400) => NextResponse.json({ error: message }, { status });

export async function POST(request: NextRequest) {
  // 1. Must be signed in
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user?.email) return fail("Please sign in to check out.", 401);

  // 2. Validate what the browser sent
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return fail("Something went wrong — please try again.");
  }

  const lines = Array.isArray(body.items) ? body.items : [];
  if (lines.length === 0) return fail("Your basket is empty.");
  if (lines.length > MAX_LINES) return fail("That's a lot of snacks! Please message us for large orders.");

  const quantities = new Map<string, number>();
  for (const line of lines) {
    const id = line.productId;
    const qty = line.quantity;
    if (typeof id !== "string" || !UUID.test(id)) return fail("Your basket has an item we don't recognise.");
    if (!Number.isInteger(qty) || (qty as number) < 1 || (qty as number) > MAX_QUANTITY) {
      return fail(`Quantities must be between 1 and ${MAX_QUANTITY}.`);
    }
    quantities.set(id, (quantities.get(id) ?? 0) + (qty as number));
  }

  const fulfilment = body.fulfilment === "delivery" ? "delivery" : body.fulfilment === "pickup" ? "pickup" : null;
  if (!fulfilment) return fail("Please choose pickup or delivery.");

  const name = text(body.name, 100);
  const phone = text(body.phone, 30);
  if (!name) return fail("Please enter your name.");
  if (!PHONE.test(phone)) return fail("Please enter a valid phone number.");

  const address = {
    line1: text(body.address?.line1, 120),
    line2: text(body.address?.line2, 120),
    city: text(body.address?.city, 80),
    postcode: text(body.address?.postcode, 10).toUpperCase(),
  };
  if (fulfilment === "delivery") {
    if (!address.line1 || !address.city) return fail("Please enter your delivery address.");
    if (!UK_POSTCODE.test(address.postcode)) return fail("Please enter a valid UK postcode.");
  }

  // 3. Re-price everything from the database
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price_gbp, available")
    .in("id", [...quantities.keys()]);
  if (productsError) return fail("We couldn't load the shop just now — please try again.", 503);

  for (const id of quantities.keys()) {
    const product = products.find((p) => p.id === id);
    if (!product) return fail("Something in your basket is no longer available. Please remove it and try again.", 409);
    if (!product.available) return fail(`Sorry — ${product.name} has just sold out. Please remove it to continue.`, 409);
  }

  const itemsPence = products.reduce((sum, p) => sum + Math.round(Number(p.price_gbp) * 100) * quantities.get(p.id)!, 0);
  const deliveryPence = fulfilment === "delivery" ? Math.round(DELIVERY_FEE_GBP * 100) : 0;
  const totalPence = itemsPence + deliveryPence;

  // 4. Save the order as "pending" (service role — customers can't write orders directly)
  const admin = createAdminClient();
  const orderId = crypto.randomUUID();
  const reference = `igb_${orderId}`;
  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      id: orderId,
      paystack_reference: reference,
      user_id: user.id,
      status: "pending",
      total_gbp: totalPence / 100,
      currency: CURRENCY,
      fulfilment,
      customer_name: name,
      customer_email: user.email,
      phone,
      address_line1: fulfilment === "delivery" ? address.line1 : null,
      address_line2: fulfilment === "delivery" ? address.line2 || null : null,
      city: fulfilment === "delivery" ? address.city : null,
      postcode: fulfilment === "delivery" ? address.postcode : null,
      delivery_fee_gbp: deliveryPence / 100,
    })
    .select("id")
    .single();
  if (orderError || !order) {
    console.error("Could not create order:", orderError?.message);
    return fail("We couldn't start your order — please try again.", 500);
  }

  const { error: itemsError } = await admin.from("order_items").insert(
    products.map((p) => ({
      order_id: order.id,
      product_id: p.id,
      quantity: quantities.get(p.id)!,
      unit_price_gbp: Number(p.price_gbp),
    }))
  );
  if (itemsError) {
    console.error("Could not save order items:", itemsError.message);
    await admin.from("orders").delete().eq("id", order.id);
    return fail("We couldn't start your order — please try again.", 500);
  }

  // 5. Start the Paystack payment
  const paystack = await initializeTransaction({
    email: user.email,
    totalPence,
    reference,
    callbackUrl: `${siteOrigin(request)}/checkout/verify`,
    metadata: { order_id: order.id, fulfilment },
  });

  if (!paystack.status) {
    console.error("Paystack initialize failed:", paystack.message);
    await admin.from("orders").update({ status: "failed" }).eq("id", order.id);
    return fail("Payments aren't available right now — please try again shortly, or message us on WhatsApp.", 502);
  }

  return NextResponse.json({ authorizationUrl: paystack.data.authorization_url });
}
