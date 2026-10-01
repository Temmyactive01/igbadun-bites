import { NextResponse, type NextRequest } from "next/server";
import { safeNextPath } from "@/lib/safe-redirect";
import { siteOrigin } from "@/lib/site-origin";
import { createClient } from "@/lib/supabase/server";

// Google → Supabase → here. Supabase sends a one-time `code`, which we swap
// for a login session (stored in a cookie), then send the visitor back to
// the page they started from.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const origin = siteOrigin(request);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
    console.error("Google sign-in failed:", error.message);
  }

  return NextResponse.redirect(`${origin}/auth/error`);
}
