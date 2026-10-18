"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { enquirySchema, fieldErrors, HONEYPOT } from "@/lib/forms/schema";
import { CheckIcon } from "../icons";
import { PillButton } from "../PillButton";
import fields from "./fields.module.css";
import { TextField } from "./TextField";
import styles from "./EnquiryForm.module.css";

const EMPTY = { name: "", email: "", phone: "", message: "", trap: "" };

type State = "idle" | "sending" | "failed" | "busy" | "sent";

/**
 * "Send an Enquiry" on the Contact page. The thank-you message only shows
 * after the server confirms the enquiry is saved. The design has no
 * thank-you state, so it reuses the referral form's wording and style.
 */
export function EnquiryForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<State>("idle");
  const doneRef = useRef<HTMLHeadingElement>(null);
  const [submissionId, setSubmissionId] = useState(() => crypto.randomUUID());

  function set(key: keyof typeof EMPTY, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  }

  function showErrors(found: Record<string, string>) {
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) requestAnimationFrame(() => document.getElementById(`enquiry-${first}`)?.focus());
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const payload = { name: values.name, email: values.email, phone: values.phone, message: values.message, submissionId, [HONEYPOT]: values.trap };
    const checked = enquirySchema.safeParse(payload);
    if (!checked.success) return showErrors(fieldErrors(checked.error));
    setState("sending");
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: Record<string, string> };
      if (response.ok && result.ok) {
        setState("sent");
        setValues(EMPTY);
        setSubmissionId(crypto.randomUUID());
        requestAnimationFrame(() => doneRef.current?.focus());
        return;
      }
      if (result.error === "invalid" && result.fields) {
        setState("idle");
        return showErrors(result.fields);
      }
      setState(result.error === "rate_limited" ? "busy" : "failed");
    } catch {
      setState("failed");
    }
  }

  if (state === "sent") {
    return (
      <div className={styles.form} role="status">
        <span className={styles.doneIcon} aria-hidden="true">
          <CheckIcon size={28} color="var(--indigo-700)" strokeWidth={2.2} />
        </span>
        <div className={styles.head}>
          <h2 className={styles.title} ref={doneRef} tabIndex={-1}>
            Thank you, your enquiry is in
          </h2>
          <p className={styles.sub}>Ensign Support Services will contact you.</p>
        </div>
        <button type="button" className={styles.again} onClick={() => setState("idle")}>
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form id="enquiry" className={styles.form} aria-label="General enquiry" noValidate onSubmit={submit}>
      <div className={styles.head}>
        <h2 className={styles.title}>Send an Enquiry</h2>
        <p className={styles.sub}>For general questions. To refer someone, please use the referral form.</p>
      </div>
      <div className={styles.honeypot} aria-hidden="true" hidden>
        <label htmlFor={`enquiry-${HONEYPOT}`}>Leave this empty</label>
        <input id={`enquiry-${HONEYPOT}`} tabIndex={-1} autoComplete="off" value={values.trap} onChange={(e) => set("trap", e.target.value)} />
      </div>
      <div className={fields.two}>
        <TextField id="enquiry-name" label="Name" autoComplete="name" value={values.name} error={errors.name} onChange={(v) => set("name", v)} />
        <TextField id="enquiry-email" label="Email" type="email" inputMode="email" autoComplete="email" value={values.email} error={errors.email} onChange={(v) => set("email", v)} />
      </div>
      <TextField id="enquiry-phone" label="Phone" optional type="tel" inputMode="tel" autoComplete="tel" value={values.phone} error={errors.phone} onChange={(v) => set("phone", v)} />
      <TextField id="enquiry-message" label="Message" multiline rows={5} value={values.message} error={errors.message} onChange={(v) => set("message", v)} />
      {state === "failed" || state === "busy" ? (
        <p className={styles.error} role="alert">
          {state === "busy"
            ? "Several enquiries have been sent from this connection in the last hour. Please wait a little and try again."
            : "Sorry, your enquiry did not send. Please try again, or use the contact details above."}
        </p>
      ) : null}
      {/* Collection notice for this form (Privacy Policy v2.0 review, item B10). Before the button,
          so it is read before anything is sent. */}
      <p className={styles.privacy}>
        Andrew Manoba, trading as Ensign Support Services, uses these details to reply to you. Our website and email
        providers, Netlify and Resend, store them in the United States, and some of our website support team work from
        India. Please do not put health details in your message. See our{" "}
        <Link href="/privacy" target="_blank" rel="noopener">
          privacy policy
          <span className="visually-hidden"> (opens in a new tab)</span>
        </Link>{" "}
        for how we handle your details.
      </p>
      <PillButton type="submit" tone="dark" size="enquiry" className={styles.button} disabled={state === "sending"}>
        {state === "sending" ? "Sending" : "Send Enquiry"}
      </PillButton>
    </form>
  );
}
