import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const questionsSource = readFileSync("questions.js", "utf8");
const expectedEvaluationCriteria = [
  { id: "training_relevance", label: "Relevance to consulting work and day-to-day delivery" },
  { id: "conceptual_clarity", label: "Clarity of LLM fundamentals, agent concepts and tool-routing principles" },
  { id: "practical_applicability", label: "Practical applicability of examples, workflows and exercises" },
  { id: "governance_confidence", label: "Confidence in applying governance, permissions and human-review gates" },
  { id: "overall_satisfaction", label: "Overall satisfaction with the training session" }
];

function loadQuestionContext(search) {
  const location = { search, pathname: "/", href: "https://example.test/" + search };
  const context = { window: { location, URL, URLSearchParams }, location, URL, URLSearchParams };
  vm.runInNewContext(questionsSource, context, { filename: "questions.js" });
  return context.window;
}

function validateQuestionSet(config, questions, expectedLength, label) {
  assert.ok(config && typeof config === "object", label + " quizConfig is required");
  assert.match(config.quizId, /^[a-z0-9][a-z0-9_-]{1,79}$/, label + " quizId is invalid");
  assert.equal(config.quizVersion, "2026-07-09", label + " has an unexpected quizVersion");
  assert.equal(config.privacyNoticeVersion, "2026-07-09", label + " has an unexpected privacy notice version");
  assert.equal(
    config.apiBase,
    "https://advancy-ai-score-api.advancy-ai-training.workers.dev",
    label + " production apiBase must use the approved Worker origin"
  );
  assert.ok(config.trainingEvaluation && typeof config.trainingEvaluation === "object",
    label + " must retain the post-QCM training evaluation");
  assert.equal(config.trainingEvaluation.title, "Training evaluation",
    label + " has an unexpected post-QCM evaluation title");
  assert.deepEqual(JSON.parse(JSON.stringify(config.trainingEvaluation.criteria)), expectedEvaluationCriteria,
    label + " must retain every post-QCM rating question");
  assert.ok(Array.isArray(questions), label + " quizQuestions must be an array");
  assert.equal(questions.length, expectedLength, label + " assessment has an unexpected question count");

  const questionTexts = new Set();
  questions.forEach((question, index) => {
    assert.equal(typeof question.q, "string", "question " + (index + 1) + " needs text");
    assert.ok(question.q.trim().length > 0, "question " + (index + 1) + " is empty");
    const normalizedQuestion = question.q.trim().toLowerCase();
    assert.ok(!questionTexts.has(normalizedQuestion), "question " + (index + 1) + " duplicates another question");
    questionTexts.add(normalizedQuestion);
    assert.ok(Number.isInteger(question.correct), "question " + (index + 1) + " needs a correct index");
    assert.ok(question.correct >= 0 && question.correct <= 4, "question " + (index + 1) + " correct index is invalid");
    assert.ok(Array.isArray(question.options), "question " + (index + 1) + " needs options");
    assert.equal(question.options.length, 5, "question " + (index + 1) + " must have five options");
    const optionTexts = new Set();
    question.options.forEach((option, optionIndex) => {
      assert.ok(option && typeof option.text === "string" && option.text.trim(), "question " + (index + 1) + " option " + optionIndex + " needs text");
      assert.ok(typeof option.why === "string" && option.why.trim(), "question " + (index + 1) + " option " + optionIndex + " needs feedback");
      const normalizedOption = option.text.trim().toLowerCase();
      assert.ok(!optionTexts.has(normalizedOption), "question " + (index + 1) + " has duplicate options");
      optionTexts.add(normalizedOption);
      assert.equal(/^Correct\b/.test(option.why), optionIndex === question.correct,
        "question " + (index + 1) + " feedback does not align with its correct index");
    });
  });
}

const landingContext = loadQuestionContext("");
const modeAware = landingContext.assessmentModes && typeof landingContext.assessmentModes === "object" &&
  landingContext.assessmentModes.normal && landingContext.assessmentModes.advanced;
