"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { isPlaceholder, nav, site } from "@/lib/site";
import { ChevronRight, CloseIcon, FlagMark, MenuIcon, PhoneIcon } from "./icons";
import { PillLink } from "./PillButton";
import styles from "./SiteHeader.module.css";

function isCurrent(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // Close the phone menu when the page changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Escape closes the menu and puts focus back on the button.
  // A click or tap outside the menu closes it too.
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    function onPointer(event: PointerEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const phoneKnown = !isPlaceholder(site.phone);
  const phoneHref = phoneKnown ? `tel:${site.phone.replace(/\s/g, "")}` : "/contact";

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" aria-label={`${site.name} home`} className={styles.logo}>
          <span className={styles.logoTile}>
            <FlagMark size={20} />
          </span>
          <span className={styles.wordmark}>
            Ensign <span className={styles.wordmarkSecond}>Support Services</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Main">
          {nav.map((item) => {
            const current = isCurrent(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={current ? `${styles.navLink} ${styles.navLinkCurrent}` : styles.navLink}
              >
                {item.label}
                {current ? <span className={styles.navDot} aria-hidden="true" /> : null}
              </Link>
            );
          })}
        </nav>

        <div className={styles.right}>
          <a className={styles.circle} href={phoneHref} aria-label={phoneKnown ? "Call us" : "Contact us"}>
            <PhoneIcon size={18} />
          </a>
          <PillLink href="/referral" tone="accent" size="header">
            Make a Referral
          </PillLink>
        </div>

        <div className={styles.mobile} ref={wrapRef}>
          <button
            ref={buttonRef}
            type="button"
            className={styles.circle}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label="Menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon size={18} /> : <MenuIcon size={20} />}
          </button>
          <div id={panelId} className={styles.panel} hidden={!open}>
            <nav aria-label="Mobile">
              {nav.map((item) => {
                const current = isCurrent(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={current ? `${styles.mlink} ${styles.mlinkCurrent}` : styles.mlink}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                    <ChevronRight size={16} color="var(--icon-muted)" />
                  </Link>
                );
              })}
            </nav>
            <PillLink href="/referral" tone="accent" size="menu" className={styles.menuButton}>
              Make a Referral
            </PillLink>
          </div>
        </div>
      </div>
    </header>
  );
}
