import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * How the OpenNext adapter turns `next build` output into a Worker.
 * Defaults everywhere: this site has no incremental cache to configure, as
 * every page is either static or rendered per request.
 */
export default defineCloudflareConfig();