let validatedLabel;
if (modeAware) {
  assert.ok(!landingContext.selectedAssessmentMode, "landing state must not preselect a mode");
  const normalContext = loadQuestionContext("?mode=normal");
  const advancedContext = loadQuestionContext("?mode=advanced");
  assert.equal(normalContext.selectedAssessmentMode, "normal", "Normal mode selection failed");
  assert.equal(advancedContext.selectedAssessmentMode, "advanced", "Advanced mode selection failed");
  validateQuestionSet(normalContext.quizConfig, normalContext.quizQuestions, 50, "Normal");
  validateQuestionSet(advancedContext.quizConfig, advancedContext.quizQuestions, 50, "Advanced");
  assert.notEqual(normalContext.quizConfig.quizId, advancedContext.quizConfig.quizId, "modes need distinct quiz IDs");
  assert.deepEqual(
    JSON.parse(JSON.stringify(normalContext.quizQuestions.slice(0, 25))),
    JSON.parse(JSON.stringify(advancedContext.quizQuestions.slice(0, 25))),
    "both modes must begin with the same 25 Charter questions"
  );
  validatedLabel = "Normal and Advanced modes (50 questions each)";
} else {
  validateQuestionSet(landingContext.quizConfig, landingContext.quizQuestions, 25, "Legacy source bank");
  validatedLabel = landingContext.quizConfig.quizId + " source bank (25 questions)";
}

const html = readFileSync("index.html", "utf8");
for (const contract of [
  'id="session-status"',
  'id="participant-name"',
  'id="privacy-acknowledged"',
  'class="privacy-confirmation" hidden',
  'id="mode-landing"',
  'href="?mode=normal"',
  'href="?mode=advanced"',
  'data-mode="normal"',
  'data-mode="advanced"',
  'id="assessment-experience"',
  'id="question-count-metric"',
  'id="change-mode"',
  'id="section-label"',
  'id="selected-mode-label"',
  'href="privacy.html"',
  'name="robots"',
  'name="referrer"',
  'Content-Security-Policy'
]) {
  assert.ok(html.includes(contract), "index.html is missing " + contract);
}

const app = readFileSync("app.js", "utf8");
for (const feedbackContract of [
  "most_valuable_takeaway",
  "Most valuable takeaway (optional)",
  "improvement_suggestion",
  "Improvement suggestion (optional)",
  "suggested_ai_automation_use_cases",
  "Suggested AI automation use cases (optional)",
  "Describe workflow ideas.",
  "recommend_training",
  "I would recommend this training."
]) {
  assert.ok(app.includes(feedbackContract), "app.js is missing post-QCM feedback field: " + feedbackContract);
}
assert.ok(!app.includes("Describe only non-confidential workflow ideas."),
  "the use-case prompt must not contain the removed non-confidential qualifier");
const resultStart = app.indexOf("function setResult");
const restartStart = app.indexOf("function restartAssessment", resultStart);
assert.ok(resultStart >= 0 && restartStart > resultStart &&
  app.slice(resultStart, restartStart).includes("createTrainingEvaluation(status)"),
  "the post-QCM result screen must render the training evaluation before secure submission");
for (const forbidden of ["correct_answers", "user_agent", "source_url", "raw_json", "enrollment_token"]) {
  assert.ok(!app.includes(forbidden), "app.js must not send " + forbidden);
}
const submissionBuilderStart = app.indexOf("function buildSubmissionPayload");
const submissionBuilderEnd = app.indexOf("async function postWithRetry", submissionBuilderStart);
assert.ok(submissionBuilderStart >= 0 && submissionBuilderEnd > submissionBuilderStart,
  "app.js must define the submission payload builder");
const submissionBuilder = app.slice(submissionBuilderStart, submissionBuilderEnd);
for (const identityField of ["first_name", "last_name", "email"]) {
  assert.ok(!submissionBuilder.includes(identityField), "assessment submissions must not include " + identityField);
}
assert.ok(app.includes("/v2/session"), "app.js must use the v2 session endpoint");
assert.ok(app.includes("/v2/submit"), "app.js must use the v2 submit endpoint");
assert.ok(app.includes("/v2/enroll"), "app.js must use the protected enrollment endpoint");
assert.ok(app.includes("Idempotency-Key"), "app.js must send an idempotency key");
for (const reliabilityContract of [
  "AbortController",
  "Retry-After",
  "requestTimeoutMs",
  "selectedAssessmentMode",
  "renderModeLanding",
  "configureSelectedMode",
  "changeAssessmentMode",
  "updateSectionContext",
  "Section 1 of 2",
  "Section 2 of 2",
  "value.sections",
  'id: "charter"',
  "result-section-",
  "retry-session",
  "validateSessionResponse",
  "validateSubmissionResponse",
  "validateEnrollmentResponse",
  "enrollmentStorageKey",
  "enrollmentIdempotencyStorageKey",
  "enrollmentPattern",
  'params.has("enroll")',
  "renderEnrollmentForm",
  "privacyConfirmationNode",
  "submitEnrollment",
  'quiz_id: config.quizId',
  'privacy_notice_version: config.privacyNoticeVersion',
  "safeSessionRemove(enrollmentStorageKey)",
  "@advancy.com",
  "state.lastSubmissionBody",
  "pendingStorageKey",
  "persistPendingSubmission",
  "restorePendingSubmission",
  "resumePersistedSubmission",
  "clearPendingSubmission",
  "serialized_payload",
  "showRecoveredSubmission",
  "baseline_attempts_used",
  "window.top !== window.self",
  "document.documentElement.replaceChildren()",
  'document.createElement("fieldset")',
  'document.createElement("legend")',
  'aria-live'
]) {
  assert.ok(app.includes(reliabilityContract), "app.js is missing reliability/accessibility contract: " + reliabilityContract);
}
assert.ok(app.includes("questions.length !== 50"), "selected modes must fail closed unless all 50 questions are loaded");
assert.ok(app.includes("sections.every(function (section) { return section.passed; })"),
  "combined pass must require both authoritative section results to pass");
