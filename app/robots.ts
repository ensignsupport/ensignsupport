import type { MetadataRoute } from "next";

/**
 * Search engines stay out until launch. The dev site (the workers.dev address)
 * is never indexed. At go live, set SITE_INDEXING=true on the live Worker
 * for the production site only. The admin area is never indexed.
 */
export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_INDEXING !== "true") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return { rules: { userAgent: "*", allow: "/", disallow: "/admin" } };
}
