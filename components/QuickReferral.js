'use client';

import { useRef, useState } from 'react';
import Icon from './Icon';
import { business, upload, consent as consentCopy } from '@/lib/content';

/**
 * The hero referral form: commit, then enrich.
 *
 * The full referral at /referral needs six things before it will accept a
 * submission. That is the right shape for a considered referral typed at a
 * desk, and the wrong shape for the first ten seconds of a first visit.
 *
 * So this asks three, and sends. Three fields is enough to ring somebody back,
 * which is the only thing that has to happen. Everything else is asked
 * afterwards, on the far side of a submission that has already succeeded,
 * where abandoning costs the participant nothing because Ensign already holds
 * a name and a number.
 *
 * The split is not only a conversion trick. Stage one deliberately collects
 * nothing at all about the participant, so it gathers no third-party health
 * information and needs no consent to send. Consent appears at stage two, at
 * the exact moment the first participant detail is asked for, which is where
 * it belongs rather than as a checkbox guarding a name and a phone number.
 */

const RELATIONSHIPS = [
  { value: 'self', label: 'Myself' },
  { value: 'other', label: 'Someone else' },
];

const PLAN_OPTIONS = [
  { value: 'self-managed', label: 'Self-managed', eligible: true },
  { value: 'plan-managed', label: 'Plan-managed', eligible: true },
  { value: 'ndia-managed', label: 'NDIA-managed', eligible: false },
  { value: 'unsure', label: 'Not sure', eligible: null },
];

const SERVICE_OPTIONS = [
  { value: 'support-coordination', label: 'Support coordination' },
  { value: 'recovery-coaching', label: 'Recovery coaching' },
  { value: 'unsure', label: 'Not sure yet' },
];

const looksLikeEmail = (v) => v.includes('@');
const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
/** Australian numbers, typed however people actually type them. */
const validPhone = (v) => v.replace(/[^\d]/g, '').length >= 8;

