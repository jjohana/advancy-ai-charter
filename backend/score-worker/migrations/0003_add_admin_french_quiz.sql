-- Add the invite-only French ADMIN assessment without changing existing
-- participant assignments or attempt history.

PRAGMA defer_foreign_keys = ON;

CREATE TABLE participant_quizzes_admin_migration (
  session_id TEXT PRIMARY KEY,
  participant_id TEXT NOT NULL,
  quiz_id TEXT NOT NULL CHECK (
    quiz_id IN (
      'advancy-ai-assessment-normal', 'advancy-ai-assessment-advanced',
      'advancy-ai-charter', 'advancy-ai-usage', 'advancy-ai-usage-advanced',
      'advancy-ai-admin-fr'
    )
  ),
  max_attempts_override INTEGER CHECK (
    max_attempts_override IS NULL OR max_attempts_override BETWEEN 1 AND 20
  ),
  enabled INTEGER NOT NULL DEFAULT 1 CHECK (enabled IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (participant_id, quiz_id),
  FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);

INSERT INTO participant_quizzes_admin_migration (
  session_id,
  participant_id,
  quiz_id,
  max_attempts_override,
  enabled,
  created_at
)
SELECT
  session_id,
  participant_id,
  quiz_id,
  max_attempts_override,
  enabled,
  created_at
FROM participant_quizzes;

DROP TABLE participant_quizzes;
ALTER TABLE participant_quizzes_admin_migration RENAME TO participant_quizzes;

CREATE INDEX idx_participant_quizzes_participant
  ON participant_quizzes(participant_id, quiz_id);

PRAGMA foreign_key_check;
