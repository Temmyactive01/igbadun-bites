import { shopSummary } from "@/lib/product-status";
import { getProducts } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";
import HeaderBar from "./header/HeaderBar";

// Reads the signed-in user (if any) from the session cookie on the server,
// so the header renders the right state with no flicker. Presentation lives
// in HeaderBar (client) because it reacts to scroll and the current page.
export default async function SiteHeader() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  const meta = (claims?.user_metadata ?? {}) as { full_name?: string; name?: string };
  const fullName = meta.full_name ?? meta.name ?? claims?.email ?? "";
  const firstName = fullName.split(/[\s@]/)[0];

  // The phone menu's "Fourteen snacks, three chapters", counted from the shop's products
  // (no note if they can't be loaded)
  const { products, error } = await getProducts();
  const shopNote = error || products.length === 0 ? "" : shopSummary(products);

  return <HeaderBar signedIn={Boolean(claims)} firstName={firstName} shopNote={shopNote} />;
}
