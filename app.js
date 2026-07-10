(function () {
  "use strict";

  if (window.top !== window.self) {
    window.stop();
    document.documentElement.replaceChildren();
    return;
  }

  const assessmentModes = window.assessmentModes && typeof window.assessmentModes === "object"
    ? window.assessmentModes
    : {};
  const selectedAssessmentMode = ["normal", "advanced"].includes(String(window.selectedAssessmentMode || "").toLowerCase())
    ? String(window.selectedAssessmentMode).toLowerCase()
    : "";
  const questions = Array.isArray(window.quizQuestions) ? window.quizQuestions : [];
  const config = {
    correctionTitle: "Correction from the charter",
    passThreshold: 0.7,
    passCopy: null,
    failCopy: null,
    quizId: "advancy-assessment",
    quizName: document.title,
    quizVersion: "2026-07-09",
    privacyNoticeVersion: "2026-07-09",
    apiBase: "",
    scoreEndpoint: "",
    trainingEvaluation: null,
    ...window.quizConfig
  };
  const letters = ["A", "B", "C", "D", "E"];
  const inviteStorageKey = "advancy-assessment-invite-v2";
  const enrollmentStorageKey = "advancy-assessment-enrollment-v2";
  const enrollmentIdempotencyStorageKey = "advancy-assessment-enrollment-idempotency-v2";
  const pendingStorageKey = ["advancy-assessment-pending-v2", config.quizId, config.quizVersion].join(":");
  const progressTtlMs = 7 * 24 * 60 * 60 * 1000;
  const pendingSubmissionTtlMs = 24 * 60 * 60 * 1000;
  const requestTimeoutMs = 12000;
  const retryDelaysMs = [0, 600, 1800];
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const invitePattern = /^inv_[A-Za-z0-9_-]{43}$/;
  const enrollmentPattern = /^enr_[A-Za-z0-9_-]{43}$/;
  const submissionPayloadKeys = new Set([
    "session_id", "test_id", "quiz_version", "answers", "attempt_started_at", "completed_at",
    "duration_seconds", "privacy_notice_version", "privacy_acknowledged", "evaluation"
  ]);
  const pendingEnvelopeKeys = new Set([
    "schema_version", "session_id", "test_id", "quiz_version", "baseline_attempts_used",
    "idempotency_key", "serialized_payload", "created_at", "expires_at"
  ]);
  const evaluationRatingKeys = new Set([
    "training_relevance", "conceptual_clarity", "practical_applicability", "governance_confidence",
    "codex_workflow_confidence", "materials_quality", "pace_and_depth", "overall_satisfaction"
  ]);
  const evaluationTextKeys = new Set([
    "most_valuable_takeaway", "improvement_suggestion", "suggested_ai_automation_use_cases"
  ]);

  const cardNode = document.querySelector("#question-card");
  const progressNode = document.querySelector("#progress");
  const progressFillNode = document.querySelector("#progress-fill");
  const scoreNode = document.querySelector("#score");
  const resultNode = document.querySelector("#result");
  const restartTopNode = document.querySelector("#restart-top");
  const sessionStatusNode = document.querySelector("#session-status");
  const participantNameNode = document.querySelector("#participant-name");
  const attemptStatusNode = document.querySelector("#attempt-status");
  const privacyInput = document.querySelector("#privacy-acknowledged");
  const privacyConfirmationNode = document.querySelector(".privacy-confirmation");
  const modeLandingNode = document.querySelector("#mode-landing");
  const assessmentExperienceNode = document.querySelector("#assessment-experience");
  const modeLandingTitleNode = document.querySelector("#mode-landing-title");
  const questionCountMetricNode = document.querySelector("#question-count-metric");
  const quizTitleNode = document.querySelector("#quiz-title");
  const selectedModeLabelNode = document.querySelector("#selected-mode-label");
  const sectionLabelNode = document.querySelector("#section-label");
  const changeModeNode = document.querySelector("#change-mode");

  const state = {
    inviteToken: "",
    enrollmentToken: "",
    enrollmentIdempotencyKey: "",
    enrollmentPending: false,
    session: null,
    sessionReady: false,
    sessionLoading: false,
    sessionRetryable: false,
    accessError: "",
    recoveredSubmission: null,
    currentIndex: 0,
    selectedIndex: null,
    submitted: false,
    resultSubmitted: false,
    submissionPending: false,
    resumePendingSubmission: false,
    lastSubmissionPayload: null,
    lastSubmissionBody: "",
    answers: Array(questions.length).fill(null),
    baselineAttemptsUsed: 0,
    attemptStartedAt: new Date().toISOString(),
    idempotencyKey: createId(),
    progressKey: ""
  };

  class RequestError extends Error {
    constructor(message, options) {
      super(message);
      this.name = "RequestError";
      this.status = options && options.status || 0;
      this.code = options && options.code || "";
      this.retryable = Boolean(options && options.retryable);
      this.retryAfterMs = options && options.retryAfterMs || 0;
    }
  }

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, function (byte) {
      return byte.toString(16).padStart(2, "0");
    }).join("");
    return hex.slice(0, 8) + "-" + hex.slice(8, 12) + "-" + hex.slice(12, 16) + "-" +
      hex.slice(16, 20) + "-" + hex.slice(20);
  }

  function appendText(parent, value) {
    parent.appendChild(document.createTextNode(String(value)));
  }

  function modeDefinition(modeId) {
    const definition = assessmentModes && assessmentModes[modeId];
    return definition && typeof definition === "object" ? definition : {};
  }

  function modeLabel(modeId) {
    const definition = modeDefinition(modeId);
    const fallback = modeId === "advanced" ? "Advanced" : "Normal";
    const label = definition.label || definition.name || definition.title || fallback;
    return typeof label === "string" && label.trim() ? label.trim() : fallback;
  }

  function updateSectionContext() {
    if (!sectionLabelNode || !selectedAssessmentMode) return;
    sectionLabelNode.textContent = state.currentIndex < 25
      ? "Section 1 of 2 · AI Charter"
      : "Section 2 of 2 · " + modeLabel(selectedAssessmentMode) + " module";
  }

  function renderModeLanding() {
    captureInviteToken();
    if (assessmentExperienceNode) assessmentExperienceNode.hidden = true;
    if (modeLandingNode) modeLandingNode.hidden = false;
    const normalTitle = document.querySelector("#mode-normal-title");
    const advancedTitle = document.querySelector("#mode-advanced-title");
    if (normalTitle) normalTitle.textContent = modeLabel("normal");
    if (advancedTitle) advancedTitle.textContent = modeLabel("advanced");
    const localHost = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
    const localApiBase = new URLSearchParams(window.location.search).get("apiBase") || "";
    document.querySelectorAll("[data-mode]").forEach(function (link) {
      const mode = link.getAttribute("data-mode");
      const params = new URLSearchParams({ mode });
      if (localHost && /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(localApiBase)) {
        params.set("apiBase", localApiBase);
      }
      link.setAttribute("href", "?" + params.toString());
    });
    document.title = "Choose assessment mode - Advancy";
    window.requestAnimationFrame(function () {
      if (modeLandingTitleNode) modeLandingTitleNode.focus();
    });
  }

  function configureSelectedMode() {
    if (modeLandingNode) modeLandingNode.hidden = true;
    if (assessmentExperienceNode) assessmentExperienceNode.hidden = false;
    if (questionCountMetricNode) questionCountMetricNode.textContent = String(questions.length);
    if (quizTitleNode) quizTitleNode.textContent = config.quizName || "Advancy AI Assessment";
    if (selectedModeLabelNode) {
      selectedModeLabelNode.textContent = modeLabel(selectedAssessmentMode) + " mode · " + questions.length + " questions";
    }
    document.title = config.quizName || (modeLabel(selectedAssessmentMode) + " Advancy AI Assessment");
    updateSectionContext();
  }

  function changeAssessmentMode() {
    const localHost = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
    const current = new URL(window.location.href);
    const params = new URLSearchParams();
    const localApiBase = current.searchParams.get("apiBase");
    if (localHost && localApiBase && /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(localApiBase)) {
      params.set("apiBase", localApiBase);
    }
    const query = params.toString();
    window.location.assign(current.pathname + (query ? "?" + query : ""));
  }

  function cleanApiBase(value) {
    return String(value || "").trim().replace(/\/+$/, "");
  }

  function apiBase() {
    const localHost = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
    if (localHost) {
      const candidate = new URLSearchParams(window.location.search).get("apiBase");
      if (/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(String(candidate || ""))) {
        return cleanApiBase(candidate);
      }
    }
    if (config.apiBase) return cleanApiBase(config.apiBase);
    if (config.scoreEndpoint) {
      try {
        const endpoint = new URL(config.scoreEndpoint);
        return endpoint.origin + endpoint.pathname.replace(/\/submit\/?$/, "");
      } catch {
        return "";
      }
    }
    return "";
  }

  function isPlainObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function validIsoTimestamp(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) return false;
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp) && new Date(timestamp).toISOString() === value;
  }

  function retryAfterMilliseconds(response) {
    const value = response.headers.get("Retry-After");
    if (!value) return 0;
    if (/^\d+$/.test(value.trim())) return Math.min(Number(value.trim()) * 1000, 10000);
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp) ? Math.min(Math.max(timestamp - Date.now(), 0), 10000) : 0;
  }

  function requestCode(payload) {
    return String(payload && payload.error && payload.error.code || payload && payload.code || "").toLowerCase();
  }

  async function fetchJsonWithRetry(url, options, onRetry) {
    const validate = options.validate;
    const requestOptions = { ...options };
    delete requestOptions.validate;
    let lastError = null;
    for (let attempt = 0; attempt < retryDelaysMs.length; attempt += 1) {
      const controller = new AbortController();
      const timeout = window.setTimeout(function () { controller.abort(); }, requestTimeoutMs);
      try {
        const response = await window.fetch(url, {
          ...requestOptions,
          signal: controller.signal
        });
        const payload = await response.json().catch(function () { return null; });
        if (!response.ok) {
          const retryable = response.status === 408 || response.status === 425 || response.status === 429 || response.status >= 500;
          throw new RequestError(publicError(payload || {}, response.status), {
            status: response.status,
            code: requestCode(payload),
            retryable,
            retryAfterMs: retryAfterMilliseconds(response)
          });
        }
        if (!isPlainObject(payload)) {
          throw new RequestError("The secure service returned an invalid response.", { retryable: true });
        }
        return validate ? validate(payload) : payload;
      } catch (error) {
        window.clearTimeout(timeout);
        const normalized = error instanceof RequestError
          ? error
          : new RequestError(
            error && error.name === "AbortError"
              ? "The secure service took too long to respond."
              : "The secure service could not be reached.",
            { retryable: true }
          );
        lastError = normalized;
        if (!normalized.retryable || attempt === retryDelaysMs.length - 1) throw normalized;
        const delay = Math.max(retryDelaysMs[attempt + 1], normalized.retryAfterMs || 0);
        if (onRetry) onRetry(attempt + 2, retryDelaysMs.length, delay, normalized);
        await wait(delay);
      } finally {
        window.clearTimeout(timeout);
      }
    }
    throw lastError || new RequestError("The request failed.", { retryable: true });
  }

  function safeSessionGet(key) {
    try {
      return window.sessionStorage.getItem(key) || "";
    } catch {
      return "";
    }
  }

  function safeSessionSet(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
      return true;
    } catch {
      // The current page can continue, but same-tab reload recovery is unavailable.
      return false;
    }
  }

  function safeSessionRemove(key) {
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      // Nothing else is required if session storage is unavailable.
    }
  }

  function safeLocalGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeLocalSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Progress recovery is helpful but not required to complete the quiz.
    }
  }

  function safeLocalRemove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Nothing else is required if storage is unavailable.
    }
  }

  function captureInviteToken() {
    const hash = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(hash);
    const fromInviteFragment = params.get("invite") || "";
    const fromEnrollmentFragment = params.get("enroll") || "";
    const previousEnrollment = safeSessionGet(enrollmentStorageKey);
    if (params.has("invite") || params.has("enroll")) {
      if (invitePattern.test(fromInviteFragment)) {
        safeSessionSet(inviteStorageKey, fromInviteFragment);
        safeSessionRemove(enrollmentStorageKey);
        safeSessionRemove(enrollmentIdempotencyStorageKey);
      } else if (enrollmentPattern.test(fromEnrollmentFragment)) {
        safeSessionSet(enrollmentStorageKey, fromEnrollmentFragment);
        safeSessionRemove(inviteStorageKey);
        if (previousEnrollment !== fromEnrollmentFragment) {
          safeSessionRemove(enrollmentIdempotencyStorageKey);
        }
      } else {
        safeSessionRemove(inviteStorageKey);
        safeSessionRemove(enrollmentStorageKey);
        safeSessionRemove(enrollmentIdempotencyStorageKey);
      }
      window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
    }
    const storedInvite = safeSessionGet(inviteStorageKey);
    const storedEnrollment = safeSessionGet(enrollmentStorageKey);
    state.enrollmentToken = enrollmentPattern.test(storedEnrollment) ? storedEnrollment : "";
    if (state.enrollmentToken) {
      const storedIdempotencyKey = safeSessionGet(enrollmentIdempotencyStorageKey);
      state.enrollmentIdempotencyKey = uuidPattern.test(storedIdempotencyKey) ? storedIdempotencyKey : createId();
      safeSessionSet(enrollmentIdempotencyStorageKey, state.enrollmentIdempotencyKey);
    } else {
      state.enrollmentIdempotencyKey = "";
      safeSessionRemove(enrollmentIdempotencyStorageKey);
    }
    return invitePattern.test(storedInvite) ? storedInvite : "";
  }

  function privacyAcknowledged() {
    return Boolean(privacyInput && privacyInput.checked);
  }

  function canStart() {
    return state.sessionReady && privacyAcknowledged() && !state.accessError;
  }

  function score() {
    return state.answers.filter(function (answer, index) {
      return answer === questions[index].correct;
    }).length;
  }

  function answeredCount() {
    return state.answers.filter(function (answer) {
      return answer !== null;
    }).length;
  }

  function progressStorageKey(sessionId) {
    return [
      "advancy-assessment-progress-v2",
      config.quizId,
      config.quizVersion,
      sessionId
    ].join(":");
  }

  function saveProgress() {
    if (!state.progressKey || state.resultSubmitted) return;
    safeLocalSet(state.progressKey, JSON.stringify({
      schema_version: 2,
      session_id: state.session && state.session.session_id,
      quiz_id: config.quizId,
      quiz_version: config.quizVersion,
      saved_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + progressTtlMs).toISOString(),
      current_index: state.currentIndex,
      selected_index: state.selectedIndex,
      submitted: state.submitted,
      answers: state.answers,
      baseline_attempts_used: state.baselineAttemptsUsed,
      attempt_started_at: state.attemptStartedAt,
      idempotency_key: state.idempotencyKey
    }));
  }

  function restoreProgress() {
    if (!state.progressKey) return false;
    const raw = safeLocalGet(state.progressKey);
    if (!raw) return false;
    try {
      const saved = JSON.parse(raw);
      const now = Date.now();
      const currentIndex = saved.current_index;
      const selectedIndex = saved.selected_index;
      const startedAt = Date.parse(saved.attempt_started_at);
      const savedAt = Date.parse(saved.saved_at);
      const expiresAt = Date.parse(saved.expires_at);
      const validEnvelope = isPlainObject(saved) &&
        saved.schema_version === 2 &&
        state.session && saved.session_id === state.session.session_id &&
        saved.quiz_id === config.quizId && saved.quiz_version === config.quizVersion &&
        Number.isFinite(savedAt) && Number.isFinite(expiresAt) && expiresAt > now &&
        savedAt <= now + 5 * 60 * 1000 && savedAt >= startedAt &&
        expiresAt <= now + progressTtlMs + 5 * 60 * 1000 &&
        Number.isInteger(currentIndex) && currentIndex >= 0 && currentIndex < questions.length &&
        (selectedIndex === null || (Number.isInteger(selectedIndex) && selectedIndex >= 0 && selectedIndex <= 4)) &&
        typeof saved.submitted === "boolean" &&
        Number.isInteger(saved.baseline_attempts_used) && saved.baseline_attempts_used >= 0 &&
        state.session && saved.baseline_attempts_used <= state.session.attempts_used &&
        Number.isFinite(startedAt) && startedAt <= now + 5 * 60 * 1000 &&
        startedAt >= now - progressTtlMs - 5 * 60 * 1000 &&
        uuidPattern.test(String(saved.idempotency_key || ""));
      if (!validEnvelope) {
        safeLocalRemove(state.progressKey);
        return false;
      }
      const answers = saved.answers;
      const validAnswers = Array.isArray(answers) &&
        answers.length === questions.length &&
        answers.every(function (answer) {
          return answer === null || (Number.isInteger(answer) && answer >= 0 && answer <= 4);
        });
      if (!validAnswers) {
        safeLocalRemove(state.progressKey);
        return false;
      }
      const coherentSequence = answers.every(function (answer, index) {
        if (index < currentIndex) return answer !== null;
        if (index > currentIndex) return answer === null;
        return saved.submitted ? answer === selectedIndex && selectedIndex !== null : answer === null;
      });
      if (!coherentSequence) {
        safeLocalRemove(state.progressKey);
        return false;
      }
      state.answers = answers;
      state.currentIndex = currentIndex;
      state.selectedIndex = selectedIndex;
      state.submitted = saved.submitted;
      state.baselineAttemptsUsed = saved.baseline_attempts_used;
      state.attemptStartedAt = new Date(startedAt).toISOString();
      state.idempotencyKey = saved.idempotency_key.toLowerCase();
      return true;
    } catch {
      safeLocalRemove(state.progressKey);
      return false;
    }
  }

  function hasExactKeys(value, expected) {
    return isPlainObject(value) && Object.keys(value).length === expected.size &&
      Object.keys(value).every(function (key) { return expected.has(key); });
  }

  function validPendingEvaluation(value) {
    if (value === null) return true;
    if (!isPlainObject(value)) return false;
    const allowed = new Set([...evaluationRatingKeys, ...evaluationTextKeys, "recommend_training"]);
    return Object.entries(value).every(function (entry) {
      const key = entry[0];
      const fieldValue = entry[1];
      if (!allowed.has(key)) return false;
      if (evaluationRatingKeys.has(key)) return Number.isInteger(fieldValue) && fieldValue >= 1 && fieldValue <= 5;
      if (evaluationTextKeys.has(key)) {
        return typeof fieldValue === "string" && fieldValue.length <= 2000 && fieldValue.trim() === fieldValue &&
          !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(fieldValue);
      }
      return typeof fieldValue === "boolean";
    });
  }

  function validPendingPayload(payload, session) {
    if (!hasExactKeys(payload, submissionPayloadKeys) || payload.session_id !== session.session_id ||
        payload.test_id !== config.quizId || payload.quiz_version !== config.quizVersion ||
        !Array.isArray(payload.answers) || payload.answers.length !== questions.length ||
        payload.answers.some(function (answer) { return !Number.isInteger(answer) || answer < 0 || answer > 4; }) ||
        !validIsoTimestamp(payload.attempt_started_at) || !validIsoTimestamp(payload.completed_at) ||
        new Date(payload.attempt_started_at).toISOString() !== payload.attempt_started_at ||
        new Date(payload.completed_at).toISOString() !== payload.completed_at ||
        Date.parse(payload.completed_at) < Date.parse(payload.attempt_started_at) ||
        !Number.isInteger(payload.duration_seconds) || payload.duration_seconds < 0 || payload.duration_seconds > 86400 ||
        payload.privacy_notice_version !== config.privacyNoticeVersion || payload.privacy_acknowledged !== true ||
        !validPendingEvaluation(payload.evaluation)) {
      return false;
    }
    const expectedDuration = Math.max(0, Math.min(86400, Math.round(
      (Date.parse(payload.completed_at) - Date.parse(payload.attempt_started_at)) / 1000
    )));
    return payload.duration_seconds === expectedDuration;
  }

  function persistPendingSubmission() {
    if (!state.session || !state.lastSubmissionBody || !uuidPattern.test(state.idempotencyKey)) return false;
    const createdAt = new Date();
    return safeSessionSet(pendingStorageKey, JSON.stringify({
      schema_version: 1,
      session_id: state.session.session_id,
      test_id: config.quizId,
      quiz_version: config.quizVersion,
      baseline_attempts_used: state.baselineAttemptsUsed,
      idempotency_key: state.idempotencyKey,
      serialized_payload: state.lastSubmissionBody,
      created_at: createdAt.toISOString(),
      expires_at: new Date(createdAt.getTime() + pendingSubmissionTtlMs).toISOString()
    }));
  }

  function clearPendingSubmission() {
    safeSessionRemove(pendingStorageKey);
  }

  function restorePendingSubmission(session) {
    const raw = safeSessionGet(pendingStorageKey);
    if (!raw) return null;
    try {
      const envelope = JSON.parse(raw);
      const now = Date.now();
      const createdAt = Date.parse(envelope.created_at);
      const expiresAt = Date.parse(envelope.expires_at);
      const bodyBytes = typeof envelope.serialized_payload === "string"
        ? new TextEncoder().encode(envelope.serialized_payload).byteLength
        : Number.POSITIVE_INFINITY;
      const validEnvelope = hasExactKeys(envelope, pendingEnvelopeKeys) && envelope.schema_version === 1 &&
        envelope.session_id === session.session_id && envelope.test_id === config.quizId &&
        envelope.quiz_version === config.quizVersion &&
        Number.isInteger(envelope.baseline_attempts_used) && envelope.baseline_attempts_used >= 0 &&
        envelope.baseline_attempts_used <= session.attempts_used && uuidPattern.test(String(envelope.idempotency_key || "")) &&
        envelope.idempotency_key === envelope.idempotency_key.toLowerCase() &&
        bodyBytes > 0 && bodyBytes <= 20000 && Number.isFinite(createdAt) && Number.isFinite(expiresAt) &&
        createdAt <= now + 5 * 60 * 1000 && expiresAt > now && expiresAt > createdAt &&
        expiresAt <= createdAt + pendingSubmissionTtlMs + 5 * 60 * 1000;
      if (!validEnvelope) throw new Error("invalid pending envelope");
      const payload = JSON.parse(envelope.serialized_payload);
      const completedAt = Date.parse(payload && payload.completed_at);
      if (!validPendingPayload(payload, session) || createdAt < completedAt || createdAt > completedAt + 5 * 60 * 1000) {
        throw new Error("invalid pending payload");
      }
      state.lastSubmissionBody = envelope.serialized_payload;
      state.lastSubmissionPayload = payload;
      state.idempotencyKey = envelope.idempotency_key;
      state.baselineAttemptsUsed = envelope.baseline_attempts_used;
      state.answers = payload.answers.slice();
      state.currentIndex = questions.length - 1;
      state.selectedIndex = state.answers[state.currentIndex];
      state.submitted = true;
      state.attemptStartedAt = payload.attempt_started_at;
      return envelope;
    } catch {
      clearPendingSubmission();
      return null;
    }
  }

  function setSessionStatus(message, kind) {
    if (!sessionStatusNode) return;
    sessionStatusNode.textContent = message;
    sessionStatusNode.className = "session-status" + (kind ? " " + kind : "");
  }

  function invalidContract(message) {
    return new RequestError(message || "The secure service returned an invalid response.", { retryable: true });
  }

  function validateScoreResult(value) {
    if (!isPlainObject(value)) throw invalidContract();
    const correct = value.correct;
    const total = value.total;
    const percent = value.percent;
    if (!Number.isInteger(correct) || !Number.isInteger(total) || total !== questions.length || correct < 0 || correct > total ||
        !Number.isInteger(percent) || percent !== Math.round((correct / total) * 100) || typeof value.passed !== "boolean") {
      throw invalidContract();
    }
    if (selectedAssessmentMode && questions.length === 50) {
      if (!Array.isArray(value.sections) || value.sections.length !== 2) throw invalidContract();
      const expected = [
        { id: "charter", name: "AI Charter" },
        { id: selectedAssessmentMode, name: (selectedAssessmentMode === "advanced" ? "Advanced" : "Normal") + " module" }
      ];
      const sectionKeys = new Set(["id", "name", "correct", "total", "percent", "passed"]);
      const sections = value.sections.map(function (section, index) {
        if (!hasExactKeys(section, sectionKeys) || section.id !== expected[index].id || section.name !== expected[index].name ||
            !Number.isInteger(section.correct) || section.correct < 0 || section.correct > 25 || section.total !== 25 ||
            !Number.isInteger(section.percent) || section.percent !== Math.round((section.correct / 25) * 100) ||
            typeof section.passed !== "boolean" || section.passed !== (section.correct >= 18)) {
          throw invalidContract();
        }
        return { ...section };
      });
      if (correct !== sections[0].correct + sections[1].correct || value.passed !== sections.every(function (section) { return section.passed; })) {
        throw invalidContract();
      }
      return { correct, total, percent, passed: value.passed, sections };
    }
    if (value.passed !== (correct >= Math.ceil(total * config.passThreshold))) throw invalidContract();
    return { correct, total, percent, passed: value.passed };
  }

  function validateReceipt(value) {
    if (!isPlainObject(value) || !/^rct_[A-Za-z0-9_-]{20,80}$/.test(String(value.receipt_id || "")) ||
        !validIsoTimestamp(value.submitted_at) || !Number.isInteger(value.attempt_number) || value.attempt_number < 1) {
      throw invalidContract();
    }
    return {
      receipt_id: value.receipt_id,
      submitted_at: new Date(value.submitted_at).toISOString(),
      attempt_number: value.attempt_number,
      score: validateScoreResult(value.score)
    };
  }

  function validateSessionResponse(payload) {
    if (!uuidPattern.test(String(payload.session_id || "")) || !isPlainObject(payload.participant) ||
        typeof payload.participant.display_name !== "string" || !payload.participant.display_name.trim() ||
        !isPlainObject(payload.quiz) || payload.quiz.id !== config.quizId || payload.quiz.version !== config.quizVersion ||
        payload.quiz.total !== questions.length || payload.quiz.pass_percent !== Math.round(config.passThreshold * 100) ||
        !validIsoTimestamp(payload.expires_at) || Date.parse(payload.expires_at) <= Date.now() ||
        typeof payload.can_submit !== "boolean" || !Number.isInteger(payload.attempts_used) || payload.attempts_used < 0 ||
        !Number.isInteger(payload.max_attempts) || payload.max_attempts < 1 || payload.attempts_used > payload.max_attempts ||
        !["ready", "submitted"].includes(payload.status)) {
      throw invalidContract();
    }
    if ((payload.status === "ready") !== (payload.attempts_used === 0)) throw invalidContract();
    if (payload.can_submit !== (payload.attempts_used < payload.max_attempts)) throw invalidContract();
    const receipt = payload.attempts_used > 0 ? validateReceipt(payload.receipt) : null;
    if (receipt) {
      if (receipt.attempt_number !== payload.attempts_used) throw invalidContract();
      const duplicateScore = validateScoreResult(payload.score);
      if (JSON.stringify(duplicateScore) !== JSON.stringify(receipt.score)) throw invalidContract();
    } else if (payload.receipt !== null || payload.score !== null) {
      throw invalidContract();
    }
    return { ...payload, participant: { ...payload.participant, display_name: payload.participant.display_name.trim() }, receipt };
  }

  function validateSubmissionResponse(payload) {
    if (payload.ok !== true) throw invalidContract();
    return {
      ...payload,
      ...validateReceipt({
        receipt_id: payload.receipt_id,
        submitted_at: payload.submitted_at,
        attempt_number: payload.attempt_number,
        score: payload.score
      })
    };
  }

  function validateEnrollmentResponse(payload) {
    const expectedKeys = new Set(["ok", "participant_id", "invite_token", "participant", "expires_at", "request_id"]);
    const participantKeys = new Set(["display_name"]);
    if (!hasExactKeys(payload, expectedKeys) || payload.ok !== true || !uuidPattern.test(String(payload.participant_id || "")) ||
        !invitePattern.test(String(payload.invite_token || "")) || !hasExactKeys(payload.participant, participantKeys) ||
        typeof payload.participant.display_name !== "string" || !payload.participant.display_name.trim() ||
        payload.participant.display_name !== payload.participant.display_name.trim() ||
        !validIsoTimestamp(payload.expires_at) || Date.parse(payload.expires_at) <= Date.now() - 60000 ||
        !uuidPattern.test(String(payload.request_id || ""))) {
      throw invalidContract("The registration service returned an invalid response.");
    }
    return {
      ...payload,
      participant: { display_name: payload.participant.display_name }
    };
  }

  function sessionBlocked(session) {
    const status = String(session && session.status || "").toLowerCase();
    return Boolean(session && session.can_submit === false) ||
      ["expired", "revoked", "disabled", "max_attempts", "max_attempts_reached"].includes(status);
  }

  function displaySession(session) {
    const participant = session.participant || {};
    if (participantNameNode) {
      participantNameNode.textContent = participant.display_name || "Authorized participant";
    }
    const used = Number(session.attempts_used || 0);
    const maximum = Number(session.max_attempts || 0);
    if (attemptStatusNode) {
      attemptStatusNode.textContent = maximum > 0
        ? "Attempts used: " + used + " of " + maximum + "."
        : "Invitation verified.";
    }
    if (restartTopNode) restartTopNode.disabled = session.can_submit === false;
    if (sessionBlocked(session)) {
      state.accessError = "This invitation cannot start another attempt for this assessment.";
      setSessionStatus(state.accessError, "session-error");
    } else {
      setSessionStatus("Secure invitation verified.", "session-ok");
    }
  }

  async function loadSession() {
    if (state.sessionLoading) return;
    state.sessionLoading = true;
    state.resumePendingSubmission = false;
    if (cardNode) cardNode.setAttribute("aria-busy", "true");
    state.sessionRetryable = false;
    state.accessError = "";
    const capturedInvite = captureInviteToken();
    state.inviteToken = capturedInvite || (invitePattern.test(state.inviteToken) ? state.inviteToken : "");
    if (!state.inviteToken) {
      if (state.enrollmentToken) {
        state.sessionLoading = false;
        if (cardNode) cardNode.setAttribute("aria-busy", "false");
        renderEnrollmentForm();
        return;
      }
      state.accessError = "Open the unique invitation link supplied by the training organizer.";
      setSessionStatus(state.accessError, "session-error");
      state.sessionLoading = false;
      if (cardNode) cardNode.setAttribute("aria-busy", "false");
      renderQuestion();
      return;
    }
    const base = apiBase();
    if (!base) {
      state.accessError = "The secure assessment service is not configured.";
      setSessionStatus(state.accessError, "session-error");
      state.sessionLoading = false;
      if (cardNode) cardNode.setAttribute("aria-busy", "false");
      renderQuestion();
      return;
    }

    setSessionStatus("Verifying your secure invitation...", "session-loading");
    try {
      const url = base + "/v2/session?test_id=" + encodeURIComponent(config.quizId) +
        "&quiz_version=" + encodeURIComponent(config.quizVersion);
      const payload = await fetchJsonWithRetry(url, {
        method: "GET",
        mode: "cors",
        cache: "no-store",
        referrerPolicy: "no-referrer",
        headers: {
          "Authorization": "Bearer " + state.inviteToken,
          "Accept": "application/json"
        },
        validate: validateSessionResponse
      }, function (attempt, maximum, delay) {
        setSessionStatus("Connection interrupted. Retrying invitation verification (" + attempt + " of " + maximum + ") in " + Math.ceil(delay / 1000) + " seconds...", "session-loading");
      });
      state.session = payload;
      state.sessionReady = !sessionBlocked(payload);
      if (privacyConfirmationNode) privacyConfirmationNode.hidden = !state.sessionReady;
      displaySession(payload);
      if (privacyInput) privacyInput.disabled = !state.sessionReady;
      state.progressKey = progressStorageKey(payload.session_id);
      const restored = restoreProgress();
      const progressBaseline = state.baselineAttemptsUsed;
      const pending = restorePendingSubmission(payload);
      const pendingWasRecorded = pending && pending.baseline_attempts_used < payload.attempts_used;
      const recordedSinceProgress = restored && progressBaseline < payload.attempts_used;
      if (pending && !pendingWasRecorded && payload.can_submit) {
        state.resultSubmitted = false;
        state.recoveredSubmission = null;
        state.resumePendingSubmission = true;
      } else if (payload.receipt && (pendingWasRecorded || !restored || recordedSinceProgress || !payload.can_submit)) {
        state.recoveredSubmission = payload.receipt;
        state.resultSubmitted = true;
        safeLocalRemove(state.progressKey);
        showRecoveredSubmission(payload.receipt);
      }
    } catch (error) {
      state.accessError = error && error.message
        ? error.message
        : "The invitation could not be verified. Contact the training organizer.";
      state.sessionRetryable = Boolean(error && error.retryable);
      setSessionStatus(state.accessError, "session-error");
    } finally {
      state.sessionLoading = false;
      if (cardNode) cardNode.setAttribute("aria-busy", "false");
    }
    renderQuestion();
    if (state.resumePendingSubmission) {
      state.resumePendingSubmission = false;
      resumePersistedSubmission();
    }
  }

  function publicError(payload, status) {
    const errorPayload = payload && payload.error;
    const code = String(payload && payload.code || errorPayload && errorPayload.code || "").toLowerCase();
    const messages = {
      invalid_invitation: "This invitation is invalid. Request a new link from the training organizer.",
      expired_invitation: "This invitation has expired. Request a new link from the training organizer.",
      invitation_invalid: "This invitation is invalid. Request a new link from the training organizer.",
      invitation_expired: "This invitation has expired. Request a new link from the training organizer.",
      enrollment_invalid: "This protected registration link is invalid. Request a new link from the training organizer.",
      enrollment_unauthorized: "This protected registration link is invalid. Request a new link from the training organizer.",
      enrollment_expired: "This protected registration link has expired. Request a new link from the training organizer.",
      enrollment_used: "This work email is already registered. Continue in the original browser tab or contact the training organizer.",
      enrollment_rate_limited: "Too many registration attempts were made. Wait briefly and try again.",
      self_enrollment_disabled: "Protected registration is closed. Contact the training organizer.",
      self_enrollment_not_configured: "Protected registration is temporarily unavailable. Contact the training organizer.",
      email_domain_not_allowed: "Use your @advancy.com work email to register.",
      identity_conflict: "These registration details could not be verified. Contact the training organizer.",
      idempotency_key_reused: "Use the same details as your first registration attempt or contact the training organizer.",
      participant_revoked: "Your assessment access has been revoked. Contact the training organizer.",
      revoked_invitation: "This invitation has been revoked. Contact the training organizer.",
      quiz_not_assigned: "This assessment is not assigned to your invitation.",
      max_attempts_reached: "The maximum number of attempts has been reached.",
      attempt_limit_reached: "The maximum number of attempts has been reached.",
      cohort_not_active: "This assessment cohort is not active.",
      cohort_expired: "The registration window for this assessment has closed.",
      privacy_acknowledgement_required: "Please acknowledge the privacy notice before submitting.",
      privacy_notice_required: "Please acknowledge the current privacy notice before submitting.",
      session_mismatch: "This invitation does not authorize the current assessment session.",
      unknown_quiz_version: "This assessment version is no longer available. Reload the page or contact the organizer."
    };
    if (messages[code]) return messages[code];
    if (status === 401 || status === 403) return "The invitation could not be authorized.";
    if (status === 429) return "The service is temporarily limiting requests. Please retry shortly.";
    if (status >= 500) return "The secure assessment service is temporarily unavailable.";
    return "The request could not be completed. Please check the invitation and try again.";
  }

  function updateProgress() {
    const answered = answeredCount();
    const total = questions.length;
    const progressValue = Math.round(((state.submitted ? state.currentIndex + 1 : state.currentIndex) / total) * 100);
    if (progressNode) progressNode.textContent = "Question " + Math.min(state.currentIndex + 1, total) + " / " + total;
    if (progressFillNode) progressFillNode.style.width = progressValue + "%";
    if (scoreNode) scoreNode.textContent = score() + " / " + answered;
  }

  function clearResult() {
    if (!resultNode) return;
    resultNode.style.display = "none";
    resultNode.className = "";
    resultNode.replaceChildren();
    resultNode.setAttribute("aria-busy", "false");
  }

  function createOption(item, option, optionIndex) {
    const label = document.createElement("label");
    label.className = "answer";
    label.dataset.testid = "answer-option-" + optionIndex;
    label.dataset.answerIndex = String(optionIndex);
    if (state.selectedIndex === optionIndex) label.classList.add("selected");
    if (state.submitted && optionIndex === item.correct) label.classList.add("correct");
    if (state.submitted && state.selectedIndex === optionIndex && optionIndex !== item.correct) {
      label.classList.add("incorrect-selected");
    }

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "answer";
    input.value = String(optionIndex);
    input.checked = state.selectedIndex === optionIndex;
    input.disabled = state.submitted || !canStart();
    input.addEventListener("change", function () {
      state.selectedIndex = optionIndex;
      saveProgress();
      cardNode.querySelectorAll(".answer").forEach(function (answerNode) {
        answerNode.classList.toggle("selected", answerNode.dataset.answerIndex === String(optionIndex));
      });
      const submit = cardNode.querySelector("[data-testid='submit-answer']");
      if (submit) submit.disabled = false;
    });

    const answerText = document.createElement("span");
    const letter = document.createElement("span");
    letter.className = "letter";
    letter.textContent = letters[optionIndex] + ".";
    answerText.appendChild(letter);
    appendText(answerText, option.text);
    label.append(input, answerText);
    return label;
  }

  function createFeedback(option, optionIndex, correctIndex) {
    const feedback = document.createElement("div");
    feedback.className = "option-feedback " + (optionIndex === correctIndex ? "correct" : "incorrect");
    const title = document.createElement("strong");
    title.textContent = letters[optionIndex] + ". " + (optionIndex === correctIndex ? "Correct" : "Incorrect");
    const why = document.createElement("span");
    why.textContent = option.why;
    feedback.append(title, why);
    return feedback;
  }

  function renderAccessGate() {
    if (!cardNode) return;
    if (sectionLabelNode && selectedAssessmentMode) {
      sectionLabelNode.textContent = modeLabel(selectedAssessmentMode) + " mode · Secure access";
    }
    cardNode.replaceChildren();
    const section = document.createElement("section");
    section.className = "access-gate";
    section.dataset.testid = "access-gate";
    const title = document.createElement("h2");
    title.textContent = state.accessError ? "Secure access required" : "Verifying secure access";
    const copy = document.createElement("p");
    copy.textContent = state.accessError || "Please wait while your invitation is verified.";
    section.append(title, copy);
    if (state.accessError && state.sessionRetryable) {
      const retry = document.createElement("button");
      retry.type = "button";
      retry.className = "button button-primary";
      retry.dataset.testid = "retry-session";
      retry.textContent = "Retry invitation verification";
      retry.addEventListener("click", function () {
        state.accessError = "";
        state.sessionRetryable = false;
        renderAccessGate();
        loadSession();
      });
      section.appendChild(retry);
    }
    cardNode.appendChild(section);
    updateProgress();
  }

  function renderEnrollmentForm() {
    if (!cardNode || !state.enrollmentToken) return;
    if (privacyConfirmationNode) privacyConfirmationNode.hidden = true;
    cardNode.replaceChildren();
    cardNode.setAttribute("aria-busy", state.enrollmentPending ? "true" : "false");
    if (sectionLabelNode) sectionLabelNode.textContent = modeLabel(selectedAssessmentMode) + " mode · Protected registration";
    if (participantNameNode) participantNameNode.textContent = "Registration required";
    if (attemptStatusNode) attemptStatusNode.textContent = "Register with your Advancy work identity to continue.";
    setSessionStatus("Complete the protected registration form to verify your invitation.", "session-loading");

    const section = document.createElement("section");
    section.className = "enrollment-card";
    section.setAttribute("aria-labelledby", "enrollment-title");
    const title = document.createElement("h2");
    title.id = "enrollment-title";
    title.tabIndex = -1;
    title.textContent = "Register for the assessment";
    const intro = document.createElement("p");
    intro.textContent = "Use your @advancy.com work email. Your protected registration link will be exchanged for a private participant invitation.";
    const form = document.createElement("form");
    form.className = "enrollment-form";
    form.dataset.testid = "enrollment-form";
    form.noValidate = true;

    const fields = [
      { id: "enrollment-first-name", name: "first_name", label: "First name", type: "text", autocomplete: "given-name", maxLength: 120 },
      { id: "enrollment-last-name", name: "last_name", label: "Last name", type: "text", autocomplete: "family-name", maxLength: 120 },
      { id: "enrollment-email", name: "email", label: "Advancy work email", type: "email", autocomplete: "email", maxLength: 254 }
    ];
    fields.forEach(function (field) {
      const label = document.createElement("label");
      label.setAttribute("for", field.id);
      label.textContent = field.label;
      const input = document.createElement("input");
      input.id = field.id;
      input.name = field.name;
      input.type = field.type;
      input.autocomplete = field.autocomplete;
      input.maxLength = field.maxLength;
      input.required = true;
      input.dataset.testid = field.name;
      form.append(label, input);
    });

    const privacyLabel = document.createElement("label");
    privacyLabel.className = "enrollment-privacy";
    const privacy = document.createElement("input");
    privacy.type = "checkbox";
    privacy.name = "privacy_acknowledged";
    privacy.required = true;
    privacy.dataset.testid = "enrollment-privacy";
    const privacyText = document.createElement("span");
    appendText(privacyText, "I have read the ");
    const privacyLink = document.createElement("a");
    privacyLink.href = "privacy.html";
    privacyLink.target = "_blank";
    privacyLink.rel = "noopener noreferrer";
    privacyLink.textContent = "assessment privacy notice";
    privacyText.append(privacyLink, document.createTextNode("."));
    privacyLabel.append(privacy, privacyText);
    form.appendChild(privacyLabel);

    const status = document.createElement("p");
    status.className = "enrollment-status";
    status.dataset.testid = "enrollment-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    const submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "button button-primary";
    submit.dataset.testid = "submit-enrollment";
    submit.textContent = "Register and continue";
    form.append(status, submit);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      submitEnrollment(form, status);
    });
    section.append(title, intro, form);
    cardNode.appendChild(section);
    updateProgress();
    window.requestAnimationFrame(function () { title.focus(); });
  }

  function enrollmentFormPayload(form) {
    const data = new FormData(form);
    const firstName = String(data.get("first_name") || "").trim();
    const lastName = String(data.get("last_name") || "").trim();
    const email = String(data.get("email") || "").trim().toLowerCase();
    const invalidControl = /[\u0000-\u001f]/;
    if (!firstName || firstName.length > 120 || invalidControl.test(firstName)) {
      return { error: "Enter a valid first name.", focus: form.elements.first_name };
    }
    if (!lastName || lastName.length > 120 || invalidControl.test(lastName)) {
      return { error: "Enter a valid last name.", focus: form.elements.last_name };
    }
    if (!/^[^\s@]{1,64}@advancy\.com$/i.test(email) || email.length > 254) {
      return { error: "Enter your @advancy.com work email.", focus: form.elements.email };
    }
    if (!form.elements.privacy_acknowledged.checked) {
      return { error: "Acknowledge the privacy notice to register.", focus: form.elements.privacy_acknowledged };
    }
    return {
      payload: {
        first_name: firstName,
        last_name: lastName,
        email,
        quiz_id: config.quizId,
        privacy_notice_version: config.privacyNoticeVersion,
        privacy_acknowledged: true
      }
    };
  }

  async function submitEnrollment(form, statusNode) {
    if (state.enrollmentPending || !state.enrollmentToken) return;
    if (!uuidPattern.test(state.enrollmentIdempotencyKey)) {
      statusNode.textContent = "The protected registration session could not be initialized. Reopen the registration link.";
      statusNode.className = "enrollment-status save-error";
      return;
    }
    const prepared = enrollmentFormPayload(form);
    if (prepared.error) {
      statusNode.textContent = prepared.error;
      statusNode.className = "enrollment-status save-error";
      if (prepared.focus) prepared.focus.focus();
      return;
    }
    state.enrollmentPending = true;
    cardNode.setAttribute("aria-busy", "true");
    Array.from(form.elements).forEach(function (control) { control.disabled = true; });
    statusNode.textContent = "Registering securely...";
    statusNode.className = "enrollment-status";
    try {
      const response = await fetchJsonWithRetry(apiBase() + "/v2/enroll", {
        method: "POST",
        mode: "cors",
        cache: "no-store",
        referrerPolicy: "no-referrer",
        headers: {
          "Authorization": "Bearer " + state.enrollmentToken,
          "Idempotency-Key": state.enrollmentIdempotencyKey,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(prepared.payload),
        validate: validateEnrollmentResponse
      }, function (attempt, maximum, delay) {
        statusNode.textContent = "Connection interrupted. Retrying registration (" + attempt + " of " + maximum + ") in " + Math.ceil(delay / 1000) + " seconds...";
      });
      safeSessionSet(inviteStorageKey, response.invite_token);
      safeSessionRemove(enrollmentStorageKey);
      safeSessionRemove(enrollmentIdempotencyStorageKey);
      state.inviteToken = response.invite_token;
      state.enrollmentToken = "";
      state.enrollmentIdempotencyKey = "";
      state.enrollmentPending = false;
      if (privacyInput) privacyInput.checked = true;
      if (participantNameNode) participantNameNode.textContent = response.participant.display_name;
      setSessionStatus("Registration verified. Loading your assessment...", "session-ok");
      cardNode.setAttribute("aria-busy", "false");
      loadSession();
    } catch (error) {
      state.enrollmentPending = false;
      cardNode.setAttribute("aria-busy", "false");
      Array.from(form.elements).forEach(function (control) { control.disabled = false; });
      statusNode.textContent = error && error.message ? error.message : "Registration could not be completed.";
      statusNode.className = "enrollment-status save-error";
    }
  }

  function renderCompletedGate() {
    if (sectionLabelNode) sectionLabelNode.textContent = "Assessment recorded · " + modeLabel(selectedAssessmentMode) + " mode";
    cardNode.replaceChildren();
    const section = document.createElement("section");
    section.className = "access-gate completed-gate";
    section.dataset.testid = "recorded-attempt";
    const title = document.createElement("h2");
    title.textContent = "Assessment already recorded";
    const copy = document.createElement("p");
    copy.textContent = "Your latest recorded result and receipt are shown below.";
    section.append(title, copy);
    if (state.session && state.session.can_submit) {
      const another = document.createElement("button");
      another.type = "button";
      another.className = "button button-primary";
      another.dataset.testid = "start-another-attempt";
      another.textContent = "Start another attempt";
      another.addEventListener("click", restartAssessment);
      section.appendChild(another);
    }
    cardNode.appendChild(section);
  }

  function renderQuestion(focusTarget) {
    if (!cardNode) return;
    if (state.recoveredSubmission) {
      renderCompletedGate();
      return;
    }
    if (!state.sessionReady || state.accessError) {
      renderAccessGate();
      return;
    }

    updateSectionContext();
    const item = questions[state.currentIndex];
    cardNode.replaceChildren();
    const heading = document.createElement("div");
    heading.className = "question-heading";
    const id = document.createElement("div");
    id.className = "qid";
    id.textContent = String(state.currentIndex + 1).padStart(2, "0");
    const title = document.createElement("h2");
    title.id = "current-question-title";
    title.tabIndex = -1;
    if (sectionLabelNode) title.setAttribute("aria-describedby", sectionLabelNode.id);
    title.textContent = item.q;
    heading.append(id, title);

    const answersNode = document.createElement("fieldset");
    answersNode.className = "answers";
    answersNode.setAttribute("aria-labelledby", title.id);
    const legend = document.createElement("legend");
    legend.className = "visually-hidden";
    legend.textContent = "Choose one answer.";
    answersNode.appendChild(legend);
    item.options.forEach(function (option, optionIndex) {
      answersNode.appendChild(createOption(item, option, optionIndex));
    });

    const correction = document.createElement("div");
    correction.className = state.submitted ? "correction visible" : "correction";
    correction.setAttribute("role", "region");
    correction.setAttribute("aria-live", "polite");
    const correctionTitle = document.createElement("h3");
    correctionTitle.className = "correction-title";
    correctionTitle.id = "current-correction-title";
    correctionTitle.tabIndex = -1;
    correctionTitle.textContent = config.correctionTitle;
    correction.setAttribute("aria-labelledby", correctionTitle.id);
    correction.appendChild(correctionTitle);
    item.options.forEach(function (option, optionIndex) {
      correction.appendChild(createFeedback(option, optionIndex, item.correct));
    });

    const actions = document.createElement("div");
    actions.className = "question-actions";
    if (!state.submitted) {
      const submit = document.createElement("button");
      submit.type = "button";
      submit.className = "button button-primary";
      submit.textContent = "Submit answer";
      submit.dataset.testid = "submit-answer";
      submit.disabled = state.selectedIndex === null || !canStart();
      submit.addEventListener("click", function () {
        state.submitted = true;
        state.answers[state.currentIndex] = state.selectedIndex;
        saveProgress();
        renderQuestion("correction");
      });
      actions.appendChild(submit);
    } else {
      const next = document.createElement("button");
      next.type = "button";
      next.className = "button button-primary";
      next.dataset.testid = state.currentIndex === questions.length - 1 ? "finalize-assessment" : "next-question";
      next.textContent = state.currentIndex === questions.length - 1 ? "Finalize assessment" : "Next question";
      next.addEventListener("click", function () {
        if (state.currentIndex === questions.length - 1) {
          setResult();
          return;
        }
        state.currentIndex += 1;
        state.selectedIndex = state.answers[state.currentIndex];
        state.submitted = state.selectedIndex !== null;
        clearResult();
        saveProgress();
        renderQuestion("question");
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      actions.appendChild(next);
    }

    const restart = document.createElement("button");
    restart.type = "button";
    restart.className = "button button-neutral";
    restart.textContent = "Restart this attempt";
    restart.dataset.testid = "restart-assessment";
    restart.addEventListener("click", restartAssessment);
    actions.appendChild(restart);

    cardNode.append(heading, answersNode, correction, actions);
    updateProgress();
    if (focusTarget === "correction") {
      window.requestAnimationFrame(function () { correctionTitle.focus(); });
    } else if (focusTarget === "question") {
      window.requestAnimationFrame(function () { title.focus(); });
    }
  }

  function collectEvaluation(form) {
    const evaluation = {};
    const formData = new FormData(form);
    (config.trainingEvaluation.criteria || []).forEach(function (criterion) {
      const value = formData.get("evaluation-" + criterion.id);
      if (value !== null && value !== "") evaluation[criterion.id] = Number(value);
    });
    evaluation.recommend_training = formData.get("recommend_training") === "yes";
    [
      "most_valuable_takeaway",
      "improvement_suggestion",
      "suggested_ai_automation_use_cases"
    ].forEach(function (field) {
      const value = String(formData.get(field) || "").trim();
      if (value) evaluation[field] = value;
    });
    return Object.keys(evaluation).length > 1 || evaluation.recommend_training ? evaluation : null;
  }

  function createTrainingEvaluation(statusNode) {
    const evaluation = config.trainingEvaluation;
    const section = document.createElement("section");
    section.className = "training-evaluation";
    section.setAttribute("aria-labelledby", "training-evaluation-title");

    const title = document.createElement("h3");
    title.id = "training-evaluation-title";
    title.textContent = evaluation.title || "Optional training evaluation";
    const intro = document.createElement("p");
    intro.textContent = "Feedback is optional and is not required to record your assessment result. Do not include client, confidential, personal, or market-sensitive information.";
    const form = document.createElement("form");
    form.className = "evaluation-form";
    form.noValidate = true;

    const scale = document.createElement("div");
    scale.className = "evaluation-scale";
    scale.textContent = evaluation.scaleLabel || "Optional scale: 1 = insufficient, 5 = excellent.";
    form.appendChild(scale);

    (evaluation.criteria || []).forEach(function (criterion) {
      const field = document.createElement("fieldset");
      field.className = "evaluation-criterion";
      const legend = document.createElement("legend");
      legend.textContent = criterion.label + " (optional)";
      field.appendChild(legend);
      const group = document.createElement("div");
      group.className = "rating-group";
      [1, 2, 3, 4, 5].forEach(function (value) {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "evaluation-" + criterion.id;
        input.value = String(value);
        label.appendChild(input);
        appendText(label, String(value));
        group.appendChild(label);
      });
      field.appendChild(group);
      form.appendChild(field);
    });

    const fields = [
      ["most_valuable_takeaway", "Most valuable takeaway (optional)", "What will you apply?"],
      ["improvement_suggestion", "Improvement suggestion (optional)", "What should be improved?"],
      ["suggested_ai_automation_use_cases", "Suggested AI automation use cases (optional)", "Describe only non-confidential workflow ideas."]
    ];
    fields.forEach(function (definition) {
      const label = document.createElement("label");
      label.className = "evaluation-text";
      label.setAttribute("for", definition[0]);
      label.textContent = definition[1];
      const textarea = document.createElement("textarea");
      textarea.id = definition[0];
      textarea.name = definition[0];
      textarea.rows = 3;
      textarea.maxLength = 2000;
      textarea.placeholder = definition[2];
      form.append(label, textarea);
    });

    const recommend = document.createElement("label");
    recommend.className = "evaluation-checkbox";
    const recommendInput = document.createElement("input");
    recommendInput.type = "checkbox";
    recommendInput.name = "recommend_training";
    recommendInput.value = "yes";
    recommend.appendChild(recommendInput);
    appendText(recommend, " I would recommend this training.");
    form.appendChild(recommend);

    const actions = document.createElement("div");
    actions.className = "question-actions";
    const submitWithFeedback = document.createElement("button");
    submitWithFeedback.type = "submit";
    submitWithFeedback.className = "button button-primary";
    submitWithFeedback.dataset.testid = "submit-with-feedback";
    submitWithFeedback.textContent = "Submit result and optional feedback";
    const submitWithoutFeedback = document.createElement("button");
    submitWithoutFeedback.type = "button";
    submitWithoutFeedback.className = "button button-neutral";
    submitWithoutFeedback.dataset.testid = "submit-without-feedback";
    submitWithoutFeedback.textContent = "Submit result without feedback";
    actions.append(submitWithFeedback, submitWithoutFeedback);
    form.appendChild(actions);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      submitAssessment(collectEvaluation(form), statusNode);
    });
    submitWithoutFeedback.addEventListener("click", function () {
      submitAssessment(null, statusNode);
    });
    section.append(title, intro, form);
    return section;
  }

  function buildSubmissionPayload(evaluation) {
    const completedAt = new Date();
    const startedAt = new Date(state.attemptStartedAt);
    const duration = Math.max(0, Math.min(86400, Math.round((completedAt.getTime() - startedAt.getTime()) / 1000)));
    return {
      session_id: state.session.session_id,
      test_id: config.quizId,
      quiz_version: config.quizVersion,
      answers: state.answers.slice(),
      attempt_started_at: state.attemptStartedAt,
      completed_at: completedAt.toISOString(),
      duration_seconds: duration,
      privacy_notice_version: config.privacyNoticeVersion,
      privacy_acknowledged: true,
      evaluation: evaluation || null
    };
  }

  async function wait(milliseconds) {
    return new Promise(function (resolve) {
      window.setTimeout(resolve, milliseconds);
    });
  }

  async function postWithRetry(serializedPayload, statusNode) {
    return fetchJsonWithRetry(apiBase() + "/v2/submit", {
      method: "POST",
      mode: "cors",
      cache: "no-store",
      referrerPolicy: "no-referrer",
      headers: {
        "Authorization": "Bearer " + state.inviteToken,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Idempotency-Key": state.idempotencyKey
      },
      body: serializedPayload,
      validate: validateSubmissionResponse
    }, function (attempt, maximum, delay) {
      statusNode.textContent = "Connection interrupted. Retrying secure submission (" + attempt + " of " + maximum + ") in " + Math.ceil(delay / 1000) + " seconds...";
    });
  }

  function renderRecordedResult(response, recovered) {
    if (!resultNode) return;
    const scoreResult = response.score;
    const correct = Number(scoreResult.correct);
    const total = Number(scoreResult.total);
    const percent = Number(scoreResult.percent);
    const passed = scoreResult.passed;
    resultNode.replaceChildren();
    resultNode.setAttribute("aria-busy", "false");
    resultNode.style.display = "block";
    resultNode.className = passed ? "pass" : "fail";
    const title = document.createElement("h2");
    title.className = "result-title";
    title.tabIndex = -1;
    title.textContent = (passed ? "Passed" : "Not passed") + " - " + correct + "/" + total + " (" + percent + "%)";
    const copy = document.createElement("p");
    copy.className = "result-copy save-status save-ok";
    copy.setAttribute("role", "status");
    copy.textContent = recovered
      ? "Your previously recorded assessment result was recovered securely."
      : "Your assessment was recorded securely.";
    const receipt = document.createElement("p");
    receipt.className = "receipt";
    receipt.dataset.testid = "submission-receipt";
    receipt.textContent = "Receipt: " + response.receipt_id;
    resultNode.append(title, copy);
    if (Array.isArray(scoreResult.sections)) {
      const sectionTitle = document.createElement("h3");
      sectionTitle.className = "result-sections-title";
      sectionTitle.textContent = "Section results";
      const sectionList = document.createElement("ul");
      sectionList.className = "result-sections";
      scoreResult.sections.forEach(function (section) {
        const item = document.createElement("li");
        item.dataset.testid = "result-section-" + section.id;
        const name = document.createElement("strong");
        name.textContent = section.name;
        const detail = document.createElement("span");
        detail.textContent = section.correct + "/" + section.total + " (" + section.percent + "%)";
        const status = document.createElement("span");
        status.className = "section-result-status " + (section.passed ? "section-pass" : "section-fail");
        status.textContent = section.passed ? "Passed" : "Not passed";
        item.append(name, detail, status);
        sectionList.appendChild(item);
      });
      resultNode.append(sectionTitle, sectionList);
    }
    resultNode.appendChild(receipt);
    if (scoreNode) scoreNode.textContent = correct + " / " + total;
    window.requestAnimationFrame(function () { title.focus(); });
  }

  function showRecoveredSubmission(receipt) {
    clearPendingSubmission();
    state.lastSubmissionPayload = null;
    state.lastSubmissionBody = "";
    state.recoveredSubmission = receipt;
    state.resultSubmitted = true;
    state.submissionPending = false;
    renderRecordedResult(receipt, true);
  }

  function showSubmissionSuccess(response) {
    clearPendingSubmission();
    state.resultSubmitted = true;
    state.submissionPending = false;
    state.recoveredSubmission = response;
    safeLocalRemove(state.progressKey);
    state.lastSubmissionPayload = null;
    state.lastSubmissionBody = "";
    if (state.session) {
      state.session.attempts_used = Math.max(state.session.attempts_used, response.attempt_number);
      state.session.can_submit = state.session.attempts_used < state.session.max_attempts;
      displaySession(state.session);
    }
    renderRecordedResult(response, false);
  }

  function showSubmissionFailure(error, statusNode) {
    state.submissionPending = false;
    resultNode.setAttribute("aria-busy", "false");
    statusNode.textContent = error && error.message
      ? error.message
      : "Submission failed. Your answers remain on this device so you can retry.";
    statusNode.className = "result-copy save-status save-error";
    const existing = resultNode.querySelector("[data-testid='retry-submit']");
    if (existing) existing.remove();
    if (!error || !error.retryable || !state.lastSubmissionBody) return;
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "button button-primary";
    retry.dataset.testid = "retry-submit";
    retry.textContent = "Retry secure submission";
    retry.addEventListener("click", function () {
      retrySubmission(statusNode);
    });
    resultNode.appendChild(retry);
  }

  function lockEvaluationControls() {
    resultNode.querySelectorAll(".evaluation-form input, .evaluation-form textarea, .evaluation-form button").forEach(function (control) {
      control.disabled = true;
    });
  }

  async function retrySubmission(statusNode) {
    if (state.submissionPending || state.resultSubmitted || !state.lastSubmissionBody) return;
    state.submissionPending = true;
    resultNode.setAttribute("aria-busy", "true");
    statusNode.textContent = "Retrying the same secure submission...";
    statusNode.className = "result-copy save-status";
    const retry = resultNode.querySelector("[data-testid='retry-submit']");
    if (retry) retry.remove();
    try {
      const response = await postWithRetry(state.lastSubmissionBody, statusNode);
      showSubmissionSuccess(response);
    } catch (error) {
      showSubmissionFailure(error, statusNode);
    }
  }

  function resumePersistedSubmission() {
    if (!resultNode || !state.lastSubmissionBody) return;
    resultNode.replaceChildren();
    resultNode.className = "result-pending";
    resultNode.style.display = "block";
    const title = document.createElement("h2");
    title.className = "result-title";
    title.tabIndex = -1;
    title.dataset.testid = "resuming-submission";
    title.textContent = "Resuming secure submission";
    const copy = document.createElement("p");
    copy.className = "result-copy";
    copy.textContent = "The exact pending response from this tab is being retried safely.";
    const status = document.createElement("p");
    status.className = "result-copy save-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    resultNode.append(title, copy, status);
    resultNode.scrollIntoView({ behavior: "smooth", block: "start" });
    window.requestAnimationFrame(function () { title.focus(); });
    retrySubmission(status);
  }

  async function submitAssessment(evaluation, statusNode) {
    if (state.submissionPending || state.resultSubmitted) return;
    if (state.lastSubmissionBody) {
      retrySubmission(statusNode);
      return;
    }
    if (!privacyAcknowledged()) {
      statusNode.textContent = "Acknowledge the privacy notice before submitting.";
      return;
    }
    state.submissionPending = true;
    resultNode.setAttribute("aria-busy", "true");
    const payload = buildSubmissionPayload(evaluation);
    state.lastSubmissionPayload = JSON.parse(JSON.stringify(payload));
    state.lastSubmissionBody = JSON.stringify(state.lastSubmissionPayload);
    persistPendingSubmission();
    lockEvaluationControls();
    statusNode.textContent = "Submitting securely...";
    statusNode.className = "result-copy save-status";
    try {
      const response = await postWithRetry(state.lastSubmissionBody, statusNode);
      showSubmissionSuccess(response);
    } catch (error) {
      showSubmissionFailure(error, statusNode);
    }
  }

  function setResult() {
    if (!resultNode || state.answers.some(function (answer) { return answer === null; })) return;
    resultNode.replaceChildren();
    resultNode.className = "result-pending";
    resultNode.style.display = "block";

    const title = document.createElement("h2");
    title.className = "result-title";
    title.tabIndex = -1;
    title.textContent = "Assessment complete - ready for secure submission";
    const copy = document.createElement("p");
    copy.className = "result-copy";
    copy.textContent = "The secure service will calculate and record the authoritative result.";
    const status = document.createElement("p");
    status.className = "result-copy save-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    resultNode.append(title, copy, status);

    if (config.trainingEvaluation) {
      resultNode.appendChild(createTrainingEvaluation(status));
      status.textContent = "You may add optional feedback or submit the result without feedback.";
    } else {
      submitAssessment(null, status);
    }
    resultNode.scrollIntoView({ behavior: "smooth", block: "start" });
    window.requestAnimationFrame(function () { title.focus(); });
  }

  function restartAssessment() {
    if (state.submissionPending) return;
    if (state.session && state.session.can_submit === false) return;
    state.recoveredSubmission = null;
    state.accessError = "";
    state.currentIndex = 0;
    state.selectedIndex = null;
    state.submitted = false;
    state.resultSubmitted = false;
    state.lastSubmissionPayload = null;
    state.lastSubmissionBody = "";
    clearPendingSubmission();
    state.answers = Array(questions.length).fill(null);
    state.baselineAttemptsUsed = state.session ? state.session.attempts_used : 0;
    state.attemptStartedAt = new Date().toISOString();
    state.idempotencyKey = createId();
    safeLocalRemove(state.progressKey);
    clearResult();
    saveProgress();
    renderQuestion("question");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  window.addEventListener("hashchange", function () {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    if (params.has("invite") || params.has("enroll")) window.location.reload();
  });
  if (changeModeNode) changeModeNode.addEventListener("click", changeAssessmentMode);

  if (!selectedAssessmentMode) {
    renderModeLanding();
    return;
  }

  configureSelectedMode();
  if (questions.length !== 50) {
    state.accessError = "The selected 50-question assessment is not available. Contact the training organizer.";
    setSessionStatus(state.accessError, "session-error");
    renderAccessGate();
    return;
  }

  if (privacyInput) {
    privacyInput.disabled = true;
    privacyInput.checked = false;
    privacyInput.addEventListener("change", function () {
      renderQuestion();
    });
  }
  if (restartTopNode) restartTopNode.addEventListener("click", restartAssessment);

  updateProgress();
  renderAccessGate();
  loadSession();
})();
