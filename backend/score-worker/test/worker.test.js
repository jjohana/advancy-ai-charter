import assert from "node:assert/strict";
import test from "node:test";

import {
  csvCell,
  decodeCursor,
  deriveEnrollmentInviteToken,
  encodeCursor,
  enrollmentFingerprint,
  rejectExistingEnrollment,
  validateEnrollmentPayload,
  validateImport,
  validateSubmission
} from "../src/index.js";
import { DEFAULT_QUIZ_IDS, LEGACY_QUIZ_IDS, QUIZ_IDS, QUIZ_VERSION, findQuiz, scoreAnswers } from "../src/quizzes.js";

const CHARTER_KEY = [0, 2, 4, 1, 3, 1, 3, 0, 2, 4, 2, 4, 1, 3, 0, 3, 0, 2, 4, 1, 4, 1, 3, 0, 2];
const USAGE_NORMAL_KEY = [0, 2, 4, 1, 3, 1, 3, 0, 2, 4, 2, 4, 1, 3, 0, 3, 0, 2, 4, 1, 4, 1, 3, 0, 2];
const COMBINED_NORMAL_KEY = USAGE_NORMAL_KEY.map((_, index) => USAGE_NORMAL_KEY[(index + 1) % USAGE_NORMAL_KEY.length]);
const USAGE_ADVANCED_KEY = [3, 0, 4, 1, 2, 4, 1, 3, 0, 2, 1, 4, 2, 0, 3, 2, 3, 0, 4, 1, 0, 2, 1, 3, 4];
const EXPECTED_KEYS = {
  "advancy-ai-assessment-normal": [...CHARTER_KEY, ...COMBINED_NORMAL_KEY],
  "advancy-ai-assessment-advanced": [...CHARTER_KEY, ...USAGE_ADVANCED_KEY],
  "advancy-ai-charter": CHARTER_KEY,
  "advancy-ai-usage": USAGE_NORMAL_KEY,
  "advancy-ai-usage-advanced": USAGE_ADVANCED_KEY
};

function submission(overrides = {}) {
  return {
    session_id: "81e0b822-8250-4c2a-8451-bf48950fe7aa",
    test_id: "advancy-ai-assessment-normal",
    quiz_version: QUIZ_VERSION,
    answers: [...EXPECTED_KEYS["advancy-ai-assessment-normal"]],
    attempt_started_at: "2026-07-09T09:00:00.000Z",
    completed_at: "2026-07-09T09:15:00.000Z",
    duration_seconds: 900,
    privacy_notice_version: "2026-07-09",
    privacy_acknowledged: true,
    ...overrides
  };
}

test("combined and cutover answer keys are exact with section-safe server scoring", () => {
  assert.deepEqual(QUIZ_IDS, Object.keys(EXPECTED_KEYS));
  assert.deepEqual(DEFAULT_QUIZ_IDS, ["advancy-ai-assessment-normal", "advancy-ai-assessment-advanced"]);
  assert.deepEqual(LEGACY_QUIZ_IDS, ["advancy-ai-charter", "advancy-ai-usage", "advancy-ai-usage-advanced"]);
  for (const [id, answerKey] of Object.entries(EXPECTED_KEYS)) {
    const quiz = findQuiz(id, QUIZ_VERSION);
    assert.deepEqual(quiz.answerKey, answerKey);
    const perfect = scoreAnswers(quiz, answerKey);
    assert.equal(perfect.correct, answerKey.length);
    assert.equal(perfect.total, answerKey.length);
    assert.equal(perfect.percent, 100);
    assert.equal(perfect.passed, true);
    if (answerKey.length === 25) {
      const seventeen = answerKey.map((answer, index) => index < 17 ? answer : (answer + 1) % 5);
      const eighteen = answerKey.map((answer, index) => index < 18 ? answer : (answer + 1) % 5);
      assert.equal(scoreAnswers(quiz, seventeen).passed, false);
      assert.equal(scoreAnswers(quiz, eighteen).passed, true);
      assert.equal("sections" in perfect, false);
    } else {
      const passing = answerKey.map((answer, index) => (index < 18 || (index >= 25 && index < 43)) ? answer : (answer + 1) % 5);
      assert.equal(scoreAnswers(quiz, passing).passed, true);
      assert.equal(perfect.sections.length, 2);
    }
  }
});

test("combined assessments concatenate Charter with the selected Usage level", () => {
  assert.deepEqual(findQuiz("advancy-ai-assessment-normal", QUIZ_VERSION).answerKey.slice(0, 25), CHARTER_KEY);
  assert.deepEqual(findQuiz("advancy-ai-assessment-normal", QUIZ_VERSION).answerKey.slice(25), COMBINED_NORMAL_KEY);
  assert.deepEqual(findQuiz("advancy-ai-assessment-advanced", QUIZ_VERSION).answerKey.slice(0, 25), CHARTER_KEY);
  assert.deepEqual(findQuiz("advancy-ai-assessment-advanced", QUIZ_VERSION).answerKey.slice(25), USAGE_ADVANCED_KEY);
});

