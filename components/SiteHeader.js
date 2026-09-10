'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { business, nav } from '@/lib/content';

function Mark() {
  return (
    <svg className="brand__mark" viewBox="0 0 22 22" aria-hidden="true" focusable="false">
      <path d="M3 2v18" stroke="#F2A950" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M6.5 3.4h12.2l-3.6 4.6 3.6 4.6H6.5z" fill="#EDF3EC" />
    </svg>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="header">
      <div className="shell header__row">
        <div className="header__bar">
          <Link className="brand" href="/">
            <Mark />
            {business.shortName}
          </Link>

          <nav className="header__nav" aria-label="Main">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header__actions">
            <a className="header__phone" href={business.phoneHref}>
              {business.phone}
            </a>
            <Link className="btn btn--onband" href="/referral">
              Refer a participant
            </Link>
            <button
              type="button"
              className="header__toggle"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div className="shell header__row">
          <nav className="header__mobile" id="mobile-nav" aria-label="Main, mobile">
            {nav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <a href={business.phoneHref}>Call {business.phone}</a>
            <Link className="btn btn--onband" href="/referral">
              Refer a participant
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
