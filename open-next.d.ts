/**
 * `.open-next/worker.js` is written by `opennextjs-cloudflare build`, so it is
 * not in git and is not on disk until the site has been built once. Declaring
 * it here means worker.ts typechecks either way, which matters because
 * `npm run check` typechecks before it builds.
 *
 * Only the default export is described. Anything else OpenNext exports (its
 * Durable Objects) is carried through by `export *` in worker.ts, which
 * wrangler resolves when it bundles.
 */
declare module "*.open-next/worker.js" {
  const handler: {
    fetch: (request: Request, env: CloudflareEnv, ctx: ExecutionContext) => Promise<Response>;
  };
  export default handler;
}
