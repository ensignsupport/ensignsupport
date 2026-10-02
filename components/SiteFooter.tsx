import Link from "next/link";
import type { ReactNode } from "react";
import { isPlaceholder, nav, site } from "@/lib/site";
import { ExternalArrow, FacebookIcon, InstagramIcon, MailIcon } from "./icons";
import styles from "./SiteFooter.module.css";

/**
 * A social link Andrew has not supplied yet is drawn as in the design but is
 * not a link, so there is never a dead "#" link on the site.
 */
function SocialItem({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  if (isPlaceholder(href)) {
    return (
      <span className={styles.socialItem} role="img" aria-label={`${label} link to be added`}>
        {children}
      </span>
    );
  }
  return (
    <a className={styles.socialItem} href={href} aria-label={label} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function ContactLine({ value, kind }: { value: string; kind: "tel" | "mailto" }) {
  if (isPlaceholder(value)) return <span>{value}</span>;
  const href = kind === "tel" ? `tel:${value.replace(/\s/g, "")}` : `mailto:${value}`;
  return (
    <a className={styles.colLink} href={href}>
      {value}
    </a>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  const emailKnown = !isPlaceholder(site.email);

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brand}>
          <Link href="/" aria-label={`${site.name} home`} className={styles.brandLink}>
            <span className={styles.brandTop}>ENSIGN</span>
            <span className={styles.brandBottom}>SUPPORT SERVICES</span>
          </Link>
          <p className={styles.blurb}>{site.tagline}</p>
          <div className={styles.social}>
            <SocialItem href={site.social.instagram} label="Instagram">
              <InstagramIcon size={21} />
            </SocialItem>
            <SocialItem href={site.social.facebook} label="Facebook">
              <FacebookIcon size={21} />
            </SocialItem>
            <a
              className={styles.socialItem}
              href={emailKnown ? `mailto:${site.email}` : "/contact"}
              aria-label={emailKnown ? "Email" : "Contact us"}
            >
              <MailIcon size={22} />
            </a>
          </div>
        </div>

        <nav className={`${styles.col} ${styles.pages}`} aria-label="Footer">
          <span className={styles.colHead}>Pages</span>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={styles.colLink}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={`${styles.col} ${styles.services}`}>
          <span className={styles.colHead}>Services</span>
          <Link href="/services" className={styles.colLink}>
            Support coordination
          </Link>
          <Link href="/services" className={styles.colLink}>
            Psychosocial recovery coaching
          </Link>
          <span className={`${styles.spaced} ${styles.servicesExtra}`}>{site.serviceArea}</span>
          <span className={styles.servicesExtra}>Self and plan-managed</span>
        </div>

        <div className={`${styles.col} ${styles.contact}`}>
          <span className={styles.colHead}>Contact</span>
          <ContactLine value={site.phone} kind="tel" />
          <ContactLine value={site.email} kind="mailto" />
          <Link href="/referral" className={styles.referLink}>
            Make a referral
          </Link>
        </div>
      </div>

      <div className={styles.partnerWrap}>
        <div className={styles.partner}>
          <span className={styles.partnerText}>
            <span className={styles.partnerLabel}>PARTNER</span>
            <span className={styles.partnerCopy}>
              We proudly partner with <strong>Archway Automation</strong> for our custom website, software and
              mobile app needs.
            </span>
          </span>
          <a className={styles.partnerLink} href={site.partnerUrl} target="_blank" rel="noopener">
            Visit website
            <ExternalArrow size={12} />
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>
      </div>

      <div className={styles.rule}>
        <div className={styles.bottom}>
          <span>
            © {year} {site.name}
          </span>
          <span className={styles.bottomRight}>
            <span>ABN {site.abn} · Not a registered NDIS provider</span>
            <Link href="/privacy" className={styles.bottomLink}>
              Privacy policy
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
