'use client';

import { useEffect, useRef, useState } from 'react';
import { business, referralFields, upload, consent } from '@/lib/content';

const STEPS = ['About you', 'About the participant', 'Documents and notes'];
const DRAFT_KEY = 'ensign-referral-draft';

const emptyValues = () => ({
  referrerName: '',
  referrerPhone: '',
  referrerEmail: '',
  referrerRole: '',
  referrerOrg: '',
  participantName: '',
  participantDob: '',
  planStart: '',
  planEnd: '',
  service: '',
  planManagement: '',
  notes: '',
  consent: false,
});

function validate(step, v) {
  const errors = {};
  if (step === 0) {
    if (!v.referrerName.trim()) errors.referrerName = 'Please tell us your name.';
    if (!v.referrerPhone.trim() && !v.referrerEmail.trim()) {
      errors.referrerPhone = 'We need a phone number or an email so we can get back to you.';
    }
    if (v.referrerEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.referrerEmail.trim())) {
      errors.referrerEmail = 'That email address does not look complete. Please check it.';
    }
  }
  if (step === 1) {
    if (!v.participantName.trim()) {
      errors.participantName = 'Please tell us who the referral is for.';
    }
    if (!v.service) errors.service = 'Please choose which service you are asking about.';
    if (!v.planManagement) errors.planManagement = 'Please tell us how the plan is managed.';
  }
  if (step === 2) {
    if (!v.consent) errors.consent = 'We need this confirmed before we can accept the referral.';
  }
  return errors;
}

