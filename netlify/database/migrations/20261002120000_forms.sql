-- Ensign Support Services: referrals, enquiries and the email outbox.
-- Fields are exactly the developer brief's. Never stored: NDIS number,
-- diagnosis, Medicare details or files.

CREATE SEQUENCE referral_ref_seq START 1001;
CREATE SEQUENCE enquiry_ref_seq START 1001;

CREATE TABLE referrals (
  id                            BIGSERIAL PRIMARY KEY,
  ref                           TEXT NOT NULL UNIQUE DEFAULT ('R-' || nextval('referral_ref_seq')),
  -- Made by the browser once per form, so a retried save never stores a referral twice.
  submission_id                 UUID NOT NULL UNIQUE,
  created_at                    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                    TIMESTAMPTZ NOT NULL DEFAULT now(),
  status                        TEXT NOT NULL DEFAULT 'new'
                                CHECK (status IN ('new', 'contacted', 'in_progress', 'accepted', 'closed')),

  referrer_type                 TEXT NOT NULL CHECK (referrer_type IN ('participant', 'family', 'professional')),
  referrer_name                 TEXT NOT NULL CHECK (char_length(referrer_name) BETWEEN 1 AND 120),
  referrer_org_role             TEXT CHECK (referrer_org_role IS NULL OR char_length(referrer_org_role) <= 160),
  referrer_phone                TEXT NOT NULL CHECK (char_length(referrer_phone) BETWEEN 8 AND 20),
  referrer_email                TEXT NOT NULL CHECK (char_length(referrer_email) BETWEEN 3 AND 254),

  participant_name              TEXT NOT NULL CHECK (char_length(participant_name) BETWEEN 1 AND 120),
  participant_preferred_contact TEXT CHECK (participant_preferred_contact IS NULL OR char_length(participant_preferred_contact) <= 200),
  participant_phone             TEXT NOT NULL CHECK (char_length(participant_phone) BETWEEN 8 AND 20),
  participant_email             TEXT NOT NULL CHECK (char_length(participant_email) BETWEEN 3 AND 254),
  participant_suburb            TEXT NOT NULL CHECK (char_length(participant_suburb) BETWEEN 4 AND 80),

  plan_type                     TEXT NOT NULL CHECK (plan_type IN ('self_managed', 'plan_managed')),
  service                       TEXT NOT NULL CHECK (service IN ('support_coordination', 'recovery_coaching', 'both')),
  reason                        TEXT NOT NULL CHECK (char_length(reason) BETWEEN 1 AND 1000),
  consent                       BOOLEAN NOT NULL CHECK (consent = true),
  consent_at                    TIMESTAMPTZ NOT NULL,
  heard_via                     TEXT CHECK (heard_via IS NULL OR char_length(heard_via) <= 60)
);

CREATE INDEX referrals_created_at_idx ON referrals (created_at DESC);
CREATE INDEX referrals_status_idx ON referrals (status);

CREATE TABLE referral_notes (
  id           BIGSERIAL PRIMARY KEY,
  referral_id  BIGINT NOT NULL REFERENCES referrals (id),
  body         TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 4000),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX referral_notes_referral_idx ON referral_notes (referral_id, created_at);

CREATE TABLE referral_status_history (
  id           BIGSERIAL PRIMARY KEY,
  referral_id  BIGINT NOT NULL REFERENCES referrals (id),
  from_status  TEXT,
  to_status    TEXT NOT NULL,
  changed_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX referral_status_history_referral_idx ON referral_status_history (referral_id, changed_at);

CREATE TABLE enquiries (
  id          BIGSERIAL PRIMARY KEY,
  ref         TEXT NOT NULL UNIQUE DEFAULT ('E-' || nextval('enquiry_ref_seq')),
  submission_id UUID NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at     TIMESTAMPTZ,
  status      TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'replied', 'closed')),
  name        TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  email       TEXT NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  phone       TEXT CHECK (phone IS NULL OR char_length(phone) BETWEEN 8 AND 20),
  message     TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 2000)
);

CREATE INDEX enquiries_created_at_idx ON enquiries (created_at DESC);

CREATE TABLE enquiry_messages (
  id               BIGSERIAL PRIMARY KEY,
  enquiry_id       BIGINT NOT NULL REFERENCES enquiries (id),
  body             TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 4000),
  sent_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  email_id         TEXT,
  delivery_status  TEXT NOT NULL DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'failed'))
);

CREATE TABLE enquiry_status_history (
  id           BIGSERIAL PRIMARY KEY,
  enquiry_id   BIGINT NOT NULL REFERENCES enquiries (id),
  from_status  TEXT,
  to_status    TEXT NOT NULL,
  changed_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Alert emails waiting to go out. Holds a reference number, never form contents.
CREATE TABLE email_outbox (
  id           BIGSERIAL PRIMARY KEY,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  kind         TEXT NOT NULL CHECK (kind IN ('new_referral', 'new_enquiry', 'daily_reminder')),
  ref          TEXT,
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  attempts     INTEGER NOT NULL DEFAULT 0,
  last_error   TEXT,
  sent_at      TIMESTAMPTZ,
  provider_id  TEXT
);

CREATE INDEX email_outbox_pending_idx ON email_outbox (status, created_at);

-- Counts form submissions per hashed address per hour, to slow down abuse.
CREATE TABLE rate_limits (
  key           TEXT NOT NULL,
  window_start  TIMESTAMPTZ NOT NULL,
  count         INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (key, window_start)
);
