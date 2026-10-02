import { NextResponse, type NextRequest } from "next/server";

/**
 * Runs in front of every admin page (admin-security-requirements.md, items 4 and 5).
 * - A strict Content Security Policy with a fresh nonce on every request, so
 *   only this site's own scripts can run in the admin.
 * - Nothing in the admin is stored by the browser or shown to search engines,
 *   and links out of it never tell the other site where they came from.
 * - No session cookie at all: straight to the sign in page. This is only a
 *   quick first check. Every admin page and action checks the session itself
 *   against the database (lib/server/admin-auth.ts).
 *
 * Kept free of Node-only code so it runs wherever the host runs it.
 */
const SESSION_COOKIE = "__Host-ensign_admin";

export function proxy(request: NextRequest) {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const nonce = btoa(String.fromCharCode(...bytes));
  const dev = process.env.NODE_ENV === "development";
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'nonce-${nonce}'`,
    // Icons take their size from a style attribute (the site scale). Attributes
    // only: a style attribute cannot run code.
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    dev ? "" : "upgrade-insecure-requests",
  ]
    .filter(Boolean)
    .join("; ");

  const { pathname, search } = request.nextUrl;
  const isSignIn = pathname === "/admin/sign-in";
  let response: NextResponse;
  if (!isSignIn && !request.cookies.has(SESSION_COOKIE)) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/sign-in";
    url.search = "";
    if (pathname !== "/admin") url.searchParams.set("next", pathname + search);
    response = NextResponse.redirect(url);
  } else {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", csp);
    response = NextResponse.next({ request: { headers: requestHeaders } });
  }
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
