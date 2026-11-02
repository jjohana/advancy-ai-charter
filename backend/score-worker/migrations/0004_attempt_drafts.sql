-- Participant progress contains no identity data and follows the assignment retention cascade.
CREATE TABLE attempt_drafts (
  session_id TEXT NOT NULL REFERENCES participant_quizzes(session_id) ON DELETE CASCADE,
  quiz_version TEXT NOT NULL,
  baseline_attempts_used INTEGER NOT NULL CHECK (baseline_attempts_used >= 0),
  draft_id TEXT NOT NULL,
  insert_nonce TEXT NOT NULL,
  previous_draft_id TEXT,
  answer_sequence TEXT NOT NULL CHECK (
    length(answer_sequence) <= 20 AND answer_sequence NOT GLOB '*[^0-4]*'
  ),
  attempt_started_at TEXT NOT NULL,
  privacy_notice_version TEXT NOT NULL,
  privacy_acknowledged INTEGER NOT NULL CHECK (privacy_acknowledged = 1),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (session_id, quiz_version, baseline_attempts_used)
);

CREATE TABLE attempt_draft_tombstones (
  session_id TEXT NOT NULL REFERENCES participant_quizzes(session_id) ON DELETE CASCADE,
  quiz_version TEXT NOT NULL,
  baseline_attempts_used INTEGER NOT NULL,
  draft_id TEXT NOT NULL,
  PRIMARY KEY (session_id, quiz_version, baseline_attempts_used, draft_id)
);

CREATE TRIGGER attempt_draft_reset_tombstone
AFTER UPDATE OF draft_id ON attempt_drafts
WHEN OLD.draft_id <> NEW.draft_id
BEGIN
  INSERT OR IGNORE INTO attempt_draft_tombstones
    VALUES (OLD.session_id, OLD.quiz_version, OLD.baseline_attempts_used, OLD.draft_id);
END;
