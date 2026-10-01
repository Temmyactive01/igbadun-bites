// Only allow redirects to paths on our own site (e.g. "/checkout"), never to
// another domain ("https://evil.com" or "//evil.com"). Falls back to the home page.
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return "/";
  return next;
}
