'use client';

import { useState } from 'react';
import Link from 'next/link';
import { business } from '@/lib/content';

/**
 * The one question every reader of this page actually has: can you take me?
 *
 * The section's job, per the design direction, is to let someone rule
 * themselves in or out fast. A static warning box makes them do that work
 * themselves. This answers it in one click, and it answers "no" as plainly as
 * it answers "yes", because a wasted referral costs the reader more than a
 * blunt answer does.
 */

const OPTIONS = [
  {
    value: 'self',
    label: 'Self-managed',
    hint: 'You or a nominee pay providers directly.',
    eligible: true,
  },
  {
    value: 'plan',
    label: 'Plan-managed',
    hint: 'A plan manager pays the invoices for you.',
    eligible: true,
  },
  {
    value: 'ndia',
    label: 'NDIA-managed',
    hint: 'The NDIA pays providers directly.',
    eligible: false,
  },
  {
    value: 'unsure',
    label: 'I am not sure',
    hint: 'Your plan will say, and so will we.',
    eligible: null,
  },
];

export default function EligibilityCheck() {
  const [choice, setChoice] = useState(null);
  const selected = OPTIONS.find((o) => o.value === choice) || null;

  return (
    <div className="check">
      <div className="check__body">
        <h3>Can we work with your plan?</h3>

        <fieldset className="check__options">
          <legend className="sr-only">How is the plan managed?</legend>
          {OPTIONS.map((o) => (
            <label
              key={o.value}
              className={`check__opt${choice === o.value ? ' check__opt--on' : ''}`}
            >
              <input
                type="radio"
                name="planManagementCheck"
                value={o.value}
                checked={choice === o.value}
                onChange={() => setChoice(o.value)}
              />
              <span>
                <span className="check__optLabel">{o.label}</span>
                <span className="check__optHint">{o.hint}</span>
              </span>
            </label>
          ))}
        </fieldset>

        <div className="check__answer" role="status">
          {!selected ? (
            <p className="check__prompt">
              Choose one above and we will tell you straight away.
            </p>
          ) : selected.eligible === true ? (
            <>
              <p className="check__verdict check__verdict--yes">Yes. We can take this.</p>
              <p>
                Support coordination and psychosocial recovery coaching can both be delivered
                without NDIS registration for {selected.label.toLowerCase()} plans.
              </p>
              <Link className="btn btn--onband" href="/referral">
                Refer a participant
              </Link>
            </>
          ) : selected.eligible === false ? (
            <>
              <p className="check__verdict check__verdict--no">Not yet, and here is why.</p>
              <p>
                NDIA-managed plans have to use a registered provider. Ensign is unregistered and
                working towards registration, so we cannot bill your plan. Call us anyway and we
                will point you at someone who can help.
              </p>
              <a className="btn btn--onband" href={business.phoneHref}>
                Call {business.phone}
              </a>
            </>
          ) : (
            <>
              <p className="check__verdict">That is a common one.</p>
              <p>
                Your plan states it near the top, usually as self-managed, plan-managed or
                NDIA-managed. If you cannot find it, ring us and we will work it out together in
                about a minute.
              </p>
              <a className="btn btn--onband" href={business.phoneHref}>
                Call {business.phone}
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
