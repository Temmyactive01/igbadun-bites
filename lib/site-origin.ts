import type { NextRequest } from "next/server";

// The address the visitor actually used (e.g. https://igbadun-bites.netlify.app).
//
// On Netlify, request.url / nextUrl.origin report the internal deploy URL
// (https://<deploy-id>--igbadun-bites.netlify.app). Redirecting there would
// lose the sign-in cookie, which belongs to the address the visitor is on —
// so build redirects from the Host header instead.
export function siteOrigin(request: NextRequest): string {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return request.nextUrl.origin;
  const proto =
    request.headers.get("x-forwarded-proto")?.split(",")[0].trim() ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
  return `${proto}://${host}`;
}
