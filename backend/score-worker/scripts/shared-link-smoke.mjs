import assert from "node:assert/strict";

import { QUIZ_VERSION, findQuiz, scoreAnswers } from "../src/quizzes.js";

const required = (name) => {
  const value = String(process.env[name] || "").trim();
  if (!value) throw new Error(`${name} is required.`);
  return value;
};

const apiBase = new URL(required("API_BASE"));
const loopback = new Set(["127.0.0.1", "localhost", "[::1]"]).has(apiBase.hostname);
if (apiBase.protocol !== "https:" && !(loopback && apiBase.protocol === "http:")) {
  throw new Error("API_BASE must use HTTPS, except for a loopback local test.");
}
if (!loopback && process.env.SMOKE_CONFIRM !== "DELETE_SYNTHETIC_PARTICIPANTS") {
  throw new Error("Set SMOKE_CONFIRM=DELETE_SYNTHETIC_PARTICIPANTS for a remote smoke test.");
}

const enrollmentToken = required("ENROLLMENT_TOKEN");
const adminToken = required("ADMIN_TOKEN");
if (!/^enr_[A-Za-z0-9_-]{43}$/.test(enrollmentToken)) throw new Error("ENROLLMENT_TOKEN has an invalid format.");
if (adminToken.length < 32) throw new Error("ADMIN_TOKEN must contain at least 32 characters.");
const origin = String(process.env.ORIGIN || "https://jjohana.github.io");
const runId = crypto.randomUUID().slice(0, 8);
const participants = [];
let submissions = 0;
let replays = 0;
let enrollmentReplays = 0;

const endpoint = (path) => new URL(path, apiBase).toString();

async function request(path, options = {}) {
  const response = await fetch(endpoint(path), options);
  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = null; }
  if (!response.ok) {
    const code = body?.error?.code || "UNKNOWN_ERROR";
    throw new Error(`${options.method || "GET"} ${path} failed with ${response.status} ${code}.`);
  }
  return { response, body };
}

function assertScore(actual, expected) {
  assert.deepEqual(
    { correct: actual.correct, total: actual.total, percent: actual.percent, passed: actual.passed },
    { correct: expected.correct, total: expected.total, percent: expected.percent, passed: expected.passed }
  );
  assert.deepEqual(actual.sections, expected.sections);
}

async function cleanup() {
  const failures = [];
  for (const participantId of participants) {
    try {
      await request(`/admin/participants/${participantId}`, {
        method: "DELETE",
        headers: {
          "X-Admin-Token": adminToken,
          "X-Confirm-Participant": participantId
        }
      });
    } catch {
      failures.push(participantId);
    }
  }
  if (failures.length) throw new Error(`Cleanup failed for ${failures.length} synthetic participant(s).`);
}

let primaryError = null;
try {
  for (const mode of ["normal", "advanced"]) {
    const quizId = `advancy-ai-assessment-${mode}`;
    const quiz = findQuiz(quizId, QUIZ_VERSION);
    for (let position = 0; position < 5; position += 1) {
      const email = `codex-smoke-${runId}-${mode}-${position}@advancy.com`;
      const enrollmentIdempotencyKey = crypto.randomUUID();
      const enrollmentOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${enrollmentToken}`,
          "Content-Type": "application/json",
          "Idempotency-Key": enrollmentIdempotencyKey,
          Origin: origin
        },
        body: JSON.stringify({
          first_name: "Synthetic",
          last_name: `Smoke ${mode} ${position}`,
          email,
          quiz_id: quizId,
          privacy_notice_version: "2026-07-09",
          privacy_acknowledged: true
        })
      };
      const { body: enrollment } = await request("/v2/enroll", enrollmentOptions);
      assert.match(enrollment.participant_id, /^[0-9a-f-]{36}$/i);
      assert.match(enrollment.invite_token, /^inv_[A-Za-z0-9_-]{43}$/);
      participants.push(enrollment.participant_id);
      const { body: enrollmentReplay } = await request("/v2/enroll", enrollmentOptions);
      assert.equal(enrollmentReplay.participant_id, enrollment.participant_id);
      assert.equal(enrollmentReplay.invite_token, enrollment.invite_token);
      assert.equal(enrollmentReplay.expires_at, enrollment.expires_at);
      enrollmentReplays += 1;

      const participantHeaders = { Authorization: `Bearer ${enrollment.invite_token}`, Origin: origin };
      const { body: session } = await request(`/v2/session?test_id=${quizId}&quiz_version=${QUIZ_VERSION}`, {
        headers: participantHeaders
      });
      const answers = Array(quiz.answerKey.length).fill(position);
      const expected = scoreAnswers(quiz, answers);
      const startedAt = new Date();
      const idempotencyKey = crypto.randomUUID();
      const submissionBody = JSON.stringify({
        session_id: session.session_id,
        test_id: quizId,
        quiz_version: QUIZ_VERSION,
        answers,
        attempt_started_at: startedAt.toISOString(),
        completed_at: new Date(startedAt.getTime() + 600_000).toISOString(),
        duration_seconds: 600,
        privacy_notice_version: "2026-07-09",
        privacy_acknowledged: true
      });
      const submitOptions = {
        method: "POST",
        headers: {
          ...participantHeaders,
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey
        },
        body: submissionBody
      };
      const { body: submitted } = await request("/v2/submit", submitOptions);
      assertScore(submitted.score, expected);
      submissions += 1;
      const { body: replayed } = await request("/v2/submit", submitOptions);
      assert.equal(replayed.idempotent_replay, true);
      assert.equal(replayed.receipt_id, submitted.receipt_id);
      assertScore(replayed.score, expected);
      replays += 1;
    }
  }
} catch (error) {
  primaryError = error;
} finally {
  try {
    await cleanup();
  } catch (cleanupError) {
    if (!primaryError) primaryError = cleanupError;
  }
}

if (primaryError) throw primaryError;
console.log(JSON.stringify({
  ok: true,
  synthetic_participants_deleted: participants.length,
  submissions,
  enrollment_replays: enrollmentReplays,
  idempotent_replays: replays,
  modes: 2,
  constant_answer_positions_per_mode: 5
}));