test("combined Normal rotates every module answer position while retaining a balanced key", () => {
  assert.deepEqual(COMBINED_NORMAL_KEY, [...USAGE_NORMAL_KEY.slice(1), USAGE_NORMAL_KEY[0]]);
  assert.equal(COMBINED_NORMAL_KEY.every((answer, index) => answer !== USAGE_NORMAL_KEY[index]), true);
  assert.deepEqual(
    [0, 1, 2, 3, 4].map((answer) => COMBINED_NORMAL_KEY.filter((value) => value === answer).length),
    [5, 5, 5, 5, 5]
  );
});

test("combined scoring requires 70% in both sections and returns the exact section contract", () => {
  const quiz = findQuiz("advancy-ai-assessment-normal", QUIZ_VERSION);
  const answers = quiz.answerKey.map((answer, index) => {
    const correct = index < 15 || (index >= 25 && index < 45);
    return correct ? answer : (answer + 1) % 5;
  });
  assert.deepEqual(scoreAnswers(quiz, answers), {
    correct: 35,
    total: 50,
    percent: 70,
    passed: false,
    sections: [
      { id: "charter", name: "AI Charter", correct: 15, total: 25, percent: 60, passed: false },
      { id: "normal", name: "Normal module", correct: 20, total: 25, percent: 80, passed: true }
    ]
  });

  const advanced = scoreAnswers(
    findQuiz("advancy-ai-assessment-advanced", QUIZ_VERSION),
    EXPECTED_KEYS["advancy-ai-assessment-advanced"]
  );
  assert.deepEqual(advanced.sections.map(({ id, name }) => ({ id, name })), [
    { id: "charter", name: "AI Charter" },
    { id: "advanced", name: "Advanced module" }
  ]);
});

test("submission validation accepts a minimal payload and optional validated evaluation", () => {
  const minimal = validateSubmission(submission(), "2026-07-09");
  assert.equal(minimal.evaluation.training_relevance, null);

  const evaluated = validateSubmission(submission({
    evaluation: {
      training_relevance: 5,
      overall_satisfaction: 4,
      recommend_training: true,
      improvement_suggestion: "More worked examples"
    }
  }), "2026-07-09");
  assert.equal(evaluated.evaluation.training_relevance, 5);
  assert.equal(evaluated.evaluation.recommend_training, 1);
});

test("submission validation rejects spoofed score fields, unknown versions and stale privacy consent", () => {
  assert.throws(() => validateSubmission(submission({ correct: 50 }), "2026-07-09"), { code: "UNKNOWN_FIELD" });
  assert.throws(() => validateSubmission(submission({ quiz_version: "old" }), "2026-07-09"), { code: "UNKNOWN_QUIZ_VERSION" });
  assert.throws(() => validateSubmission(submission({ privacy_notice_version: "old" }), "2026-07-09"), { code: "PRIVACY_NOTICE_REQUIRED" });
  assert.throws(() => validateSubmission(submission({ answers: Array(50).fill(9) }), "2026-07-09"), { code: "INVALID_ANSWERS" });
});

test("cohort imports enforce the privacy notice retention ceiling", () => {
  const future = (days) => new Date(Date.now() + days * 86_400_000).toISOString();
  const payload = (retentionDays) => ({
    cohort: {
      id: "privacy-retention-test",
      name: "Privacy retention test",
      starts_at: future(-1),
      expires_at: future(30),
      retention_days: retentionDays
    },
    participants: [{ first_name: "Test", last_name: "Person", email: "test@advancy.com" }]
  });
  const env = { RETENTION_DAYS: "365", INVITATION_TTL_DAYS: "30", ALLOWED_EMAIL_DOMAINS: "advancy.com" };
  const validated = validateImport(payload(365), env);
  assert.equal(validated.cohort.retentionDays, 365);
  assert.deepEqual(validated.participants[0].quizIds, DEFAULT_QUIZ_IDS);
  assert.throws(() => validateImport(payload(366), env), { code: "INVALID_FIELD" });
});

test("legacy quiz ids remain explicitly assignable during cutover", () => {
  const now = Date.now();
  const input = {
    cohort: {
      id: "legacy-cutover-test",
      name: "Legacy cutover test",
      starts_at: new Date(now - 86_400_000).toISOString(),
      expires_at: new Date(now + 86_400_000).toISOString()
    },
    participants: [{
      first_name: "Legacy",
      last_name: "Participant",
      email: "legacy@advancy.com",
      quiz_ids: [...LEGACY_QUIZ_IDS]
    }]
  };
  const validated = validateImport(input, { RETENTION_DAYS: "365", INVITATION_TTL_DAYS: "1", ALLOWED_EMAIL_DOMAINS: "advancy.com" });
  assert.deepEqual(validated.participants[0].quizIds, LEGACY_QUIZ_IDS);
});

