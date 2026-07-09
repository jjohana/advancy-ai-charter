-- Add recoverable, privacy-minimized idempotency metadata for shared-link
-- enrollment. Raw idempotency keys and raw invitation tokens are never stored.

ALTER TABLE participants ADD COLUMN enrollment_idempotency_hash TEXT
  CHECK (enrollment_idempotency_hash IS NULL OR length(enrollment_idempotency_hash) = 64);

ALTER TABLE participants ADD COLUMN enrollment_fingerprint TEXT
  CHECK (enrollment_fingerprint IS NULL OR length(enrollment_fingerprint) = 64);

CREATE UNIQUE INDEX IF NOT EXISTS idx_participants_enrollment_idempotency
  ON participants(cohort_id, enrollment_idempotency_hash)
  WHERE enrollment_idempotency_hash IS NOT NULL;
