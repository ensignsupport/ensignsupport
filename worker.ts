// The Worker Cloudflare actually runs. It is the site that OpenNext builds,
// plus the hourly alerts job that used to be a Netlify scheduled function.
// See docs/decisions/0008-moving-to-cloudflare.md.
//
// .open-next/worker.js is written by `opennextjs-cloudflare build`, so it is
// not in git. open-next.d.ts describes it so this file typechecks before the
// first build.
import handler from "./.open-next/worker.js";
// Carries through anything else OpenNext exports, such as its Durable Objects.
export * from "./.open-next/worker.js";

export default {
  fetch: handler.fetch,

  /**
   * Runs every hour. The work goes through the site's own /api/alerts route
   * rather than being called here, so it runs inside a normal request the way
   * the rest of the server code expects, with the D1 binding in place.
   * Nothing leaves the Worker: this never touches the network.
   */
  async scheduled(controller: ScheduledController, env: CloudflareEnv, ctx: ExecutionContext) {
    const secret = (env as CloudflareEnv & { CRON_SECRET?: string }).CRON_SECRET;
    const say = (event: string, fields: Record<string, unknown> = {}) =>
      console.error(JSON.stringify({ at: new Date().toISOString(), event, cron: controller.cron, ...fields }));
    if (!secret) {
      say("alerts.no_cron_secret");
      return;
    }
    const request = new Request("https://ensign.invalid/api/alerts", {
      method: "POST",
      headers: { "x-cron-secret": secret },
    });
    ctx.waitUntil(
      handler
        .fetch(request, env, ctx)
        .then((response) => {
          if (!response.ok) say("alerts.job_http_error", { status: response.status });
        })
        .catch((error: unknown) => say("alerts.job_failed", { error: error instanceof Error ? error.name : "Error" })),
    );
  },
};
