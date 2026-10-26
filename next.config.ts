import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Security headers for every page. The admin area adds stricter ones here and
// in proxy.ts (a nonce-based Content Security Policy).
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    // The admin's own headers (no caching, no indexing, no referrer) are set in
    // proxy.ts instead of here. Setting a header in both places makes the Worker
    // send both values joined by a comma, and proxy.ts covers more: it also runs
    // on the redirect to the sign in page, which never reaches a route.
    // Referrer-Policy is the one shared key, so the public rule skips /admin,
    // which sets its own stricter no-referrer.
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/((?!admin).*)", headers: [{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }] },
    ];
  },
};

export default nextConfig;

// Lets `next dev` reach the Cloudflare bindings (the D1 database) the same
// way the deployed Worker does. Does nothing outside the dev server.
void initOpenNextCloudflareForDev();
