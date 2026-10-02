-- Ensign Support Services: the private admin area.
-- Sign in sessions, failed sign in tracking, the access log, and email for
-- enquiry replies and sign in lockouts. Never stores what a person wrote in
-- the log tables.

-- One row per signed in browser. The id is a hash of the cookie, so the
-- database never holds a usable session token.
CREATE TABLE admin_sessions (
  id            TEXT PRIMARY KEY,
  -- Ties the session to the passphrase in use at sign in (mixed with the
  -- token, which is not stored). Changing the passphrase ends every session.
  passphrase_tag TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at    TIMESTAMPTZ NOT NULL,
  revoked_at    TIMESTAMPTZ
);

-- Every sign in attempt, kept to lock out guessing. The address is hashed.
CREATE TABLE login_attempts (
  id            BIGSERIAL PRIMARY KEY,
  attempted_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_hash       TEXT,
  succeeded     BOOLEAN NOT NULL
);

CREATE INDEX login_attempts_at_idx ON login_attempts (attempted_at);

-- Who opened or changed what, and when. A reference number only, never contents.
CREATE TABLE access_log (
  id          BIGSERIAL PRIMARY KEY,
  at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  session_id  TEXT,
  action      TEXT NOT NULL,
  target_ref  TEXT
);

CREATE INDEX access_log_at_idx ON access_log (at);

-- The outbox also sends Andrew's replies to enquiries, and a lockout alert.
ALTER TABLE email_outbox DROP CONSTRAINT email_outbox_kind_check;
ALTER TABLE email_outbox ADD CONSTRAINT email_outbox_kind_check
  CHECK (kind IN ('new_referral', 'new_enquiry', 'daily_reminder', 'enquiry_reply', 'login_lockout'));
ALTER TABLE email_outbox ADD COLUMN message_id BIGINT REFERENCES enquiry_messages (id);

CREATE INDEX enquiry_messages_enquiry_idx ON enquiry_messages (enquiry_id, sent_at);
CREATE INDEX enquiry_status_history_enquiry_idx ON enquiry_status_history (enquiry_id, changed_at);
