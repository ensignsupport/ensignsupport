/**
 * Form fields, options and validation, shared by the browser and the server.
 * Fields are exactly the developer brief's. Never collected: NDIS number,
 * diagnosis, Medicare details or files.
 */
import { z } from "zod";

export const REFERRER_TYPES = [
  { id: "participant", title: "I am the participant", sub: "Referring yourself", label: "Participant" },
  { id: "family", title: "Family member or carer", sub: "Referring someone you support", label: "Family or carer" },
  {
    id: "professional",
    title: "A professional",
    sub: "Support coordinator, LAC, plan manager, health professional or other provider",
    label: "Professional",
  },
] as const;

export const SERVICES = [
  {
    id: "support_coordination",
    title: "Support coordination",
    sub: "Understand the plan and connect the right supports",
    label: "Support coordination",
  },
  {
    id: "recovery_coaching",
    title: "Psychosocial recovery coaching",
    sub: "Build skills, routines and community connections",
    label: "Psychosocial recovery coaching",
  },
  { id: "both", title: "Both", sub: "Support coordination and recovery coaching", label: "Both" },
] as const;

// Self-managed and plan-managed only. There is no NDIA-managed option, by design.
export const PLAN_TYPES = [
  { id: "self_managed", title: "Self-managed" },
  { id: "plan_managed", title: "Plan-managed" },
] as const;

export const HEARD_VIA = [
  "Search engine",
  "Social media",
  "Word of mouth",
  "Support coordinator or LAC",
  "Plan manager",
  "Health professional",
  "Other",
] as const;

type Ids<T extends readonly { id: string }[]> = T[number]["id"];
const ids = <T extends readonly { id: string }[]>(list: T) => list.map((o) => o.id) as [Ids<T>, ...Ids<T>[]];

/** Characters the database refuses (the NUL byte) never get past the form. */
const noNul = (v: string | undefined) => !v || !v.includes("\u0000");
const NUL_MESSAGE = "Remove the unusual character and try again";

const text = (label: string, max: number) =>
  z
    .string({ error: `Enter ${label}` })
    .trim()
    .min(1, `Enter ${label}`)
    .max(max, `Keep ${label} under ${max} characters`)
    .refine(noNul, NUL_MESSAGE);

const optionalText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .max(max, `Keep ${label} under ${max} characters`)
    .refine(noNul, NUL_MESSAGE)
    .optional()
    .transform((v) => (v ? v : undefined));

const phone = (label: string) =>
  z
    .string({ error: `Enter ${label}` })
    .trim()
    .min(1, `Enter ${label}`)
    .max(20, `Keep ${label} under 20 characters`)
    .refine((v) => /^[0-9+()\-\s]+$/.test(v), `Enter ${label} using numbers only, for example 0400 123 456`)
    .refine((v) => {
      const digits = v.replace(/\D/g, "").length;
      return digits >= 8 && digits <= 15;
    }, `Enter ${label} with 8 to 15 digits, for example 0400 123 456`);

const email = (label: string) =>
  z
    .string({ error: `Enter ${label}` })
    .trim()
    .min(1, `Enter ${label}`)
    .max(254, `Keep ${label} under 254 characters`)
    .refine(noNul, NUL_MESSAGE)
    .pipe(z.email(`Enter ${label} in the format name@example.com`));

const suburb = z
  .string({ error: "Enter the suburb and postcode" })
  .trim()
  .min(1, "Enter the suburb and postcode")
  .max(80, "Keep the suburb and postcode under 80 characters")
  .refine(noNul, NUL_MESSAGE)
  .refine((v) => /[A-Za-z]/.test(v) && /\b\d{4}\b/.test(v), "Enter the suburb and the 4 digit postcode, for example Springfield 4300");

/** Step 1: your details. */
export const referrerSchema = z.object({
  referrerName: text("your full name", 120),
  referrerOrgRole: optionalText("the organisation and role", 160),
  referrerPhone: phone("your phone number"),
  referrerEmail: email("your email address"),
});

/** Step 2: the participant, when someone else is referring. */
export const participantSchema = z.object({
  participantName: text("the participant's full name", 120),
  participantPhone: phone("the participant's phone number"),
  participantEmail: email("the participant's email address"),
  participantPreferredContact: optionalText("the preferred contact", 200),
});

export const suburbSchema = z.object({ participantSuburb: suburb });

/** Step 3: service, plan type and reason. */
export const supportSchema = z.object({
  service: z.enum(ids(SERVICES), { error: "Choose a service" }),
  planType: z.enum(ids(PLAN_TYPES), { error: "Choose how the NDIS plan is managed" }),
  reason: text("a short reason for the referral", 1000),
});

/** Step 4: consent and how they heard. */
export const confirmSchema = z.object({
  consent: z.literal(true, { error: "Tick the box to confirm consent before sending" }),
  heardVia: z.enum(HEARD_VIA).optional(),
});

/** Everything except the participant's own contact details. */
const referralBaseSchema = z
  .object({
    referrerType: z.enum(ids(REFERRER_TYPES), { error: "Choose who is making this referral" }),
    // One id per form, so a retried save can never store the same referral twice.
    submissionId: z.uuid({ error: "Please reload the page and try again" }),
  })
  .extend(referrerSchema.shape)
  .extend(suburbSchema.shape)
  .extend(supportSchema.shape)
  .extend(confirmSchema.shape);

export type Referral = z.output<typeof referralBaseSchema> & Partial<z.output<typeof participantSchema>>;

type ParseResult<T> = { success: true; data: T } | { success: false; errors: Record<string, string> };

/**
 * Checks a whole referral. When the participant refers themselves, their own
 * details are the participant's details, so the participant fields are skipped.
 */
export function parseReferral(input: unknown): ParseResult<Referral> {
  const base = referralBaseSchema.safeParse(input);
  const errors: Record<string, string> = base.success ? {} : fieldErrors(base.error);
  let participant: Partial<z.output<typeof participantSchema>> = {};
  const type = (input as { referrerType?: unknown } | null)?.referrerType;
  if (type !== "participant") {
    const parsed = participantSchema.safeParse(input);
    if (parsed.success) participant = parsed.data;
    else Object.assign(errors, fieldErrors(parsed.error));
  }
  if (!base.success || Object.keys(errors).length > 0) return { success: false, errors };
  return { success: true, data: { ...base.data, ...participant } };
}

export const enquirySchema = z.object({
  name: text("your name", 120),
  email: email("your email address"),
  phone: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(phone("your phone number").optional()),
  message: text("your message", 2000),
  submissionId: z.uuid({ error: "Please reload the page and try again" }),
});

export type Enquiry = z.output<typeof enquirySchema>;

/** Name of the hidden field that only bots fill in. */
export const HONEYPOT = "ens_hp_7x";

/** Turn a zod error into { field: first message }. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
