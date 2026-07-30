import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const questionsSource = readFileSync("questions.js", "utf8");
const location = { search: "", pathname: "/", href: "https://example.test/" };
const context = { window: { location }, location };
vm.runInNewContext(questionsSource, context, { filename: "questions.js" });

const config = context.window.quizConfig;
const questions = context.window.quizQuestions;

assert.ok(config && typeof config === "object", "quizConfig is required");
assert.equal(config.quizId, "advancy-ai-assessment-normal");
assert.equal(config.quizName, "Advancy AI Knowledge Assessment");
assert.equal(config.quizVersion, "2026-07-29");
assert.equal(config.privacyNoticeVersion, "2026-07-09");
assert.equal(config.apiBase, "https://advancy-ai-score-api.advancy-ai-training.workers.dev");
assert.equal(config.passThreshold, 0.7);
assert.deepEqual(
  JSON.parse(JSON.stringify(config.trainingEvaluation.criteria)),
  [{ id: "overall_satisfaction", label: "Overall satisfaction with the training and assessment" }],
  "feedback must remain one concise rating plus the optional comment rendered by app.js"
);

assert.ok(Array.isArray(questions));
assert.equal(questions.length, 20, "the assessment must contain exactly 20 questions");

const questionTexts = new Set();
questions.forEach((question, index) => {
  assert.equal(typeof question.q, "string", "question " + (index + 1) + " needs text");
  assert.ok(question.q.trim(), "question " + (index + 1) + " is empty");
  const normalizedQuestion = question.q.trim().toLowerCase();
  assert.ok(!questionTexts.has(normalizedQuestion), "question " + (index + 1) + " duplicates another question");
  questionTexts.add(normalizedQuestion);
  assert.equal(typeof question.source, "string", "question " + (index + 1) + " needs a source rationale");
  assert.ok(question.source.trim(), "question " + (index + 1) + " has an empty source rationale");
  assert.ok(Number.isInteger(question.correct) && question.correct >= 0 && question.correct <= 4,
    "question " + (index + 1) + " has an invalid correct index");
  assert.ok(Array.isArray(question.options));
  assert.equal(question.options.length, 5, "question " + (index + 1) + " must have five options");
  const optionTexts = new Set();
  question.options.forEach((option, optionIndex) => {
    assert.ok(option && typeof option.text === "string" && option.text.trim(),
      "question " + (index + 1) + " option " + (optionIndex + 1) + " needs text");
    assert.ok(typeof option.why === "string" && option.why.trim(),
      "question " + (index + 1) + " option " + (optionIndex + 1) + " needs feedback");
    const normalizedOption = option.text.trim().toLowerCase();
    assert.ok(!optionTexts.has(normalizedOption), "question " + (index + 1) + " has duplicate options");
    optionTexts.add(normalizedOption);
    assert.equal(/^Correct\b/.test(option.why), optionIndex === question.correct,
      "question " + (index + 1) + " feedback does not align with its single correct answer");
  });
});

assert.deepEqual(
  [0, 1, 2, 3, 4].map((answer) => questions.filter((question) => question.correct === answer).length),
  [4, 4, 4, 4, 4],
  "correct-answer positions must be balanced"
);

const surfaceQuestions = questions.filter((question) => question.source.includes("Advancy ChatGPT Enterprise Practical Usage & Credit Guide"));
assert.equal(surfaceQuestions.length, 2, "exactly two questions must apply the Advancy Chat, Work and Codex framework");
assert.ok(surfaceQuestions.every((question) => /Chat|Work|Codex/.test(question.q)));
assert.ok(surfaceQuestions.some((question) => question.options[question.correct].text.includes("Chat with Sol Thinking")));
assert.ok(surfaceQuestions.some((question) =>
  question.options[question.correct].text.includes("Work with Luna High") &&
  question.options[question.correct].text.includes("Codex with Terra")
));

const html = readFileSync("index.html", "utf8");
for (const contract of [
  'id="session-status"',
  'id="participant-name"',
  'id="privacy-acknowledged"',
  'name="advancy-public-enrollment"',
  'class="privacy-confirmation" hidden',
  'id="assessment-experience"',
  'id="question-count-metric">20',
  'id="section-label"',
  'href="privacy.html"',
  'name="robots"',
  'name="referrer"',
  "Content-Security-Policy",
  "20 mixed questions",
  "Chat · Work · Codex"
]) {
  assert.ok(html.includes(contract), "index.html is missing " + contract);
}
for (const removed of [
  'id="mode-landing"',
  'href="?mode=normal"',
  'href="?mode=advanced"',
  'id="change-mode"',
  "Normal or Advanced",
  "50-question"
]) {
  assert.ok(!html.includes(removed), "index.html still contains removed mode content: " + removed);
}

