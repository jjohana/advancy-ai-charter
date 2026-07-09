import { DEFAULT_QUIZ_IDS, QUIZ_IDS, QUIZ_VERSION, findQuiz, scoreAnswers } from "./quizzes.js";

const API_VERSION = "2.0.0";
const PUBLIC_HEADERS = new Set(["authorization", "content-type", "idempotency-key", "x-request-id"]);
const ENROLLMENT_KEYS = new Set([
  "first_name",
  "last_name",
  "email",
  "quiz_id",
  "privacy_notice_version",
  "privacy_acknowledged"
]);
const SUBMISSION_KEYS = new Set([
  "session_id",
  "test_id",
  "quiz_version",
  "answers",
  "attempt_started_at",
  "completed_at",
  "duration_seconds",
  "evaluation",
  "privacy_notice_version",
  "privacy_acknowledged"
]);
const EVALUATION_RATINGS = [
  "training_relevance",
  "conceptual_clarity",
  "practical_applicability",
  "governance_confidence",
  "codex_workflow_confidence",
  "materials_quality",
  "pace_and_depth",
  "overall_satisfaction"
];
const EVALUATION_TEXT = [
  "most_valuable_takeaway",
  "improvement_suggestion",
  "suggested_ai_automation_use_cases"
];
const EVALUATION_KEYS = new Set([...EVALUATION_RATINGS, ...EVALUATION_TEXT, "recommend_training"]);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const INVITE_RE = /^inv_[A-Za-z0-9_-]{43}$/;
const ENROLLMENT_TOKEN_RE = /^enr_[A-Za-z0-9_-]{43}$/;
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,189}\.[^\s@]{2,63}$/;
const COHORT_RE = /^[a-z0-9][a-z0-9_-]{1,63}$/;

class HttpError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function envBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value).toLowerCase() === "true";
}

function envInteger(value, fallback, min, max) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertExactKeys(value, allowed, required, label) {
  if (!isPlainObject(value)) {
    throw new HttpError(400, "INVALID_PAYLOAD", `${label} must be a JSON object.`);
  }
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) {
      throw new HttpError(400, "UNKNOWN_FIELD", `${label} contains an unsupported field: ${key}.`);
    }
  }
  for (const key of required) {
    if (!(key in value)) {
      throw new HttpError(400, "MISSING_FIELD", `${label} is missing: ${key}.`);
    }
  }
}

function strictString(value, field, maxLength, allowEmpty = false) {
  if (typeof value !== "string") {
    throw new HttpError(400, "INVALID_FIELD", `${field} must be a string.`);
  }
  const result = value.trim();
  if ((!allowEmpty && result.length === 0) || result.length > maxLength || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(result)) {
    throw new HttpError(400, "INVALID_FIELD", `${field} is invalid.`);
  }
  return result;
}

function strictInteger(value, field, min, max) {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new HttpError(400, "INVALID_FIELD", `${field} must be an integer between ${min} and ${max}.`);
  }
  return value;
}

function strictIsoDate(value, field) {
  const text = strictString(value, field, 40);
  const timestamp = Date.parse(text);
  if (!Number.isFinite(timestamp)) {
    throw new HttpError(400, "INVALID_FIELD", `${field} must be an ISO-8601 timestamp.`);
  }
  return new Date(timestamp).toISOString();
}

function allowedOrigins(env) {
  return new Set(
    String(env.ALLOWED_ORIGINS || "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  );
}

function requirePublicOrigin(request, env) {
  const origin = request.headers.get("Origin") || "";
  if (!origin || !allowedOrigins(env).has(origin)) {
    throw new HttpError(403, "ORIGIN_NOT_ALLOWED", "This website origin is not allowed.");
  }
  return origin;
}

function requireNoAdminOrigin(request) {
  if (request.headers.has("Origin")) {
    throw new HttpError(403, "ADMIN_BROWSER_FORBIDDEN", "Admin endpoints do not accept browser-origin requests.");
  }
}

function responseHeaders(requestId, extra = {}) {
  return {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Request-ID": requestId,
    ...extra
  };
}

function jsonResponse(status, body, requestId, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: responseHeaders(requestId, extraHeaders)
  });
}

function textResponse(status, body, requestId, contentType, extraHeaders = {}) {
  return new Response(body, {
    status,
    headers: responseHeaders(requestId, { "Content-Type": contentType, ...extraHeaders })
  });
}

function withCors(response, origin) {
  if (!origin) return response;
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Expose-Headers", "X-Request-ID");
  headers.append("Vary", "Origin");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function errorResponse(error, requestId) {
  const known = error instanceof HttpError;
  const status = known ? error.status : 500;
  const payload = {
    ok: false,
    error: {
      code: known ? error.code : "INTERNAL_ERROR",
      message: known ? error.message : "The service could not complete the request.",
      request_id: requestId
    }
  };
  if (known && error.details !== undefined) payload.error.details = error.details;
  return jsonResponse(status, payload, requestId);
}

async function readJson(request, maxBytes) {
  const contentType = (request.headers.get("Content-Type") || "").split(";", 1)[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    throw new HttpError(415, "CONTENT_TYPE_REQUIRED", "Content-Type must be application/json.");
  }
  const declared = request.headers.get("Content-Length");
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > maxBytes)) {
    throw new HttpError(413, "PAYLOAD_TOO_LARGE", "The request body is too large.");
  }
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > maxBytes) {
    throw new HttpError(413, "PAYLOAD_TOO_LARGE", "The request body is too large.");
  }
  try {
    const parsed = JSON.parse(raw);
    if (!isPlainObject(parsed)) throw new Error("not an object");
    return parsed;
  } catch {
    throw new HttpError(400, "INVALID_JSON", "The request body must be a valid JSON object.");
  }
}

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  return [...digest].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function base64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function randomToken(prefix, byteLength = 32) {
  return `${prefix}${base64Url(crypto.getRandomValues(new Uint8Array(byteLength)))}`;
}

export async function deriveEnrollmentInviteToken(enrollmentToken, cohortId, email, idempotencyKey) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(enrollmentToken),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const message = `advancy-enrollment-v1\u0000${cohortId}\u0000${email}\u0000${idempotencyKey}`;
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message)));
  return `inv_${base64Url(signature)}`;
}

async function safeSecretEqual(left, right) {
  if (!left || !right) return false;
  const [a, b] = await Promise.all([sha256Hex(left), sha256Hex(right)]);
  let mismatch = a.length ^ b.length;
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    mismatch |= (a.charCodeAt(index) || 0) ^ (b.charCodeAt(index) || 0);
  }
  return mismatch === 0;
}

function bearerToken(request) {
  const authorization = request.headers.get("Authorization") || "";
  const match = authorization.match(/^Bearer ([^\s]+)$/);
  return match ? match[1] : "";
}

async function requireAdmin(request, env) {
  requireNoAdminOrigin(request);
  const supplied = request.headers.get("X-Admin-Token") || bearerToken(request);
  if (!env.ADMIN_TOKEN || !(await safeSecretEqual(supplied, env.ADMIN_TOKEN))) {
    throw new HttpError(401, "ADMIN_UNAUTHORIZED", "Admin authentication failed.");
  }
}

