import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

import { QUIZ_VERSION, findQuiz } from "../backend/score-worker/src/quizzes.js";

const source = readFileSync(new URL("../questions.js", import.meta.url), "utf8");
const location = { search: "" };
const context = { window: { location } };
vm.runInNewContext(source, context, { filename: "questions.js" });

const client = context.window;
const quiz = findQuiz(client.quizConfig.quizId, QUIZ_VERSION);
assert.ok(quiz, "the unified backend quiz is missing");
assert.equal(client.quizConfig.quizId, "advancy-ai-assessment-normal");
assert.equal(client.quizConfig.quizVersion, QUIZ_VERSION);
assert.equal(client.quizQuestions.length, 20, "the client must contain exactly 20 questions");
assert.deepEqual(
  JSON.parse(JSON.stringify(client.quizQuestions.map((question) => question.correct))),
  [...quiz.answerKey],
  "client and server answer keys differ"
);
assert.deepEqual(
  [0, 1, 2, 3, 4].map((answer) => quiz.answerKey.filter((value) => value === answer).length),
  [4, 4, 4, 4, 4],
  "answer positions must remain balanced"
);

const surfaceQuestions = client.quizQuestions.filter((question) =>
  /Chat|Work|Codex/.test(question.q) &&
  /usage-credit framework/.test(question.q)
);
assert.equal(surfaceQuestions.length, 2, "exactly two questions must apply the Chat, Work and Codex usage-credit framework");

console.log("Validated the unified 20-question client/server contract.");
