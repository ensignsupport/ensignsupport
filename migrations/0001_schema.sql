-- Ensign Support Services: the whole schema, for D1 (SQLite).
-- See docs/decisions/0008-moving-to-cloudflare.md.
--
-- This is one file where Postgres had three. SQLite cannot drop or replace a
-- check constraint with ALTER TABLE, and the second Postgres migration did
-- exactly that to the outbox, so its end state is written here directly.
-- Nothing is lost by this: there is no data and no D1 database to migrate from.
--
-- Times are text, written as UTC with a Z on the end, so JavaScript reads them
-- back as the right moment and a plain comparison still sorts correctly.
-- Booleans are 0 and 1.
--
-- Fields are exactly the developer brief's. Never stored: NDIS number,
-- diagnosis, Medicare details or files.

-- Referrals, enquiries and the email outbox -----------------------------------

CREATE TABLE referrals (
  id                            INTEGER PRIMARY KEY AUTOINCREMENT,
  -- Set by the trigger below, from the id, so the first referral is R-1001.
  ref                           TEXT NOT NULL UNIQUE DEFAULT '',
  -- Made by the browser once per form, so a retried save never stores a referral twice.
  submission_id                 TEXT NOT NULL UNIQUE,
  created_at                    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at                    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  status                        TEXT NOT NULL DEFAULT 'new'
                                CHECK (status IN ('new', 'contacted', 'in_progress', 'accepted', 'closed')),

  referrer_type                 TEXT NOT NULL CHECK (referrer_type IN ('participant', 'family', 'professional')),
  referrer_name                 TEXT NOT NULL CHECK (length(referrer_name) BETWEEN 1 AND 120),
  referrer_org_role             TEXT CHECK (referrer_org_role IS NULL OR length(referrer_org_role) <= 160),
  referrer_phone                TEXT NOT NULL CHECK (length(referrer_phone) BETWEEN 8 AND 20),
  referrer_email                TEXT NOT NULL CHECK (length(referrer_email) BETWEEN 3 AND 254),

  participant_name              TEXT NOT NULL CHECK (length(participant_name) BETWEEN 1 AND 120),
  participant_preferred_contact TEXT CHECK (participant_preferred_contact IS NULL OR length(participant_preferred_contact) <= 200),
  participant_phone             TEXT NOT NULL CHECK (length(participant_phone) BETWEEN 8 AND 20),
  participant_email             TEXT NOT NULL CHECK (length(participant_email) BETWEEN 3 AND 254),
  participant_suburb            TEXT NOT NULL CHECK (length(participant_suburb) BETWEEN 4 AND 80),

  plan_type                     TEXT NOT NULL CHECK (plan_type IN ('self_managed', 'plan_managed')),
  service                       TEXT NOT NULL CHECK (service IN ('support_coordination', 'recovery_coaching', 'both')),
  reason                        TEXT NOT NULL CHECK (length(reason) BETWEEN 1 AND 1000),
  consent                       INTEGER NOT NULL CHECK (consent = 1),
  consent_at                    TEXT NOT NULL,
  heard_via                     TEXT CHECK (heard_via IS NULL OR length(heard_via) <= 60)
);

-- Postgres used a sequence starting at 1001. AUTOINCREMENT starts at 1 and
-- never reuses a number, even after a row is removed, so id + 1000 gives the
-- same references and a removed referral's reference can never come back.
CREATE TRIGGER referrals_ref AFTER INSERT ON referrals WHEN NEW.ref = ''
BEGIN
  UPDATE referrals SET ref = 'R-' || (NEW.id + 1000) WHERE id = NEW.id;
END;

CREATE INDEX referrals_created_at_idx ON referrals (created_at DESC);
CREATE INDEX referrals_status_idx ON referrals (status);

CREATE TABLE referral_notes (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  referral_id  INTEGER NOT NULL REFERENCES referrals (id),
  body         TEXT NOT NULL CHECK (length(body) BETWEEN 1 AND 4000),
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX referral_notes_referral_idx ON referral_notes (referral_id, created_at);

CREATE TABLE referral_status_history (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  referral_id  INTEGER NOT NULL REFERENCES referrals (id),
  from_status  TEXT,
  to_status    TEXT NOT NULL,
  changed_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX referral_status_history_referral_idx ON referral_status_history (referral_id, changed_at);

CREATE TABLE enquiries (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  ref           TEXT NOT NULL UNIQUE DEFAULT '',
  submission_id TEXT NOT NULL UNIQUE,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  read_at       TEXT,
  status        TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'replied', 'closed')),
  name          TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 120),
  email         TEXT NOT NULL CHECK (length(email) BETWEEN 3 AND 254),
  phone         TEXT CHECK (phone IS NULL OR length(phone) BETWEEN 8 AND 20),
  message       TEXT NOT NULL CHECK (length(message) BETWEEN 1 AND 2000)
);