async function requirePublicRateLimit(request, env) {
  if (!env.PUBLIC_RATE_LIMITER) return;
  const source = request.headers.get("CF-Connecting-IP") || "local-development";
  const key = await sha256Hex(`${source}:${new URL(request.url).pathname}`);
  const outcome = await env.PUBLIC_RATE_LIMITER.limit({ key });
  if (!outcome.success) {
    throw new HttpError(429, "RATE_LIMITED", "Too many requests. Please wait before trying again.");
  }
}

async function requireEnrollmentAccess(request, env) {
  if (!envBoolean(env.SELF_ENROLLMENT_ENABLED, false)) {
    throw new HttpError(404, "SELF_ENROLLMENT_DISABLED", "Self-enrollment is not available.");
  }
  const configured = String(env.ENROLLMENT_TOKEN || "");
  const supplied = bearerToken(request);
  if (!ENROLLMENT_TOKEN_RE.test(configured)) {
    throw new HttpError(503, "SELF_ENROLLMENT_NOT_CONFIGURED", "Self-enrollment is not configured.");
  }
  if (!ENROLLMENT_TOKEN_RE.test(supplied) || !(await safeSecretEqual(supplied, configured))) {
    throw new HttpError(401, "ENROLLMENT_UNAUTHORIZED", "The enrollment credential is invalid.");
  }
}

async function requireEnrollmentRateLimit(request, env, email) {
  if (!env.ENROLLMENT_RATE_LIMITER) return;
  const source = request.headers.get("CF-Connecting-IP") || "local-development";
  const key = await sha256Hex(`${source}:${email}`);
  const outcome = await env.ENROLLMENT_RATE_LIMITER.limit({ key });
  if (!outcome.success) {
    throw new HttpError(429, "ENROLLMENT_RATE_LIMITED", "Too many enrollment attempts. Please wait before trying again.");
  }
}

async function participantSession(request, env, quizId) {
  const token = bearerToken(request);
  if (!INVITE_RE.test(token)) {
    throw new HttpError(401, "INVITATION_INVALID", "The invitation is invalid or no longer active.");
  }
  const tokenHash = await sha256Hex(token);
  const row = await env.DB.prepare(`
    SELECT
      p.id AS participant_id, p.first_name, p.last_name, p.expires_at AS participant_expires_at,
      pq.session_id, pq.quiz_id, pq.max_attempts_override, pq.enabled,
      c.id AS cohort_id, c.name AS cohort_name, c.active AS cohort_active,
      c.starts_at AS cohort_starts_at, c.expires_at AS cohort_expires_at
    FROM participants p
    JOIN cohorts c ON c.id = p.cohort_id
    JOIN participant_quizzes pq ON pq.participant_id = p.id
    WHERE p.token_hash = ? AND p.active = 1 AND pq.quiz_id = ?
  `).bind(tokenHash, quizId).first();

  if (!row || row.enabled !== 1) {
    throw new HttpError(401, "INVITATION_INVALID", "The invitation is invalid or no longer active.");
  }
  const now = Date.now();
  if (row.cohort_active !== 1 || now < Date.parse(row.cohort_starts_at)) {
    throw new HttpError(403, "COHORT_NOT_ACTIVE", "This assessment cohort is not active yet.");
  }
  if (now >= Date.parse(row.cohort_expires_at) || now >= Date.parse(row.participant_expires_at)) {
    throw new HttpError(410, "INVITATION_EXPIRED", "This invitation has expired.");
  }
  return row;
}

function parseEvaluation(value) {
  const empty = Object.fromEntries([...EVALUATION_RATINGS, ...EVALUATION_TEXT, "recommend_training"].map((key) => [key, null]));
  if (value === undefined || value === null) return empty;
  assertExactKeys(value, EVALUATION_KEYS, [], "evaluation");
  for (const field of EVALUATION_RATINGS) {
    if (value[field] !== undefined && value[field] !== null) {
      empty[field] = strictInteger(value[field], `evaluation.${field}`, 1, 5);
    }
  }
  for (const field of EVALUATION_TEXT) {
    if (value[field] !== undefined && value[field] !== null) {
      const text = strictString(value[field], `evaluation.${field}`, 2000, true);
      empty[field] = text || null;
    }
  }
  if (value.recommend_training !== undefined && value.recommend_training !== null) {
    if (typeof value.recommend_training !== "boolean") {
      throw new HttpError(400, "INVALID_FIELD", "evaluation.recommend_training must be a boolean.");
    }
    empty.recommend_training = value.recommend_training ? 1 : 0;
  }
  return empty;
}

export function validateSubmission(payload, expectedPrivacyVersion) {
  assertExactKeys(
    payload,
    SUBMISSION_KEYS,
    ["session_id", "test_id", "quiz_version", "answers", "attempt_started_at", "completed_at", "duration_seconds", "privacy_notice_version", "privacy_acknowledged"],
    "submission"
  );
  const sessionId = strictString(payload.session_id, "session_id", 36);
  if (!UUID_RE.test(sessionId)) throw new HttpError(400, "INVALID_FIELD", "session_id is invalid.");
  const testId = strictString(payload.test_id, "test_id", 80);
  const quizVersion = strictString(payload.quiz_version, "quiz_version", 40);
  const quiz = findQuiz(testId, quizVersion);
  if (!quiz) throw new HttpError(400, "UNKNOWN_QUIZ_VERSION", "The assessment id or version is not supported.");
  if (!Array.isArray(payload.answers) || payload.answers.length !== quiz.answerKey.length || payload.answers.some((answer) => !Number.isInteger(answer) || answer < 0 || answer > 4)) {
    throw new HttpError(400, "INVALID_ANSWERS", `answers must contain exactly ${quiz.answerKey.length} integers from 0 to 4.`);
  }
  const startedAt = strictIsoDate(payload.attempt_started_at, "attempt_started_at");
  const completedAt = strictIsoDate(payload.completed_at, "completed_at");
  if (Date.parse(completedAt) < Date.parse(startedAt)) {
    throw new HttpError(400, "INVALID_TIMING", "completed_at cannot be earlier than attempt_started_at.");
  }
  const durationSeconds = strictInteger(payload.duration_seconds, "duration_seconds", 0, 86400);
  const privacyVersion = strictString(payload.privacy_notice_version, "privacy_notice_version", 40);
  if (privacyVersion !== expectedPrivacyVersion || payload.privacy_acknowledged !== true) {
    throw new HttpError(428, "PRIVACY_NOTICE_REQUIRED", "The current privacy notice must be acknowledged.", { expected_version: expectedPrivacyVersion });
  }
  return {
    sessionId,
    testId,
    quizVersion,
    quiz,
    answers: payload.answers,
    startedAt,
    completedAt,
    durationSeconds,
    privacyVersion,
    evaluation: parseEvaluation(payload.evaluation)
  };
}

function sqliteTimestamp(value) {
  if (!value) return null;
  return value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
}

