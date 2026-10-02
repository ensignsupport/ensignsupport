import "server-only";
import { allow } from "./rate-limit";
import { log, logError } from "./log";
import { processOutbox, sendSaveFailedAlert } from "./email";
import { clientIp, hashKey, isSameOrigin } from "./request";
import { HONEYPOT } from "@/lib/forms/schema";
import { isDataError, withRetry } from "./submissions";

type Parsed<T> = { success: true; data: T } | { success: false; errors: Record<string, string> };

type Options<T> = {
  form: "referral" | "enquiry";
  limitPerHour: number;
  parse: (body: unknown) => Parsed<T>;
  save: (data: T) => Promise<string>;
};

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/**
 * The shared path for both public forms:
 * check origin, check size, check the honeypot, rate limit, validate,
 * save with one retry, then try to send the alert.
 * The visitor only hears "sent" after the database confirms the save.
 */
export async function handleFormPost<T>(request: Request, opts: Options<T>): Promise<Response> {
  if (!isSameOrigin(request)) return json({ ok: false, error: "forbidden" }, 403);

  const MAX_BYTES = 20_000;
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BYTES) return json({ ok: false, error: "too_large" }, 413);
  const raw = await request.text();
  if (Buffer.byteLength(raw) > MAX_BYTES) return json({ ok: false, error: "too_large" }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }

  // A filled honeypot means a bot. Say thanks and keep nothing.
  const trap = (body as Record<string, unknown> | null)?.[HONEYPOT];
  if (typeof trap === "string" && trap.length > 0) {
    log(`${opts.form}.honeypot`);
    return json({ ok: true });
  }

  const parsed = opts.parse(body);
  if (!parsed.success) {
    log(`${opts.form}.invalid`, { fields: Object.keys(parsed.errors).join(",") });
    return json({ ok: false, error: "invalid", fields: parsed.errors }, 422);
  }

  try {
    const ip = clientIp(request);
    if (!ip) log(`${opts.form}.rate_limit_skipped`, { reason: "no trusted address" });
    else if (!(await allow(hashKey(opts.form, ip), opts.limitPerHour))) {
      log(`${opts.form}.rate_limited`);
      return json({ ok: false, error: "rate_limited" }, 429);
    }
  } catch (error) {
    // If the limiter itself cannot reach the database, the save below will
    // find out too and handle it.
    logError(`${opts.form}.rate_limit_unavailable`, error);
  }

  let ref: string;
  try {
    ref = await withRetry(() => opts.save(parsed.data));
  } catch (error) {
    if (isDataError(error)) {
      // The database refused the data itself. Not an outage, so no alert.
      logError(`${opts.form}.data_refused`, error);
      return json({ ok: false, error: "invalid", fields: {} }, 422);
    }
    logError(`${opts.form}.save_failed`, error);
    await sendSaveFailedAlert(opts.form);
    return json({ ok: false, error: "save_failed" }, 503);
  }
  log(`${opts.form}.saved`, { ref });

  // The record is safe. Try the alert now; anything that fails is retried
  // by the hourly job (netlify/functions/alerts.mts).
  try {
    await Promise.race([processOutbox(5), new Promise((resolve) => setTimeout(resolve, 4000))]);
  } catch (error) {
    logError("email.outbox_failed", error);
  }

  return json({ ok: true });
}
