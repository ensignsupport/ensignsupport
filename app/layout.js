import { Outfit, Manrope } from 'next/font/google';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Motion from '@/components/Motion';
import ParticleField from '@/components/ParticleField';
import TopoPattern from '@/components/TopoPattern';
import { business, registration } from '@/lib/content';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata = {
  title: {
    default: `${business.name} | NDIS support coordination in South East Queensland`,
    template: `%s | ${business.name}`,
  },
  description:
    'Support coordination and psychosocial recovery coaching across South East Queensland. We help you understand your plan, find the right providers, and build your independence.',
  openGraph: {
    title: business.name,
    description:
      'Support coordination and psychosocial recovery coaching across South East Queensland.',
    type: 'website',
    locale: 'en_AU',
  },
};

export const viewport = {
  themeColor: '#0a1c14',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU" className={`${outfit.variable} ${manrope.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to main content
        </a>
        <ParticleField />
        <TopoPattern />
        <SiteHeader />
        <Motion />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <script
          type="application/ld+json"
          // Local business markup. Phone and address are placeholders until the
          // client supplies them; see lib/content.js.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: business.name,
              description: registration.line,
              areaServed: 'South East Queensland, Australia',
              telephone: business.phone,
              email: business.email,
              openingHours: 'Mo-Su 07:00-19:00',
            }),
          }}
        />
      </body>
    </html>
  );
}
