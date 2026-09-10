import Link from 'next/link';
import { PageHead, ServiceTiles, CtaBand, Tick } from '@/components/Sections';
import Icon from '@/components/Icon';
import { services, audience, business } from '@/lib/content';

export const metadata = {
  title: 'Services',
  description:
    'Support coordination and psychosocial recovery coaching across South East Queensland, for self-managed and plan-managed NDIS participants.',
};

export default function ServicesPage() {
  return (
    <>
      {/* The hero is the chooser. Two tiles, pick one, jump to it. */}
      <PageHead
        title="Two services. Both in person."
        lede="Both open to self-managed and plan-managed participants, all ages, all disability types."
        panel={<ServiceTiles items={services} />}
      />

      {services.map((s, i) => (
        <section
          className="section"
          id={s.slug}
          key={s.slug}
          style={i > 0 ? { paddingTop: 0 } : undefined}
        >
          <div className="shell stack" data-anim="reveal">
            <span className="ico">
              <Icon name={s.icon} size={21} />
            </span>
            <h2 className="h2">{s.name}</h2>

            {s.body.map((para) => (
              <p key={para.slice(0, 30)}>{para}</p>
            ))}

            <div className="who" style={{ marginTop: 16 }}>
              <div>
                <h3 className="h3" style={{ marginBottom: 14 }}>
                  What the first month looks like
                </h3>
                {/* numbered, because these genuinely happen in order */}
                <ol className="timeline">
                  {s.firstMonth.map((step, i) => (
                    <li className="tl" key={step}>
                      <span className="tl__dot" aria-hidden="true">
                        {i + 1}
                      </span>
                      <p style={{ marginTop: 4 }}>{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <dl className="facts">
                {s.facts.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      ))}

      {/* In and out, side by side. A referrer can rule Ensign in or out of a
          case in one glance instead of reading two prose sections. */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell stack" data-anim="reveal">
          <h2 className="h2">What we do, and what we do not</h2>
          <p className="lede">
            Worth being blunt about, because it saves a referrer a wasted phone call.
          </p>

          {/* One rule, two columns, no prose between them. A referrer reads
              the right-hand column first and either stops or keeps going. */}
          <div className="scope">
            <div className="scope__col">
              <h3>We do</h3>
              <ul className="scope__list">
                {[
                  'Read the plan and work out what it actually funds',
                  'Find providers with real availability in your postcode',
                  'Set up service agreements and hold the bookings',
                  'Chase the gaps when a service falls through',
                  'Write the progress report before your plan review',
                ].map((item) => (
                  <li key={item}>
                    <Tick />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="scope__col scope__col--no">
              <h3>We do not</h3>
              <ul className="scope__list">
                {[
                  'Provide support workers or personal care',
                  'Deliver therapy of any kind',
                  'Provide transport or accommodation',
                  'Manage your plan budget or pay invoices',
                  'Take NDIA-managed plans, until we are registered',
                ].map((item) => (
                  <li key={item}>
                    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                      <circle
                        cx="10"
                        cy="10"
                        r="9"
                        fill="none"
                        stroke="var(--text-dim)"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M6.4 10h7.2"
                        stroke="var(--text-dim)"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p style={{ marginTop: 16, fontSize: '1rem', color: 'var(--text-dim)' }}>
                We find, arrange and hold together the providers who do.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell stack" data-anim="reveal">
          <h2 className="h2">Which plans we can work with</h2>

          {/* Three states, side by side, so the answer is found rather than
              read. The "no" gets the same tile as the two yeses instead of
              being buried at the end of a sentence. */}
          <ul className="matrix">
            {audience.planTypes.map(([label, ok]) => (
              <li key={label} data-ok={ok ? 'true' : 'false'}>
                <span className="matrix__state">
                  {ok ? (
                    <Tick colour="var(--ok)" />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                      <circle
                        cx="10"
                        cy="10"
                        r="9"
                        fill="none"
                        stroke="var(--attention)"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M10 5.5v5.2"
                        stroke="var(--attention)"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle cx="10" cy="14" r="1.2" fill="var(--attention)" />
                    </svg>
                  )}
                  {ok ? 'We can take this' : 'Not yet'}
                </span>
                <span className="matrix__name">{label}</span>
                <p>
                  {ok
                    ? 'No registration needed for this plan type.'
                    : 'Needs a registered provider. We are not one yet, and we say so on the first call.'}
                </p>
              </li>
            ))}
          </ul>

          <p style={{ marginTop: 20 }}>
            Not sure which yours is? <Link href="/#what">Check it in one click</Link> or ring{' '}
            <a href={business.phoneHref}>{business.phone}</a>.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