function prettySize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ReferralForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | sending | done | failed
  const [reference, setReference] = useState('');
  const formRef = useRef(null);
  const headingRef = useRef(null);
  const fileInputRef = useRef(null);

  /* Restore an in-progress referral after an accidental refresh or a back
     navigation. sessionStorage, never localStorage: this is health information
     about a third party and it is often typed on a shared clinic computer.
     It is cleared the moment the tab closes, and on a successful submit. */
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      if (saved) setValues({ ...emptyValues(), ...JSON.parse(saved) });
    } catch {
      /* private mode, or storage disabled. Nothing to restore. */
    }
  }, []);

  useEffect(() => {
    try {
      const { consent: _drop, ...rest } = values;
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(rest));
    } catch {
      /* nothing we can do, and nothing the user needs to hear about */
    }
  }, [values]);

  const set = (name) => (event) => {
    const next = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setValues((v) => ({ ...v, [name]: next }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  // Validate on blur, never on keystroke.
  const blur = (name) => () => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((e) => ({ ...e, ...validate(step, values) }));
  };

  const focusFirstError = (errs) => {
    const first = Object.keys(errs)[0];
    if (!first || !formRef.current) return;
    const el = formRef.current.querySelector(`[name="${first}"]`);
    if (el && typeof el.focus === 'function') el.focus();
  };

  const goNext = () => {
    const errs = validate(step, values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      focusFirstError(errs);
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    if (headingRef.current) headingRef.current.focus();
  };

  const goBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    if (headingRef.current) headingRef.current.focus();
  };

  const addFiles = (list) => {
    const incoming = Array.from(list).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      file,
      tooBig: file.size > upload.maxMb * 1024 * 1024,
    }));
    setFiles((current) => {
      const seen = new Set(current.map((f) => f.id));
      return [...current, ...incoming.filter((f) => !seen.has(f.id))];
    });
  };

  const removeFile = (id) => setFiles((current) => current.filter((f) => f.id !== id));

  const submit = async (event) => {
    event.preventDefault();
    const errs = validate(2, values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      focusFirstError(errs);
      return;
    }

    setStatus('sending');
    const body = new FormData();
    Object.entries(values).forEach(([k, v]) => body.append(k, String(v)));
    // Oversized files are never sent. The referral still goes.
    files.filter((f) => !f.tooBig).forEach((f) => body.append('documents', f.file, f.file.name));

    try {
      const response = await fetch('/api/referral', { method: 'POST', body });
      if (!response.ok) throw new Error('Bad response');
      const data = await response.json();
      setReference(data.reference);
      setStatus('done');
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
    } catch {
      setStatus('failed');
    }
  };

  /* ------------------------------------------------------------- done -- */

  if (status === 'done') {
    return (
      <div className="stack" role="status">
        <div className="notice notice--ok">
          <h2 className="h2">Referral received.</h2>
          <p>
            Your reference is <strong>{reference}</strong>. Write it down or take a screenshot.
          </p>
        </div>
        <h3 className="h3">What happens next</h3>
        <ul className="ticks">
          <li>
            <span aria-hidden="true">1.</span>
            <span>Someone reads it today. Not a system, a person.</span>
          </li>
          <li>
            <span aria-hidden="true">2.</span>
            <span>
              We call you back {business.responseTime} to talk about capacity and fit, including if
              we think we are the wrong service.
            </span>
          </li>
          <li>
            <span aria-hidden="true">3.</span>
            <span>
              If anything did not upload, email it to{' '}
              <a href={`mailto:${business.email}`}>{business.email}</a> quoting {reference}.
            </span>
          </li>
        </ul>
        <p>
          If you need to change something, call {business.phone} rather than sending a second
          referral.
        </p>
      </div>
    );
  }

  const ndiaSelected = values.planManagement === 'ndia-managed';
  const errorList = Object.values(errors).filter(Boolean);

  return (
    <form className="form" ref={formRef} onSubmit={submit} noValidate>
      <ol className="progress">
        {STEPS.map((label, i) => (
          <li
            key={label}
            aria-current={i === step ? 'step' : undefined}
            data-done={i < step ? 'true' : 'false'}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      <h2 className="h2" ref={headingRef} tabIndex={-1}>
        {STEPS[step]}
      </h2>

      {/* A single live region. Announced on submit, not on every keystroke. */}
      <div role="alert">
        {errorList.length ? (
          <div className="notice notice--error">
            <h3>There {errorList.length === 1 ? 'is 1 thing' : `are ${errorList.length} things`} to fix</h3>
            <ul style={{ paddingLeft: 20 }}>
              {errorList.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {/* -------------------------------------------------- step 1 -- */}
      {step === 0 ? (
        <>
          <p className="lede">
            Referring yourself or a family member? Fill in your own details here as the referrer,
            and leave the organisation field blank.
          </p>
          {referralFields.referrer.map((f) => (
            <Field
              key={f.name}
              field={f}
              value={values[f.name]}
              error={errors[f.name]}
              onChange={set(f.name)}
              onBlur={blur(f.name)}
            />
          ))}
        </>
      ) : null}

      {/* -------------------------------------------------- step 2 -- */}
      {step === 1 ? (
        <>
          {referralFields.participant.map((f) => (
            <Field
              key={f.name}
              field={f}
              value={values[f.name]}
              error={errors[f.name]}
              onChange={set(f.name)}
              onBlur={blur(f.name)}
            />
          ))}

          <fieldset>
            <legend>Which service are you asking about?</legend>
            <div className="radios">
              {referralFields.serviceOptions.map((o) => (
                <label
                  className={`radio${values.service === o.value ? ' radio--on' : ''}`}
                  key={o.value}
                >
                  <input
                    type="radio"
                    name="service"
                    value={o.value}
                    checked={values.service === o.value}
                    onChange={set('service')}
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
            {errors.service ? <p className="field__error">{errors.service}</p> : null}
          </fieldset>

          <fieldset>
            <legend>How is the plan managed?</legend>
            <div className="radios">
              {referralFields.planManagementOptions.map((o) => (
                <label
                  className={`radio${values.planManagement === o.value ? ' radio--on' : ''}`}
                  key={o.value}
                >
                  <input
                    type="radio"
                    name="planManagement"
                    value={o.value}
                    checked={values.planManagement === o.value}
                    onChange={set('planManagement')}
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
            {errors.planManagement ? (
              <p className="field__error">{errors.planManagement}</p>
            ) : null}

            {/* Branch immediately rather than letting someone complete a form
                they are not eligible for. */}
            {ndiaSelected ? (
              <div className="notice notice--attention" role="status">
                <h3>NDIA-managed plans need a registered provider</h3>
                <p>
                  Ensign is not registered yet, so we cannot bill an NDIA-managed plan. You are
                  welcome to send this anyway and we will point you towards someone who can help,
                  or call {business.phone} and we will do it on the phone.
                </p>
              </div>
            ) : null}
          </fieldset>
        </>
      ) : null}

      {/* -------------------------------------------------- step 3 -- */}
      {step === 2 ? (
        <>
          <div className="stack">
            <h3 className="h3">Supporting documents</h3>
            <p>
              Helpful but not required: {upload.examples}. {upload.acceptLabel}, up to{' '}
              {upload.maxMb}MB each. You can attach more than one.
            </p>

            <div className="drop">
              <input
                ref={fileInputRef}
                id="documents"
                name="documents"
                type="file"
                multiple
                accept={upload.accept}
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = '';
                }}
              />
              <p style={{ color: 'var(--text-dim)', fontSize: '1rem' }}>
                Uploading from a phone on a patchy connection is fine. If it stalls, send the form
                anyway and email the rest.
              </p>
            </div>

            {files.length ? (
              <ul className="filelist">
                {files.map((f) => (
                  <li key={f.id}>
                    <span className="meta">
                      <span className="name">{f.file.name}</span>
                      {f.tooBig ? (
                        <span className="bad">
                          Too large to send. Email this one to {business.email}.
                        </span>
                      ) : (
                        <span className="size">{prettySize(f.file.size)}</span>
                      )}
                    </span>
                    <button type="button" className="linkbtn" onClick={() => removeFile(f.id)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="notes">
              Anything else we should know <span className="optional">(optional)</span>
            </label>
            <textarea id="notes" name="notes" value={values.notes} onChange={set('notes')} />
          </div>

          {/* Collection notice sits immediately above submit, never in a footer link. */}
          <div className="notice notice--attention">
            <h3>How we handle this information</h3>
            <p>{consent.notice}</p>
          </div>

          <div className={`field${errors.consent ? ' field--invalid' : ''}`}>
            <label className="checkline" htmlFor="consent">
              <input
                id="consent"
                name="consent"
                type="checkbox"
                checked={values.consent}
                onChange={set('consent')}
              />
              <span>{consent.checkbox}</span>
            </label>
            {errors.consent ? <p className="field__error">{errors.consent}</p> : null}
          </div>

          {status === 'failed' ? (
            <div className="notice notice--error" role="alert">
              <h3>That did not send</h3>
              <p>
                Nothing was lost. Try again, or call {business.phone} and we will take the referral
                over the phone.
              </p>
            </div>
          ) : null}
        </>
      ) : null}

      <div className="actions">
        {step > 0 ? (
          <button type="button" className="btn btn--secondary" onClick={goBack}>
            Back
          </button>
        ) : null}

        {step < STEPS.length - 1 ? (
          <button type="button" className="btn btn--primary" onClick={goNext}>
            Continue
          </button>
        ) : (
          <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send referral'}
          </button>
        )}

        <span style={{ color: 'var(--text-dim)', fontSize: '1rem' }}>
          Step {step + 1} of {STEPS.length}
        </span>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ field -- */

function Field({ field, value, error, onChange, onBlur }) {
  const describedBy = [field.help ? `${field.name}-help` : null, error ? `${field.name}-err` : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`field${error ? ' field--invalid' : ''}`}>
      <label htmlFor={field.name}>
        {field.label} {field.required ? null : <span className="optional">(optional)</span>}
      </label>
      {field.help ? (
        <p className="help" id={`${field.name}-help`}>
          {field.help}
        </p>
      ) : null}
      <input
        id={field.name}
        name={field.name}
        type={field.type}
        value={value}
        autoComplete={field.autoComplete}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy || undefined}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error ? (
        <p className="field__error" id={`${field.name}-err`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
