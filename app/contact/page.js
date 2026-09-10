import Link from 'next/link';
import { PageHead, Dial } from '@/components/Sections';
import EnquiryForm from '@/components/EnquiryForm';
import Icon from '@/components/Icon';
import { business, coverage } from '@/lib/content';

export const metadata = {
  title: 'Contact',
  description: `Call ${business.name} on ${business.phone}, ${business.hoursLong}, or send a short enquiry.`,
};

export default function ContactPage() {
  return (
    <>
      {/* No panel. The phone number is the entire point of this page, so it
          is the largest thing on it. */}
      <PageHead
        title="Get in touch"
        lede="The fastest way to reach us, answered by the person who would be doing the work."
        below={
          <Dial
            phone={business.phone}
            href={business.phoneHref}
            hours={`${business.hoursLong}. Or email ${business.email}.`}
          />
        }
      />

      {/* Three doors again, matching the home page, because the right route
          genuinely differs by who is asking. */}
      <section className="section">
        <div className="shell stack" data-anim="reveal">
          <h2 className="h2">Pick whichever suits you.</h2>
          <p className="lede">
            All three reach the same person. The difference is only how much you have to type.
          </p>

          <div className="cards" data-anim="fold" style={{ marginTop: 20 }}>
            <article className="card">
              <div className="card__head">
                <span className="card__tag">Fastest</span>
              </div>
              <div className="card__body">
                <span className="ico ico--sm">
                  <Icon name="phone" size={18} />
                </span>
                <h3>Call us</h3>
                <p>
                  {business.hoursLong}. You will get a person who can answer, not a queue and not a
                  script.
                </p>
                <a className="card__link" href={business.phoneHref}>
                  {business.phone}
                </a>
              </div>
            </article>

            <article className="card">
              <div className="card__head">
                <span className="card__tag">Referring someone</span>
              </div>
              <div className="card__body">
                <span className="ico ico--sm">
                  <Icon name="send" size={18} />
                </span>
                <h3>Use the referral form</h3>
                <p>
                  It collects the plan details and reports in one go, so we are not going back and
                  forth by email.
                </p>
                <Link className="card__link" href="/referral">
                  Refer a participant
                </Link>
              </div>
            </article>

            <article className="card">
              <div className="card__head">
                <span className="card__tag">Just a question</span>
              </div>
              <div className="card__body">
                <span className="ico ico--sm">
                  <Icon name="mail" size={18} />
                </span>
                <h3>Send a short enquiry</h3>
                <p>Three fields. Ask anything, including whether we are the wrong service.</p>
                <a className="card__link" href="#enquiry">
                  Below on this page
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} id="enquiry">
        <div className="shell" data-anim="reveal">
          <div className="railed">
            <div className="stack">
              <h2 className="h2">Send a short enquiry</h2>
              <p className="lede">
                For a general question. If you are referring someone, the{' '}
                <Link href="/referral">referral form</Link> collects what we need in one go.
              </p>
              <EnquiryForm />
            </div>

            <aside className="rail">
              <div className="check">
                <div className="check__body">
                  <h3>Where we come to you</h3>
                  <div className="check__answer" style={{ borderTop: 0, paddingTop: 0 }}>
                    <p>{coverage.now}</p>
                    <p style={{ fontSize: '1rem' }}>{coverage.next}</p>
                  </div>
                </div>
              </div>

              <div className="notice">
                <h3>Prefer another language?</h3>
                <p>
                  Interpreters can be arranged. Say so when you call and we will organise it before
                  the first meeting.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
