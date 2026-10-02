import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminFlag } from "@/components/admin/AdminIcons";
import { SignInForm } from "@/components/admin/SignInForm";
import styles from "@/components/admin/admin.module.css";
import { currentSession, safeNext, signInConfigured } from "@/lib/server/admin-auth";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function SignInPage({ searchParams }: PageProps<"/admin/sign-in">) {
  const params = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const next = safeNext(one(params.next)) ?? "";
  // Already signed in: straight through.
  if (await currentSession()) redirect(next || "/admin/referrals");

  let notice: string | null = null;
  if (one(params.expired)) notice = "You were signed out because nothing happened for 15 minutes. Sign in again to carry on.";
  if (one(params.signed_out)) notice = "You are signed out.";
  if (!signInConfigured()) notice = "Sign in has not been set up yet. Ask Archway Automation.";

  return (
    <main id="main" className={styles.signInPage}>
      <div className={styles.signInCard}>
        <div className={styles.signInBrand}>
          <span className={styles.signInTile}>
            <AdminFlag light={false} />
          </span>
          <span className={styles.brandText}>
            <span className={`${styles.brandName} ${styles.onLight}`}>Ensign</span>
            <span className={`${styles.brandSub} ${styles.onLightSub}`}>Admin</span>
          </span>
        </div>
        <div className={styles.titleBlock}>
          <h1 className={styles.signInTitle}>Sign in</h1>
          <p className={styles.signInText}>The private area for Ensign Support Services referrals and enquiries.</p>
        </div>
        {notice && (
          <p className={styles.notice} role="status">
            {notice}
          </p>
        )}
        <SignInForm next={next} />
      </div>
    </main>
  );
}
