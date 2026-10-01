import { NextResponse, type NextRequest } from "next/server";
import { siteOrigin } from "@/lib/site-origin";
import { createClient } from "@/lib/supabase/server";

// POST only (from the header's sign-out form), so a link or prefetch can't sign someone out.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(`${siteOrigin(request)}/`, { status: 303 });
}
