import Link from 'next/link';
import {
  Hero,
  PlanBand,
  ProcessFlow,
  Converge,
  CredentialsStrip,
  CtaBand,
  Testimonials,
  Commitments,
} from '@/components/Sections';
import EligibilityCheck from '@/components/EligibilityCheck';
import Icon from '@/components/Icon';
import { business, services, steps, audience, coverage, registration } from '@/lib/content';

export default function HomePage() {
  return (
    <>
      {/* The hero does the work now instead of describing it. Three fields,
          one phone number, and the referral is started before the reader has
          scrolled anything. The three route cards that used to sit below are
          gone: the form's first question ("who is this for?") and the phone
          number beside it already answer what those cards were asking. */}
      <Hero
        title={
          <>
            Someone who reads the <em>whole plan</em>.
          </>
        }
        sub={`Support coordination and psychosocial recovery coaching across ${business.coverage}.`}
        secondary={{ href: '/services', label: 'See what we do' }}
        showStatus
        showForm
      />

      {/* The plan map, with room to be read rather than squinted at. */}
      <PlanBand />

      {/* What we do, as the bento from the approved design. Five cells for five
          things, so nothing sits in an empty tile. */}
      <section className="section">
        <div className="shell stack" data-anim="reveal">
          <h2 className="h2">Two services, both delivered in person.</h2>
          <p className="lede">
            Short list, done properly. Both open to self-managed and plan-managed participants.
          </p>

          <div className="bento" data-anim="stagger" style={{ marginTop: 20 }}>
            <div className="cell cell--wide">
              <span className="ico ico--sm">
                <Icon name={services[0].icon} size={18} />
              </span>
              <h3>{services[0].name}</h3>
              <p>{services[0].summary}</p>
              <ul className="chips">
                <li className="chip">Self-managed</li>
                <li className="chip">Plan-managed</li>
                <li className="chip">Home visits</li>
                <li className="chip">Written reporting</li>
              </ul>
              <Link className="card__link" href="/services">
                How it works
              </Link>
              <div className="cell__reveal">
                <h3>Support coordination</h3>
                <div className="cell__reveal__foot">
                  <p>
                    Delivered face to face, in your home or in the community, right across South
                    East Queensland.
                  </p>
                  <Link className="btn btn--onband" href="/services">
                    See the detail
                  </Link>
                </div>
              </div>
            </div>

            {/* The one true differentiator the questionnaire actually gives us:
                this is a solo practice. Stated as a fact, not a growth metric. */}
            <div className="cell cell--accent">
              <span className="big">1</span>
              <h3 style={{ fontSize: '1.1875rem' }}>One coordinator</h3>
              <p>
                The person who reads your plan answers the phone. No handovers, no queue, no
                explaining it twice.
              </p>
              <div className="cell__reveal">
                <h3>One coordinator</h3>
                <div className="cell__reveal__foot">
                  <p>Referrals are answered {business.responseTime}, seven days a week.</p>
                  <Link className="btn btn--onband" href="/referral">
                    Refer a participant
                  </Link>
                </div>
              </div>
            </div>

            <div className="cell cell--half">
              <span className="ico ico--sm">
                <Icon name={services[1].icon} size={18} />
              </span>
              <h3>{services[1].name}</h3>
              <p>{services[1].summary}</p>
              <Link className="card__link" href="/services">
                How it works
              </Link>
              <div className="cell__reveal">
                <h3>Recovery coaching</h3>
                <div className="cell__reveal__foot">
                  <p>
                    Sessions run at your pace: at home, somewhere in the community, or by phone on
                    the harder weeks.
                  </p>
                  <Link className="btn btn--onband" href="/services">
                    See the detail
                  </Link>
                </div>
              </div>
            </div>

            <div className="cell cell--half">
              <h3 style={{ fontSize: '1.1875rem' }}>What we stay on top of</h3>
              <p style={{ fontSize: '1rem' }}>An example, not a real participant.</p>
              <div className="track">
                <div className="trk">
                  <span style={{ flex: 1 }}>
                    <span className="nm">Occupational therapy</span>
                    <span className="bar">
                      <i style={{ width: '82%' }} />
                    </span>
                  </span>
                  <span className="st">Booked</span>
                </div>
                <div className="trk">
                  <span style={{ flex: 1 }}>
                    <span className="nm">Support worker roster</span>
                    <span className="bar">
                      <i style={{ width: '64%' }} />
                    </span>
                  </span>
                  <span className="st">Booked</span>
                </div>
                <div className="trk">
                  <span style={{ flex: 1 }}>
                    <span className="nm">Assistive technology</span>
                    <span className="bar">
                      <i style={{ width: '35%' }} />
                    </span>
                  </span>
                  <span className="st st--waiting">Chasing</span>
                </div>
              </div>
              <div className="cell__reveal">
                <h3>What we stay on top of</h3>
                <div className="cell__reveal__foot">
                  <p>
                    Providers approached, agreements signed, bookings held, and the gaps chased when
                    something falls through.
                  </p>
                  <Link className="btn btn--onband" href="/referral">
                    Refer a participant
                  </Link>
                </div>
              </div>
            </div>

            <div className="cell cell--half">
              <span className="ico ico--sm">
                <Icon name="map" size={18} />
              </span>
              <h3>Where we go</h3>
              <p>{coverage.now}</p>
              <ul className="chips">
                <li className="chip">Seven days</li>
                <li className="chip">{business.hours}</li>
              </ul>
              <div className="cell__reveal">
                <h3>Where we go</h3>
                <div className="cell__reveal__foot">
                  <p>Brisbane, Logan, Redlands, Ipswich, and the Gold Coast down to Coolangatta.</p>
                  <Link className="btn btn--onband" href="/contact">
                    Check your area
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who refers. The diagram needs the full shell to read, so it gets its
          own row rather than being squeezed into half a two-column grid. */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell stack" data-anim="reveal">
          <h2 className="h2">Anyone can refer. It reaches the same person.</h2>
          <p className="lede">{audience.intro}</p>
          <Converge />
          <p style={{ marginTop: 20, fontSize: '1rem', color: 'var(--text-dim)' }}>
            {audience.cald}
          </p>
        </div>
      </section>

      {/* The other question every reader has, answered in one click including
          when the answer is no. */}
      <section className="section" style={{ paddingTop: 0 }} id="what">
        <div className="shell" data-anim="reveal">
          <div className="who">
            <div className="stack">
              <h2 className="h2">Can we take your plan?</h2>
              <p className="lede">
                How your plan is managed decides it, not what your disability is. Pick yours and
                you have the answer.
              </p>
              <p>{registration.explainer}</p>
            </div>

            <EligibilityCheck />
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell stack" data-anim="reveal">
          <h2 className="h2">What happens after you get in touch.</h2>
          <ProcessFlow
            steps={steps.map((s) => ({
              when: s.needsResponseTime ? business.responseTime : s.when,
              title: s.title,
              body: s.body,
            }))}
          />
        </div>
      </section>

      <Testimonials />

      <Commitments />

      <CredentialsStrip />

      <CtaBand />
    </>
  );
}
