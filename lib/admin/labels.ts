/**
 * Words the admin shows for the values stored in the database.
 * Shared by the server and the browser. Statuses and their order come from
 * the admin designs (AdminReferrals.dc.html, AdminEnquiries.dc.html).
 */
import { PLAN_TYPES, REFERRER_TYPES, SERVICES } from "@/lib/forms/schema";

export const REFERRAL_STATUSES = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "in_progress", label: "In progress" },
  { id: "accepted", label: "Accepted" },
  { id: "closed", label: "Closed" },
] as const;

export const ENQUIRY_STATUSES = [
  { id: "new", label: "New" },
  { id: "replied", label: "Replied" },
  { id: "closed", label: "Closed" },
] as const;

export type ReferralStatus = (typeof REFERRAL_STATUSES)[number]["id"];
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number]["id"];

export const REFERRAL_STATUS_IDS = REFERRAL_STATUSES.map((s) => s.id) as ReferralStatus[];
export const ENQUIRY_STATUS_IDS = ENQUIRY_STATUSES.map((s) => s.id) as EnquiryStatus[];

export const statusLabel = (id: string) =>
  [...REFERRAL_STATUSES, ...ENQUIRY_STATUSES].find((s) => s.id === id)?.label ?? id;

export const serviceLabel = (id: string) => SERVICES.find((s) => s.id === id)?.label ?? id;
export const serviceShort = (id: string) => (id === "recovery_coaching" ? "Recovery coaching" : serviceLabel(id));
export const planLabel = (id: string) => PLAN_TYPES.find((p) => p.id === id)?.title ?? id;
export const referrerLabel = (id: string) => REFERRER_TYPES.find((r) => r.id === id)?.label ?? id;

export const SERVICE_FILTERS = [
  { id: "support_coordination", label: "Support coordination" },
  { id: "recovery_coaching", label: "Recovery coaching" },
  { id: "both", label: "Both" },
] as const;

const BRISBANE_DAY = new Intl.DateTimeFormat("en-AU", {
  timeZone: "Australia/Brisbane",
  day: "numeric",
  month: "numeric",
  year: "numeric",
});

const BRISBANE_TIME = new Intl.DateTimeFormat("en-AU", {
  timeZone: "Australia/Brisbane",
  day: "numeric",
  month: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const BRISBANE_FULL = new Intl.DateTimeFormat("en-AU", {
  timeZone: "Australia/Brisbane",
  day: "numeric",
  month: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

// The designs write months as "Sep", not "Sept".
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const month = (parts: Intl.DateTimeFormatPart[]) => MONTHS[Number(parts.find((p) => p.type === "month")?.value) - 1];

/** "2 Oct 2026", Brisbane time. */
export const formatDay = (iso: string) => {
  const parts = BRISBANE_DAY.formatToParts(new Date(iso));
  return `${Number(parts.find((p) => p.type === "day")?.value)} ${month(parts)} ${parts.find((p) => p.type === "year")?.value}`;
};
/** "2 Oct, 9:12am", Brisbane time, as the enquiries design shows it. */
export const formatWhen = (iso: string) => {
  const parts = BRISBANE_TIME.formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${Number(get("day"))} ${month(parts)}, ${get("hour")}:${get("minute")}${get("dayPeriod").toLowerCase().replace(/\s|\./g, "")}`;
};
/** "2 Oct 2026, 9:12am", Brisbane time, for history lines. */
export const formatFull = (iso: string) => {
  const parts = BRISBANE_FULL.formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${Number(get("day"))} ${month(parts)} ${get("year")}, ${get("hour")}:${get("minute")}${get("dayPeriod").toLowerCase().replace(/\s|\./g, "")}`;
};
