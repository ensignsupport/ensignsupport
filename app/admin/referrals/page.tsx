import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { ReferralsBoard } from "@/components/admin/ReferralsBoard";
import { logAccess, requireSession } from "@/lib/server/admin-auth";
import { listReferrals } from "@/lib/server/admin-data";
import { REFERRAL_STATUS_IDS, type ReferralStatus } from "@/lib/admin/labels";

export const metadata: Metadata = {
  title: "Admin · Referrals",
  robots: { index: false, follow: false },
};

export default async function AdminReferralsPage({ searchParams }: PageProps<"/admin/referrals">) {
  const params = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const ref = one(params.ref);
  const status = one(params.status);
  const qs = new URLSearchParams();
  if (ref && /^R-\d{4,9}$/.test(ref)) qs.set("ref", ref);
  if (status && (REFERRAL_STATUS_IDS as string[]).includes(status)) qs.set("status", status);
  const session = await requireSession(`/admin/referrals${qs.size ? `?${qs}` : ""}`);
  await logAccess(session.id, "view_referrals");
  const rows = await listReferrals();
  const newCount = rows.filter((r) => r.status === "new").length;
  return (
    <AdminShell active="referrals" newCount={newCount}>
      <ReferralsBoard
        rows={rows}
        initialRef={qs.get("ref")}
        initialStatus={(qs.get("status") as ReferralStatus | null) ?? "all"}
      />
    </AdminShell>
  );
}