assert.ok(app.slice(app.indexOf("function renderModeLanding"), app.indexOf("function configureSelectedMode")).includes("captureInviteToken()"),
  "the landing must secure and scrub the invitation before mode navigation");
const modeGuard = app.lastIndexOf("if (!selectedAssessmentMode)");
const finalSessionLoad = app.lastIndexOf("loadSession();");
assert.ok(modeGuard >= 0 && finalSessionLoad > modeGuard && app.slice(modeGuard, finalSessionLoad).includes("return;"),
  "the no-mode landing must return before any session API request");
assert.ok(!app.slice(app.indexOf("function changeAssessmentMode"), app.indexOf("function cleanApiBase")).includes("inviteToken"),
  "Change mode must not place the invitation token in navigation");
assert.ok(!app.slice(app.indexOf("function changeAssessmentMode"), app.indexOf("function cleanApiBase")).includes("enrollmentToken"),
  "Change mode must not place the enrollment token in navigation");
const captureStart = app.indexOf("function captureInviteToken");
const captureEnd = app.indexOf("function privacyAcknowledged", captureStart);
const captureContract = app.slice(captureStart, captureEnd);
assert.ok(captureStart >= 0 && captureEnd > captureStart &&
  captureContract.includes("window.history.replaceState") &&
  captureContract.includes("window.location.pathname + window.location.search"),
  "invite and enrollment fragments must be scrubbed immediately after capture");
for (const idempotencyCaptureContract of [
  "previousEnrollment !== fromEnrollmentFragment",
  "safeSessionGet(enrollmentIdempotencyStorageKey)",
  "safeSessionSet(enrollmentIdempotencyStorageKey, state.enrollmentIdempotencyKey)",
  "uuidPattern.test(storedIdempotencyKey) ? storedIdempotencyKey : createId()",
  "safeSessionRemove(enrollmentIdempotencyStorageKey)"
]) {
  assert.ok(captureContract.includes(idempotencyCaptureContract),
    "enrollment access capture is missing stable idempotency behavior: " + idempotencyCaptureContract);
}
assert.ok(!app.includes("safeLocalSet(enrollmentIdempotencyStorageKey") &&
  !app.includes("safeLocalGet(enrollmentIdempotencyStorageKey"),
  "the enrollment idempotency key must never use persistent localStorage");

const enrollmentRenderStart = app.indexOf("function renderEnrollmentForm");
const enrollmentPayloadStart = app.indexOf("function enrollmentFormPayload");
const enrollmentSubmitStart = app.indexOf("async function submitEnrollment", enrollmentPayloadStart);
const enrollmentSubmitEnd = app.indexOf("function renderCompletedGate", enrollmentSubmitStart);
assert.ok(enrollmentRenderStart >= 0 && enrollmentPayloadStart > enrollmentRenderStart &&
  app.slice(enrollmentRenderStart, enrollmentPayloadStart).includes("privacyConfirmationNode.hidden = true"),
  "protected registration must hide the duplicate sidebar privacy acknowledgement");
assert.ok(enrollmentPayloadStart >= 0 && enrollmentSubmitStart > enrollmentPayloadStart && enrollmentSubmitEnd > enrollmentSubmitStart,
  "app.js must define the enrollment form and submission flow");
