import Image from 'next/image';
import { PageHead, FactStrip, Timeline, CredentialsStrip, CtaBand } from '@/components/Sections';
import { business, registration, values, coverage, audience } from '@/lib/content';

export const metadata = {
  title: 'About',
  description:
    'Ensign Support Coordination is a solo practice in South East Queensland, taking its first participants from September 2026. Honest about what it is and is not.',
};

/* Every entry below is a fact from the discovery questionnaire. Nothing here
   is a projection or a promise beyond what the client actually stated. */
const journey = [
  {
    icon: 'send',
    when: 'Now',
    title: 'Taking referrals',
    body: 'The books are open for September. Referrals sent now get a conversation now, not an autoresponder.',
    now: true,
  },
  {
    icon: 'visit',
    when: business.launch,
    title: 'First participants',
    body: 'Support coordination and psychosocial recovery coaching begin, delivered in person across South East Queensland.',
  },
  {
    icon: 'badgeCheck',
    when: 'In progress',
    title: 'Working towards NDIS registration',
    body: 'Unregistered until then, which is legal for self-managed and plan-managed participants and is stated plainly everywhere on this site.',
  },
  {
    icon: 'compass',
    when: 'After that',
    title: 'Australia-wide, remotely',
    body: 'Remote and telehealth delivery beyond South East Queensland is the planned next phase.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Centred and panel-less. This page is a statement about what the
          practice is, so the statement gets the whole width. */}
      <PageHead
        align="center"
        title="A small practice, on purpose."
        lede="Ensign is one person. That is the point, and it is also the limit."
        below={
          <FactStrip
            items={[
              ['Structure', 'Sole trader'],
              ['First participants', business.launch],
              ['Coverage', `${business.coverage}, in person`],
              ['Registration', 'Working towards'],
            ]}
          />
        }
      />

      <section className="section">
        <div className="shell stack" data-anim="reveal">
          <h2 className="h2">Where this is up to</h2>
          <p className="lede">
            No back catalogue of testimonials and no long client list, because there has not been
            time for one. Here is the actual state of things.
          </p>
          <Timeline items={journey} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell stack" data-anim="reveal">
          <h2 className="h2">What we are trying to do</h2>
          <p className="lede">
            Ensign helps people navigate their disability journey: building independence and meeting
            disability-related needs, rather than simply booking services.
          </p>

          {/* Values as prose with a numeral, not icon cards. Cards flatten the
              one thing that actually distinguishes this business. */}
          <div className="values" data-anim="stagger">
            {values.map((v, i) => (
              <div className="value" key={v.name}>
                <span className="value__n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{v.name}</h3>
                <p>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell" data-anim="reveal">
          <div className="who">
            <div className="stack">
              <h2 className="h2">About registration</h2>
              <p className="lede">{registration.line}</p>
              <p>{registration.explainer}</p>
            </div>

            {/* The disclosure gets the dark panel treatment, because it is the
                most important paragraph on the page. */}
            <div className="check">
              <div className="check__body">
                <h3>What we will not claim</h3>
                <div className="check__answer" style={{ borderTop: 0, paddingTop: 0 }}>
                  <p>
                    Ensign is not NDIS registered, not NDIS accredited, and has not been assessed
                    against the NDIS Practice Standards.
                  </p>
                  <p>
                    Professional indemnity insurance is not held, so it is not listed anywhere as a
                    credential.
                  </p>
                  <p>
                    The NDIS Code of Conduct applies regardless of registration status, and we work
                    to it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell" data-anim="reveal">
          <div className="photoband">
            {/* Beside the text, not behind it. */}
            <figure className="photoband__media">
              <Image
                src="/photos/community.jpg"
                alt="A man in a wheelchair on a city street, out on his own, waiting to cross."
                width={1600}
                height={1067}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
              <figcaption>
                In the community, not in an office. Photograph by the Centre for Ageing Better.
              </figcaption>
            </figure>

            <div className="stack">
              <h2 className="h2">Where we work</h2>
              <p className="lede">{coverage.now}</p>
              <p>{coverage.next}</p>
              <p>{audience.cald}</p>
            </div>
          </div>
        </div>
      </section>

      <CredentialsStrip heading="What we can show you" />

      <CtaBand
        title="Still want to ask something?"
        body="A phone call costs you nothing and gets you a straight answer about whether we are the right fit."
        action={{ href: '/contact', label: 'Contact us' }}
      />
    </>
  );
}
