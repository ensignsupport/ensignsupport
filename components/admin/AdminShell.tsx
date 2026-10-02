"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { idleSignOutAction, keepAliveAction, signOutAction } from "@/app/admin/actions";
import { AdminFlag, EnquiriesIcon, ReferralsIcon, SignOutIcon, ViewSiteIcon } from "./AdminIcons";
import styles from "./admin.module.css";

const IDLE_MS = 15 * 60_000;
const WARN_MS = 13 * 60_000;
const PING_EVERY_MS = 60_000;
// Shared between admin tabs, so a forgotten tab does not sign out the one in use.
const ACTIVE_KEY = "ensign-admin-last-active";

const readShared = () => {
  try {
    return Number(window.localStorage.getItem(ACTIVE_KEY)) || 0;
  } catch {
    return 0;
  }
};
const writeShared = (t: number) => {
  try {
    window.localStorage.setItem(ACTIVE_KEY, String(t));
  } catch {
    // Storage blocked: each tab keeps its own clock, which is still safe.
  }
};

/**
 * The admin frame from the designs: sidebar on computers, a top bar on phones.
 * Also keeps the session alive while Andrew is working, warns him two minutes
 * before the 15 minute idle sign out, and signs him out when it is reached.
 */
export function AdminShell({
  active,
  newCount,
  children,
}: {
  active: "referrals" | "enquiries";
  /** New items in the section being viewed. The design shows the count on that section only. */
  newCount: number;
  children: ReactNode;
}) {
  const lastActive = useRef(0);
  const lastShared = useRef(0);
  const signingOut = useRef(false);
  const lastPing = useRef(0);
  const [warn, setWarn] = useState(false);

  const stayActive = useCallback(() => {
    const now = Date.now();
    if (now - lastShared.current > 5_000) {
      lastShared.current = now;
      writeShared(now);
    }
    lastActive.current = now;
    setWarn(false);
    if (now - lastPing.current > PING_EVERY_MS) {
      lastPing.current = now;
      keepAliveAction().catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    const start = Date.now();
    lastActive.current = start;
    lastPing.current = start;
    lastShared.current = start;
    writeShared(start);
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, stayActive, { passive: true }));
    const timer = window.setInterval(() => {
      const idle = Date.now() - Math.max(lastActive.current, readShared());
      if (idle >= IDLE_MS && !signingOut.current) {
        signingOut.current = true;
        // If the sign out call cannot get through, leave the page anyway so nothing stays on screen.
        idleSignOutAction().catch(() => window.location.replace(`${window.location.origin}/admin/sign-in?expired=1`));
      }
      else setWarn(idle >= WARN_MS);
    }, 5_000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, stayActive));
      window.clearInterval(timer);
    };
  }, [stayActive]);

  return (
    <div className={styles.shell}>
      <aside className={styles.side}>
        <Link href="/admin/referrals" className={styles.brand} prefetch={false}>
          <span className={styles.brandTile}>
            <AdminFlag />
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>Ensign</span>
            <span className={styles.brandSub}>Admin</span>
          </span>
        </Link>
        <nav className={styles.sideNav} aria-label="Admin">
          <Link
            href="/admin/referrals"
            prefetch={false}
            className={`${styles.navLink} ${active === "referrals" ? styles.navOn : ""}`}
            aria-current={active === "referrals" ? "page" : undefined}
          >
            <ReferralsIcon className={styles.navIcon} />
            <span className={styles.navLabel}>Referrals</span>
            {active === "referrals" && newCount > 0 && (
              <span className={styles.navCount}>
                {newCount}
                <span className="visually-hidden"> new</span>
              </span>
            )}
          </Link>
          <Link
            href="/admin/enquiries"
            prefetch={false}
            className={`${styles.navLink} ${active === "enquiries" ? styles.navOn : ""}`}
            aria-current={active === "enquiries" ? "page" : undefined}
          >
            <EnquiriesIcon className={styles.navIcon} />
            <span className={styles.navLabel}>Enquiries</span>
            {active === "enquiries" && newCount > 0 && (
              <span className={styles.navCount}>
                {newCount}
                <span className="visually-hidden"> new</span>
              </span>
            )}
          </Link>
          <form action={signOutAction} className={styles.phoneSignOut}>
            <button type="submit" className={`${styles.navLink} ${styles.phoneSignOutButton}`} aria-label="Sign out">
              <SignOutIcon />
            </button>
          </form>
        </nav>
        <div className={styles.sideFoot}>
          <Link href="/" className={styles.navLink}>
            <ViewSiteIcon />
            View website
          </Link>
          <form action={signOutAction}>
            <button type="submit" className={`${styles.navLink} ${styles.navButton}`}>
              <SignOutIcon />
              Sign out
            </button>
          </form>
          <div className={styles.who}>
            <span className={styles.avatar} aria-hidden="true">
              ES
            </span>
            <span className={styles.whoText}>
              <span className={styles.whoName}>Ensign admin</span>
              <span className={styles.whoSub}>Signed in</span>
            </span>
          </div>
        </div>
      </aside>
      <main id="main" className={styles.main} tabIndex={-1}>
        {warn && (
          <div className={styles.idle} role="alert">
            <span>You will be signed out in 2 minutes because nothing has happened for a while.</span>
            <button type="button" className={styles.btn} onClick={stayActive}>
              Stay signed in
            </button>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
