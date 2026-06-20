(function () {
  const questions = window.quizQuestions;
  const letters = ["A", "B", "C", "D", "E"];

  const cardNode = document.querySelector("#question-card");
  const progressNode = document.querySelector("#progress");
  const progressFillNode = document.querySelector("#progress-fill");
  const scoreNode = document.querySelector("#score");
  const sourceNode = document.querySelector("#question-source");
  const resultNode = document.querySelector("#result");
  const restartTopNode = document.querySelector("#restart-top");

  let currentIndex = 0;
  let selectedIndex = null;
  let submitted = false;
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

  function updateProgress() {
    const answered = answeredCount();
    const total = questions.length;
    const progressValue = Math.round(((submitted ? currentIndex + 1 : currentIndex) / total) * 100);
    progressNode.textContent = `Question ${Math.min(currentIndex + 1, total)} / ${total}`;
    progressFillNode.style.width = `${progressValue}%`;
    scoreNode.textContent = `${score()} / ${answered}`;
  }

  function setResult() {
    const total = questions.length;
    const correct = score();
    const percent = Math.round((correct / total) * 100);
    const passed = percent >= 70;
    resultNode.className = passed ? "pass" : "fail";
    resultNode.style.display = "block";
    resultNode.innerHTML = "";

    const title = document.createElement("h2");
    title.className = "result-title";
    title.textContent = `${passed ? "Passed" : "Not passed"} - ${correct}/${total} (${percent}%)`;

    const copy = document.createElement("p");
    copy.className = "result-copy";
    copy.textContent = passed ? "Candidate meets the 70% threshold." : "Candidate needs at least 18 correct answers to pass.";

    resultNode.append(title, copy);
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
    correctionTitle.textContent = "Correction from the charter";
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
      submit.disabled = selectedIndex === null;
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
  }

  function restartAssessment() {
    currentIndex = 0;
    selectedIndex = null;
    submitted = false;
    answers.fill(null);
    clearResult();
    renderQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  restartTopNode.addEventListener("click", restartAssessment);
  renderQuestion();
})();
