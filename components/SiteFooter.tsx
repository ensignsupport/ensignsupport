import Link from "next/link";
import { nav, site } from "@/lib/site";
import { ExternalArrow, MailIcon } from "./icons";
import styles from "./SiteFooter.module.css";

// Ensign has no social media and no public phone number, so email is the only contact icon.

export function SiteFooter() {
  const year = new Date().getFullYear();

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
            <a className={styles.socialItem} href={`mailto:${site.email}`} aria-label={`Write to us at ${site.email}`}>
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
          <a className={styles.colLink} href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <Link href="/contact#enquiry" className={styles.colLink}>
            Send us a message
          </Link>
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
