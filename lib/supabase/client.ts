import { createBrowserClient } from "@supabase/ssr";

// Supabase client for Client Components (runs in the visitor's browser).
// Public key only — Row Level Security decides what it can read.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
