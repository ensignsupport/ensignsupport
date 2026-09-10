import { upload } from '@/lib/content';

export const runtime = 'nodejs';

/**
 * Referral intake.
 *
 * IMPORTANT, AND DELIBERATE: this handler validates the referral and returns a
 * reference number, but it does NOT yet store the submission or the uploaded
 * documents anywhere.
 *
 * That is not an oversight. The referral collects health information about a
 * third party who is not present to consent, which under Australian privacy law
 * is a sensitive-information category with specific handling obligations. Four
 * questions have to be answered by someone qualified before a destination is
 * wired up:
 *
 *   1. Where are documents stored, and in which country?
 *   2. Who can access them, and how is that access logged?
 *   3. How long are they retained, and how are they destroyed?
 *   4. What must the collection notice and consent wording actually say?
 *
 * Picking a mail provider or a bucket before those are answered would be
 * choosing the client's compliance posture for them. Once answered, send the
 * payload on from here.
 *
 * ---------------------------------------------------------------------------
 * THREE STAGES, ONE ENDPOINT
 *
 * `stage=lead`   The hero form. Name, one contact, and who the referral is
 *                for. Deliberately collects NOTHING about the participant, so
 *                no third-party health information is gathered and no consent
 *                is required to send it. This is what makes the hero form
 *                honest as well as short: there is nothing to consent to yet.
 *
 * `stage=detail` The follow-up, sent after the lead is already safely in.
 *                This is the first point at which participant information is
 *                collected, so this is the first point that requires consent.
 *                It carries the reference issued by the lead.
 *
 * (no stage)     The full referral form at /referral, unchanged. One
 *                submission, everything at once, consent before send.
 * ---------------------------------------------------------------------------
 */

const REFERENCE = /^ENS-\d{8}-[A-Z0-9]{4}$/;

function reference() {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate()
  ).padStart(2, '0')}`;
  const tail = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ENS-${stamp}-${tail}`;
}

/** Files the browser actually attached, ignoring empty file inputs. */
function documentsFrom(form) {
  return form.getAll('documents').filter((f) => typeof f === 'object' && 'size' in f && f.size > 0);
}

function oversizeResponse(documents) {
  const oversize = documents.filter((f) => f.size > upload.maxMb * 1024 * 1024);
  if (!oversize.length) return null;
  return Response.json(
    { error: `Each file must be ${upload.maxMb}MB or smaller.` },
    { status: 413 }
  );
}

export async function POST(request) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: 'Could not read the submission.' }, { status: 400 });
  }

  const stage = String(form.get('stage') || 'full');
  const value = (name) => String(form.get(name) || '').trim();

  /* ------------------------------------------------------------- lead -- */
  /* Three fields. Nothing about the participant, so nothing to consent to. */
  if (stage === 'lead') {
    const referrerName = value('referrerName');
    const referrerPhone = value('referrerPhone');
    const referrerEmail = value('referrerEmail');

    const problems = [];
    if (!referrerName) problems.push('referrerName');
    if (!referrerPhone && !referrerEmail) problems.push('referrerContact');

    if (problems.length) {
      return Response.json({ error: 'Missing required details.', problems }, { status: 422 });
    }

    const ref = reference();
    // Non-identifying only. See the note at the top of this file.
    console.info(`[referral:lead] ${ref} received`);
    return Response.json({ ok: true, reference: ref });
  }

  /* ----------------------------------------------------------- detail -- */
  /* Everything the lead deliberately did not ask for. The referral is already
     in by this point, so a failure here costs the detail, never the contact. */
  if (stage === 'detail') {
    const ref = value('reference');
    const consented = value('consent') === 'true';

    const problems = [];
    if (!REFERENCE.test(ref)) problems.push('reference');
    if (!consented) problems.push('consent');

    if (problems.length) {
      return Response.json({ error: 'Missing required details.', problems }, { status: 422 });
    }

    const documents = documentsFrom(form);
    const tooBig = oversizeResponse(documents);
    if (tooBig) return tooBig;

    console.info(
      `[referral:detail] ${ref} enriched, ${documents.length} document(s), ${documents.reduce(
        (n, f) => n + f.size,
        0
      )} bytes total`
    );

    return Response.json({ ok: true, reference: ref });
  }

  /* ------------------------------------------------------------- full -- */
  const referrerName = value('referrerName');
  const referrerPhone = value('referrerPhone');
  const referrerEmail = value('referrerEmail');
  const participantName = value('participantName');
  const consented = value('consent') === 'true';

  // Server-side validation. The client-side checks are a convenience, not a gate.
  const problems = [];
  if (!referrerName) problems.push('referrerName');
  if (!referrerPhone && !referrerEmail) problems.push('referrerContact');
  if (!participantName) problems.push('participantName');
  if (!consented) problems.push('consent');

  if (problems.length) {
    return Response.json({ error: 'Missing required details.', problems }, { status: 422 });
  }

  const documents = documentsFrom(form);
  const tooBig = oversizeResponse(documents);
  if (tooBig) return tooBig;

  const ref = reference();

  // TODO: deliver the referral once the privacy questions above are answered.
  // Until then, log only non-identifying facts so nothing sensitive lands in
  // server logs by accident.
  console.info(
    `[referral] ${ref} received, ${documents.length} document(s), ${documents.reduce(
      (n, f) => n + f.size,
      0
    )} bytes total`
  );

  return Response.json({ ok: true, reference: ref });
}
