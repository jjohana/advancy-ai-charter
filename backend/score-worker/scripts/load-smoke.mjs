import { DEFAULT_QUIZ_IDS, QUIZ_IDS, QUIZ_VERSION, findQuiz } from "../src/quizzes.js";

function integerFlag(name, fallback, min, max) {
  const index = process.argv.indexOf(name);
  const value = index >= 0 ? Number.parseInt(process.argv[index + 1], 10) : fallback;
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer from ${min} to ${max}`);
  }
  return value;
}

function stringFlag(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const baseUrl = new URL(stringFlag("--base-url", "http://127.0.0.1:8787"));
if (!new Set(["127.0.0.1", "localhost", "[::1]"]).has(baseUrl.hostname)) {
  throw new Error("This smoke/load script is local-only; --base-url must use a loopback host.");
}
const adminToken = process.env.LOCAL_ADMIN_TOKEN;
if (!adminToken || adminToken.length < 32) {
  throw new Error("Set LOCAL_ADMIN_TOKEN to the local Worker's 32+ character ADMIN_TOKEN.");
}

const participantCount = integerFlag("--participants", 10, 1, 300);
const concurrency = integerFlag("--concurrency", 10, 1, 50);
const attemptsPerQuiz = integerFlag("--attempts-per-quiz", 1, 1, 3);
const quizIds = process.argv.includes("--include-legacy") ? QUIZ_IDS : DEFAULT_QUIZ_IDS;
const expectedAttempts = participantCount * quizIds.length * attemptsPerQuiz;
const runId = crypto.randomUUID().slice(0, 8);
const cohortId = `load-${runId}`;
const api = (path) => new URL(path, baseUrl).toString();

async function apiRequest(path, options = {}) {
  const response = await fetch(api(path), options);
  const text = await response.text();
  let body;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${path} returned ${response.status}: ${JSON.stringify(body)}`);
  }
  return { response, body };
}

const participants = Array.from({ length: participantCount }, (_, index) => ({
  first_name: "Synthetic",
  last_name: `Participant ${index + 1}`,
  email: `load-${runId}-${String(index + 1).padStart(3, "0")}@advancy.com`,
  max_attempts: attemptsPerQuiz,
  quiz_ids: quizIds
}));

const now = new Date();
const imported = [];
for (let offset = 0; offset < participants.length; offset += 50) {
  const batch = participants.slice(offset, offset + 50);
  const { body } = await apiRequest("/admin/participants/import", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Token": adminToken },
    body: JSON.stringify({
      cohort: {
        id: cohortId,
        name: `Synthetic local load ${runId}`,
        starts_at: new Date(now.getTime() - 300_000).toISOString(),
        expires_at: new Date(now.getTime() + 86_400_000).toISOString(),
        retention_days: 1
      },
      participants: batch,
      rotate_existing_tokens: true
    })
  });
  imported.push(...body.participants);
}
if (imported.length !== participantCount || imported.some((participant) => !participant.token)) {
  throw new Error("Participant import did not return every one-time token.");
}

const jobs = [];
for (let participantIndex = 0; participantIndex < imported.length; participantIndex += 1) {
  const participant = imported[participantIndex];
  for (const quizId of quizIds) jobs.push({ participant, participantIndex, quizId });
}

let nextJob = 0;
let submitted = 0;
const receipts = new Set();
async function runner() {
  while (true) {
    const jobIndex = nextJob;
    nextJob += 1;
    if (jobIndex >= jobs.length) return;
    const { participant, participantIndex, quizId } = jobs[jobIndex];
    const originHeaders = {
      Authorization: `Bearer ${participant.token}`,
      Origin: "https://jjohana.github.io",
      // The local-only synthetic address distributes requests across limiter keys.
      "CF-Connecting-IP": `198.18.${Math.floor(participantIndex / 250)}.${(participantIndex % 250) + 1}`
    };
    const { body: session } = await apiRequest(`/v2/session?test_id=${encodeURIComponent(quizId)}&quiz_version=${QUIZ_VERSION}`, {
      headers: originHeaders
    });
    const quiz = findQuiz(quizId, QUIZ_VERSION);
    for (let attempt = 0; attempt < attemptsPerQuiz; attempt += 1) {
      const started = new Date(now.getTime() + attempt * 1000);
      const idempotencyKey = crypto.randomUUID();
      const options = {
        method: "POST",
        headers: { ...originHeaders, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
        body: JSON.stringify({
          session_id: session.session_id,
          test_id: quizId,
          quiz_version: QUIZ_VERSION,
          answers: quiz.answerKey,
          attempt_started_at: started.toISOString(),
          completed_at: new Date(started.getTime() + 600_000).toISOString(),
          duration_seconds: 600,
          privacy_notice_version: "2026-07-09",
          privacy_acknowledged: true
        })
      };
      const { body: result } = await apiRequest("/v2/submit", options);
      const { body: replay } = await apiRequest("/v2/submit", options);
      const combinedSectionsValid = !quiz.sections || (
        Array.isArray(result.score.sections) &&
        result.score.sections.length === 2 &&
        result.score.sections.every((section) => section.correct === 25 && section.total === 25 && section.passed)
      );
      if (result.score.correct !== quiz.answerKey.length || !result.score.passed || !combinedSectionsValid || replay.receipt_id !== result.receipt_id || replay.idempotent_replay !== true) {
        throw new Error("Score or idempotency reconciliation failed.");
      }
      if (receipts.has(result.receipt_id)) throw new Error("Duplicate receipt id returned.");
      receipts.add(result.receipt_id);
      submitted += 1;
    }
  }
}

await Promise.all(Array.from({ length: Math.min(concurrency, jobs.length) }, () => runner()));

let cursor = null;
let exported = 0;
do {
  const params = new URLSearchParams({ cohort_id: cohortId, limit: "500" });
  if (cursor) params.set("cursor", cursor);
  const { body } = await apiRequest(`/admin/attempts?${params}`, { headers: { "X-Admin-Token": adminToken } });
  exported += body.count;
  cursor = body.next_cursor;
} while (cursor);

if (submitted !== expectedAttempts || exported !== expectedAttempts || receipts.size !== expectedAttempts) {
  throw new Error(`Reconciliation failed: expected=${expectedAttempts}, submitted=${submitted}, exported=${exported}, receipts=${receipts.size}`);
}

console.log(JSON.stringify({
  ok: true,
  local_only: true,
  cohort_id: cohortId,
  participants: participantCount,
  quiz_ids: quizIds,
  concurrency,
  attempts: submitted,
  idempotent_replays: submitted,
  exported
}));