function receiptFromAttempt(row) {
  if (!row) return null;
  const score = {
    correct: Number(row.correct),
    total: Number(row.total),
    percent: Number(row.percent),
    passed: Number(row.passed) === 1
  };
  const quiz = findQuiz(row.quiz_id, row.quiz_version);
  if (quiz?.sections && row.answers) {
    try {
      const sectionScore = scoreAnswers(quiz, JSON.parse(row.answers));
      score.sections = sectionScore.sections;
      score.passed = sectionScore.passed;
    } catch {
      // Historical receipts remain readable even if an old answers value is corrupt.
    }
  }
  return {
    receipt_id: row.receipt_id,
    submitted_at: sqliteTimestamp(row.submitted_at),
    attempt_number: Number(row.attempt_number),
    score
  };
}

async function latestAttempt(env, sessionId) {
  return env.DB.prepare(`
    SELECT receipt_id, submitted_at, attempt_number, correct, total, percent, passed,
      answers, quiz_id, quiz_version
    FROM attempts WHERE session_id = ? ORDER BY attempt_number DESC LIMIT 1
  `).bind(sessionId).first();
}

async function handleSession(request, env, requestId) {
  const url = new URL(request.url);
  for (const key of url.searchParams.keys()) {
    if (key !== "test_id" && key !== "quiz_version") {
      throw new HttpError(400, "UNKNOWN_QUERY_PARAMETER", `Unsupported query parameter: ${key}.`);
    }
  }
  const testId = strictString(url.searchParams.get("test_id"), "test_id", 80);
  const quizVersion = strictString(url.searchParams.get("quiz_version"), "quiz_version", 40);
  const quiz = findQuiz(testId, quizVersion);
  if (!quiz) throw new HttpError(400, "UNKNOWN_QUIZ_VERSION", "The assessment id or version is not supported.");
  const session = await participantSession(request, env, testId);
  const countRow = await env.DB.prepare("SELECT COUNT(*) AS count FROM attempts WHERE session_id = ?").bind(session.session_id).first();
  const attemptsUsed = Number(countRow?.count || 0);
  const maxAttempts = session.max_attempts_override ?? envInteger(env.MAX_ATTEMPTS_PER_QUIZ, 3, 1, 20);
  const latest = await latestAttempt(env, session.session_id);
  const receipt = receiptFromAttempt(latest);
  const expiresAt = new Date(Math.min(Date.parse(session.participant_expires_at), Date.parse(session.cohort_expires_at))).toISOString();
  return jsonResponse(200, {
    session_id: session.session_id,
    participant: { display_name: `${session.first_name} ${session.last_name}` },
    quiz: { id: quiz.id, version: quiz.version, name: quiz.name, total: quiz.answerKey.length, pass_percent: Math.round(quiz.passThreshold * 100) },
    expires_at: expiresAt,
    status: attemptsUsed > 0 ? "submitted" : "ready",
    can_submit: attemptsUsed < maxAttempts,
    attempts_used: attemptsUsed,
    max_attempts: maxAttempts,
    receipt,
    score: receipt?.score || null
  }, requestId);
}

function validateIdempotencyKey(request) {
  const key = request.headers.get("Idempotency-Key") || "";
  if (!UUID_RE.test(key)) {
    throw new HttpError(400, "IDEMPOTENCY_KEY_REQUIRED", "Idempotency-Key must be a UUID.");
  }
  return key.toLowerCase();
}

async function attemptByIdempotency(env, sessionId, key) {
  return env.DB.prepare(`
    SELECT receipt_id, submitted_at, attempt_number, correct, total, percent, passed,
      answers, quiz_id, quiz_version, submission_fingerprint
    FROM attempts WHERE session_id = ? AND idempotency_key = ? LIMIT 1
  `).bind(sessionId, key).first();
}

async function submissionFingerprint(parsed) {
  return sha256Hex(JSON.stringify({
    session_id: parsed.sessionId,
    test_id: parsed.testId,
    quiz_version: parsed.quizVersion,
    answers: parsed.answers,
    attempt_started_at: parsed.startedAt,
    completed_at: parsed.completedAt,
    duration_seconds: parsed.durationSeconds,
    privacy_notice_version: parsed.privacyVersion,
    evaluation: parsed.evaluation
  }));
}

function assertIdempotentMatch(row, fingerprint) {
  if (row && row.submission_fingerprint !== fingerprint) {
    throw new HttpError(409, "IDEMPOTENCY_KEY_REUSED", "This Idempotency-Key was already used for a different submission.");
  }
}

function submissionResponse(row, requestId, replay, status = 200) {
  const receipt = receiptFromAttempt(row);
  return jsonResponse(status, {
    ok: true,
    receipt_id: receipt.receipt_id,
    submitted_at: receipt.submitted_at,
    attempt_number: receipt.attempt_number,
    score: receipt.score,
    idempotent_replay: replay,
    request_id: requestId
  }, requestId);
}

async function handleSubmit(request, env, requestId) {
  const idempotencyKey = validateIdempotencyKey(request);
  const payload = await readJson(request, 20_000);
  const parsed = validateSubmission(payload, String(env.PRIVACY_NOTICE_VERSION || "2026-07-09"));
  const session = await participantSession(request, env, parsed.testId);
  if (session.session_id !== parsed.sessionId) {
    throw new HttpError(403, "SESSION_MISMATCH", "This invitation does not authorize the supplied session.");
  }

  const fingerprint = await submissionFingerprint(parsed);
  const prior = await attemptByIdempotency(env, session.session_id, idempotencyKey);
  assertIdempotentMatch(prior, fingerprint);
  if (prior) return submissionResponse(prior, requestId, true);

  const maxAttempts = session.max_attempts_override ?? envInteger(env.MAX_ATTEMPTS_PER_QUIZ, 3, 1, 20);
  const result = scoreAnswers(parsed.quiz, parsed.answers);
  const evaluation = parsed.evaluation;
  const attemptId = crypto.randomUUID();
  const receiptId = randomToken("rct_", 18);
  const insertion = await env.DB.prepare(`
    INSERT OR IGNORE INTO attempts (
      id, receipt_id, session_id, quiz_id, quiz_version, idempotency_key,
      submission_fingerprint, attempt_number,
      answers, correct, total, percent, passed, client_started_at, client_completed_at,
      duration_seconds, privacy_notice_version, privacy_acknowledged,
      training_relevance, conceptual_clarity, practical_applicability, governance_confidence,
      codex_workflow_confidence, materials_quality, pace_and_depth, overall_satisfaction,
      recommend_training, most_valuable_takeaway, improvement_suggestion,
      suggested_ai_automation_use_cases
    )
    SELECT ?, ?, ?, ?, ?, ?, ?,
      COALESCE((SELECT MAX(attempt_number) FROM attempts WHERE session_id = ?), 0) + 1,
      ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    WHERE (SELECT COUNT(*) FROM attempts WHERE session_id = ?) < ?
  `).bind(
    attemptId, receiptId, session.session_id, parsed.testId, parsed.quizVersion, idempotencyKey,
    fingerprint,
    session.session_id, JSON.stringify(parsed.answers), result.correct, result.total, result.percent,
    result.passed ? 1 : 0, parsed.startedAt, parsed.completedAt, parsed.durationSeconds,
    parsed.privacyVersion, evaluation.training_relevance, evaluation.conceptual_clarity,
    evaluation.practical_applicability, evaluation.governance_confidence,
    evaluation.codex_workflow_confidence, evaluation.materials_quality, evaluation.pace_and_depth,
    evaluation.overall_satisfaction, evaluation.recommend_training,
    evaluation.most_valuable_takeaway, evaluation.improvement_suggestion,
    evaluation.suggested_ai_automation_use_cases, session.session_id, maxAttempts
  ).run();

  let stored = await attemptByIdempotency(env, session.session_id, idempotencyKey);
  if (stored) {
    assertIdempotentMatch(stored, fingerprint);
    const inserted = Number(insertion.meta?.changes || 0) > 0;
    return submissionResponse(stored, requestId, !inserted, inserted ? 201 : 200);
  }

  const latest = await latestAttempt(env, session.session_id);
  throw new HttpError(409, "ATTEMPT_LIMIT_REACHED", "The maximum number of attempts has been reached.", {
    max_attempts: maxAttempts,
    receipt: receiptFromAttempt(latest)
  });
}

