(function () {
  const questions = window.quizQuestions;
  const config = {
    correctionTitle: "Correction from the charter",
    passThreshold: 0.7,
    passCopy: null,
    failCopy: null,
    quizId: "advancy-assessment",
    quizName: document.title,
    ...window.quizConfig
  };
  const letters = ["A", "B", "C", "D", "E"];
  const storageKey = "advancy-assessment-results:v1";

  const cardNode = document.querySelector("#question-card");
  const progressNode = document.querySelector("#progress");
  const progressFillNode = document.querySelector("#progress-fill");
  const scoreNode = document.querySelector("#score");
  const sourceNode = document.querySelector("#question-source");
  const resultNode = document.querySelector("#result");
  const restartTopNode = document.querySelector("#restart-top");
  const firstNameNode = document.querySelector("#first-name");
  const lastNameNode = document.querySelector("#last-name");
  const emailNode = document.querySelector("#email");
  const participantStatusNode = document.querySelector("#participant-status");
  const downloadResultsNode = document.querySelector("#download-results");

  let currentIndex = 0;
  let selectedIndex = null;
  let submitted = false;
  let resultSaved = false;
  const answers = Array(questions.length).fill(null);

  function appendText(parent, text) {
    parent.appendChild(document.createTextNode(text));
  }

  function score() {
    return answers.filter((answer, index) => answer === questions[index].correct).length;
  }

  function answeredCount() {
    return answers.filter((answer) => answer !== null).length;
  }

  function participant() {
    return {
      firstName: (firstNameNode?.value || "").trim(),
      lastName: (lastNameNode?.value || "").trim(),
      email: (emailNode?.value || "").trim().toLowerCase()
    };
  }

  function participantReady() {
    const item = participant();
    return item.firstName.length > 0 && item.lastName.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email);
  }

  function storedResults() {
    try {
      const value = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
      return Array.isArray(value) ? value : [];
    } catch (error) {
      return [];
    }
  }

  function setStoredResults(rows) {
    window.localStorage.setItem(storageKey, JSON.stringify(rows));
  }

  function csvCell(value) {
    return `"${String(value ?? "").replace(/"/g, '""')}"`;
  }

  function csvFromRows(rows) {
    const headers = [
      "timestamp",
      "test_id",
      "test_name",
      "first_name",
      "last_name",
      "email",
      "correct",
      "total",
      "percent",
      "passed",
      "answers",
      "correct_answers"
    ];
    const lines = rows.map((row) => headers.map((header) => csvCell(row[header])).join(","));
    return [headers.join(","), ...lines].join("\r\n");
  }

  function downloadCsv() {
    const rows = storedResults();
    const csv = csvFromRows(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `advancy-ai-assessment-results-${stamp}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function updateParticipantState() {
    if (participantStatusNode) {
      const item = participant();
      participantStatusNode.textContent = participantReady()
        ? `Results will be saved for ${item.firstName} ${item.lastName}.`
        : "Enter first name, last name and a valid email before submitting.";
    }

    const activeSubmit = document.querySelector("[data-submit-answer='true']");
    if (activeSubmit) {
      activeSubmit.disabled = selectedIndex === null || !participantReady();
    }

    if (downloadResultsNode) {
      downloadResultsNode.disabled = storedResults().length === 0;
    }
  }

  function updateProgress() {
    const answered = answeredCount();
    const total = questions.length;
    const progressValue = Math.round(((submitted ? currentIndex + 1 : currentIndex) / total) * 100);
    progressNode.textContent = `Question ${Math.min(currentIndex + 1, total)} / ${total}`;
    progressFillNode.style.width = `${progressValue}%`;
    scoreNode.textContent = `${score()} / ${answered}`;
  }

  function saveResult(correct, total, percent, passed) {
    if (resultSaved || !participantReady()) return null;

    const item = participant();
    const row = {
      timestamp: new Date().toISOString(),
      test_id: config.quizId,
      test_name: config.quizName,
      first_name: item.firstName,
      last_name: item.lastName,
      email: item.email,
      correct,
      total,
      percent,
      passed: passed ? "yes" : "no",
      answers: answers.map((answer) => letters[answer] || "").join(" "),
      correct_answers: questions.map((question) => letters[question.correct]).join(" ")
    };
    const rows = storedResults();
    const existingIndex = rows.findIndex((existing) =>
      existing.test_id === row.test_id &&
      String(existing.first_name || "").trim().toLowerCase() === item.firstName.toLowerCase() &&
      String(existing.last_name || "").trim().toLowerCase() === item.lastName.toLowerCase() &&
      String(existing.email || "").trim().toLowerCase() === item.email
    );

    if (existingIndex >= 0) {
      rows[existingIndex] = row;
    } else {
      rows.push(row);
    }
    setStoredResults(rows);
    resultSaved = true;
    updateParticipantState();
    return row;
  }

  function setResult() {
    const total = questions.length;
    const correct = score();
    const percent = Math.round((correct / total) * 100);
    const passMark = Math.ceil(total * config.passThreshold);
    const thresholdPercent = Math.round(config.passThreshold * 100);
    const passed = correct >= passMark;
    saveResult(correct, total, percent, passed);
    resultNode.className = passed ? "pass" : "fail";
    resultNode.style.display = "block";
    resultNode.innerHTML = "";

    const title = document.createElement("h2");
    title.className = "result-title";
    title.textContent = `${passed ? "Passed" : "Not passed"} - ${correct}/${total} (${percent}%)`;

    const copy = document.createElement("p");
    copy.className = "result-copy";
    copy.textContent = passed
      ? (config.passCopy || `Candidate meets the ${thresholdPercent}% threshold.`)
      : (config.failCopy || `Candidate needs at least ${passMark} correct answers to pass.`);

    const saved = document.createElement("p");
    saved.className = "result-copy";
    saved.textContent = "Result saved in this browser. Download the CSV to collect scores across consultants and tests.";

    const download = document.createElement("button");
    download.type = "button";
    download.className = "button button-primary";
    download.textContent = "Download CSV";
    download.addEventListener("click", downloadCsv);

    resultNode.append(title, copy, saved, download);
    resultNode.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function clearResult() {
    resultNode.style.display = "none";
    resultNode.className = "";
    resultNode.innerHTML = "";
  }

  function renderOption(item, option, optionIndex) {
    const label = document.createElement("label");
    label.className = "answer";
    if (selectedIndex === optionIndex) label.classList.add("selected");
    if (submitted && optionIndex === item.correct) label.classList.add("correct");
    if (submitted && selectedIndex === optionIndex && optionIndex !== item.correct) {
      label.classList.add("incorrect-selected");
    }

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "answer";
    input.value = String(optionIndex);
    input.checked = selectedIndex === optionIndex;
    input.disabled = submitted;
    input.addEventListener("change", () => {
      selectedIndex = optionIndex;
      renderQuestion();
    });

    const answerText = document.createElement("span");
    const letter = document.createElement("span");
    letter.className = "letter";
    letter.textContent = `${letters[optionIndex]}.`;
    answerText.appendChild(letter);
    appendText(answerText, option.text);

    label.append(input, answerText);
    return label;
  }

  function renderFeedback(item, option, optionIndex) {
    const feedback = document.createElement("div");
    feedback.className = `option-feedback ${optionIndex === item.correct ? "correct" : "incorrect"}`;

    const title = document.createElement("strong");
    title.textContent = `${letters[optionIndex]}. ${optionIndex === item.correct ? "Correct" : "Incorrect"}`;

    const why = document.createElement("span");
    why.textContent = option.why;

    feedback.append(title, why);
    return feedback;
  }

  function renderQuestion() {
    const item = questions[currentIndex];
    sourceNode.textContent = item.source;
    cardNode.innerHTML = "";

    const heading = document.createElement("div");
    heading.className = "question-heading";

    const id = document.createElement("div");
    id.className = "qid";
    id.textContent = String(currentIndex + 1).padStart(2, "0");

    const title = document.createElement("h2");
    title.textContent = item.q;
    heading.append(id, title);

    const note = document.createElement("p");
    note.className = "rule-note";
    note.textContent = item.source;

    const answersNode = document.createElement("div");
    answersNode.className = "answers";
    item.options.forEach((option, optionIndex) => {
      answersNode.appendChild(renderOption(item, option, optionIndex));
    });

    const correction = document.createElement("div");
    correction.className = submitted ? "correction visible" : "correction";
    const correctionTitle = document.createElement("h3");
    correctionTitle.className = "correction-title";
    correctionTitle.textContent = config.correctionTitle;
    correction.appendChild(correctionTitle);
    item.options.forEach((option, optionIndex) => {
      correction.appendChild(renderFeedback(item, option, optionIndex));
    });

    const actions = document.createElement("div");
    actions.className = "question-actions";

    if (!submitted) {
      const submit = document.createElement("button");
      submit.type = "button";
      submit.className = "button button-primary";
      submit.textContent = "Submit answer";
      submit.dataset.submitAnswer = "true";
      submit.disabled = selectedIndex === null || !participantReady();
      submit.addEventListener("click", () => {
        submitted = true;
        answers[currentIndex] = selectedIndex;
        updateProgress();
        renderQuestion();
      });
      actions.appendChild(submit);
    } else {
      const next = document.createElement("button");
      next.type = "button";
      next.className = "button button-primary";
      next.textContent = currentIndex === questions.length - 1 ? "Show final score" : "Next question";
      next.addEventListener("click", () => {
        if (currentIndex === questions.length - 1) {
          setResult();
          return;
        }
        currentIndex += 1;
        selectedIndex = answers[currentIndex];
        submitted = selectedIndex !== null;
        clearResult();
        updateProgress();
        renderQuestion();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      actions.appendChild(next);
    }

    const restart = document.createElement("button");
    restart.type = "button";
    restart.className = "button button-neutral";
    restart.textContent = "Restart assessment";
    restart.addEventListener("click", restartAssessment);
    actions.appendChild(restart);

    cardNode.append(heading, note, answersNode, correction, actions);
    updateProgress();
    updateParticipantState();
  }

  function restartAssessment() {
    currentIndex = 0;
    selectedIndex = null;
    submitted = false;
    resultSaved = false;
    answers.fill(null);
    clearResult();
    renderQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  restartTopNode.addEventListener("click", restartAssessment);
  firstNameNode?.addEventListener("input", updateParticipantState);
  lastNameNode?.addEventListener("input", updateParticipantState);
  emailNode?.addEventListener("input", updateParticipantState);
  downloadResultsNode?.addEventListener("click", downloadCsv);
  renderQuestion();
})();
