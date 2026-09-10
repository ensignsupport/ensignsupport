import Image from 'next/image';
import { PageHead, StepPreview, Timeline } from '@/components/Sections';
import ReferralForm from '@/components/ReferralForm';
import Icon from '@/components/Icon';
import { business, upload, steps } from '@/lib/content';

export const metadata = {
  title: 'Refer a participant',
  description: `Send a referral to Ensign Support Coordination. Three short steps, an upload field for the plan and reports, and a call back ${business.responseTime}.`,
};

export default function ReferralPage() {
  return (
    <>
      <PageHead
        title="Refer a participant"
        lede={`Three short steps. We read every referral the day it arrives and call you back ${business.responseTime}.`}
        panel={
          <StepPreview
            steps={[
              { title: 'About you', detail: 'Your name and a phone number or email' },
              {
                title: 'About the participant',
                detail: 'Their name, plan dates, and which service you are after',
              },
              {
                title: 'Documents and notes',
                detail: `Optional uploads. ${upload.acceptLabel}, up to ${upload.maxMb}MB each`,
              },
            ]}
          />
        }
      />

      {/* The form is the page. The rail beside it answers the questions people
          hesitate over mid-form, so they do not have to leave to find them. */}
      <section className="section">
        <div className="shell">
          <div className="railed">
            <div data-anim="reveal">
              <ReferralForm />
            </div>

            <aside className="rail" data-anim="reveal">
              <div className="check">
                <div className="check__body">
                  <h3>Rather not use a form?</h3>
                  <div className="check__answer" style={{ borderTop: 0, paddingTop: 0 }}>
                    <p>
                      Completely fine, and it will not slow anything down. We will fill in the gaps
                      on the phone.
                    </p>
                    <a className="btn btn--onband" href={business.phoneHref}>
                      Call {business.phone}
                    </a>
                    <p style={{ fontSize: '1rem' }}>
                      {business.hoursLong}, or email{' '}
                      <a href={`mailto:${business.email}`} style={{ color: 'var(--accent-band)' }}>
                        {business.email}
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>

              <div className="notice">
                <h3>Referring yourself?</h3>
                <p>
                  Put your own details in as the referrer and leave the organisation field blank.
                  The form works the same either way.
                </p>
              </div>

              <div className="notice">
                <h3>If an upload stalls</h3>
                <p>
                  Send the form anyway and email the documents afterwards. We would rather have the
                  referral than the paperwork.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell" data-anim="reveal">
          <div className="photoband" style={{ alignItems: 'start' }}>
            <div className="stack">
              <h2 className="h2">What happens after you send it</h2>
              <Timeline
            items={steps.map((s, i) => ({
              icon: s.icon,
              when: s.needsResponseTime ? business.responseTime : s.when,
              title: s.title,
              body: s.body,
              now: i === 0,
            }))}
              />
            </div>

            {/* No faces: the safety valve the design brief recommends for a
                page that is otherwise all paperwork. */}
            <figure className="photoband__media" style={{ order: 2 }}>
              <Image
                src="/photos/plan-desk.jpg"
                alt="An open notebook, reading glasses and a pen on a desk in daylight."
                width={1600}
                height={1068}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
              <figcaption>
                We read the plan and the reports before we ring. Photograph by Emmanuel Ikwuegbu.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
    </>
  );
}