function normalizeEmail(value, field = "email") {
  const email = strictString(value, field, 254).toLowerCase();
  if (!EMAIL_RE.test(email)) throw new HttpError(400, "INVALID_EMAIL", `${field} is invalid.`);
  return email;
}

function allowedEmailDomains(env) {
  return new Set(String(env.ALLOWED_EMAIL_DOMAINS || "").split(",").map((item) => item.trim().toLowerCase()).filter(Boolean));
}

export function validateEnrollmentPayload(payload, env) {
  assertExactKeys(payload, ENROLLMENT_KEYS, [...ENROLLMENT_KEYS], "enrollment");
  const firstName = strictString(payload.first_name, "first_name", 120);
  const lastName = strictString(payload.last_name, "last_name", 120);
  const email = normalizeEmail(payload.email);
  const domains = allowedEmailDomains(env);
  const domain = email.slice(email.lastIndexOf("@") + 1);
  if (domains.size && !domains.has(domain)) {
    throw new HttpError(400, "EMAIL_DOMAIN_NOT_ALLOWED", "The email is not in an allowed domain.");
  }
  const quizId = strictString(payload.quiz_id, "quiz_id", 80);
  if (!DEFAULT_QUIZ_IDS.includes(quizId)) {
    throw new HttpError(400, "INVALID_QUIZ_ID", "quiz_id must identify a current combined assessment.");
  }
  const expectedPrivacyVersion = String(env.PRIVACY_NOTICE_VERSION || "2026-07-09");
  const privacyVersion = strictString(payload.privacy_notice_version, "privacy_notice_version", 40);
  if (privacyVersion !== expectedPrivacyVersion || payload.privacy_acknowledged !== true) {
    throw new HttpError(428, "PRIVACY_NOTICE_REQUIRED", "The current privacy notice must be acknowledged.", { expected_version: expectedPrivacyVersion });
  }
  return { firstName, lastName, email, quizId, privacyVersion };
}

export async function enrollmentFingerprint(input, cohortId) {
  return sha256Hex(JSON.stringify({
    cohort_id: cohortId,
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    quiz_id: input.quizId,
    privacy_notice_version: input.privacyVersion,
    privacy_acknowledged: true
  }));
}

export function rejectExistingEnrollment(participant) {
  if (participant && Number(participant.active) === 1 && !participant.revoked_at) {
    throw new HttpError(409, "ENROLLMENT_USED", "This email has already completed enrollment.");
  }
  if (participant) {
    throw new HttpError(403, "PARTICIPANT_REVOKED", "This participant is not allowed to self-enroll.");
  }
  throw new HttpError(503, "ENROLLMENT_FAILED", "Enrollment could not be completed.");
}

function selfEnrollmentConfig(env) {
  try {
    const id = strictString(env.SELF_ENROLLMENT_COHORT_ID, "SELF_ENROLLMENT_COHORT_ID", 64).toLowerCase();
    if (!COHORT_RE.test(id)) throw new Error("invalid cohort id");
    const name = strictString(env.SELF_ENROLLMENT_COHORT_NAME, "SELF_ENROLLMENT_COHORT_NAME", 160);
    const expiresAt = strictIsoDate(env.SELF_ENROLLMENT_COHORT_EXPIRES_AT, "SELF_ENROLLMENT_COHORT_EXPIRES_AT");
    if (Date.parse(expiresAt) <= Date.now()) throw new Error("expired cohort");
    return {
      id,
      name,
      expiresAt,
      retentionDays: envInteger(env.RETENTION_DAYS, 365, 1, 365)
    };
  } catch {
    throw new HttpError(503, "SELF_ENROLLMENT_NOT_CONFIGURED", "The enrollment cohort configuration is invalid.");
  }
}

