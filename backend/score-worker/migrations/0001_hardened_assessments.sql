-- Hardened v2 assessment storage. The legacy `scores` table is intentionally
-- neither altered nor dropped by this migration.

CREATE TABLE IF NOT EXISTS cohorts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 160),
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  starts_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  retention_days INTEGER NOT NULL DEFAULT 365 CHECK (retention_days BETWEEN 1 AND 365),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (starts_at < expires_at)
);

CREATE INDEX IF NOT EXISTS idx_cohorts_validity ON cohorts(active, starts_at, expires_at);

CREATE TABLE IF NOT EXISTS participants (
  id TEXT PRIMARY KEY,
  cohort_id TEXT NOT NULL,
  first_name TEXT NOT NULL CHECK (length(first_name) BETWEEN 1 AND 120),
  last_name TEXT NOT NULL CHECK (length(last_name) BETWEEN 1 AND 120),
  email TEXT NOT NULL COLLATE NOCASE CHECK (length(email) BETWEEN 3 AND 254),
  token_hash TEXT NOT NULL UNIQUE CHECK (length(token_hash) = 64),
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (cohort_id, email),
  FOREIGN KEY (cohort_id) REFERENCES cohorts(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_participants_token_hash ON participants(token_hash);
CREATE INDEX IF NOT EXISTS idx_participants_expiry ON participants(active, expires_at);
CREATE INDEX IF NOT EXISTS idx_participants_cohort ON participants(cohort_id, email);

CREATE TABLE IF NOT EXISTS participant_quizzes (
  session_id TEXT PRIMARY KEY,
  participant_id TEXT NOT NULL,
  quiz_id TEXT NOT NULL CHECK (
    quiz_id IN (
      'advancy-ai-assessment-normal', 'advancy-ai-assessment-advanced',
      'advancy-ai-charter', 'advancy-ai-usage', 'advancy-ai-usage-advanced'
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

CREATE INDEX IF NOT EXISTS idx_participant_quizzes_participant
  ON participant_quizzes(participant_id, quiz_id);

CREATE TABLE IF NOT EXISTS attempts (
  id TEXT PRIMARY KEY,
  receipt_id TEXT NOT NULL UNIQUE,
  session_id TEXT NOT NULL,
  quiz_id TEXT NOT NULL,
  quiz_version TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  submission_fingerprint TEXT NOT NULL CHECK (length(submission_fingerprint) = 64),
  attempt_number INTEGER NOT NULL CHECK (attempt_number >= 1),
  answers TEXT NOT NULL,
  correct INTEGER NOT NULL CHECK (correct >= 0),
  total INTEGER NOT NULL CHECK (total > 0),
  percent INTEGER NOT NULL CHECK (percent BETWEEN 0 AND 100),
  passed INTEGER NOT NULL CHECK (passed IN (0, 1)),
  client_started_at TEXT NOT NULL,
  client_completed_at TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL CHECK (duration_seconds BETWEEN 0 AND 86400),
  privacy_notice_version TEXT NOT NULL,
  privacy_acknowledged INTEGER NOT NULL CHECK (privacy_acknowledged = 1),
  training_relevance INTEGER CHECK (training_relevance BETWEEN 1 AND 5),
  conceptual_clarity INTEGER CHECK (conceptual_clarity BETWEEN 1 AND 5),
  practical_applicability INTEGER CHECK (practical_applicability BETWEEN 1 AND 5),
  governance_confidence INTEGER CHECK (governance_confidence BETWEEN 1 AND 5),
  codex_workflow_confidence INTEGER CHECK (codex_workflow_confidence BETWEEN 1 AND 5),
  materials_quality INTEGER CHECK (materials_quality BETWEEN 1 AND 5),
  pace_and_depth INTEGER CHECK (pace_and_depth BETWEEN 1 AND 5),
  overall_satisfaction INTEGER CHECK (overall_satisfaction BETWEEN 1 AND 5),
  recommend_training INTEGER CHECK (recommend_training IN (0, 1)),
  most_valuable_takeaway TEXT CHECK (
    most_valuable_takeaway IS NULL OR length(most_valuable_takeaway) <= 2000
  ),
  improvement_suggestion TEXT CHECK (
    improvement_suggestion IS NULL OR length(improvement_suggestion) <= 2000
  ),
  suggested_ai_automation_use_cases TEXT CHECK (
    suggested_ai_automation_use_cases IS NULL OR length(suggested_ai_automation_use_cases) <= 2000
  ),
  submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (session_id, idempotency_key),
  UNIQUE (session_id, attempt_number),
  FOREIGN KEY (session_id) REFERENCES participant_quizzes(session_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_attempts_quiz_submitted
  ON attempts(quiz_id, submitted_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_attempts_session_submitted
  ON attempts(session_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_attempts_retention ON attempts(submitted_at);

CREATE TABLE IF NOT EXISTS admin_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  target_id TEXT,
  affected_count INTEGER NOT NULL DEFAULT 0 CHECK (affected_count >= 0),
  request_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admin_events_created ON admin_events(created_at DESC);