CREATE TRIGGER enquiries_ref AFTER INSERT ON enquiries WHEN NEW.ref = ''
BEGIN
  UPDATE enquiries SET ref = 'E-' || (NEW.id + 1000) WHERE id = NEW.id;
END;

CREATE INDEX enquiries_created_at_idx ON enquiries (created_at DESC);

CREATE TABLE enquiry_messages (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  enquiry_id       INTEGER NOT NULL REFERENCES enquiries (id),
  body             TEXT NOT NULL CHECK (length(body) BETWEEN 1 AND 4000),
  sent_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  email_id         TEXT,
  delivery_status  TEXT NOT NULL DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'failed'))
);

CREATE INDEX enquiry_messages_enquiry_idx ON enquiry_messages (enquiry_id, sent_at);

CREATE TABLE enquiry_status_history (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  enquiry_id   INTEGER NOT NULL REFERENCES enquiries (id),
  from_status  TEXT,
  to_status    TEXT NOT NULL,
  changed_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX enquiry_status_history_enquiry_idx ON enquiry_status_history (enquiry_id, changed_at);

-- Alert emails waiting to go out. Holds a reference number, never form contents.
-- The five kinds are the end state of the two Postgres migrations: the first
-- three, plus the enquiry reply and the sign in lockout the admin added.
CREATE TABLE email_outbox (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  kind         TEXT NOT NULL
               CHECK (kind IN ('new_referral', 'new_enquiry', 'daily_reminder', 'enquiry_reply', 'login_lockout')),
  ref          TEXT,
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  attempts     INTEGER NOT NULL DEFAULT 0,
  last_error   TEXT,
  sent_at      TEXT,
  provider_id  TEXT,
  message_id   INTEGER REFERENCES enquiry_messages (id)
);

CREATE INDEX email_outbox_pending_idx ON email_outbox (status, created_at);

-- Counts form submissions per hashed address per hour, to slow down abuse.
CREATE TABLE rate_limits (
  key           TEXT NOT NULL,
  window_start  TEXT NOT NULL,
  count         INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (key, window_start)
);

-- The private admin area --------------------------------------------------

-- One row per signed in browser. The id is a hash of the cookie, so the
-- database never holds a usable session token.
CREATE TABLE admin_sessions (
  id             TEXT PRIMARY KEY,
  -- Ties the session to the passphrase in use at sign in (mixed with the
  -- token, which is not stored). Changing the passphrase ends every session.
  passphrase_tag TEXT NOT NULL,
  created_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  last_seen_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  expires_at     TEXT NOT NULL,
  revoked_at     TEXT
);

-- Every sign in attempt, kept to lock out guessing. The address is hashed.
CREATE TABLE login_attempts (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  attempted_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  ip_hash       TEXT,
  succeeded     INTEGER NOT NULL
);

CREATE INDEX login_attempts_at_idx ON login_attempts (attempted_at);

-- Who opened or changed what, and when. A reference number only, never contents.
CREATE TABLE access_log (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  session_id  TEXT,
  action      TEXT NOT NULL,
  target_ref  TEXT
);

CREATE INDEX access_log_at_idx ON access_log (at);

-- Removing personal information when it is no longer needed ------------------

-- Privacy Policy v2.0 clause 11.3 and APP 11.2: when the keeping period ends,
-- Andrew removes a closed referral or enquiry from the admin area. Its personal
-- details, notes, replies and status history are deleted for good. Only this
-- row is kept, so there is a record that the reference number existed and when
-- it was removed. It holds no names, contact details or anything a person wrote.
-- received_on is the Brisbane date: Queensland is UTC+10 all year with no
-- daylight saving, so adding 10 hours to the stored UTC time is exact.
CREATE TABLE removed_records (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  ref          TEXT NOT NULL UNIQUE,
  kind         TEXT NOT NULL CHECK (kind IN ('referral', 'enquiry')),
  received_on  TEXT NOT NULL,
  removed_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX removed_records_removed_at_idx ON removed_records (removed_at);