async function handleEnrollment(request, env, requestId) {
  await requireEnrollmentAccess(request, env);
  const idempotencyKey = validateIdempotencyKey(request);
  const payload = await readJson(request, 10_000);
  const input = validateEnrollmentPayload(payload, env);
  await requireEnrollmentRateLimit(request, env, input.email);
  const configuredCohort = selfEnrollmentConfig(env);
  const now = new Date();
  const startsAt = new Date(now.getTime() - 60_000).toISOString();

  await env.DB.prepare(`
    INSERT INTO cohorts (id, name, active, starts_at, expires_at, retention_days, created_at, updated_at)
    VALUES (?, ?, 1, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO NOTHING
  `).bind(
    configuredCohort.id,
    configuredCohort.name,
    startsAt,
    configuredCohort.expiresAt,
    configuredCohort.retentionDays
  ).run();
  const cohort = await env.DB.prepare(`
    SELECT id, active, starts_at, expires_at FROM cohorts WHERE id = ?
  `).bind(configuredCohort.id).first();
  if (!cohort) throw new HttpError(503, "SELF_ENROLLMENT_NOT_CONFIGURED", "The enrollment cohort is unavailable.");
  if (Number(cohort.active) !== 1 || Date.parse(cohort.starts_at) > now.getTime()) {
    throw new HttpError(403, "COHORT_NOT_ACTIVE", "This enrollment cohort is not active.");
  }
  const storedCohortExpiry = Date.parse(cohort.expires_at);
  if (!Number.isFinite(storedCohortExpiry)) {
    throw new HttpError(503, "SELF_ENROLLMENT_NOT_CONFIGURED", "The enrollment cohort has an invalid expiry.");
  }
  if (storedCohortExpiry <= now.getTime()) {
    throw new HttpError(410, "COHORT_EXPIRED", "This enrollment cohort has expired.");
  }
  const invitationTtlDays = envInteger(env.INVITATION_TTL_DAYS, 90, 1, 3650);
  const expiresAt = new Date(Math.min(
    storedCohortExpiry,
    now.getTime() + invitationTtlDays * 86_400_000
  )).toISOString();
  const inviteToken = await deriveEnrollmentInviteToken(
    String(env.ENROLLMENT_TOKEN),
    cohort.id,
    input.email,
    idempotencyKey
  );
  const tokenHash = await sha256Hex(inviteToken);
  const idempotencyHash = await sha256Hex(`advancy-enrollment-idempotency-v1\u0000${idempotencyKey}`);
  const fingerprint = await enrollmentFingerprint(input, cohort.id);
  const proposedParticipantId = crypto.randomUUID();

  const participant = await env.DB.prepare(`
    INSERT INTO participants (
      id, cohort_id, first_name, last_name, email, token_hash, active, expires_at,
      revoked_at, enrollment_idempotency_hash, enrollment_fingerprint,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, 1, ?, NULL, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT DO NOTHING
    RETURNING id
  `).bind(
    proposedParticipantId,
    cohort.id,
    input.firstName,
    input.lastName,
    input.email,
    tokenHash,
    expiresAt,
    idempotencyHash,
    fingerprint
  ).first();
  let stored = await env.DB.prepare(`
    SELECT id, first_name, last_name, email, token_hash, active, expires_at, revoked_at,
      enrollment_fingerprint
    FROM participants
    WHERE cohort_id = ? AND enrollment_idempotency_hash = ?
  `).bind(cohort.id, idempotencyHash).first();
  const inserted = Boolean(participant?.id);
  if (!stored) {
    const existing = await env.DB.prepare(`
      SELECT id, active, revoked_at FROM participants WHERE cohort_id = ? AND email = ?
    `).bind(cohort.id, input.email).first();
    rejectExistingEnrollment(existing);
  }
  if (!(await safeSecretEqual(stored.enrollment_fingerprint, fingerprint))) {
    throw new HttpError(409, "IDEMPOTENCY_KEY_REUSED", "This Idempotency-Key was already used for different enrollment data.");
  }
  if (Number(stored.active) !== 1 || stored.revoked_at) {
    throw new HttpError(403, "PARTICIPANT_REVOKED", "This participant is not allowed to self-enroll.");
  }
  if (!(await safeSecretEqual(stored.token_hash, tokenHash))) {
    throw new HttpError(409, "ENROLLMENT_USED", "This enrollment has already been replaced by an administrator-issued credential.");
  }

  const assignments = DEFAULT_QUIZ_IDS.map((quizId) => env.DB.prepare(`
    INSERT INTO participant_quizzes (session_id, participant_id, quiz_id, max_attempts_override, enabled)
    VALUES (?, ?, ?, NULL, 1)
    ON CONFLICT(participant_id, quiz_id) DO NOTHING
  `).bind(crypto.randomUUID(), stored.id, quizId));
  if (inserted) {
    assignments.push(env.DB.prepare(`
      INSERT INTO admin_events (id, event_type, target_id, affected_count, request_id)
      VALUES (?, 'participant_self_enrolled', ?, 1, ?)
    `).bind(crypto.randomUUID(), stored.id, requestId));
  }
  await env.DB.batch(assignments);

  return jsonResponse(200, {
    ok: true,
    participant_id: stored.id,
    invite_token: inviteToken,
    participant: { display_name: `${stored.first_name} ${stored.last_name}` },
    expires_at: stored.expires_at,
    request_id: requestId
  }, requestId);
}

export function validateImport(payload, env) {
  const topKeys = new Set(["cohort", "participants", "expires_in_days", "max_attempts", "rotate_existing_tokens"]);
  assertExactKeys(payload, topKeys, ["cohort", "participants"], "import");
  const cohortKeys = new Set(["id", "name", "starts_at", "expires_at", "retention_days"]);
  assertExactKeys(payload.cohort, cohortKeys, ["id", "name", "starts_at", "expires_at"], "cohort");
  const cohortId = strictString(payload.cohort.id, "cohort.id", 64).toLowerCase();
  if (!COHORT_RE.test(cohortId)) throw new HttpError(400, "INVALID_COHORT", "cohort.id must be a lowercase slug.");
  const cohortName = strictString(payload.cohort.name, "cohort.name", 160);
  const cohortStartsAt = strictIsoDate(payload.cohort.starts_at, "cohort.starts_at");
  const cohortExpiresAt = strictIsoDate(payload.cohort.expires_at, "cohort.expires_at");
  if (Date.parse(cohortStartsAt) >= Date.parse(cohortExpiresAt) || Date.parse(cohortExpiresAt) <= Date.now()) {
    throw new HttpError(400, "INVALID_COHORT_WINDOW", "The cohort validity window is invalid or already over.");
  }
  const retentionDays = payload.cohort.retention_days === undefined
    ? envInteger(env.RETENTION_DAYS, 365, 1, 365)
    : strictInteger(payload.cohort.retention_days, "cohort.retention_days", 1, 365);
  if (!Array.isArray(payload.participants) || payload.participants.length < 1 || payload.participants.length > 50) {
    throw new HttpError(400, "INVALID_BATCH_SIZE", "participants must contain between 1 and 50 entries.");
  }
  const expiresInDays = payload.expires_in_days === undefined
    ? envInteger(env.INVITATION_TTL_DAYS, 90, 1, 3650)
    : strictInteger(payload.expires_in_days, "expires_in_days", 1, 3650);
  const defaultMax = payload.max_attempts === undefined ? null : strictInteger(payload.max_attempts, "max_attempts", 1, 20);
  if (payload.rotate_existing_tokens !== undefined && typeof payload.rotate_existing_tokens !== "boolean") {
    throw new HttpError(400, "INVALID_FIELD", "rotate_existing_tokens must be a boolean.");
  }
  const rotate = payload.rotate_existing_tokens === true;
  const domains = allowedEmailDomains(env);
  const participantKeys = new Set(["first_name", "last_name", "email", "expires_at", "max_attempts", "quiz_ids"]);
  const seen = new Set();
  const defaultExpiryMs = Math.min(Date.now() + expiresInDays * 86400_000, Date.parse(cohortExpiresAt));
  const participants = payload.participants.map((item, index) => {
    assertExactKeys(item, participantKeys, ["first_name", "last_name", "email"], `participants[${index}]`);
    const firstName = strictString(item.first_name, `participants[${index}].first_name`, 120);
    const lastName = strictString(item.last_name, `participants[${index}].last_name`, 120);
    const email = normalizeEmail(item.email, `participants[${index}].email`);
    const domain = email.slice(email.lastIndexOf("@") + 1);
    if (domains.size && !domains.has(domain)) {
      throw new HttpError(400, "EMAIL_DOMAIN_NOT_ALLOWED", `${email} is not in an allowed email domain.`);
    }
    if (seen.has(email)) throw new HttpError(400, "DUPLICATE_EMAIL", `The batch contains duplicate email: ${email}.`);
    seen.add(email);
    const expiry = item.expires_at === undefined ? new Date(defaultExpiryMs).toISOString() : strictIsoDate(item.expires_at, `participants[${index}].expires_at`);
    if (Date.parse(expiry) <= Date.now() || Date.parse(expiry) > Date.parse(cohortExpiresAt)) {
      throw new HttpError(400, "INVALID_INVITATION_EXPIRY", `The invitation expiry for ${email} is outside the cohort window.`);
    }
    const maxAttempts = item.max_attempts === undefined ? defaultMax : strictInteger(item.max_attempts, `participants[${index}].max_attempts`, 1, 20);
    const quizIds = item.quiz_ids === undefined ? [...DEFAULT_QUIZ_IDS] : item.quiz_ids;
    if (!Array.isArray(quizIds) || quizIds.length < 1 || new Set(quizIds).size !== quizIds.length || quizIds.some((id) => !QUIZ_IDS.includes(id))) {
      throw new HttpError(400, "INVALID_QUIZ_IDS", `participants[${index}].quiz_ids is invalid.`);
    }
    return { firstName, lastName, email, expiry, maxAttempts, quizIds };
  });
  return {
    cohort: { id: cohortId, name: cohortName, startsAt: cohortStartsAt, expiresAt: cohortExpiresAt, retentionDays },
    participants,
    rotate
  };
}

