export const QUIZ_VERSION = "2026-07-09";

const CHARTER_KEY = Object.freeze([0, 2, 4, 1, 3, 1, 3, 0, 2, 4, 2, 4, 1, 3, 0, 3, 0, 2, 4, 1, 4, 1, 3, 0, 2]);
const USAGE_NORMAL_KEY = Object.freeze([0, 2, 4, 1, 3, 1, 3, 0, 2, 4, 2, 4, 1, 3, 0, 3, 0, 2, 4, 1, 4, 1, 3, 0, 2]);
const COMBINED_NORMAL_KEY = Object.freeze(USAGE_NORMAL_KEY.map((_, index) => USAGE_NORMAL_KEY[(index + 1) % USAGE_NORMAL_KEY.length]));
const USAGE_ADVANCED_KEY = Object.freeze([3, 0, 4, 1, 2, 4, 1, 3, 0, 2, 1, 4, 2, 0, 3, 2, 3, 0, 4, 1, 0, 2, 1, 3, 4]);

const definitions = [
  {
    id: "advancy-ai-assessment-normal",
    name: "Advancy AI Charter and Usage Assessment - Normal",
    version: QUIZ_VERSION,
    passThreshold: 0.7,
    answerKey: [...CHARTER_KEY, ...COMBINED_NORMAL_KEY],
    sections: [
      { id: "charter", name: "AI Charter", start: 0, end: 25, passThreshold: 0.7 },
      { id: "normal", name: "Normal module", start: 25, end: 50, passThreshold: 0.7 }
    ]
  },
  {
    id: "advancy-ai-assessment-advanced",
    name: "Advancy AI Charter and Usage Assessment - Advanced",
    version: QUIZ_VERSION,
    passThreshold: 0.7,
    answerKey: [...CHARTER_KEY, ...USAGE_ADVANCED_KEY],
    sections: [
      { id: "charter", name: "AI Charter", start: 0, end: 25, passThreshold: 0.7 },
      { id: "advanced", name: "Advanced module", start: 25, end: 50, passThreshold: 0.7 }
    ]
  },
  {
    id: "advancy-ai-charter",
    name: "Advancy AI Charter Assessment",
    version: QUIZ_VERSION,
    passThreshold: 0.7,
    answerKey: CHARTER_KEY
  },
  {
    id: "advancy-ai-usage",
    name: "Advancy AI Usage Training Assessment",
    version: QUIZ_VERSION,
    passThreshold: 0.7,
    answerKey: USAGE_NORMAL_KEY
  },
  {
    id: "advancy-ai-usage-advanced",
    name: "Advancy AI Usage Advanced Assessment",
    version: QUIZ_VERSION,
    passThreshold: 0.7,
    answerKey: USAGE_ADVANCED_KEY
  }
];

export const QUIZZES = new Map(definitions.map((quiz) => {
  const sections = quiz.sections
    ? Object.freeze(quiz.sections.map((section) => Object.freeze({ ...section })))
    : undefined;
  const immutable = Object.freeze({
    ...quiz,
    answerKey: Object.freeze([...quiz.answerKey]),
    ...(sections ? { sections } : {})
  });
  return [`${immutable.id}@${immutable.version}`, immutable];
}));
export const QUIZ_IDS = Object.freeze(definitions.map((quiz) => quiz.id));
export const DEFAULT_QUIZ_IDS = Object.freeze([
  "advancy-ai-assessment-normal",
  "advancy-ai-assessment-advanced"
]);
export const LEGACY_QUIZ_IDS = Object.freeze([
  "advancy-ai-charter",
  "advancy-ai-usage",
  "advancy-ai-usage-advanced"
]);

export function findQuiz(id, version) {
  return QUIZZES.get(`${id}@${version}`) || null;
}

export function scoreAnswers(quiz, answers) {
  const correct = answers.reduce(
    (count, answer, index) => count + (answer === quiz.answerKey[index] ? 1 : 0),
    0
  );
  const total = quiz.answerKey.length;
  const percent = Math.round((correct / total) * 100);
  const sections = quiz.sections?.map((section) => {
    let sectionCorrect = 0;
    for (let index = section.start; index < section.end; index += 1) {
      if (answers[index] === quiz.answerKey[index]) sectionCorrect += 1;
    }
    const sectionTotal = section.end - section.start;
    return {
      id: section.id,
      name: section.name,
      correct: sectionCorrect,
      total: sectionTotal,
      percent: Math.round((sectionCorrect / sectionTotal) * 100),
      passed: sectionCorrect >= Math.ceil(sectionTotal * section.passThreshold)
    };
  });
  return {
    correct,
    total,
    percent,
    passed: sections?.length
      ? sections.every((section) => section.passed)
      : correct >= Math.ceil(total * quiz.passThreshold),
    ...(sections?.length ? { sections } : {})
  };
}
