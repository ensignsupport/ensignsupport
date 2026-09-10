import Link from 'next/link';
import Wave from './Wave';
import MeshBackdrop from './MeshBackdrop';
import PlanMap from './PlanMap';
import Icon from './Icon';
import QuickReferral from './QuickReferral';
import {
  business,
  registration,
  credentials,
  disclosures,
  testimonials,
  commitments,
  audience,
} from '@/lib/content';

/* ------------------------------------------------------------------ hero -- */

/**
 * The home hero.
 *
 * It used to be a headline, a three-line paragraph, two buttons and an
 * illustration: four things asking to be read before anything could be done.
 * Now the doing is in the hero itself. The panel is a three-field referral
 * form, the paragraph is one line, and the second button is gone because the
 * form is the action and a competing button only dilutes it.
 */
export function Hero({ title, sub, secondary, showStatus = false, showForm = false }) {
  return (
    <section className={'hero' + (showForm ? ' hero--form' : '')}>
      <MeshBackdrop />
      <div className="hero__veil" />
      {/* Three blocks, not two, so the phone number and the disclosure can sit
          beside the form on a desktop and below it on a phone. Ordered as one
          column, the form has to arrive before them: a reader on a 390px
          screen should not scroll past a paragraph to reach the thing the
          hero is for. */}
      <div className="shell hero__inner">
        <div className="hero__lead">
          <h1 className="hero__title" data-anim="hero">
            {title}
          </h1>
          <p className="hero__sub" data-anim="hero">
            {sub}
          </p>
        </div>

        {/* Deliberately NOT data-anim="hero".
            Everything else in this hero fades in on a stagger. The form does
            not, because it is the one thing on the page that has a job to do,
            and an entrance animation is a period during which it cannot do
            it. With three canvases (mesh, particles, plan map) competing for
            frames on a modest device, that period is not the 0.75s the tween
            asks for. It is painted, complete, at first paint; the text
            arrives around it. */}
        {showForm ? (
          <div className="hero__panel">
            <QuickReferral />
          </div>
        ) : null}

        {/* Static, like the form. The authored moment in this hero is the
            headline and its line of support arriving; the phone number is a
            route out for someone who will not use the form, and the
            registration line is a disclosure. A disclosure that has not
            painted yet is not a disclosure, so neither waits on a tween. */}
        <div className="hero__tail">
          <div className="hero__aside">
            <a className="hero__call" href={business.phoneHref}>
              <Icon name="phone" size={20} />
              {business.phone}
            </a>
            <span className="hero__callNote">{business.hoursLong}</span>
          </div>

          {secondary ? (
            <div className="hero__actions">
              <Link className="btn btn--onbandGhost" href={secondary.href}>
                {secondary.label}
              </Link>
            </div>
          ) : null}

          {showStatus ? <p className="hero__status">{registration.line}</p> : null}
        </div>
      </div>
      <Wave position="bottom" />
    </section>
  );
}

/* -------------------------------------------------------------- plan band -- */

/**
 * The plan map, moved out of the hero and given a section of its own.
 *
 * In the hero it was a 380px panel competing with a headline. Here it is the
 * larger half of a dark band, with a legend that turns it from decoration
 * into something readable: this is what the job actually is.
 */
export function PlanBand() {
  return (
    <section className="planband">
      <Wave position="top" />
      <div className="shell planband__inner" data-anim="reveal">
        <div>
          <h2>This is the job, drawn.</h2>
          <p>
            Every dot is a provider, a booking or an agreement that has to exist, be paid for
            correctly, and still be there next month. Coordination is holding the whole picture so
            you do not have to.
          </p>
          <ul className="planband__legend">
            <li>
              <span className="planband__key planband__key--hub" />
              <span>
                <b>You, at the centre.</b> Not a case number moving through a queue.
              </span>
            </li>
            <li>
              <span className="planband__key planband__key--held" />
              <span>
                <b>Running.</b> Provider found, agreement signed, booking held.
              </span>
            </li>
            <li>
              <span className="planband__key planband__key--chasing" />
              <span>
                <b>Being chased.</b> The ones that fell through. This is most of the work.
              </span>
            </li>
          </ul>
        </div>

        <div className="planband__canvas">
          <PlanMap />
        </div>
      </div>
      <Wave position="bottom" />
    </section>
  );
}

/* ---------------------------------------------------------------- process -- */

/**
 * What happens after you get in touch.
 *
 * Was four paragraphs in a row with nothing joining them, which asked the
 * reader to work out for themselves that it was a sequence. Now it is one
 * rail with four numbered stops, and the numbers earn their place because the
 * order is the information.
 */
