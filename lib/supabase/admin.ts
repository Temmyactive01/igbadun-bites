import "server-only";
import { createClient } from "@supabase/supabase-js";

// Admin client using the secret (service role) key. It BYPASSES Row Level Security,
// so it is only for trusted server code — e.g. writing an order after Paystack
// verifies a payment. The "server-only" import makes the build fail if this file
// is ever pulled into browser code.
export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
