import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";

const bankNames = ["charter", "normal", "advanced"];
const banks = Object.fromEntries(bankNames.map((name) => [
  name,
  JSON.parse(readFileSync(new URL("../question-banks/" + name + ".json", import.meta.url), "utf8"))
]));

for (const [name, bank] of Object.entries(banks)) {
  assert.equal(bank.questions.length, 25, name + " must contain 25 questions");
  bank.questions.forEach((question, index) => {
    assert.ok(question && typeof question.q === "string" && question.q.trim(), name + " question " + (index + 1) + " needs text");
    assert.ok(Number.isInteger(question.correct) && question.correct >= 0 && question.correct <= 4, name + " question " + (index + 1) + " has an invalid key");
    assert.equal(question.options.length, 5, name + " question " + (index + 1) + " must contain five options");
  });
}

const legacyNormalKey = banks.normal.questions.map((question) => question.correct);
const rotatedNormalKey = legacyNormalKey.slice(1).concat(legacyNormalKey[0]);
assert.ok(rotatedNormalKey.every((answer, index) => answer !== legacyNormalKey[index]), "Normal combined key must differ at every position");
assert.deepEqual(
  [0, 1, 2, 3, 4].map((answer) => rotatedNormalKey.filter((value) => value === answer).length),
  [5, 5, 5, 5, 5],
  "Normal combined key must stay balanced"
);

function moveCorrectOption(question, targetIndex) {
  const copy = JSON.parse(JSON.stringify(question));
  const originalIndex = copy.correct;
  [copy.options[originalIndex], copy.options[targetIndex]] = [copy.options[targetIndex], copy.options[originalIndex]];
  copy.correct = targetIndex;
  return copy;
}

const canonicalBanks = {
  charter: banks.charter.questions,
  normal: banks.normal.questions.map((question, index) => moveCorrectOption(question, rotatedNormalKey[index])),
  advanced: banks.advanced.questions
};
const evaluation = banks.normal.config.trainingEvaluation || banks.advanced.config.trainingEvaluation || null;
const sourceLiteral = JSON.stringify({ banks: canonicalBanks, evaluation });
const output = [
  "(function () {",
  '  "use strict";',
  "",
  "  const source = " + sourceLiteral + ";",
  "  const modes = {",
  "    normal: {",
  '      id: "normal",',
  '      label: "Normal",',
  '      quizId: "advancy-ai-assessment-normal",',
  '      quizName: "Advancy AI Assessment - Normal"',
  "    },",
  "    advanced: {",
  '      id: "advanced",',
  '      label: "Advanced",',
  '      quizId: "advancy-ai-assessment-advanced",',
  '      quizName: "Advancy AI Assessment - Advanced"',
  "    }",
  "  };",
  '  const requestedMode = new URLSearchParams(window.location && window.location.search || "").get("mode") || "";',
  '  const selectedMode = Object.prototype.hasOwnProperty.call(modes, requestedMode) ? requestedMode : "";',
  "",
  "  window.assessmentModes = modes;",
  "  window.selectedAssessmentMode = selectedMode;",
  "  window.quizQuestions = [];",
  "  window.quizConfig = {};",
  "  if (!selectedMode) return;",
  "",
  "  const sectionQuestion = (question, id, name) => ({",
  "    ...question,",
  "    section: { id, name }",
  "  });",
  "  window.quizQuestions = [",
  '    ...source.banks.charter.map((question) => sectionQuestion(question, "charter", "AI Charter")),',
  "    ...source.banks[selectedMode].map((question) => sectionQuestion(",
  "      question,",
  "      selectedMode,",
  '      selectedMode === "advanced" ? "Advanced module" : "Normal module"',
  "    ))",
  "  ];",
  "  window.quizConfig = {",
  "    quizId: modes[selectedMode].quizId,",
  "    quizName: modes[selectedMode].quizName,",
  '    quizVersion: "2026-07-09",',
  '    privacyNoticeVersion: "2026-07-09",',
  '    apiBase: "https://advancy-ai-score-api.advancy-ai-training.workers.dev",',
  "    passThreshold: 0.7,",
  '    correctionTitle: "Correction and explanation",',
  "    trainingEvaluation: source.evaluation,",
  "    selectedMode",
  "  };",
  "})();",
  ""
].join("\n");

const target = new URL("../questions.js", import.meta.url);
if (process.argv.includes("--check")) {
  assert.equal(readFileSync(target, "utf8").replace(/\r\n/g, "\n"), output, "questions.js is not synchronized with question-banks");
  console.log("Unified question bundle is synchronized.");
} else {
  writeFileSync(target, output, "utf8");
  console.log("Generated questions.js with Normal and Advanced 50-question modes.");
}
