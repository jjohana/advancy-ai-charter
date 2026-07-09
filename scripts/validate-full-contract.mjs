import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

import { QUIZ_VERSION, findQuiz } from "../backend/score-worker/src/quizzes.js";

const source = readFileSync(new URL("../questions.js", import.meta.url), "utf8");
const plain = (value) => JSON.parse(JSON.stringify(value));

function loadMode(mode) {
  const location = { search: "?mode=" + mode };
  const context = { window: { location }, URLSearchParams };
  vm.runInNewContext(source, context, { filename: "questions.js" });
  return context.window;
}

for (const mode of ["normal", "advanced"]) {
  const client = loadMode(mode);
  const quiz = findQuiz(client.quizConfig.quizId, QUIZ_VERSION);
  assert.ok(quiz, mode + " backend quiz is missing");
  assert.equal(client.quizQuestions.length, 50, mode + " client must contain 50 questions");
  assert.deepEqual(
    plain(client.quizQuestions.map((question) => question.correct)),
    [...quiz.answerKey],
    mode + " client/server answer keys differ"
  );
  assert.deepEqual(
    plain(client.quizQuestions.slice(0, 25).map((question) => question.section)),
    Array(25).fill(null).map(() => ({ id: "charter", name: "AI Charter" })),
    mode + " Charter section metadata differs"
  );
  assert.deepEqual(
    plain(client.quizQuestions.slice(25).map((question) => question.section)),
    Array(25).fill(null).map(() => ({
      id: mode,
      name: mode === "advanced" ? "Advanced module" : "Normal module"
    })),
    mode + " module section metadata differs"
  );
}

const normal = loadMode("normal").quizQuestions;
const charterKey = normal.slice(0, 25).map((question) => question.correct);
const normalKey = normal.slice(25).map((question) => question.correct);
assert.equal(normalKey.every((answer, index) => answer !== charterKey[index]), true, "Normal must not repeat the Charter answer pattern");
assert.deepEqual(
  [0, 1, 2, 3, 4].map((answer) => normalKey.filter((value) => value === answer).length),
  [5, 5, 5, 5, 5],
  "Normal answer positions must remain balanced"
);

const advanced = loadMode("advanced").quizQuestions.slice(25);
const uniquelyLongestCorrect = advanced.filter((question) => {
  const lengths = question.options.map((option) => option.text.trim().split(/\s+/).length);
  const maximum = Math.max(...lengths);
  return lengths[question.correct] === maximum && lengths.filter((length) => length === maximum).length === 1;
});
assert.equal(uniquelyLongestCorrect.length, 0, "Advanced correct answers must not expose a unique longest-option shortcut");

console.log("Validated full client/server contract for both 50-question modes.");
