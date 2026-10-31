import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

import { ADMIN_FRENCH_QUIZ_VERSION, findQuiz } from "../backend/score-worker/src/quizzes.js";

const source = readFileSync(new URL("../fr/questions.js", import.meta.url), "utf8");
const location = { search: "", pathname: "/fr/", href: "https://example.test/fr/" };
const context = { window: { location }, location };
vm.runInNewContext(source, context, { filename: "fr/questions.js" });

const config = context.window.quizConfig;
const questions = context.window.quizQuestions;

assert.ok(config && typeof config === "object", "quizConfig is required");
assert.equal(config.quizId, "advancy-ai-admin-fr");
assert.equal(config.quizName, "Evaluation IA - ADMIN");
assert.equal(config.quizVersion, ADMIN_FRENCH_QUIZ_VERSION);
assert.equal(config.storageNamespace, "admin-fr");
assert.equal(config.privacyNoticeVersion, "2026-07-09");
assert.equal(config.passThreshold, 0.7);
assert.equal(config.apiBase, "https://advancy-ai-score-api.advancy-ai-training.workers.dev");
assert.ok(config.ui && config.errorMessages, "the French interface copy is required");

assert.ok(Array.isArray(questions));
assert.equal(questions.length, 20, "the French assessment must contain exactly 20 questions");

const questionTexts = new Set();
const scenarioCount = questions.filter((question) => question.kind === "scenario").length;
assert.equal(scenarioCount, 17, "the assessment needs 17 applied scenarios");
assert.equal(questions.length - scenarioCount, 3, "the assessment needs 3 concise knowledge checks");
assert.doesNotMatch(
  JSON.stringify(questions),
  /\b(?:orange|rouge|vert|verte|couleur)\b/i,
  "the ADMIN questions must describe concrete permissions and risks without a color taxonomy"
);

questions.forEach((question, index) => {
  const label = `question ${index + 1}`;
  assert.ok(["scenario", "qcm"].includes(question.kind), `${label} needs a valid kind`);
  assert.ok(typeof question.theme === "string" && question.theme.trim(), `${label} needs a theme`);
  assert.ok(typeof question.q === "string" && question.q.trim(), `${label} needs text`);
  assert.ok(question.q.length >= 120, `${label} needs enough context to support a judgment call`);
  assert.ok(question.q.length <= 360, `${label} is too long`);
  const normalizedQuestion = question.q.trim().toLocaleLowerCase("fr");
  assert.ok(!questionTexts.has(normalizedQuestion), `${label} duplicates another question`);
  questionTexts.add(normalizedQuestion);
  assert.ok(typeof question.source === "string" && /Formation Advancy du 2 novembre 2026, slides? /.test(question.source), `${label} needs a current slide-backed rationale`);
  assert.ok(Array.isArray(question.slides) && question.slides.length > 0, `${label} needs explicit slide locators`);
  assert.equal(new Set(question.slides).size, question.slides.length, `${label} repeats a slide locator`);
  assert.ok(question.slides.every((slide) => Number.isInteger(slide) && slide >= 2 && slide <= 16), `${label} has an invalid slide locator`);
  assert.ok(Number.isInteger(question.correct) && question.correct >= 0 && question.correct <= 4, `${label} has an invalid answer index`);
  assert.ok(Array.isArray(question.options));
  assert.equal(question.options.length, 5, `${label} must have five options`);
  const optionTexts = new Set();
  question.options.forEach((option, optionIndex) => {
    assert.ok(option && typeof option.text === "string" && option.text.trim(), `${label} option ${optionIndex + 1} needs text`);
    assert.ok(option.text.length >= 35, `${label} option ${optionIndex + 1} is too simplistic`);
    assert.ok(option.text.length <= 280, `${label} option ${optionIndex + 1} is too long`);
    assert.ok(typeof option.why === "string" && option.why.trim(), `${label} option ${optionIndex + 1} needs feedback`);
    assert.ok(option.why.length <= 440, `${label} option ${optionIndex + 1} feedback is too long`);
    const normalizedOption = option.text.trim().toLocaleLowerCase("fr");
    assert.ok(!optionTexts.has(normalizedOption), `${label} has duplicate options`);
    optionTexts.add(normalizedOption);
    assert.equal(/^Correct\b/.test(option.why), optionIndex === question.correct, `${label} feedback does not match its single correct answer`);
    assert.equal(/^Incorrect\b/.test(option.why), optionIndex !== question.correct, `${label} distractor feedback is not explicit`);
    assert.ok(!/toutes les réponses|aucune des réponses/i.test(option.text), `${label} uses an all/none-of-the-above shortcut`);
  });
});

assert.deepEqual(
  [0, 1, 2, 3, 4].map((answer) => questions.filter((question) => question.correct === answer).length),
  [4, 4, 4, 4, 4],
  "correct-answer positions must be perfectly balanced"
);

const adminCoverage = questions
  .map((question) => `${question.theme} ${question.q}`)
  .join(" ")
  .toLocaleLowerCase("fr");
for (const domain of ["recrutement", "marketing", "traduction", "kpi", "canva", "rétroplanning", "esprit critique", "persévérance", "créativité", "codex", "brouillon"]) {
  assert.ok(adminCoverage.includes(domain), `the training topic ${domain} is not represented`);
}

for (let slide = 2; slide <= 16; slide += 1) {
  assert.ok(questions.some((question) => question.slides.includes(slide)), `slide ${slide} is not represented`);
}
assert.doesNotMatch(JSON.stringify(questions), /septembre 2026|Présentation septembre/i, "stale source references remain");

const backendQuiz = findQuiz(config.quizId, config.quizVersion);
assert.ok(backendQuiz, "the French backend quiz definition is missing");
assert.deepEqual(
  JSON.parse(JSON.stringify(questions.map((question) => question.correct))),
  [...backendQuiz.answerKey],
  "the French client and server answer keys differ"
);

const html = readFileSync(new URL("../fr/index.html", import.meta.url), "utf8");
assert.ok(html.includes("<title>Evaluation IA - ADMIN</title>"));
assert.ok(html.includes("<h1>Evaluation IA - ADMIN</h1>"));
assert.doesNotMatch(html, /générative|Generative AI|septembre 2026/i, "the ADMIN page retains its former title or source period");
assert.ok(!html.includes('name="advancy-public-enrollment" content="enabled"'), "the ADMIN site must not allow public enrollment");
for (const contract of [
  '<html lang="fr">',
  'id="session-status"',
  'id="participant-name"',
  'id="privacy-acknowledged"',
  'Réservé aux équipes ADMIN',
  'id="assessment-experience"',
  'id="question-count-metric">20',
  'href="privacy.html"',
  'src="questions.js?',
  'src="../app.js?'
]) {
  assert.ok(html.includes(contract), `fr/index.html is missing ${contract}`);
}

const privacy = readFileSync(new URL("../fr/privacy.html", import.meta.url), "utf8");
for (const contract of [
  '<html lang="fr">',
  "Qui est responsable de vos données ?",
  "Les notes et commentaires facultatifs",
  "ne conserve pas votre adresse IP",
  "Retour au questionnaire"
]) {
  assert.ok(privacy.includes(contract), `fr/privacy.html is missing ${contract}`);
}

console.log(`Validated ${questions.length} French ADMIN questions against all 15 content slides: ${scenarioCount} scenarios, ${questions.length - scenarioCount} knowledge checks, invite-only access, balanced A-E answers, complete feedback and matching server scoring.`);
