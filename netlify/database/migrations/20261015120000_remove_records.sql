-- Ensign Support Services: removing personal information when it is no longer needed.
-- Privacy Policy v2.0 clause 11.3 and APP 11.2: when the keeping period ends, Andrew
-- removes a closed referral or enquiry from the admin area. Its personal details,
-- notes, replies and status history are deleted for good. Only this row is kept,
-- so there is a record that the reference number existed and when it was removed.
-- It holds no names, contact details or anything a person wrote.

CREATE TABLE removed_records (
  id           BIGSERIAL PRIMARY KEY,
  ref          TEXT NOT NULL UNIQUE,
  kind         TEXT NOT NULL CHECK (kind IN ('referral', 'enquiry')),
  received_on  DATE NOT NULL,
  removed_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX removed_records_removed_at_idx ON removed_records (removed_at);
