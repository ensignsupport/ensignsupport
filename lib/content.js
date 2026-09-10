/**
 * Every piece of site copy and every business fact lives here.
 * Edit this file to change the site's words. Nothing else needs touching.
 *
 * Anything marked TODO is a detail the discovery questionnaire did not answer.
 * Search this file for "TODO" before launch.
 */

export const business = {
  name: 'Ensign Support Coordination',
  shortName: 'Ensign',
  // TODO: client to supply. Placeholders below are clearly fake so they cannot ship unnoticed.
  phone: '07 0000 0000',
  phoneHref: 'tel:+61700000000',
  email: 'hello@example.com.au',
  abn: 'ABN to be confirmed',
  hours: '7am to 7pm',
  /* TODO: CLIENT TO CONFIRM. The questionnaire never states a response time.
     "within one business day" was written by us as demo copy and is a service
     promise the business has not made. Either confirm it, change it, or set it
     to null and the site stops claiming it. */
  responseTime: 'within one business day',
  hoursLong: '7am to 7pm, seven days',
  launch: 'September 2026',
  coverage: 'South East Queensland',
};

/**
 * Registration wording.
 *
 * The client asked for "Registration coming soon". That phrasing implies a date
 * the business cannot commit to, and it has to be corrected every time the date
 * moves. "Working towards registration" says the same thing, stays true
 * indefinitely, and cannot be read as a promise. Raised with the client.
 */
export const registration = {
  line: 'Ensign is an unregistered NDIS provider, working towards registration. We support self-managed and plan-managed participants.',
  short: 'Unregistered, working towards registration',
  explainer:
    'Support coordination and psychosocial recovery coaching can both be delivered without NDIS registration, provided the participant is self-managed or plan-managed. If your plan is NDIA-managed, you will need a registered provider, and we will tell you that on the first call rather than after the paperwork.',
};

export const services = [
  {
    slug: 'support-coordination',
    icon: 'network',
    name: 'Support coordination',
    summary:
      'We help you understand what is in your plan, find providers who suit you, get the supports running, and keep them running.',
    body: [
      'A plan is a budget and a set of goals. Turning it into actual supports means finding providers with real availability, working out what they charge against what you have, setting up service agreements, and staying on it when something falls through.',
      'That is the job. You should not have to be the switchboard for your own supports, and you should not have to explain your situation again every time you ring.',
    ],
    facts: [
      ['Who it suits', 'Anyone whose plan includes support coordination funding'],
      ['Plan types', 'Self-managed and plan-managed'],
      ['Where', 'In your home or in the community, across South East Queensland'],
      ['Reporting', 'Written progress summary before each plan review'],
    ],
    firstMonth: [
      'We read your plan and any reports before the first visit.',
      'We meet at your place, or wherever you are comfortable, and work out what matters first.',
      'We approach providers, check real availability, and bring you options rather than a directory.',
      'Agreements get signed, bookings get made, and you get a written summary of where everything sits.',
    ],
  },
  {
    slug: 'recovery-coaching',
    icon: 'compass',
    name: 'Psychosocial recovery coaching',
    summary:
      'Longer-horizon work for people living with a psychosocial disability, built around what you want your life to look like.',
    body: [
      'Recovery coaching starts from where you want to be, not from a list of services. We build a picture of the next twelve months together, then work backwards into the supports and the steps that get you there.',
      'It is designed to move at your pace, including through the periods when things are harder and the plan needs to change.',
    ],
    facts: [
      ['Who it suits', 'Participants with psychosocial recovery coaching in their plan'],
      ['Rhythm', 'Regular sessions, adjusted to how you are going'],
      ['Where', 'Your home, somewhere in the community, or by phone'],
      ['Focus', 'Building capacity and independence, not managing compliance'],
    ],
    firstMonth: [
      'We spend the early sessions on what you want, not on forms.',
      'We map the supports you already have and the ones that are missing.',
      'We agree on a small number of things to work on first.',
      'We revisit the picture regularly, because it is meant to change.',
    ],
  },
];

/** Screening the client holds and can display. Professional indemnity is NOT held. */
export const credentials = [
  { label: 'NDIS Worker Screening Check', icon: 'idCard' },
  { label: 'Blue Card', icon: 'badgeCheck' },
  { label: 'Police Check', icon: 'shield' },
  { label: 'Mental Health First Aid', icon: 'brain' },
  { label: 'First Aid and CPR', icon: 'firstAid' },
  { label: 'Public liability insurance', icon: 'coverShield' },
];

/**
 * What Ensign does NOT hold, listed in the same register as what it does.
 *
 * This was previously a grey sentence under the credential chips, which is
 * where a reader's eye goes last. A list of only the good news is worth
 * nothing precisely because every provider's list looks like that; the gap is
 * the only part of the register that proves the rest of it is complete. So it
 * is rendered as a row, at the same size, with an explicit state.
 */
export const disclosures = [
  {
    label: 'Professional indemnity insurance',
    icon: 'coverShield',
    state: 'Not held',
    held: false,
  },
];

/**
 * TESTIMONIALS. Intentionally empty.
 *
 * Ensign is pre-launch and takes its first participants from September 2026, so
 * there are no clients and therefore no quotes. The questionnaire left the
 * testimonials question blank.
 *
 * The design comp showed a quote from "Marisol Trang, occupational therapist".
 * That person does not exist. It was placeholder copy for the visual, and
 * shipping it would be a fabricated endorsement: misleading conduct under
 * Australian Consumer Law, and a Code of Conduct problem for a provider selling
 * honesty as its differentiator.
 *
 * The section is built and wired. Add a real, consented quote here and it
 * appears. Until then it renders nothing.
 *
 *   { quote: '...', name: '...', role: '...', place: '...' }
 */