export function ProcessFlow({ steps }) {
  return (
    <ol className="flow" data-anim="stagger">
      {steps.map((s, i) => (
        <li className={'flow__step' + (i === 0 ? ' flow__step--now' : '')} key={s.title}>
          <span className="flow__dot" aria-hidden="true">
            {i + 1}
          </span>
          <span className="flow__when">{s.when}</span>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

/* --------------------------------------------------------------- converge -- */

/**
 * Who refers, and the one thing they all have in common.
 *
 * The list of referral sources was a tick list under a paragraph. The point
 * of the list is not the five entries, it is that all five arrive at the same
 * coordinator, so the diagram says that and the paragraph can go.
 */
export function Converge() {
  return (
    <div className="converge" data-anim="reveal">
      <ul className="converge__sources">
        {audience.worksWith.map((w) => (
          <li key={w.label}>
            <span className="ico ico--sm">
              <Icon name={w.icon} size={18} />
            </span>
            <span className="converge__label">{w.label}</span>
            {/* the run from this source to the spine. Decorative: the
                relationship it draws is stated by the hub's own text. */}
            <span className="converge__line" aria-hidden="true" />
          </li>
        ))}
      </ul>

      <div className="converge__spine" aria-hidden="true" />

      <div className="converge__hub">
        <span className="ico">
          <Icon name="coordinator" size={21} />
        </span>
        <b>One coordinator</b>
        <span>Reads the plan, answers the phone, does the work.</span>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- page header -- */

export function PageHead({ title, lede, action, panel, align = 'split', below }) {
  return (
    <section className={`hero hero--page hero--${align}`}>
      <MeshBackdrop />
      <div className="hero__veil" />
      <div
        className={`shell ${panel ? 'hero__inner' : ''}`}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <div>
          <h1 className="hero__title" data-anim="hero" style={{ maxWidth: '18ch' }}>
            {title}
          </h1>
          {lede ? (
            <p className="hero__sub" data-anim="hero">
              {lede}
            </p>
          ) : null}
          {action ? (
            <div className="hero__actions" data-anim="hero">
              <Link className="btn btn--onband" href={action.href}>
                {action.label}
              </Link>
            </div>
          ) : null}
        </div>

        {panel ? (
          <div className="planpanel" data-anim="hero">
            {panel}
          </div>
        ) : null}
      </div>

      {below ? (
        <div className="shell" style={{ position: 'relative', zIndex: 2, marginTop: 40 }}>
          {below}
        </div>
      ) : null}

      <Wave position="bottom" />
    </section>
  );
}

/* ---- four different hero devices, one per page's actual job ---- */

/** About: a horizontal strip under a centred statement. */
export function FactStrip({ items }) {
  return (
    <ul className="factstrip" data-anim="hero">
      {items.map(([term, value]) => (
        <li key={term}>
          <span className="factstrip__v">{value}</span>
          <span className="factstrip__k">{term}</span>
        </li>
      ))}
    </ul>
  );
}

/** Services: the choice itself, made in the hero. */
export function ServiceTiles({ items }) {
  return (
    <div className="svctiles" data-anim="hero">
      {items.map((s) => (
        <a className="svctile" href={`#${s.slug}`} key={s.slug}>
          <span className="svctile__ico">
            <Icon name={s.icon} size={20} />
          </span>
          <span className="svctile__name">{s.name}</span>
          <span className="svctile__line">{s.summary}</span>
        </a>
      ))}
    </div>
  );
}

/** Referral: a preview of the form, so nothing about it is a surprise. */
export function StepPreview({ steps: list }) {
  return (
    <>
      <div className="planpanel__head">
        <span className="planpanel__cap">What the form asks</span>
        <span className="planpanel__cap planpanel__cap--note">3 minutes</span>
      </div>
      <ol className="steppreview">
        {list.map((st, i) => (
          <li key={st.title}>
            <span className="steppreview__n">{i + 1}</span>
            <span>
              <strong>{st.title}</strong>
              <span>{st.detail}</span>
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}

/** Contact: the phone number is the page, so it is the hero. */
export function Dial({ phone, href, hours }) {
  return (
    <div className="dial" data-anim="hero">
      <a className="dial__num" href={href}>
        {phone}
      </a>
      <span className="dial__hours">{hours}</span>
    </div>
  );
}

/**
 * The facts panel that sits beside a page title, in the same glass as the home
 * hero's plan map. Gives every page head something to look at and something to
 * take away, instead of a headline floating on a gradient.
 */
export function HeadFacts({ caption, note, items }) {
  return (
    <>
      <div className="planpanel__head">
        <span className="planpanel__cap">{caption}</span>
        {note ? <span className="planpanel__cap planpanel__cap--note">{note}</span> : null}
      </div>
      <dl className="headfacts">
        {items.map(([term, value]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

/* -------------------------------------------------------------- timeline -- */

export function Timeline({ items }) {
  return (
    <ol className="timeline" data-anim="stagger">
      {items.map((it) => (
        <li className={`tl${it.now ? ' tl--now' : ''}`} key={it.title}>
          <span className="tl__dot">
            <Icon name={it.icon} size={17} />
          </span>
          <span className="tl__when">{it.when}</span>
          <h3>{it.title}</h3>
          <p>{it.body}</p>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------ tick icon -- */

export function Tick({ colour = 'var(--accent)' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r="9" fill="none" stroke={colour} strokeWidth="1.6" />
      <path
        d="M6 10.4l2.6 2.6L14.2 7"
        fill="none"
        stroke={colour}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------------------------------------------------------- credentials -- */

/**
 * A register, not a badge rack.
 *
 * The gap is listed in the same table, at the same size, as the things Ensign
 * holds. A list of only good news reads like every other provider's list; the
 * missing row is the only thing that makes the other six believable.
 */
export function CredentialsStrip({ heading = 'Screening and cover, all current' }) {
  return (
    <section className="section section--tight">
      <div className="shell stack" data-anim="reveal">
        <h2 className="h2">{heading}</h2>
        <ul className="register">
          {credentials.map((c) => (
            <li key={c.label} data-held="true">
              <span className="register__mark">
                <Icon name="check" size={16} />
              </span>
              <span className="register__label">{c.label}</span>
              <span className="register__state">Held</span>
            </li>
          ))}
          {disclosures.map((d) => (
            <li key={d.label} data-held="false">
              <span className="register__mark" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" focusable="false">
                  <path
                    d="M4 8h8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
              <span className="register__label">{d.label}</span>
              <span className="register__state">{d.state}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- testimonials -- */

/**
 * Renders only when there is a real, consented quote in lib/content.js.
 * Today that array is empty, so this returns null and the section does not
 * exist. See the note above `testimonials` for why.
 */
export function Testimonials() {
  if (!testimonials.length) return null;

  return (
    <section className="section">
      <div className="shell stack" data-anim="reveal">
        <h2 className="h2">What referrers say</h2>
        <div className="quotes">
          {testimonials.map((t) => (
            <figure className="quote" key={t.name}>
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                {t.name}
                {t.role ? `, ${t.role}` : ''}
                {t.place ? `, ${t.place}` : ''}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- commitments -- */

/**
 * What sits where the testimonials would. Ensign is pre-launch, so there is no
 * social proof to show. Every line here is the client's own stated value,
 * made specific enough to be held to.
 */
export function Commitments() {
  return (
    <section className="section">
      <div className="shell stack" data-anim="reveal">
        <h2 className="h2">No reviews yet. Hold us to these instead.</h2>
        <p className="lede">
          First participants from {business.launch}, so there is nobody to quote. Four promises
          with a way to check each one.
        </p>

        {/* A ledger rather than four cards: the promise on the left, the thing
            you can actually hold Ensign to on the right. Same words, but the
            reader can now scan one column and stop. */}
        <div className="ledger" data-anim="stagger">
          {commitments.map((c) => (
            <div className="ledger__row" key={c.title}>
              <span className="ledger__name">
                <span className="ico ico--sm">
                  <Icon name={c.icon} size={18} />
                </span>
                {c.title}
              </span>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- band -- */

export function CtaBand({
  title = 'Send us a referral.',
  body = 'Attach the plan and any reports. If an upload stalls, send the form anyway and email the rest. We would rather have the referral than the paperwork.',
  action = { href: '/referral', label: 'Start a referral' },
}) {
  return (
    <section className="band">
      <Wave position="top" />
      <div className="shell band__inner" data-anim="reveal">
        <div>
          <h2>{title}</h2>
          <p>{body}</p>
          <p style={{ marginTop: 10 }}>
            Or call{' '}
            <a href={business.phoneHref} style={{ color: 'var(--accent-band)' }}>
              {business.phone}
            </a>
            , {business.hoursLong}.
          </p>
        </div>
        <div>
          <Link className="btn btn--onband" href={action.href}>
            {action.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