async function handleAdminImport(request, env, requestId) {
  await requireAdmin(request, env);
  const payload = await readJson(request, 250_000);
  const input = validateImport(payload, env);
  const placeholders = input.participants.map(() => "?").join(",");
  const existingResult = await env.DB.prepare(`
    SELECT id, email, token_hash, active FROM participants
    WHERE cohort_id = ? AND email IN (${placeholders})
  `).bind(input.cohort.id, ...input.participants.map((item) => item.email)).all();
  const existingByEmail = new Map((existingResult.results || []).map((row) => [String(row.email).toLowerCase(), row]));
  for (const item of input.participants) {
    const existing = existingByEmail.get(item.email);
    if (existing && Number(existing.active) !== 1 && !input.rotate) {
      throw new HttpError(409, "PARTICIPANT_REVOKED", `${item.email} is revoked; token rotation is required to reactivate it.`);
    }
  }

  const prepared = await Promise.all(input.participants.map(async (item) => {
    const existing = existingByEmail.get(item.email);
    const participantId = existing?.id || crypto.randomUUID();
    const rawToken = !existing || input.rotate ? randomToken("inv_") : null;
    const tokenHash = rawToken ? await sha256Hex(rawToken) : existing.token_hash;
    return { ...item, existing, participantId, rawToken, tokenHash };
  }));

  const statements = [env.DB.prepare(`
    INSERT INTO cohorts (id, name, active, starts_at, expires_at, retention_days, created_at, updated_at)
    VALUES (?, ?, 1, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET name = excluded.name, active = 1,
      starts_at = excluded.starts_at, expires_at = excluded.expires_at,
      retention_days = excluded.retention_days, updated_at = CURRENT_TIMESTAMP
  `).bind(input.cohort.id, input.cohort.name, input.cohort.startsAt, input.cohort.expiresAt, input.cohort.retentionDays)];

  for (const item of prepared) {
    if (item.existing) {
      statements.push(env.DB.prepare(`
        UPDATE participants SET first_name = ?, last_name = ?, token_hash = ?, active = 1,
          expires_at = ?, revoked_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `).bind(item.firstName, item.lastName, item.tokenHash, item.expiry, item.participantId));
    } else {
      statements.push(env.DB.prepare(`
        INSERT INTO participants (id, cohort_id, first_name, last_name, email, token_hash, expires_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(item.participantId, input.cohort.id, item.firstName, item.lastName, item.email, item.tokenHash, item.expiry));
    }
    for (const quizId of item.quizIds) {
      statements.push(env.DB.prepare(`
        INSERT INTO participant_quizzes (session_id, participant_id, quiz_id, max_attempts_override, enabled)
        VALUES (?, ?, ?, ?, 1)
        ON CONFLICT(participant_id, quiz_id) DO UPDATE SET
          max_attempts_override = excluded.max_attempts_override, enabled = 1
      `).bind(crypto.randomUUID(), item.participantId, quizId, item.maxAttempts));
    }
  }
  statements.push(env.DB.prepare(`
    INSERT INTO admin_events (id, event_type, target_id, affected_count, request_id)
    VALUES (?, 'participants_imported', ?, ?, ?)
  `).bind(crypto.randomUUID(), input.cohort.id, prepared.length, requestId));
  await env.DB.batch(statements);

  return jsonResponse(200, {
    ok: true,
    cohort_id: input.cohort.id,
    count: prepared.length,
    participants: prepared.map((item) => ({
      participant_id: item.participantId,
      email: item.email,
      token: item.rawToken,
      token_status: item.rawToken ? (item.existing ? "rotated" : "created") : "unchanged",
      expires_at: item.expiry,
      quiz_ids: item.quizIds
    })),
    request_id: requestId
  }, requestId);
}

export function encodeCursor(value) {
  return btoa(JSON.stringify(value)).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

export function decodeCursor(value) {
  if (!value) return null;
  if (value.length > 500 || !/^[A-Za-z0-9_-]+$/.test(value)) throw new HttpError(400, "INVALID_CURSOR", "The cursor is invalid.");
  try {
    const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "=".repeat((4 - (value.length % 4)) % 4);
    const result = JSON.parse(atob(padded));
    if (!isPlainObject(result) || typeof result.submitted_at !== "string" || typeof result.id !== "string") throw new Error("bad cursor");
    return result;
  } catch {
    throw new HttpError(400, "INVALID_CURSOR", "The cursor is invalid.");
  }
}

export function csvCell(value) {
  let text = value === null || value === undefined ? "" : String(value);
  if (/^[\t\r]|^\s*[=+\-@]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const EXPORT_COLUMNS = [
  "cohort_id", "receipt_id", "quiz_id", "quiz_version", "attempt_number", "first_name", "last_name", "email",
  "answers", "correct", "total", "percent", "passed", "client_started_at", "client_completed_at", "duration_seconds",
  "privacy_notice_version", ...EVALUATION_RATINGS, "recommend_training", ...EVALUATION_TEXT, "submitted_at"
];

async function handleAdminExport(request, env, requestId) {
  await requireAdmin(request, env);
  const url = new URL(request.url);
  const allowed = new Set(["format", "test_id", "quiz_version", "cohort_id", "limit", "cursor"]);
  for (const key of url.searchParams.keys()) if (!allowed.has(key)) throw new HttpError(400, "UNKNOWN_QUERY_PARAMETER", `Unsupported query parameter: ${key}.`);
  const format = url.searchParams.get("format") || "json";
  if (format !== "json" && format !== "csv") throw new HttpError(400, "INVALID_FORMAT", "format must be json or csv.");
  const testId = url.searchParams.get("test_id");
  if (testId && !QUIZ_IDS.includes(testId)) throw new HttpError(400, "INVALID_TEST_ID", "test_id is invalid.");
  const quizVersion = url.searchParams.get("quiz_version");
  if (quizVersion && quizVersion !== QUIZ_VERSION) throw new HttpError(400, "INVALID_QUIZ_VERSION", "quiz_version is invalid.");
  const cohortId = url.searchParams.get("cohort_id");
  if (cohortId && !COHORT_RE.test(cohortId)) throw new HttpError(400, "INVALID_COHORT", "cohort_id is invalid.");
  const limitText = url.searchParams.get("limit") || "100";
  if (!/^\d+$/.test(limitText)) throw new HttpError(400, "INVALID_LIMIT", "limit is invalid.");
  const limit = envInteger(limitText, 100, 1, 500);
  const cursor = decodeCursor(url.searchParams.get("cursor"));
  const conditions = [];
  const binds = [];
  if (testId) { conditions.push("a.quiz_id = ?"); binds.push(testId); }
  if (quizVersion) { conditions.push("a.quiz_version = ?"); binds.push(quizVersion); }
  if (cohortId) { conditions.push("p.cohort_id = ?"); binds.push(cohortId); }
  if (cursor) {
    conditions.push("(a.submitted_at < ? OR (a.submitted_at = ? AND a.id < ?))");
    binds.push(cursor.submitted_at, cursor.submitted_at, cursor.id);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const result = await env.DB.prepare(`
    SELECT p.cohort_id, a.id AS _cursor_id, a.receipt_id, a.quiz_id, a.quiz_version,
      a.attempt_number, p.first_name, p.last_name, p.email, a.answers, a.correct, a.total,
      a.percent, a.passed, a.client_started_at, a.client_completed_at, a.duration_seconds,
      a.privacy_notice_version, a.training_relevance, a.conceptual_clarity,
      a.practical_applicability, a.governance_confidence, a.codex_workflow_confidence,
      a.materials_quality, a.pace_and_depth, a.overall_satisfaction, a.recommend_training,
      a.most_valuable_takeaway, a.improvement_suggestion,
      a.suggested_ai_automation_use_cases, a.submitted_at
    FROM attempts a
    JOIN participant_quizzes pq ON pq.session_id = a.session_id
    JOIN participants p ON p.id = pq.participant_id
    ${where}
    ORDER BY a.submitted_at DESC, a.id DESC LIMIT ?
  `).bind(...binds, limit + 1).all();
  const fetched = result.results || [];
  const hasMore = fetched.length > limit;
  const selected = fetched.slice(0, limit);
  const last = selected.at(-1);
  const nextCursor = hasMore && last ? encodeCursor({ submitted_at: last.submitted_at, id: last._cursor_id }) : null;
  const rows = selected.map((row) => {
    const output = {};
    for (const column of EXPORT_COLUMNS) output[column] = row[column];
    output.passed = Number(output.passed) === 1;
    if (output.recommend_training !== null) output.recommend_training = Number(output.recommend_training) === 1;
    output.submitted_at = sqliteTimestamp(output.submitted_at);
    return output;
  });
  if (format === "csv") {
    const csv = [EXPORT_COLUMNS.join(","), ...rows.map((row) => EXPORT_COLUMNS.map((column) => csvCell(row[column])).join(","))].join("\r\n");
    return textResponse(200, `\uFEFF${csv}`, requestId, "text/csv; charset=utf-8", {
      "Content-Disposition": `attachment; filename="advancy-ai-attempts-${new Date().toISOString().slice(0, 10)}.csv"`,
      ...(nextCursor ? { "X-Next-Cursor": nextCursor } : {})
    });
  }
  return jsonResponse(200, { ok: true, count: rows.length, rows, next_cursor: nextCursor, request_id: requestId }, requestId);
}

async function handleLegacyExport(request, env, requestId) {
  await requireAdmin(request, env);
  const result = await env.DB.prepare(`
    SELECT test_id, first_name, last_name, email, correct, total, percent, passed,
      submission_count, received_at, updated_at FROM scores ORDER BY updated_at DESC LIMIT 500
  `).all();
  return jsonResponse(200, { ok: true, legacy_read_only: true, count: result.results?.length || 0, rows: result.results || [], request_id: requestId }, requestId);
}

async function handleParticipantMutation(request, env, requestId, participantId, action) {
  await requireAdmin(request, env);
  if (!UUID_RE.test(participantId)) throw new HttpError(400, "INVALID_PARTICIPANT_ID", "participant id is invalid.");
  const exists = await env.DB.prepare("SELECT id, cohort_id FROM participants WHERE id = ?").bind(participantId).first();
  if (!exists) throw new HttpError(404, "PARTICIPANT_NOT_FOUND", "Participant not found.");
  if (action === "revoke") {
    const replacementHash = await sha256Hex(randomToken("revoked_"));
    await env.DB.batch([
      env.DB.prepare("UPDATE participants SET active = 0, revoked_at = CURRENT_TIMESTAMP, token_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(replacementHash, participantId),
      env.DB.prepare("INSERT INTO admin_events (id, event_type, target_id, affected_count, request_id) VALUES (?, 'participant_revoked', ?, 1, ?)").bind(crypto.randomUUID(), participantId, requestId)
    ]);
    return jsonResponse(200, { ok: true, participant_id: participantId, status: "revoked", request_id: requestId }, requestId);
  }
  if (request.headers.get("X-Confirm-Participant") !== participantId) {
    throw new HttpError(400, "DELETE_CONFIRMATION_REQUIRED", "X-Confirm-Participant must exactly match the participant id.");
  }
  await env.DB.batch([
    env.DB.prepare("DELETE FROM participants WHERE id = ?").bind(participantId),
    env.DB.prepare("INSERT INTO admin_events (id, event_type, target_id, affected_count, request_id) VALUES (?, 'participant_deleted', ?, 1, ?)").bind(crypto.randomUUID(), participantId, requestId)
  ]);
  return jsonResponse(200, { ok: true, participant_id: participantId, status: "deleted", request_id: requestId }, requestId);
}

async function handleHealth(env, requestId) {
  try {
    const row = await env.DB.prepare(`
      SELECT
        (SELECT COUNT(*) FROM sqlite_master
          WHERE type = 'table' AND name IN ('cohorts', 'participants', 'participant_quizzes', 'attempts')) AS table_count,
        (SELECT COUNT(*) FROM pragma_table_info('attempts')
          WHERE name IN ('quiz_version', 'submission_fingerprint', 'privacy_notice_version')) AS attempt_column_count,
        (SELECT COUNT(*) FROM pragma_table_info('participants')
          WHERE name IN ('enrollment_idempotency_hash', 'enrollment_fingerprint')) AS enrollment_column_count
    `).first();
    if (
      Number(row?.table_count) !== 4 ||
      Number(row?.attempt_column_count) !== 3 ||
      Number(row?.enrollment_column_count) !== 2
    ) throw new Error("schema not ready");
    return jsonResponse(200, { ok: true, status: "healthy", database: "ready", api_version: API_VERSION }, requestId);
  } catch {
    throw new HttpError(503, "DATABASE_NOT_READY", "The database is not ready.");
  }
}

async function legacySubmit(request, env, requestId) {
  if (!envBoolean(env.LEGACY_SUBMISSIONS_ENABLED, false)) {
    throw new HttpError(410, "LEGACY_ENDPOINT_DISABLED", "This transitional endpoint is disabled. Use /v2/submit.");
  }
  const payload = await readJson(request, 100_000);
  const testId = strictString(payload.test_id, "test_id", 80);
  const quiz = findQuiz(testId, QUIZ_VERSION);
  if (!quiz) throw new HttpError(400, "INVALID_TEST_ID", "test_id is invalid.");
  const answersText = strictString(payload.answers, "answers", 300);
  const answers = answersText.split(/\s+/).map((letter) => "ABCDE".indexOf(letter.toUpperCase()));
  if (answers.length !== quiz.answerKey.length || answers.some((answer) => answer < 0)) throw new HttpError(400, "INVALID_ANSWERS", "answers is invalid.");
  const result = scoreAnswers(quiz, answers);
  const firstName = strictString(payload.first_name, "first_name", 120);
  const lastName = strictString(payload.last_name, "last_name", 120);
  const email = normalizeEmail(payload.email);
  await env.DB.prepare(`
    INSERT INTO scores (
      test_id, first_name_norm, last_name_norm, email, test_name, first_name, last_name,
      correct, total, percent, passed, answers, correct_answers, raw_json,
      submission_count, received_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', '{}', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT(test_id, first_name_norm, last_name_norm, email) DO UPDATE SET
      correct = excluded.correct, total = excluded.total, percent = excluded.percent,
      passed = excluded.passed, answers = excluded.answers,
      submission_count = scores.submission_count + 1, updated_at = CURRENT_TIMESTAMP
  `).bind(testId, firstName.toLowerCase(), lastName.toLowerCase(), email, quiz.name, firstName, lastName,
    result.correct, result.total, result.percent, result.passed ? "yes" : "no", answersText).run();
  return jsonResponse(200, { ok: true, legacy: true, request_id: requestId }, requestId);
}

async function preflight(request, env, requestId) {
  const origin = requirePublicOrigin(request, env);
  const requestedMethod = request.headers.get("Access-Control-Request-Method") || "";
  if (!new Set(["GET", "POST"]).has(requestedMethod.toUpperCase())) throw new HttpError(405, "METHOD_NOT_ALLOWED", "The requested method is not allowed.");
  const requestedHeaders = (request.headers.get("Access-Control-Request-Headers") || "").split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
  if (requestedHeaders.some((header) => !PUBLIC_HEADERS.has(header))) throw new HttpError(403, "HEADER_NOT_ALLOWED", "The preflight requested an unsupported header.");
  return withCors(new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type, Idempotency-Key, X-Request-ID",
      "Access-Control-Max-Age": "600",
      "Cache-Control": "no-store",
      "X-Request-ID": requestId
    }
  }), origin);
}

async function routeRequest(request, env, requestId) {
  const url = new URL(request.url);
  const path = url.pathname;
  if (request.method === "OPTIONS" && (path === "/v2/enroll" || path === "/v2/session" || path === "/v2/submit" || path === "/submit")) return preflight(request, env, requestId);
  if (request.method === "GET" && path === "/health") return handleHealth(env, requestId);

  if (path === "/v2/enroll" || path === "/v2/session" || path === "/v2/submit" || path === "/submit") {
    const origin = requirePublicOrigin(request, env);
    await requirePublicRateLimit(request, env);
    let response;
    if (request.method === "POST" && path === "/v2/enroll") response = await handleEnrollment(request, env, requestId);
    else if (request.method === "GET" && path === "/v2/session") response = await handleSession(request, env, requestId);
    else if (request.method === "POST" && path === "/v2/submit") response = await handleSubmit(request, env, requestId);
    else if (request.method === "POST" && path === "/submit") response = await legacySubmit(request, env, requestId);
    else throw new HttpError(405, "METHOD_NOT_ALLOWED", "The method is not allowed for this endpoint.");
    return withCors(response, origin);
  }

  if (request.method === "POST" && path === "/admin/participants/import") return handleAdminImport(request, env, requestId);
  if (request.method === "GET" && (path === "/admin/attempts" || path === "/admin/scores")) return handleAdminExport(request, env, requestId);
  if (request.method === "GET" && path === "/admin/legacy-scores") return handleLegacyExport(request, env, requestId);
  const mutation = path.match(/^\/admin\/participants\/([0-9a-f-]+)\/(revoke)$/i);
  if (request.method === "POST" && mutation) return handleParticipantMutation(request, env, requestId, mutation[1], "revoke");
  const deletion = path.match(/^\/admin\/participants\/([0-9a-f-]+)$/i);
  if (request.method === "DELETE" && deletion) return handleParticipantMutation(request, env, requestId, deletion[1], "delete");
  throw new HttpError(404, "NOT_FOUND", "Endpoint not found.");
}

function observablePath(path) {
  if (/^\/admin\/participants\/[0-9a-f-]+(?:\/revoke)?$/i.test(path)) {
    return path.endsWith("/revoke") ? "/admin/participants/:id/revoke" : "/admin/participants/:id";
  }
  return path;
}

async function purgeExpiredCohorts(env) {
  const requestId = `cron-${crypto.randomUUID()}`;
  const result = await env.DB.prepare(`
    DELETE FROM participants
    WHERE cohort_id IN (
      SELECT id FROM cohorts
      WHERE datetime(expires_at, '+' || retention_days || ' days') < CURRENT_TIMESTAMP
    )
  `).run();
  const count = Number(result.meta?.changes || 0);
  if (count > 0) {
    await env.DB.prepare(`
      INSERT INTO admin_events (id, event_type, target_id, affected_count, request_id)
      VALUES (?, 'retention_purge', NULL, ?, ?)
    `).bind(crypto.randomUUID(), count, requestId).run();
  }
  console.log(JSON.stringify({ event: "retention_purge", request_id: requestId, purged_participants: count }));
}

export default {
  async fetch(request, env) {
    const incoming = request.headers.get("X-Request-ID") || "";
    const requestId = UUID_RE.test(incoming) ? incoming.toLowerCase() : crypto.randomUUID();
    const started = Date.now();
    let response;
    try {
      response = await routeRequest(request, env, requestId);
    } catch (error) {
      if (!(error instanceof HttpError)) {
        console.error(JSON.stringify({ event: "request_error", request_id: requestId, error_name: error?.name || "Error" }));
      }
      response = errorResponse(error, requestId);
      const origin = request.headers.get("Origin") || "";
      const path = new URL(request.url).pathname;
      if (origin && allowedOrigins(env).has(origin) && (path.startsWith("/v2/") || path === "/submit")) response = withCors(response, origin);
    }
    console.log(JSON.stringify({
      event: "request_complete",
      request_id: requestId,
      method: request.method,
      path: observablePath(new URL(request.url).pathname),
      status: response.status,
      duration_ms: Date.now() - started
    }));
    return response;
  },

  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(purgeExpiredCohorts(env));
  }
};
