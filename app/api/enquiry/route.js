export const runtime = 'nodejs';

/**
 * General enquiry intake.
 *
 * Like the referral handler, this validates and acknowledges but does not yet
 * deliver anywhere. This form collects far less than the referral form (a name,
 * a contact, and a message), so wiring it to email is a much smaller decision.
 * It still needs the client's mailbox to exist first.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Could not read the enquiry.' }, { status: 400 });
  }

  const name = String(body.name || '').trim();
  const contact = String(body.contact || '').trim();
  const message = String(body.message || '').trim();

  if (!name || !contact || !message) {
    return Response.json({ error: 'Missing required details.' }, { status: 422 });
  }

  // TODO: send to the business mailbox once it exists. See lib/content.js.
  console.info('[enquiry] received');

  return Response.json({ ok: true });
}
