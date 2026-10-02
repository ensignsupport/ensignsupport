/**
 * Structured logs. Record what happened, never what a person wrote:
 * no names, emails, phone numbers, messages or keys.
 */
type Fields = Record<string, string | number | boolean | null | undefined>;

export function log(event: string, fields: Fields = {}) {
  console.log(JSON.stringify({ at: new Date().toISOString(), event, ...fields }));
}

export function logError(event: string, error: unknown, fields: Fields = {}) {
  const message = error instanceof Error ? error.message : String(error);
  // Database and email errors can quote the values that failed, so only the
  // error type and code are logged.
  const code = (error as { code?: string } | null)?.code;
  console.error(
    JSON.stringify({
      at: new Date().toISOString(),
      event,
      error: error instanceof Error ? error.name : "Error",
      code: code ?? null,
      hint: message.slice(0, 80).replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, "[email]").replace(/\d{6,}/g, "[number]"),
      ...fields,
    }),
  );
}