const enrollmentPayloadBuilder = app.slice(enrollmentPayloadStart, enrollmentSubmitStart);
for (const field of ["first_name", "last_name", "email", "quiz_id", "privacy_notice_version", "privacy_acknowledged"]) {
  assert.ok(enrollmentPayloadBuilder.includes(field), "enrollment payload is missing " + field);
}
for (const forbiddenField of ["invite_token", "enrollment_token", "idempotency_key", "answers", "source_url"]) {
  assert.ok(!enrollmentPayloadBuilder.includes(forbiddenField), "enrollment payload must not include " + forbiddenField);
}
const enrollmentSubmit = app.slice(enrollmentSubmitStart, enrollmentSubmitEnd);
for (const enrollmentContract of [
  'apiBase() + "/v2/enroll"',
  '"Authorization": "Bearer " + state.enrollmentToken',
  '"Idempotency-Key": state.enrollmentIdempotencyKey',
  "body: JSON.stringify(prepared.payload)",
  "validate: validateEnrollmentResponse",
  "safeSessionSet(inviteStorageKey, response.invite_token)",
  "safeSessionRemove(enrollmentStorageKey)",
  "safeSessionRemove(enrollmentIdempotencyStorageKey)",
  'state.enrollmentToken = ""',
  'state.enrollmentIdempotencyKey = ""',
  "loadSession()"
]) {
  assert.ok(enrollmentSubmit.includes(enrollmentContract), "enrollment submission is missing contract: " + enrollmentContract);
}
assert.ok(app.includes('new Set(["ok", "participant_id", "invite_token", "participant", "expires_at", "request_id"])'),
  "enrollment responses must be checked against the exact v2 response keys");
const sessionLoaderStart = app.indexOf("async function loadSession");
const sessionRequestStart = app.indexOf("const base = apiBase();", sessionLoaderStart);
assert.ok(sessionLoaderStart >= 0 && sessionRequestStart > sessionLoaderStart &&
  app.slice(sessionLoaderStart, sessionRequestStart).includes("renderEnrollmentForm();"),
  "an enrollment credential must render registration before any session request");
assert.ok(app.slice(sessionLoaderStart, app.indexOf("function renderAccessGate", sessionLoaderStart))
  .includes("privacyConfirmationNode.hidden = !state.sessionReady"),
  "the sidebar privacy acknowledgement must appear only for a verified session");
assert.ok(
  app.includes("postWithRetry(state.lastSubmissionBody, statusNode)"),
  "explicit and automatic submission retries must reuse the exact serialized payload"
);
const submitFunctionStart = app.indexOf("async function submitAssessment");
const pendingWrite = app.indexOf("persistPendingSubmission();", submitFunctionStart);
const firstSubmit = app.indexOf("postWithRetry(state.lastSubmissionBody, statusNode)", submitFunctionStart);
assert.ok(submitFunctionStart >= 0 && pendingWrite > submitFunctionStart && firstSubmit > pendingWrite,
  "the exact pending submission must be stored before the first POST");
assert.ok(app.includes("safeSessionSet(pendingStorageKey"), "pending submission must use sessionStorage");
assert.ok(app.includes("safeSessionRemove(pendingStorageKey)"), "pending submission must be removed from sessionStorage");
assert.ok(app.includes("state.lastSubmissionBody = envelope.serialized_payload"),
  "reload recovery must reuse the stored serialized payload without reserialization");
assert.ok(app.includes("state.idempotencyKey = envelope.idempotency_key"),
  "reload recovery must reuse the stored idempotency key");
assert.ok((app.match(/clearPendingSubmission\(\);/g) || []).length >= 4,
  "pending submission must be cleared on success, recovery, restart, and invalid restore");

const css = readFileSync("styles.css", "utf8");
const privacy = readFileSync("privacy.html", "utf8");
for (const privacyContract of [
  "supplied through protected registration or by the authorized cohort administrator",
  "immediately removed from the browser address",
  "held only in session storage for the current browser tab",
  "random registration transaction identifier is stored beside the registration credential",
  "reload or interrupted request reuses the same registration",
  "both are removed after exchange for a participant invitation or when an invalid access link is opened"
]) {
  assert.ok(privacy.includes(privacyContract), "privacy.html is missing enrollment disclosure: " + privacyContract);
}
function cssColor(variable) {
  const match = css.match(new RegExp("--" + variable + ":\\s*(#[0-9a-fA-F]{6})"));
  assert.ok(match, "styles.css is missing --" + variable);
  return match[1];
}
function luminance(hex) {
  const channels = [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16) / 255)
    .map((value) => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}
function whiteContrast(hex) {
  return 1.05 / (luminance(hex) + 0.05);
}
assert.ok(whiteContrast(cssColor("advancy-orange-action")) >= 4.5, "primary button must meet WCAG AA contrast");
assert.ok(whiteContrast(cssColor("advancy-orange-action-hover")) >= 4.5, "hovered primary button must meet WCAG AA contrast");

console.log("Validated " + validatedLabel + ".");
