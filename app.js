(function () {
  const questions = window.quizQuestions;
  const config = {
    correctionTitle: "Correction from the charter",
    passThreshold: 0.7,
    passCopy: null,
    failCopy: null,
    quizId: "advancy-assessment",
    quizName: document.title,
    scoreEndpoint: "",
    trainingEvaluation: null,
    ...window.quizConfig
  };
  const letters = ["A", "B", "C", "D", "E"];

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

  const attemptStartedAt = new Date();
  let currentIndex = 0;
  let selectedIndex = null;
  let submitted = false;
  let resultSubmitted = false;
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

  function collectorReady() {
    return typeof config.scoreEndpoint === "string" && /^https:\/\//.test(config.scoreEndpoint);
  }

  function updateParticipantState() {
    if (participantStatusNode) {
      const item = participant();
      if (!collectorReady()) {
        participantStatusNode.textContent = "Private score database is not configured yet. The assessment is locked until the secure collector is active.";
      } else {
        participantStatusNode.textContent = participantReady()
          ? `Score will be submitted privately for ${item.firstName} ${item.lastName}.`
          : "Enter first name, last name and a valid email before submitting.";
      }
    }

    const activeSubmit = document.querySelector("[data-submit-answer='true']");
    if (activeSubmit) {
      activeSubmit.disabled = selectedIndex === null || !participantReady() || !collectorReady();
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

  function buildResultPayload(correct, total, percent, passed, extra = {}) {
    const item = participant();
    return {
      timestamp: new Date().toISOString(),
      attempt_started_at: attemptStartedAt.toISOString(),
      completed_at: new Date().toISOString(),
      duration_seconds: Math.round((Date.now() - attemptStartedAt.getTime()) / 1000),
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
      correct_answers: questions.map((question) => letters[question.correct]).join(" "),
      source_url: window.location.href,
      user_agent: window.navigator.userAgent,
      ...extra
    };
  }

  function submitResult(payload, statusNode, successMessage) {
    if (resultSubmitted) return Promise.resolve(false);
    resultSubmitted = true;

    if (!collectorReady()) {
      statusNode.textContent = "Private score database is not configured. Please contact the training organizer before using this assessment.";
      statusNode.classList.add("save-error");
      return Promise.resolve(false);
    }

    statusNode.textContent = "Submitting result to the private results database...";

    return fetch(config.scoreEndpoint, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Private database rejected the submission.");
      }
      statusNode.textContent = successMessage || "Thank you. Your result has been submitted to the private results database.";
      statusNode.classList.add("save-ok");
      return true;
    }).catch(() => {
      resultSubmitted = false;
      statusNode.textContent = "Result submission failed. Please keep this page open and contact the training organizer.";
      statusNode.classList.add("save-error");
      return false;
    });
  }

  function createTrainingEvaluation(basePayload, statusNode) {
    const evaluation = config.trainingEvaluation;
    const section = document.createElement("section");
    section.className = "training-evaluation";
    section.setAttribute("aria-labelledby", "training-evaluation-title");

    const title = document.createElement("h3");
    title.id = "training-evaluation-title";
    title.textContent = evaluation.title || "Training evaluation";

    const intro = document.createElement("p");
    intro.textContent = evaluation.intro || "Please evaluate the training before submitting your result.";

    const form = document.createElement("form");
    form.className = "evaluation-form";

    const scale = document.createElement("div");
    scale.className = "evaluation-scale";
    scale.textContent = evaluation.scaleLabel || "Scale: 1 = insufficient, 5 = excellent.";

    const criteria = evaluation.criteria || [];
    criteria.forEach((criterion, criterionIndex) => {
      const field = document.createElement("fieldset");
      field.className = "evaluation-criterion";

      const legend = document.createElement("legend");
      legend.textContent = criterion.label;
      field.appendChild(legend);

      const group = document.createElement("div");
      group.className = "rating-group";

      [1, 2, 3, 4, 5].forEach((value) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `evaluation-${criterion.id}`;
        input.value = String(value);
        input.required = true;
        label.appendChild(input);
        appendText(label, String(value));
        group.appendChild(label);
      });

      field.appendChild(group);
      form.appendChild(field);
    });

    const fields = [
      ["most_valuable_takeaway", "Most valuable takeaway", "What was the most useful learning or behavior you will apply?"],
      ["improvement_suggestion", "Improvement suggestion", "What should be improved for the next session?"],
      [
        "suggested_ai_automation_use_cases",
        "Suggested AI automation use cases for Advancy",
        "Which recurring Advancy workflows, analyses or deliverables should be considered for AI automation, and why?"
      ]
    ];

    fields.forEach(([id, labelText, placeholder]) => {
      const label = document.createElement("label");
      label.className = "evaluation-text";
      label.setAttribute("for", id);
      label.textContent = labelText;

      const textarea = document.createElement("textarea");
      textarea.id = id;
      textarea.name = id;
      textarea.rows = 3;
      textarea.placeholder = placeholder;

      form.append(label, textarea);
    });

    const recommend = document.createElement("label");
    recommend.className = "evaluation-checkbox";
    const recommendInput = document.createElement("input");
    recommendInput.type = "checkbox";
    recommendInput.name = "recommend_training";
    recommendInput.value = "yes";
    recommend.appendChild(recommendInput);
    appendText(recommend, " I would recommend this training to another consultant.");
    form.appendChild(recommend);

    const actions = document.createElement("div");
    actions.className = "question-actions";
    const submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "button button-primary";
    submit.textContent = "Finalize response";
    actions.appendChild(submit);
    form.appendChild(actions);

    const confirmation = document.createElement("div");
    confirmation.className = "evaluation-confirmation";
    confirmation.setAttribute("role", "status");
    confirmation.setAttribute("aria-live", "polite");
    confirmation.hidden = true;

    const confirmationTitle = document.createElement("strong");
    confirmationTitle.textContent = "Thank you for completing the assessment and training evaluation.";

    const confirmationCopy = document.createElement("span");
    confirmationCopy.textContent = "Your feedback has been captured for the training team and will help improve future Advancy AI enablement sessions.";

    confirmation.append(confirmationTitle, confirmationCopy);
    form.appendChild(confirmation);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (resultSubmitted) return;

      const data = new FormData(form);
      const extra = {
        evaluation_submitted_at: new Date().toISOString(),
        recommend_training: data.get("recommend_training") === "yes" ? "yes" : "no"
      };

      criteria.forEach((criterion) => {
        extra[criterion.id] = data.get(`evaluation-${criterion.id}`) || "";
      });

      fields.forEach(([id]) => {
        extra[id] = String(data.get(id) || "").trim();
      });

      submit.disabled = true;
      submit.textContent = "Response submitted";
      confirmation.hidden = false;
      form.classList.add("evaluation-submitted");
      submitResult(
        { ...basePayload, ...extra },
        statusNode,
        "Thank you. Your score and training evaluation have been submitted privately."
      ).then((ok) => {
        if (!ok && config.scoreEndpoint) {
          submit.disabled = false;
          submit.textContent = "Finalize response";
          confirmation.hidden = true;
          form.classList.remove("evaluation-submitted");
        }
      });
    });

    section.append(title, intro, scale, form);
    return section;
  }

  function setResult() {
    const total = questions.length;
    const correct = score();
    const percent = Math.round((correct / total) * 100);
    const passMark = Math.ceil(total * config.passThreshold);
    const thresholdPercent = Math.round(config.passThreshold * 100);
    const passed = correct >= passMark;
    const payload = buildResultPayload(correct, total, percent, passed);
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
    saved.className = "result-copy save-status";

    resultNode.append(title, copy, saved);
    if (config.trainingEvaluation) {
      resultNode.appendChild(createTrainingEvaluation(payload, saved));
      saved.textContent = "Complete the training evaluation below to submit your score privately.";
    } else {
      submitResult(payload, saved);
    }
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
      submit.disabled = selectedIndex === null || !participantReady() || !collectorReady();
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
    resultSubmitted = false;
    answers.fill(null);
    clearResult();
    renderQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  restartTopNode.addEventListener("click", restartAssessment);
  firstNameNode?.addEventListener("input", updateParticipantState);
  lastNameNode?.addEventListener("input", updateParticipantState);
  emailNode?.addEventListener("input", updateParticipantState);
  renderQuestion();
})();
