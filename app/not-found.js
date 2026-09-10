import Link from 'next/link';
import { PageHead } from '@/components/Sections';
import { business } from '@/lib/content';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <>
      <PageHead
        title="That page is not here."
        lede="The link may be out of date, or we may have moved something."
      />
      <section className="section">
        <div className="shell stack">
          <h2 className="h2">Where you might be headed</h2>
          <ul className="ticks">
            <li><span aria-hidden="true">→</span><Link href="/services">What we do</Link></li>
            <li><span aria-hidden="true">→</span><Link href="/referral">Refer a participant</Link></li>
            <li><span aria-hidden="true">→</span><Link href="/contact">Contact us</Link></li>
          </ul>
          <p>Or call {business.phone}, {business.hoursLong}.</p>
        </div>
      </section>
    </>
  );
}