test("shared-link enrollment accepts only the exact current combined-assessment contract", () => {
  const env = { ALLOWED_EMAIL_DOMAINS: "advancy.com", PRIVACY_NOTICE_VERSION: "2026-07-09" };
  const payload = {
    first_name: "  Alice ",
    last_name: " Example  ",
    email: "ALICE@ADVANCY.COM",
    quiz_id: "advancy-ai-assessment-normal",
    privacy_notice_version: "2026-07-09",
    privacy_acknowledged: true
  };
  assert.deepEqual(validateEnrollmentPayload(payload, env), {
    firstName: "Alice",
    lastName: "Example",
    email: "alice@advancy.com",
    quizId: "advancy-ai-assessment-normal",
    privacyVersion: "2026-07-09"
  });
  assert.equal(
    validateEnrollmentPayload({ ...payload, quiz_id: "advancy-ai-assessment-advanced" }, env).quizId,
    "advancy-ai-assessment-advanced"
  );
  assert.throws(() => validateEnrollmentPayload({ ...payload, quiz_id: "advancy-ai-charter" }, env), { code: "INVALID_QUIZ_ID" });
  assert.throws(() => validateEnrollmentPayload({ ...payload, email: "alice@example.com" }, env), { code: "EMAIL_DOMAIN_NOT_ALLOWED" });
  assert.throws(() => validateEnrollmentPayload({ ...payload, privacy_notice_version: "old" }, env), { code: "PRIVACY_NOTICE_REQUIRED" });
  assert.throws(() => validateEnrollmentPayload({ ...payload, extra: true }, env), { code: "UNKNOWN_FIELD" });
});

test("self-enrollment is one-time and revoked participants fail closed", () => {
  assert.throws(() => rejectExistingEnrollment({ active: 1, revoked_at: null }), { status: 409, code: "ENROLLMENT_USED" });
  assert.throws(() => rejectExistingEnrollment({ active: 0, revoked_at: "2026-07-10 12:00:00" }), { status: 403, code: "PARTICIPANT_REVOKED" });
  assert.throws(() => rejectExistingEnrollment({ active: 0, revoked_at: null }), { status: 403, code: "PARTICIPANT_REVOKED" });
  assert.throws(() => rejectExistingEnrollment(null), { status: 503, code: "ENROLLMENT_FAILED" });
});

test("enrollment recovery derives stable tokens and normalized fingerprints without raw storage", async () => {
  const secret = "enr_0123456789012345678901234567890123456789012";
  const cohortId = "ai-training-2026";
  const email = "alice@advancy.com";
  const key = "81e0b822-8250-4c2a-8451-bf48950fe7aa";
  const first = await deriveEnrollmentInviteToken(secret, cohortId, email, key);
  const replay = await deriveEnrollmentInviteToken(secret, cohortId, email, key);
  assert.equal(first, replay);
  assert.match(first, /^inv_[A-Za-z0-9_-]{43}$/);
  assert.notEqual(first, await deriveEnrollmentInviteToken(secret, cohortId, email, "fd279783-d5ed-48f9-8d85-851a8bd175d6"));

  const input = {
    firstName: "Alice",
    lastName: "Example",
    email,
    quizId: "advancy-ai-assessment-normal",
    privacyVersion: "2026-07-09"
  };
  const fingerprint = await enrollmentFingerprint(input, cohortId);
  assert.match(fingerprint, /^[0-9a-f]{64}$/);
  assert.equal(fingerprint, await enrollmentFingerprint({ ...input }, cohortId));
  assert.notEqual(fingerprint, await enrollmentFingerprint({ ...input, quizId: "advancy-ai-assessment-advanced" }, cohortId));
});

test("CSV cells neutralize spreadsheet formulas and escape delimiters", () => {
  assert.equal(csvCell("=2+2"), "'=2+2");
  assert.equal(csvCell("  -1+1"), "'  -1+1");
  assert.equal(csvCell("@SUM(A1:A2)"), "'@SUM(A1:A2)");
  assert.equal(csvCell("Doe, Jane"), '"Doe, Jane"');
  assert.equal(csvCell('A "quote"'), '"A ""quote"""');
});

test("keyset export cursors round-trip without exposing plain JSON", () => {
  const cursor = { submitted_at: "2026-07-09 12:34:56", id: "81e0b822-8250-4c2a-8451-bf48950fe7aa" };
  const encoded = encodeCursor(cursor);
  assert.doesNotMatch(encoded, /[+\/=]/);
  assert.deepEqual(decodeCursor(encoded), cursor);
  assert.throws(() => decodeCursor("not*a*cursor"), { code: "INVALID_CURSOR" });
});