function prettySize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function QuickReferral() {
  const [stage, setStage] = useState('lead'); // lead | detail | done
  const [relationship, setRelationship] = useState('other');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reference, setReference] = useState('');

  // stage two
  const [participant, setParticipant] = useState('');
  const [planManagement, setPlanManagement] = useState('');
  const [service, setService] = useState('');
  const [notes, setNotes] = useState('');
  const [consented, setConsented] = useState(false);
  const [files, setFiles] = useState([]);

  const nameRef = useRef(null);
  const contactRef = useRef(null);
  const headRef = useRef(null);

  const forSelf = relationship === 'self';

  /* --------------------------------------------------------- stage one -- */

  const sendLead = async (event) => {
    event.preventDefault();
    const next = {};
    if (!name.trim()) next.name = 'We need a name to put on the callback.';
    if (!contact.trim()) {
      next.contact = 'A phone number or an email, whichever you prefer.';
    } else if (looksLikeEmail(contact) && !validEmail(contact.trim())) {
      next.contact = 'That email looks incomplete. Check it and try again.';
    } else if (!looksLikeEmail(contact) && !validPhone(contact)) {
      next.contact = 'That phone number looks too short. Check it and try again.';
    }

    setErrors(next);
    if (Object.keys(next).length) {
      const target = next.name ? nameRef : contactRef;
      if (target.current) target.current.focus();
      return;
    }

    setSending(true);
    setFailed(false);

    const body = new FormData();
    body.append('stage', 'lead');
    body.append('referrerName', name.trim());
    body.append(looksLikeEmail(contact) ? 'referrerEmail' : 'referrerPhone', contact.trim());
    body.append('relationship', relationship);

    try {
      const response = await fetch('/api/referral', { method: 'POST', body });
      if (!response.ok) throw new Error('Bad response');
      const data = await response.json();
      setReference(data.reference);
      setStage('detail');
      // Move the reader to the confirmation rather than leaving focus on a
      // button that no longer exists.
      window.setTimeout(() => {
        if (headRef.current) headRef.current.focus();
      }, 40);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  /* --------------------------------------------------------- stage two -- */

  const addFiles = (list) => {
    const incoming = Array.from(list).map((file) => ({
      id: file.name + '-' + file.size + '-' + file.lastModified,
      file,
      tooBig: file.size > upload.maxMb * 1024 * 1024,
    }));
    setFiles((current) => {
      const seen = new Set(current.map((f) => f.id));
      return [...current, ...incoming.filter((f) => !seen.has(f.id))];
    });
  };

  const sendDetail = async (event) => {
    event.preventDefault();
    if (!consented) {
      setErrors({ consent: 'We need this confirmed before we can take participant details.' });
      return;
    }
    setErrors({});
    setSending(true);
    setFailed(false);

    const body = new FormData();
    body.append('stage', 'detail');
    body.append('reference', reference);
    body.append('consent', 'true');
    body.append('participantName', forSelf ? name.trim() : participant.trim());
    body.append('planManagement', planManagement);
    body.append('service', service);
    body.append('notes', notes);
    files.filter((f) => !f.tooBig).forEach((f) => body.append('documents', f.file, f.file.name));

    try {
      const response = await fetch('/api/referral', { method: 'POST', body });
      if (!response.ok) throw new Error('Bad response');
      setStage('done');
      window.setTimeout(() => {
        if (headRef.current) headRef.current.focus();
      }, 40);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  const plan = PLAN_OPTIONS.find((o) => o.value === planManagement) || null;
  const verdictTone =
    plan === null ? '' : plan.eligible === true ? 'yes' : plan.eligible === false ? 'no' : 'maybe';

  /* ------------------------------------------------------------ render -- */

  return (
    <div className="qr">
      <div className="qr__head">
        <span className="qr__title">
          {stage === 'lead' ? 'Start a referral' : 'Referral received'}
        </span>
        <span className="qr__note">{stage === 'lead' ? 'About 20 seconds' : reference}</span>
      </div>

      {/* Two beads, not a progress bar. The second stage is genuinely
          optional, so the indicator must not imply an unfinished task. */}
      <ol className="qr__beads" aria-hidden="true">
        <li data-state={stage === 'lead' ? 'now' : 'done'} />
        <li data-state={stage === 'lead' ? 'next' : stage === 'detail' ? 'now' : 'done'} />
      </ol>

      {/* ------------------------------------------------------- stage 1 -- */}
      {stage === 'lead' ? (
        <form className="qr__body" onSubmit={sendLead} noValidate>
          <h2 className="qr__lede" ref={headRef} tabIndex={-1}>
            Three things, and we ring you back {business.responseTime}.
          </h2>

          <fieldset className="qr__seg">
            <legend>Who is the referral for?</legend>
            <div className="seg">
              {RELATIONSHIPS.map((o) => (
                <label
                  className={'seg__opt' + (relationship === o.value ? ' seg__opt--on' : '')}
                  key={o.value}
                >
                  <input
                    type="radio"
                    name="relationship"
                    value={o.value}
                    checked={relationship === o.value}
                    onChange={() => setRelationship(o.value)}
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className={'qr__field' + (errors.name ? ' qr__field--bad' : '')}>
            <label htmlFor="qr-name">Your name</label>
            <input
              id="qr-name"
              ref={nameRef}
              type="text"
              value={name}
              autoComplete="name"
              aria-invalid={errors.name ? 'true' : undefined}
              aria-describedby={errors.name ? 'qr-name-err' : undefined}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((v) => ({ ...v, name: undefined }));
              }}
            />
            {errors.name ? (
              <p className="qr__err" id="qr-name-err">
                {errors.name}
              </p>
            ) : null}
          </div>

          {/* One field, not two. Whichever they type is the one we use. */}
          <div className={'qr__field' + (errors.contact ? ' qr__field--bad' : '')}>
            <label htmlFor="qr-contact">Phone or email</label>
            <input
              id="qr-contact"
              ref={contactRef}
              type="text"
              value={contact}
              autoComplete="tel"
              aria-invalid={errors.contact ? 'true' : undefined}
              aria-describedby={errors.contact ? 'qr-contact-err' : undefined}
              onChange={(e) => {
                setContact(e.target.value);
                if (errors.contact) setErrors((v) => ({ ...v, contact: undefined }));
              }}
            />
            {errors.contact ? (
              <p className="qr__err" id="qr-contact-err">
                {errors.contact}
              </p>
            ) : null}
          </div>

          {failed ? (
            <p className="qr__err" role="alert">
              That did not send. Try again, or call {business.phone} and we will take it on the
              phone.
            </p>
          ) : null}

          <button className="qr__send" type="submit" disabled={sending}>
            {sending ? 'Sending…' : 'Send'}
            <Arrow />
          </button>

          <p className="qr__foot">
            No plan details needed yet. Or call <a href={business.phoneHref}>{business.phone}</a>,{' '}
            {business.hoursLong}.
          </p>
        </form>
      ) : null}

      {/* ------------------------------------------------------- stage 2 -- */}
      {stage === 'detail' ? (
        <form className="qr__body" onSubmit={sendDetail} noValidate>
          <h2 className="qr__lede qr__lede--ok" ref={headRef} tabIndex={-1}>
            <Ticked />
            That is enough to call you back.
          </h2>
          <p className="qr__sent">
            Your reference is <strong>{reference}</strong>. A person reads it today.
          </p>

          <p className="qr__ask">If you have another minute, these save a phone call.</p>

          {!forSelf ? (
            <div className="qr__field">
              <label htmlFor="qr-participant">
                Participant name <span className="qr__opt">optional</span>
              </label>
              <input
                id="qr-participant"
                type="text"
                value={participant}
                onChange={(e) => setParticipant(e.target.value)}
              />
            </div>
          ) : null}

          <fieldset className="qr__seg">
            <legend>
              How is the plan managed? <span className="qr__opt">optional</span>
            </legend>
            <div className="seg seg--wrap">
              {PLAN_OPTIONS.map((o) => (
                <label
                  className={'seg__opt' + (planManagement === o.value ? ' seg__opt--on' : '')}
                  key={o.value}
                >
                  <input
                    type="radio"
                    name="planManagement"
                    value={o.value}
                    checked={planManagement === o.value}
                    onChange={() => setPlanManagement(o.value)}
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Answered the moment it is asked, rather than after a phone call. */}
          {plan ? (
            <p className={'qr__verdict qr__verdict--' + verdictTone} role="status">
              {plan.eligible === true
                ? 'We can work with this plan.'
                : plan.eligible === false
                  ? 'NDIA-managed plans need a registered provider. Ensign is not one yet, so we will point you to someone who is.'
                  : 'Your plan states it near the top. We will work it out on the call.'}
            </p>
          ) : null}

          <fieldset className="qr__seg">
            <legend>
              Which service? <span className="qr__opt">optional</span>
            </legend>
            <div className="seg seg--wrap">
              {SERVICE_OPTIONS.map((o) => (
                <label
                  className={'seg__opt' + (service === o.value ? ' seg__opt--on' : '')}
                  key={o.value}
                >
                  <input
                    type="radio"
                    name="service"
                    value={o.value}
                    checked={service === o.value}
                    onChange={() => setService(o.value)}
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="qr__field">
            <label htmlFor="qr-notes">
              Anything else <span className="qr__opt">optional</span>
            </label>
            <textarea
              id="qr-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="qr__field">
            <label htmlFor="qr-files">
              The plan or any reports <span className="qr__opt">optional</span>
            </label>
            <input
              id="qr-files"
              type="file"
              multiple
              accept={upload.accept}
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = '';
              }}
            />
            {files.length ? (
              <ul className="qr__files">
                {files.map((f) => (
                  <li key={f.id}>
                    <span>{f.file.name}</span>
                    <span className={f.tooBig ? 'qr__bad' : 'qr__size'}>
                      {f.tooBig ? 'Over ' + upload.maxMb + 'MB, email this one' : prettySize(f.file.size)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Consent appears here, with the first participant detail, and not
              a moment before it is needed. */}
          <div className={'qr__consent' + (errors.consent ? ' qr__field--bad' : '')}>
            <label htmlFor="qr-consent">
              <input
                id="qr-consent"
                type="checkbox"
                checked={consented}
                onChange={(e) => {
                  setConsented(e.target.checked);
                  if (errors.consent) setErrors({});
                }}
              />
              <span>{consentCopy.checkbox}</span>
            </label>
            {errors.consent ? (
              <p className="qr__err" role="alert">
                {errors.consent}
              </p>
            ) : null}
          </div>

          {failed ? (
            <p className="qr__err" role="alert">
              That did not send, but your referral {reference} is safe. We will ask on the call.
            </p>
          ) : null}

          <button className="qr__send" type="submit" disabled={sending}>
            {sending ? 'Sending…' : 'Send these too'}
            <Arrow />
          </button>

          <p className="qr__foot">
            Or skip it. {reference} is already with us and we will ask on the call.
          </p>
        </form>
      ) : null}

      {/* ------------------------------------------------------- stage 3 -- */}
      {stage === 'done' ? (
        <div className="qr__body">
          <h2 className="qr__lede qr__lede--ok" ref={headRef} tabIndex={-1}>
            <Ticked />
            All of it is with us.
          </h2>
          <p className="qr__sent">
            Reference <strong>{reference}</strong>. We call back {business.responseTime}, and it
            will be the person who would be doing the work.
          </p>
          <p className="qr__foot">
            Need to change something? Call <a href={business.phoneHref}>{business.phone}</a> and
            quote {reference} rather than sending a second referral.
          </p>
        </div>
      ) : null}
    </div>
  );
}

/* Drawn, not a glyph: it inherits the button's colour and stroke weight. */
function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <path
        d="M3.5 9h10M9.5 5l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Ticked() {
  return (
    <span className="qr__tick" aria-hidden="true">
      <Icon name="check" size={16} />
    </span>
  );
}
