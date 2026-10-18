"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  confirmSchema,
  fieldErrors,
  HEARD_VIA,
  HONEYPOT,
  participantSchema,
  PLAN_TYPES,
  referrerSchema,
  REFERRER_TYPES,
  SERVICES,
  suburbSchema,
  supportSchema,
} from "@/lib/forms/schema";
import { site } from "@/lib/site";
import { ArrowLeft, CheckIcon } from "../icons";
import { PillButton } from "../PillButton";
import { TextField } from "./TextField";
import styles from "./ReferralForm.module.css";

type ReferrerType = (typeof REFERRER_TYPES)[number]["id"];

type Values = {
  referrerType: ReferrerType | "";
  referrerName: string;
  referrerOrgRole: string;
  referrerPhone: string;
  referrerEmail: string;
  participantName: string;
  participantPhone: string;
  participantEmail: string;
  participantPreferredContact: string;
  participantSuburb: string;
  service: string;
  planType: string;
  reason: string;
  consent: boolean;
  heardVia: string;
  trap: string;
};

const EMPTY: Values = {
  referrerType: "",
  referrerName: "",
  referrerOrgRole: "",
  referrerPhone: "",
  referrerEmail: "",
  participantName: "",
  participantPhone: "",
  participantEmail: "",
  participantPreferredContact: "",
  participantSuburb: "",
  service: "",
  planType: "",
  reason: "",
  consent: false,
  heardVia: "",
  trap: "",
};

/** Step names shown above the progress bar, as in the design. */
const STEP_NAMES = ["Who", "Your details", "Participant", "Support", "Confirm"];

/** Which step each field lives on, to show a server error on the right step. */
const FIELD_STEP: Record<string, number> = {
  referrerType: 1,
  referrerName: 2,
  referrerOrgRole: 2,
  referrerPhone: 2,
  referrerEmail: 2,
  participantName: 3,
  participantPhone: 3,
  participantEmail: 3,
  participantPreferredContact: 3,
  participantSuburb: 3,
  service: 4,
  planType: 4,
  reason: 4,
  consent: 5,
  heardVia: 5,
};

type SendState = "idle" | "sending" | "failed" | "busy";

