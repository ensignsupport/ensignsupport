import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { EnquiriesBoard } from "@/components/admin/EnquiriesBoard";
import { logAccess, requireSession } from "@/lib/server/admin-auth";
import { listEnquiries } from "@/lib/server/admin-data";

export const metadata: Metadata = {
  title: "Admin · Enquiries",
  robots: { index: false, follow: false },
};

export default async function AdminEnquiriesPage({ searchParams }: PageProps<"/admin/enquiries">) {
  const params = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const ref = one(params.ref);
  const validRef = ref && /^E-\d{4,9}$/.test(ref) ? ref : null;
  const session = await requireSession(`/admin/enquiries${validRef ? `?ref=${validRef}` : ""}`);
  await logAccess(session.id, "view_enquiries");
  const rows = await listEnquiries();
  const newCount = rows.filter((e) => e.status === "new").length;
  return (
    <AdminShell active="enquiries" newCount={newCount}>
      <EnquiriesBoard rows={rows} initialRef={validRef} />
    </AdminShell>
  );
}