export const testimonials = [];

/**
 * What stands in for social proof until there is some. Every line below is the
 * client's own stated value from the questionnaire, made specific.
 */
export const commitments = [
  {
    icon: 'clock',
    title: 'Honest hours',
    body: 'We bill the time we actually worked on your plan, not a rounded-up block.',
  },
  {
    icon: 'planManager',
    title: 'Honest invoicing',
    body: 'Plan managers get invoices that match those hours, itemised, every time.',
  },
  {
    icon: 'idCard',
    title: 'Honest reporting',
    body: 'What goes to the NDIA is what actually happened, including when something did not work.',
  },
  {
    icon: 'coordinator',
    title: 'A straight answer first',
    body: 'If we are the wrong service for you, we say so on the first call rather than after the paperwork.',
  },
];

export const values = [
  {
    name: 'Compassion',
    body: 'Genuine care for participants and their families, rather than service delivery at arm’s length.',
  },
  {
    name: 'Integrity',
    body: 'Honest hours, honest invoicing to plan managers, and honest reporting to the NDIA. You get told what actually happened.',
  },
  {
    name: 'Advocacy',
    body: 'Actively representing participants’ interests inside the NDIS, particularly for the people the system tends to overlook.',
  },
];

export const steps = [
  {
    icon: 'send',
    when: 'Same day',
    title: 'Your referral reaches a person',
    body: 'You get a reference number and the name of the person handling it, not an automated receipt.',
  },
  {
    icon: 'call',
    when: 'Next',
    title: 'We call you back',
    body: 'A real conversation about capacity and fit, including whether we are the wrong service for this participant.',
    needsResponseTime: true,
  },
  {
    icon: 'visit',
    when: 'First week',
    title: 'We meet, wherever suits you',
    body: 'We read the plan and the reports beforehand, so the first hour is not spent on paperwork.',
  },
  {
    icon: 'ongoing',
    when: 'Ongoing',
    title: 'Supports go live and stay live',
    body: 'Providers approached, agreements signed, and someone chasing the gaps when a service falls through.',
  },
];

export const audience = {
  intro:
    'We work with participants of all ages and all disability types, and we take referrals from anyone.',
  worksWith: [
    { label: 'Participants and families referring themselves', icon: 'family' },
    { label: 'Support coordinators and Local Area Coordinators', icon: 'coordinator' },
    { label: 'Plan managers', icon: 'planManager' },
    { label: 'Hospitals, GPs and allied health', icon: 'clinical' },
    { label: 'Other providers', icon: 'provider' },
  ],
  planTypes: [
    ['Self-managed', true],
    ['Plan-managed', true],
    ['NDIA-managed', false],
  ],
  cald: 'Trained to work with culturally and linguistically diverse communities. Interpreters can be arranged when you need one.',
};

export const coverage = {
  now: 'South East Queensland, in person. If we take a referral, someone comes to you.',
  next: 'Remote and telehealth delivery Australia-wide is the planned next phase after the South East Queensland launch.',
};

/** Referral form: the exact field list the client specified. */
export const referralFields = {
  referrer: [
    { name: 'referrerName', label: 'Your name', type: 'text', required: true, autoComplete: 'name' },
    { name: 'referrerPhone', label: 'Phone', type: 'tel', required: false, autoComplete: 'tel' },
    { name: 'referrerEmail', label: 'Email', type: 'email', required: false, autoComplete: 'email' },
    { name: 'referrerRole', label: 'Your position or role', type: 'text', required: false, help: 'If you are referring yourself or a family member, put that here.' },
    { name: 'referrerOrg', label: 'Organisation', type: 'text', required: false, help: 'Leave blank if you are not referring on behalf of an organisation.' },
  ],
  participant: [
    { name: 'participantName', label: 'Participant name', type: 'text', required: true },
    { name: 'participantDob', label: 'Date of birth', type: 'date', required: false },
    { name: 'planStart', label: 'Plan start date', type: 'date', required: false },
    { name: 'planEnd', label: 'Plan end date', type: 'date', required: false },
  ],
  serviceOptions: [
    { value: 'support-coordination', label: 'Support coordination' },
    { value: 'recovery-coaching', label: 'Psychosocial recovery coaching' },
    { value: 'unsure', label: 'Not sure yet' },
  ],
  planManagementOptions: [
    { value: 'self-managed', label: 'Self-managed' },
    { value: 'plan-managed', label: 'Plan-managed' },
    { value: 'ndia-managed', label: 'NDIA-managed' },
  ],
};

export const upload = {
  accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png,.heic',
  acceptLabel: 'PDF, Word, JPG, PNG or HEIC',
  maxMb: 25,
  examples: 'NDIS plan, functional capacity report, allied health or OT reports',
};

/**
 * TODO: LEGAL REVIEW REQUIRED BEFORE LAUNCH.
 * This form collects health information about a third party who is not present.
 * The collection notice and consent wording below are placeholders and must be
 * replaced with wording from someone qualified in Australian privacy law.
 * Storage location, retention period and destruction method also need answering.
 */
export const consent = {
  notice:
    'PLACEHOLDER, PENDING LEGAL REVIEW. We collect this information so we can respond to your referral and, if we take it on, deliver supports to the participant. It may include health information. We do not share it outside Ensign without the participant’s consent, except where the law requires it.',
  checkbox:
    'I have the participant’s consent to share this information with Ensign Support Coordination.',
};

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
];
