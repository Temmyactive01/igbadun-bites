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

  return <HeaderBar signedIn={Boolean(claims)} firstName={firstName} />;
}
