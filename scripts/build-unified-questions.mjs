import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";

const bankNames = ["charter", "normal", "advanced"];
const banks = Object.fromEntries(bankNames.map((name) => [
  name,
  JSON.parse(readFileSync(new URL("../question-banks/" + name + ".json", import.meta.url), "utf8"))
]));

for (const [name, bank] of Object.entries(banks)) {
  assert.equal(bank.questions.length, 25, name + " must contain 25 source questions");
  bank.questions.forEach((question, index) => {
    assert.ok(question && typeof question.q === "string" && question.q.trim(), name + " question " + (index + 1) + " needs text");
    assert.ok(Number.isInteger(question.correct) && question.correct >= 0 && question.correct <= 4, name + " question " + (index + 1) + " has an invalid key");
    assert.equal(question.options.length, 5, name + " question " + (index + 1) + " must contain five options");
  });
}

const customQuestions = {
  chat_choice: {
    q: "A consultant needs to review an authorized document and extract its key messages, gaps, and client implications. No file-processing or layout problem has occurred. Which Chat, Work or Codex starting route follows the Advancy usage-credit framework?",
    source: "Advancy ChatGPT Enterprise Practical Usage & Credit Guide - use Chat Sol Thinking for document review and most Word or Excel work; move to Work only if the file cannot be processed or repaired.",
    correct: 0,
    options: [
      {
        text: "Chat with Sol Thinking, using High or xHigh effort as needed.",
        why: "Correct. Document review is a best-value Chat Thinking task unless a concrete file-processing or layout failure requires Work."
      },
      {
        text: "Work with Sol immediately, because every document review needs an execution agent.",
        why: "Incorrect. The framework reserves Work for a named execution or file problem, and Sol in Work for failures smaller models cannot resolve."
      },
      {
        text: "Codex with Terra, because the document may contain structured information.",
        why: "Incorrect. Codex is for reusable engineering, code, integrations, and maintained automation rather than ordinary document review."
      },
      {
        text: "Deep Research by default, because extracting implications always requires wide-scope research.",
        why: "Incorrect. Deep Research is reserved for broad, source-intensive work; it is not the default for reviewing an authorized document."
      },
      {
        text: "Work with Luna, because Work is inherently more intelligent than Chat.",
        why: "Incorrect. The framework states that Work provides a different execution environment, not inherently greater intelligence."
      }
    ]
  },
  work_codex_choice: {
    q: "Which Chat, Work or Codex allocation follows the Advancy usage-credit framework for these two tasks: (1) create an Advancy PowerPoint from a template and render-correct every slide; (2) modify a reusable skill, run tests, and preserve the repository?",
    source: "Advancy ChatGPT Enterprise Practical Usage & Credit Guide - Work is for visually iterative PowerPoint and website production; Codex is for reusable, repository-aware engineering and testing.",
    correct: 2,
    options: [
      {
        text: "Use Chat for both tasks because it has the most predictable cost.",
        why: "Incorrect. Chat is the best-value default for reasoning and many documents, but these tasks require visual execution and reusable repository engineering."
      },
      {
        text: "Use Codex for the PowerPoint and Work for the reusable skill.",
        why: "Incorrect. This reverses the framework's surface choices."
      },
      {
        text: "Use Work with Luna High for the PowerPoint; use Codex with Terra for the reusable skill, escalating only against a named failure.",
        why: "Correct. Work fits the render-and-correct presentation loop, while Codex fits reusable engineering with tests and repository preservation."
      },
      {
        text: "Use Work with Sol for both tasks from the start.",
        why: "Incorrect. The framework starts Work or Codex with the lowest sufficient model and reserves Sol for clearly identified failures."
      },
      {
        text: "Use Deep Research for the PowerPoint and Chat Instant for the reusable skill.",
        why: "Incorrect. Neither route provides the execution topology required by these tasks."
      }
    ]
  }
};

const selection = [
  ["charter", 1],
  ["normal", 1],
  ["charter", 2],
  ["normal", 4],
  ["custom", "chat_choice"],
  ["charter", 9],
  ["advanced", 12],
  ["charter", 14],
  ["normal", 7],
  ["custom", "work_codex_choice"],
  ["charter", 5],
  ["normal", 18],
  ["charter", 12],
  ["advanced", 14],
  ["charter", 7],
  ["normal", 19],
  ["charter", 24],
  ["advanced", 20],
  ["charter", 3],
  ["advanced", 24]
];

const targetAnswerKey = [2, 0, 4, 1, 3, 1, 4, 0, 2, 3, 0, 4, 1, 2, 3, 4, 2, 1, 0, 3];

function copyQuestion(source) {
  return JSON.parse(JSON.stringify(source));
}

function moveCorrectOption(question, targetIndex) {
  const copy = copyQuestion(question);
  const originalIndex = copy.correct;
  [copy.options[originalIndex], copy.options[targetIndex]] = [copy.options[targetIndex], copy.options[originalIndex]];
  copy.correct = targetIndex;
  return copy;
}

const unifiedQuestions = selection.map(([bankName, questionIndex], index) => {
  const sourceQuestion = bankName === "custom"
    ? customQuestions[questionIndex]
    : banks[bankName].questions[questionIndex];
  assert.ok(sourceQuestion, "selection " + (index + 1) + " is invalid");
  return moveCorrectOption(sourceQuestion, targetAnswerKey[index]);
});

assert.equal(unifiedQuestions.length, 20, "the unified assessment must contain exactly 20 questions");
assert.deepEqual(
  [0, 1, 2, 3, 4].map((answer) => unifiedQuestions.filter((question) => question.correct === answer).length),
  [4, 4, 4, 4, 4],
  "the unified answer positions must remain balanced"
);
assert.equal(
  new Set(unifiedQuestions.map((question) => question.q.trim().toLowerCase())).size,
  unifiedQuestions.length,
  "the unified assessment must not contain duplicate questions"
);

const evaluation = {
  title: "Feedback",
  intro: "Please share concise feedback to help improve future training and assessments.",
  scaleLabel: "Overall rating: 1 = needs improvement, 5 = excellent.",
  criteria: [
    {
      id: "overall_satisfaction",
      label: "Overall satisfaction with the training and assessment"
    }
  ]
};

const sourceLiteral = JSON.stringify({ questions: unifiedQuestions, evaluation });
const output = [
  "(function () {",
  '  "use strict";',
  "",
  "  const source = " + sourceLiteral + ";",
  "  window.quizQuestions = source.questions;",
  "  window.quizConfig = {",
  '    quizId: "advancy-ai-assessment-normal",',
  '    quizName: "Advancy AI Knowledge Assessment",',
  '    quizVersion: "2026-07-29",',
  '    privacyNoticeVersion: "2026-07-09",',
  '    apiBase: "https://advancy-ai-score-api.advancy-ai-training.workers.dev",',
  "    passThreshold: 0.7,",
  '    correctionTitle: "Correction and explanation",',
  "    trainingEvaluation: source.evaluation",
  "  };",
  "})();",
  ""
].join("\n");

const target = new URL("../questions.js", import.meta.url);
if (process.argv.includes("--check")) {
  assert.equal(readFileSync(target, "utf8").replace(/\r\n/g, "\n"), output, "questions.js is not synchronized with the unified source selection");
  console.log("Unified 20-question bundle is synchronized.");
} else {
  writeFileSync(target, output, "utf8");
  console.log("Generated one mixed 20-question assessment.");
}
