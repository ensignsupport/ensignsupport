import Link from 'next/link';
import { business, registration, coverage } from '@/lib/content';

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="shell footer__grid">
        <div>
          <h2>{business.name}</h2>
          <p style={{ maxWidth: '32ch' }}>
            Support coordination and psychosocial recovery coaching across {business.coverage}.
          </p>
        </div>

        <div>
          <h2>Services</h2>
          <ul>
            <li>
              <Link href="/services">Support coordination</Link>
            </li>
            <li>
              <Link href="/services">Psychosocial recovery coaching</Link>
            </li>
            <li>
              <Link href="/referral">Make a referral</Link>
            </li>
          </ul>
        </div>

        <div>
          <h2>Contact</h2>
          <ul>
            <li>
              <a href={business.phoneHref}>{business.phone}</a>
            </li>
            <li>
              <a href={`mailto:${business.email}`}>{business.email}</a>
            </li>
            <li>{business.hoursLong}</li>
          </ul>
        </div>

        <div>
          <h2>Practice</h2>
          <ul>
            <li>NDIS Code of Conduct</li>
            <li>
              <Link href="/about">About Ensign</Link>
            </li>
            <li>{business.abn}</li>
          </ul>
        </div>

        <div className="footer__legal">
          <p style={{ maxWidth: '80ch' }}>
            {registration.line} {coverage.next}
          </p>
        </div>
      </div>
    </footer>
  );
}