export function ReferralForm() {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [send, setSend] = useState<SendState>("idle");
  // One id per referral, so a retried save can never store it twice.
  const [submissionId, setSubmissionId] = useState(() => crypto.randomUUID());
  const headingRef = useRef<HTMLHeadingElement>(null);
  const movedRef = useRef(false);

  const isSelf = values.referrerType === "participant";
  const progressStep = Math.min(Math.max(step - 1, 1), 4);

  // After the visitor moves between steps, put focus on the new step's heading
  // so screen readers announce where they are. Never on first load.
  useEffect(() => {
    if (movedRef.current) headingRef.current?.focus();
  }, [step]);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  }

  function go(next: number) {
    movedRef.current = true;
    setErrors({});
    setStep(next);
  }

  /** Shows the errors and puts focus on the first field that needs fixing. */
  function showErrors(found: Record<string, string>) {
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) requestAnimationFrame(() => document.getElementById(first)?.focus());
  }

  function check(schema: { safeParse: (v: unknown) => { success: boolean; error?: unknown } }, data: unknown) {
    const result = schema.safeParse(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return result.success ? {} : fieldErrors(result.error as any);
  }

  function next() {
    let found: Record<string, string> = {};
    if (step === 2) {
      found = check(referrerSchema, {
        ...values,
        referrerOrgRole: values.referrerType === "professional" ? values.referrerOrgRole : undefined,
      });
    }
    if (step === 3) {
      found = { ...(isSelf ? {} : check(participantSchema, values)), ...check(suburbSchema, values) };
    }
    if (step === 4) found = check(supportSchema, values);
    if (Object.keys(found).length) return showErrors(found);
    go(step + 1);
  }

  async function submit() {
    const found = check(confirmSchema, { consent: values.consent, heardVia: values.heardVia || undefined });
    if (Object.keys(found).length) return showErrors(found);
    setSend("sending");
    try {
      const response = await fetch("/api/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          trap: undefined,
          [HONEYPOT]: values.trap,
          submissionId,
          referrerOrgRole: values.referrerType === "professional" ? values.referrerOrgRole : undefined,
          heardVia: values.heardVia || undefined,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: Record<string, string> };
      if (response.ok && result.ok) {
        setSend("idle");
        go(6);
        return;
      }
      if (result.error === "invalid" && result.fields) {
        // The server found something the browser missed: show it on its own step.
        const firstStep = Math.min(...Object.keys(result.fields).map((k) => FIELD_STEP[k] ?? 5));
        setSend("idle");
        movedRef.current = true;
        setStep(firstStep);
        showErrors(result.fields);
        return;
      }
      setSend(result.error === "rate_limited" ? "busy" : "failed");
    } catch {
      setSend("failed");
    }
  }

  function reset() {
    setSubmissionId(crypto.randomUUID());
    setValues(EMPTY);
    setErrors({});
    setSend("idle");
    go(1);
  }

  const yourTitle = isSelf ? "Great, tell us about you" : "Thanks, now a little about you";
  const partTitle = isSelf ? "Where are you based?" : "Who are you referring?";
  const partSub = isSelf
    ? "We will use the details you just gave us."
    : "Their contact details help us reach the right person.";

  const backButton = (
    <button type="button" className={styles.ghost} onClick={() => go(step - 1)}>
      <ArrowLeft size={16} />
      Back
    </button>
  );

  const heading = (text: string) => (
    <h2 className={styles.title} ref={headingRef} tabIndex={-1}>
      {text}
    </h2>
  );

  return (
    <section className={styles.section}>
      <div className={styles.layout}>
        <form
          className={styles.form}
          aria-label="Referral form"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (step === 5) void submit();
            else if (step > 1 && step < 5) next();
          }}
        >
          {/* Honeypot for bots. Hidden from people and screen readers. */}
          <div className={styles.honeypot} aria-hidden="true" hidden>
            <label htmlFor={HONEYPOT}>Leave this empty</label>
            <input id={HONEYPOT} name={HONEYPOT} tabIndex={-1} autoComplete="off" value={values.trap} onChange={(e) => set("trap", e.target.value)} />
          </div>

          {step >= 2 && step <= 5 ? (
            <div className={styles.progress}>
              <div className={styles.progressRow}>
                <span className={styles.progressLabel}>
                  Step {progressStep} of 4 · {STEP_NAMES[progressStep]}
                </span>
                <span className={styles.progressTime}>About 3 minutes</span>
              </div>
              <div className={styles.segs} aria-hidden="true">
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className={i <= progressStep ? `${styles.seg} ${styles.segOn}` : styles.seg} />
                ))}
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className={styles.step} key="s1">
              <span className={styles.badge}>4 quick steps · About 3 minutes</span>
              <div className={styles.head}>
                {heading("Who is making this referral?")}
                <p className={styles.sub}>Pick the option that fits best. You can refer yourself or someone you support.</p>
              </div>
              <fieldset className={styles.group}>
                <legend className="visually-hidden">Who is making this referral?</legend>
                <div className={styles.choices}>
                  {REFERRER_TYPES.map((o) => (
                    <label key={o.id} className={styles.choice}>
                      <input
                        className={styles.radio}
                        type="radio"
                        name="referrerType"
                        id={o.id === REFERRER_TYPES[0].id ? "referrerType" : undefined}
                        value={o.id}
                        checked={values.referrerType === o.id}
                        onChange={() => {
                          set("referrerType", o.id);
                          // The consent wording depends on who is referring, so a tick never carries over.
                          set("consent", false);
                        }}
                      />
                      <span className={styles.dot} aria-hidden="true" />
                      <span className={styles.choiceText}>
                        <span className={styles.choiceTitle}>{o.title}</span>
                        <span className={styles.choiceSub}>{o.sub}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className={styles.actions}>
                <span />
                <PillButton type="button" tone="accent" size="step" disabled={!values.referrerType} onClick={() => go(2)}>
                  Continue
                </PillButton>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className={styles.step} key="s2">
              <div className={styles.head}>
                {heading(yourTitle)}
                <p className={styles.sub}>So we know who to get back to.</p>
              </div>
              <TextField id="referrerName" label="Full name" placeholder="First and last name" autoComplete="name" value={values.referrerName} error={errors.referrerName} onChange={(v) => set("referrerName", v)} />
              {values.referrerType === "professional" ? (
                <TextField id="referrerOrgRole" label="Organisation and role" optional placeholder="e.g. Support coordinator at ..." autoComplete="organization" value={values.referrerOrgRole} error={errors.referrerOrgRole} onChange={(v) => set("referrerOrgRole", v)} />
              ) : null}
              <TextField id="referrerPhone" label="Phone" type="tel" inputMode="tel" placeholder="Mobile or landline" autoComplete="tel" value={values.referrerPhone} error={errors.referrerPhone} onChange={(v) => set("referrerPhone", v)} />
              <TextField id="referrerEmail" label="Email" type="email" inputMode="email" placeholder="name@example.com" autoComplete="email" value={values.referrerEmail} error={errors.referrerEmail} onChange={(v) => set("referrerEmail", v)} />
              <div className={styles.actions}>
                {backButton}
                <PillButton type="submit" tone="accent" size="step">
                  Continue
                </PillButton>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className={styles.step} key="s3">
              <div className={styles.head}>
                {heading(partTitle)}
                <p className={styles.sub}>{partSub}</p>
              </div>
              {!isSelf ? (
                <div className={styles.stack26}>
                  <TextField id="participantName" label="Participant full name" placeholder="First and last name" autoComplete="off" value={values.participantName} error={errors.participantName} onChange={(v) => set("participantName", v)} />
                  <TextField id="participantPhone" label="Participant phone" type="tel" inputMode="tel" placeholder="Mobile or landline" autoComplete="off" value={values.participantPhone} error={errors.participantPhone} onChange={(v) => set("participantPhone", v)} />
                  <TextField id="participantEmail" label="Participant email" type="email" inputMode="email" placeholder="name@example.com" autoComplete="off" value={values.participantEmail} error={errors.participantEmail} onChange={(v) => set("participantEmail", v)} />
                  <TextField id="participantPreferredContact" label="Preferred contact, if different" optional placeholder="Name and best way to reach them" autoComplete="off" value={values.participantPreferredContact} error={errors.participantPreferredContact} onChange={(v) => set("participantPreferredContact", v)} />
                </div>
              ) : null}
              <TextField id="participantSuburb" label="Suburb and postcode" placeholder="e.g. Springfield 4300" autoComplete={isSelf ? "address-level2" : "off"} value={values.participantSuburb} error={errors.participantSuburb} onChange={(v) => set("participantSuburb", v)} />
              <div className={styles.actions}>
                {backButton}
                <PillButton type="submit" tone="accent" size="step">
                  Continue
                </PillButton>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className={styles.step} key="s4">
              <div className={styles.head}>
                {heading("What support are you looking for?")}
                <p className={styles.sub}>Choose a service and how the NDIS plan is managed.</p>
              </div>
              <fieldset className={styles.group}>
                <legend className={styles.groupLabel}>Service</legend>
                <div className={styles.choices}>
                  {SERVICES.map((o, i) => (
                    <label key={o.id} className={styles.choice}>
                      <input className={styles.radio} type="radio" name="service" id={i === 0 ? "service" : undefined} value={o.id} checked={values.service === o.id} onChange={() => set("service", o.id)} />
                      <span className={styles.dot} aria-hidden="true" />
                      <span className={styles.choiceText}>
                        <span className={styles.choiceTitle}>{o.title}</span>
                        <span className={styles.choiceSub}>{o.sub}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className={styles.group}>
                <legend className={styles.groupLabel}>Plan management</legend>
                <div className={styles.planChoices}>
                  {PLAN_TYPES.map((o, i) => (
                    <label key={o.id} className={styles.choice}>
                      <input className={styles.radio} type="radio" name="planType" id={i === 0 ? "planType" : undefined} value={o.id} checked={values.planType === o.id} onChange={() => set("planType", o.id)} />
                      <span className={styles.dot} aria-hidden="true" />
                      <span className={styles.choiceTitle}>{o.title}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <TextField id="reason" label="In a sentence or two, what would help most right now?" multiline rows={4} placeholder="A short reason for the referral is enough." hint="Only write what we need to know to get started. You do not need to give a diagnosis." value={values.reason} error={errors.reason} onChange={(v) => set("reason", v)} />
              <div className={styles.actions}>
                {backButton}
                <PillButton type="submit" tone="accent" size="step" disabled={!(values.service && values.planType)}>
                  Continue
                </PillButton>
              </div>
            </div>
          ) : null}

          {step === 5 ? (
            <div className={styles.step} key="s5">
              <div className={styles.head}>
                {heading("Almost done")}
                <p className={styles.sub}>One last check before you send it.</p>
              </div>
              <label className={styles.check} htmlFor="consent">
                <input type="checkbox" id="consent" name="consent" checked={values.consent} aria-describedby={errors.consent ? "consent-error" : undefined} onChange={(e) => set("consent", e.target.checked)} />
                {/* Two wordings, approved with Privacy Policy v2.0 (15 Oct 2026). When someone else refers,
                    the tick is their confirmation, not the participant's own consent; Andrew asks the
                    participant at first contact (policy clause 4.3). Never ticked by default. */}
                <span>
                  {isSelf
                    ? "I agree to send these details to Ensign Support Services, including any health or disability information I write. I agree that Ensign can contact me about this referral."
                    : "I asked the participant, or their nominee or guardian, and they agree to this referral. They know I am sending these details to Ensign Support Services, including any health or disability information I write, and that Ensign will contact them about it."}
                </span>
              </label>
              <div className={styles.heard}>
                <span id="heard-label" className={styles.heardLabel}>
                  How did you hear about us? <span className={styles.optional}>(optional)</span>
                </span>
                <div className={styles.chips} role="group" aria-labelledby="heard-label">
                  {HEARD_VIA.map((h) => (
                    <button
                      key={h}
                      type="button"
                      className={values.heardVia === h ? `${styles.chip} ${styles.chipOn}` : styles.chip}
                      aria-pressed={values.heardVia === h}
                      onClick={() => set("heardVia", values.heardVia === h ? "" : h)}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
              {send === "failed" || send === "busy" ? (
                <p className={styles.sendError} role="alert">
                  {send === "busy" ? (
                    "Several referrals have been sent from this connection in the last hour. Please wait a little and try again."
                  ) : (
                    <>
                      Sorry, your referral did not send. Please try again. If it keeps happening, email us at{" "}
                      <a href={`mailto:${site.email}`}>{site.email}</a>.
                    </>
                  )}
                </p>
              ) : null}
              <div className={styles.actions}>
                {backButton}
                <PillButton type="submit" tone="accent" size="step" disabled={!values.consent || send === "sending"}>
                  {send === "sending" ? "Sending" : "Send Referral"}
                </PillButton>
              </div>
            </div>
          ) : null}

          {step === 6 ? (
            <div className={`${styles.step} ${styles.done}`} key="done" role="status">
              <span className={styles.doneIcon} aria-hidden="true">
                <CheckIcon size={28} color="var(--indigo-700)" strokeWidth={2.2} />
              </span>
              <div className={styles.head}>
                {heading("Thank you, your referral is in")}
                <p className={styles.sub}>Ensign Support Services will contact you about next steps.</p>
              </div>
              <div className={styles.doneActions}>
                <Link href="/" className={styles.homeLink}>
                  Back to home
                </Link>
                <button type="button" className={styles.ghost} onClick={reset}>
                  Make another referral
                </button>
              </div>
            </div>
          ) : null}
        </form>

        <aside className={styles.notice} aria-labelledby="notice-title">
          <div className={styles.noticeHead}>
            <h2 id="notice-title" className={styles.noticeTitle}>
              Collection Notice
            </h2>
          </div>
          {/* Collection Notice wording approved by Ensign's legal representative (Part 2 of the
              Privacy Policy v2.0 document, 15 Oct 2026). Change it only with legal sign-off. */}
          <p className={styles.noticeCopy}>
            Andrew Manoba, trading as Ensign Support Services, collects this information. Email <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
          <p className={styles.noticeCopy}>
            We use it to reply and, if the referral goes ahead, provide our services. It may include health information.
            If you refer someone else, we will tell them who referred them. The form cannot be sent without required
            fields.
          </p>
          <p className={styles.noticeCopy}>
            With the participant’s agreement, we usually share it with their providers, plan manager or the NDIA. Our
            website and email providers, Netlify and Resend, store it in the United States, and some of our website
            support team work from India.
          </p>
          <p className={styles.noticeCopy}>
            This form does not ask for an NDIS number, diagnosis, Medicare details or documents. Our privacy policy explains
            how to see or correct it, or complain.
          </p>
          {/* Opens in a new tab so nobody loses what they have typed in the form. */}
          <Link href="/privacy" className={styles.privacyLink} target="_blank" rel="noopener">
            Read our privacy policy
            <span className="visually-hidden"> (opens in a new tab)</span>
          </Link>
          <div className={styles.who}>
            <p className={styles.whoTitle}>Who we work with</p>
            <p className={styles.whoCopy}>
              Self-managed and plan-managed NDIS participants, currently in South East Queensland.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