const app = readFileSync("app.js", "utf8");
for (const contract of [
  "overall_satisfaction",
  "Comments or suggestions (optional)",
  "improvement_suggestion",
  "Suggested AI automation use cases (optional)",
  "suggested_ai_automation_use_cases",
  "Describe workflow ideas.",
  'dataset.testid = "submit-assessment"',
  "Add optional feedback, then submit your assessment.",
  "questions.length !== 20",
  "/v2/session",
  "/v2/submit",
  "/v2/enroll",
  "Idempotency-Key",
  "AbortController",
  "Retry-After",
  "requestTimeoutMs",
  "retry-session",
  "validateSessionResponse",
  "validateSubmissionResponse",
  "validateEnrollmentResponse",
  "enrollmentStorageKey",
  "enrollmentIdempotencyStorageKey",
  "publicEnrollmentMetaNode",
  "renderEnrollmentForm",
  "privacyConfirmationNode",
  "submitEnrollment",
  'quiz_id: config.quizId',
  'privacy_notice_version: config.privacyNoticeVersion',
  "pendingStorageKey",
  "persistPendingSubmission",
  "restorePendingSubmission",
  "resumePersistedSubmission",
  "clearPendingSubmission",
  "window.top !== window.self",
  "document.documentElement.replaceChildren()",
  'document.createElement("fieldset")',
  'document.createElement("legend")',
  "aria-live"
]) {
  assert.ok(app.includes(contract), "app.js is missing contract: " + contract);
}
for (const removed of [
  "selectedAssessmentMode",
  "renderModeLanding",
  "changeAssessmentMode",
  "Section 1 of 2",
  "Section 2 of 2",
  "submit-without-feedback",
  "most_valuable_takeaway"
]) {
  assert.ok(!app.includes(removed), "app.js still contains removed complexity: " + removed);
}
for (const forbidden of ["correct_answers", "user_agent", "source_url", "raw_json", "enrollment_token"]) {
  assert.ok(!app.includes(forbidden), "app.js must not send " + forbidden);
}
assert.ok(app.includes("cn\\.advancy\\.com"), "app.js must accept the China-office work-email domain");

const submissionBuilderStart = app.indexOf("function buildSubmissionPayload");
const submissionBuilderEnd = app.indexOf("async function wait", submissionBuilderStart);
assert.ok(submissionBuilderStart >= 0 && submissionBuilderEnd > submissionBuilderStart,
  "app.js must define the submission payload builder");
const submissionBuilder = app.slice(submissionBuilderStart, submissionBuilderEnd);
for (const identityField of ["first_name", "last_name", "email"]) {
  assert.ok(!submissionBuilder.includes(identityField), "assessment submissions must not include " + identityField);
}

const privacy = readFileSync("privacy.html", "utf8");
const worker = readFileSync("backend/score-worker/src/index.js", "utf8");
const wrangler = readFileSync("backend/score-worker/wrangler.toml", "utf8");
assert.ok(
  wrangler.includes('ALLOWED_EMAIL_DOMAINS = "advancy.com,cn.advancy.com"'),
  "Worker configuration must accept the standard and China-office work-email domains"
);
for (const publicEnrollmentContract of [
  'path === "/v2/public-enroll"',
  "validatePublicEnrollmentConfiguration",
  "PUBLIC_SELF_ENROLLMENT_ENABLED"
]) {
  assert.ok(worker.includes(publicEnrollmentContract) || wrangler.includes(publicEnrollmentContract),
    "public cohort registration is missing backend contract: " + publicEnrollmentContract);
}
for (const privacyContract of [
  "supplied through protected registration or by the authorized cohort administrator",
  "common cohort link opens registration without a private link credential",
  "work in any browser",
  "Registration remains restricted to authorized work-email domains",
  "removed from the browser address after capture",
  "reload or interrupted request reuses the same registration"
]) {
  assert.ok(privacy.includes(privacyContract), "privacy.html is missing disclosure: " + privacyContract);
}

const css = readFileSync("styles.css", "utf8");
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

console.log("Validated one mixed 20-question assessment with concise feedback and use-case capture.");
