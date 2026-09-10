'use client';

import { useRef, useState } from 'react';
import { business } from '@/lib/content';

/**
 * Deliberately three fields. Merging this with the referral form is the most
 * common mistake on a site like this: it turns a simple question into a
 * clinical intake.
 */
export default function EnquiryForm() {
  const [values, setValues] = useState({ name: '', contact: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const formRef = useRef(null);

  const set = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const check = (v) => {
    const errs = {};
    if (!v.name.trim()) errs.name = 'Please tell us your name.';
    if (!v.contact.trim()) errs.contact = 'We need a phone number or an email so we can reply.';
    if (!v.message.trim()) errs.message = 'Let us know what you would like to ask.';
    return errs;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = check(values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = formRef.current?.querySelector(`[name="${Object.keys(errs)[0]}"]`);
      first?.focus();
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('bad');
      setStatus('done');
    } catch {
      setStatus('failed');
    }
  };

  if (status === 'done') {
    return (
      <div className="notice notice--ok" role="status">
        <h2 className="h3">Thanks, that reached us.</h2>
        <p>
          We reply {business.responseTime}. If it is urgent, call {business.phone} instead.
        </p>
      </div>
    );
  }

  return (
    <form className="form" ref={formRef} onSubmit={submit} noValidate>
      <div className={`field${errors.name ? ' field--invalid' : ''}`}>
        <label htmlFor="name">Your name</label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={set('name')}
          aria-invalid={errors.name ? 'true' : undefined}
        />
        {errors.name ? <p className="field__error">{errors.name}</p> : null}
      </div>

      <div className={`field${errors.contact ? ' field--invalid' : ''}`}>
        <label htmlFor="contact">Phone or email</label>
        <input
          id="contact"
          name="contact"
          type="text"
          value={values.contact}
          onChange={set('contact')}
          aria-invalid={errors.contact ? 'true' : undefined}
        />
        {errors.contact ? <p className="field__error">{errors.contact}</p> : null}
      </div>

      <div className={`field${errors.message ? ' field--invalid' : ''}`}>
        <label htmlFor="message">What would you like to ask?</label>
        <textarea
          id="message"
          name="message"
          value={values.message}
          onChange={set('message')}
          aria-invalid={errors.message ? 'true' : undefined}
        />
        {errors.message ? <p className="field__error">{errors.message}</p> : null}
      </div>

      {status === 'failed' ? (
        <div className="notice notice--error" role="alert">
          <h3>That did not send</h3>
          <p>Please try again, or call {business.phone}.</p>
        </div>
      ) : null}

      <div className="actions">
        <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send enquiry'}
        </button>
      </div>
    </form>
  );
}
