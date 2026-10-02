"use server";

import { redirect, RedirectType } from "next/navigation";
import { z } from "zod";
import { logAccess, requireSessionForAction, safeNext, signIn, signOut } from "@/lib/server/admin-auth";
import {
  addReferralNote,
  openEnquiry,
  queueEnquiryReply,
  referralDetail,
  setEnquiryStatus,
  setReferralStatus,
  type EnquiryDetail,
  type ReferralDetail,
} from "@/lib/server/admin-data";
import { processOutbox } from "@/lib/server/email";
import { logError } from "@/lib/server/log";
import { ENQUIRY_STATUS_IDS, REFERRAL_STATUS_IDS, type EnquiryStatus, type ReferralStatus } from "@/lib/admin/labels";

/**
 * Every admin action. Each one checks the session against the database before
 * doing anything (requireSession), validates what it was sent, and records
 * who did what in the access log (reference numbers only). Next.js also
 * refuses a server action posted from another site.
 */

const REF = /^[RE]-\d{4,9}$/;
const noNul = (v: string) => !v.includes("\u0000");
const refSchema = z.string().regex(REF);
const textSchema = (max: number) =>
  z.string().trim().min(1, "Write something first").max(max, `Keep it under ${max} characters`).refine(noNul, "Remove the unusual character");

export type SignInState = { error?: string } | undefined;

export async function signInAction(_prev: SignInState, form: FormData): Promise<SignInState> {
  const passphrase = String(form.get("passphrase") ?? "");
  if (!passphrase || passphrase.length > 200) return { error: "Enter the passphrase." };
  const result = await signIn(passphrase);
  if (!result.ok) {
    if (result.reason === "locked") return { error: "Too many wrong tries. Sign in is locked for 15 minutes." };
    if (result.reason === "not_set_up") return { error: "Sign in has not been set up yet. Ask Archway Automation." };
    return { error: "That passphrase is not right. Check it and try again." };
  }
  redirect(safeNext(String(form.get("next") ?? "")) ?? "/admin/referrals");
}

export async function signOutAction() {
  await signOut();
  redirect("/admin/sign-in?signed_out=1", RedirectType.replace);
}

/** Called while Andrew is active, so reading a long referral does not sign him out. */
export async function keepAliveAction(): Promise<boolean> {
  await requireSessionForAction();
  return true;
}

/**
 * 15 minutes without activity. Ends the session on the server and removes the
 * cookie, which also clears the browser's copy of the admin pages, so the Back
 * button cannot show them again.
 */
export async function idleSignOutAction() {
  await signOut();
  redirect("/admin/sign-in?expired=1", RedirectType.replace);
}

export async function referralDetailAction(ref: string): Promise<ReferralDetail | null> {
  const session = await requireSessionForAction();
  if (!refSchema.safeParse(ref).success) return null;
  const detail = await referralDetail(ref);
  if (detail) await logAccess(session.id, "view_referral", ref);
  return detail;
}

export async function referralStatusAction(ref: string, status: ReferralStatus): Promise<ReferralDetail | null> {
  const session = await requireSessionForAction();
  if (!refSchema.safeParse(ref).success || !REFERRAL_STATUS_IDS.includes(status)) return null;
  if (!(await setReferralStatus(ref, status))) return null;
  await logAccess(session.id, "change_referral_status", ref);
  return referralDetail(ref);
}

export async function referralNoteAction(
  ref: string,
  body: string,
): Promise<{ ok: true; detail: ReferralDetail } | { ok: false; error: string }> {
  const session = await requireSessionForAction();
  const parsed = textSchema(4000).safeParse(body);
  if (!refSchema.safeParse(ref).success) return { ok: false, error: "That referral could not be found." };
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  if (!(await addReferralNote(ref, parsed.data))) return { ok: false, error: "That referral could not be found." };
  await logAccess(session.id, "add_referral_note", ref);
  const detail = await referralDetail(ref);
  return { ok: true, detail: detail! };
}

export async function openEnquiryAction(ref: string): Promise<EnquiryDetail | null> {
  const session = await requireSessionForAction();
  if (!refSchema.safeParse(ref).success) return null;
  const detail = await openEnquiry(ref);
  if (detail) await logAccess(session.id, "view_enquiry", ref);
  return detail;
}

export async function enquiryStatusAction(ref: string, status: EnquiryStatus): Promise<boolean> {
  const session = await requireSessionForAction();
  if (!refSchema.safeParse(ref).success || !ENQUIRY_STATUS_IDS.includes(status)) return false;
  const ok = await setEnquiryStatus(ref, status);
  if (ok) await logAccess(session.id, "change_enquiry_status", ref);
  return ok;
}

export async function enquiryReplyAction(
  ref: string,
  body: string,
): Promise<{ ok: true; detail: EnquiryDetail } | { ok: false; error: string }> {
  const session = await requireSessionForAction();
  const parsed = textSchema(4000).safeParse(body);
  if (!refSchema.safeParse(ref).success) return { ok: false, error: "That enquiry could not be found." };
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  if (!(await queueEnquiryReply(ref, parsed.data))) return { ok: false, error: "That enquiry could not be found." };
  await logAccess(session.id, "send_enquiry_reply", ref);
  // Try to send it now. If email is not set up yet, or fails, the hourly job keeps trying.
  try {
    await processOutbox(5);
  } catch (error) {
    logError("admin.reply_send_now_failed", error, { ref });
  }
  const detail = await openEnquiry(ref);
  if (!detail) return { ok: false, error: "That enquiry could not be found." };
  return { ok: true, detail };
}
