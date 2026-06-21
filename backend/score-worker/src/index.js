const ALLOWED_ORIGINS = new Set([
  "https://jjohana.github.io",
  "http://localhost:8000",
  "http://127.0.0.1:8000"
]);

const TEST_IDS = new Set(["advancy-ai-charter", "advancy-ai-usage", "advancy-ai-usage-advanced"]);

const TEXT_FIELDS = [
  "test_id",
  "test_name",
  "first_name",
  "last_name",
  "email",
  "passed",
  "answers",
  "correct_answers",
  "timestamp",
  "attempt_started_at",
  "completed_at",
  "source_url",
  "user_agent",
  "evaluation_submitted_at",
  "recommend_training",
  "most_valuable_takeaway",
  "improvement_suggestion",
  "suggested_ai_automation_use_cases"
];

const RATING_FIELDS = [
  "training_relevance",
  "conceptual_clarity",
  "practical_applicability",
  "governance_confidence",
  "codex_workflow_confidence",
  "materials_quality",
  "pace_and_depth",
  "overall_satisfaction"
];

const SCORE_FIELDS = ["correct", "total", "percent", "duration_seconds"];

function corsHeaders(request) {
  const origin = request.headers.get("Origin");
  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Token",
    "Access-Control-Max-Age": "86400"
  };

  if (ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers.Vary = "Origin";
  }

  return headers;
}

function jsonResponse(request, status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(request),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function textResponse(request, status, body, contentType = "text/plain; charset=utf-8") {
  return new Response(body, {
    status,
    headers: {
      ...corsHeaders(request),
      "Content-Type": contentType,
      "Cache-Control": "no-store"
    }
  });
}

function cleanText(value, maxLength = 4000) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function normalize(value) {
  return cleanText(value, 255).toLowerCase();
}

function parseInteger(value, fallback = null) {
  if (value === "" || value === null || value === undefined) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function rating(value) {
  const parsed = parseInteger(value);
  return parsed >= 1 && parsed <= 5 ? parsed : null;
}

function validatePayload(payload) {
  const required = [
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

  for (const field of required) {
    if (cleanText(payload[field]) === "") {
      throw new Error(`Missing field: ${field}`);
    }
  }

  if (!TEST_IDS.has(cleanText(payload.test_id))) {
    throw new Error("Invalid test_id");
  }

  const email = normalize(payload.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid email");
  }

  const total = parseInteger(payload.total);
  const correct = parseInteger(payload.correct);
  const percent = parseInteger(payload.percent);
  if (total !== 25 || correct < 0 || correct > total || percent < 0 || percent > 100) {
    throw new Error("Invalid score");
  }
}

function rowFromPayload(payload) {
  validatePayload(payload);

  const row = {
    test_id: cleanText(payload.test_id, 80),
    first_name_norm: normalize(payload.first_name),
    last_name_norm: normalize(payload.last_name),
    email: normalize(payload.email),
    test_name: cleanText(payload.test_name, 200),
    first_name: cleanText(payload.first_name, 120),
    last_name: cleanText(payload.last_name, 120),
    correct: parseInteger(payload.correct),
    total: parseInteger(payload.total),
    percent: parseInteger(payload.percent),
    passed: cleanText(payload.passed, 10),
    answers: cleanText(payload.answers, 300),
    correct_answers: cleanText(payload.correct_answers, 300),
    client_timestamp: cleanText(payload.timestamp, 80),
    attempt_started_at: cleanText(payload.attempt_started_at, 80),
    completed_at: cleanText(payload.completed_at, 80),
    duration_seconds: parseInteger(payload.duration_seconds),
    source_url: cleanText(payload.source_url, 1000),
    user_agent: cleanText(payload.user_agent, 1000),
    evaluation_submitted_at: cleanText(payload.evaluation_submitted_at, 80),
    recommend_training: cleanText(payload.recommend_training, 10),
    most_valuable_takeaway: cleanText(payload.most_valuable_takeaway, 4000),
    improvement_suggestion: cleanText(payload.improvement_suggestion, 4000),
    suggested_ai_automation_use_cases: cleanText(payload.suggested_ai_automation_use_cases, 4000),
    raw_json: JSON.stringify(payload)
  };

  for (const field of RATING_FIELDS) {
    row[field] = rating(payload[field]);
  }

  return row;
}

async function submitScore(request, env) {
  const raw = await request.text();
  if (raw.length > 100000) {
    return jsonResponse(request, 413, { ok: false, error: "Payload too large" });
  }

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return jsonResponse(request, 400, { ok: false, error: "Invalid JSON" });
  }

  let row;
  try {
    row = rowFromPayload(payload);
  } catch (error) {
    return jsonResponse(request, 400, { ok: false, error: error.message });
  }

  const sql = `
    INSERT INTO scores (
      test_id, first_name_norm, last_name_norm, email, test_name, first_name, last_name,
      correct, total, percent, passed, answers, correct_answers, client_timestamp,
      attempt_started_at, completed_at, duration_seconds, source_url, user_agent,
      evaluation_submitted_at, training_relevance, conceptual_clarity, practical_applicability,
      governance_confidence, codex_workflow_confidence, materials_quality, pace_and_depth,
      overall_satisfaction, recommend_training, most_valuable_takeaway, improvement_suggestion,
      suggested_ai_automation_use_cases, raw_json, submission_count, received_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1,
      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
    ON CONFLICT(test_id, first_name_norm, last_name_norm, email) DO UPDATE SET
      test_name = excluded.test_name,
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      correct = excluded.correct,
      total = excluded.total,
      percent = excluded.percent,
      passed = excluded.passed,
      answers = excluded.answers,
      correct_answers = excluded.correct_answers,
      client_timestamp = excluded.client_timestamp,
      attempt_started_at = excluded.attempt_started_at,
      completed_at = excluded.completed_at,
      duration_seconds = excluded.duration_seconds,
      source_url = excluded.source_url,
      user_agent = excluded.user_agent,
      evaluation_submitted_at = excluded.evaluation_submitted_at,
      training_relevance = excluded.training_relevance,
      conceptual_clarity = excluded.conceptual_clarity,
      practical_applicability = excluded.practical_applicability,
      governance_confidence = excluded.governance_confidence,
      codex_workflow_confidence = excluded.codex_workflow_confidence,
      materials_quality = excluded.materials_quality,
      pace_and_depth = excluded.pace_and_depth,
      overall_satisfaction = excluded.overall_satisfaction,
      recommend_training = excluded.recommend_training,
      most_valuable_takeaway = excluded.most_valuable_takeaway,
      improvement_suggestion = excluded.improvement_suggestion,
      suggested_ai_automation_use_cases = excluded.suggested_ai_automation_use_cases,
      raw_json = excluded.raw_json,
      submission_count = scores.submission_count + 1,
      updated_at = CURRENT_TIMESTAMP
  `;

  await env.DB.prepare(sql)
    .bind(
      row.test_id,
      row.first_name_norm,
      row.last_name_norm,
      row.email,
      row.test_name,
      row.first_name,
      row.last_name,
      row.correct,
      row.total,
      row.percent,
      row.passed,
      row.answers,
      row.correct_answers,
      row.client_timestamp,
      row.attempt_started_at,
      row.completed_at,
      row.duration_seconds,
      row.source_url,
      row.user_agent,
      row.evaluation_submitted_at,
      row.training_relevance,
      row.conceptual_clarity,
      row.practical_applicability,
      row.governance_confidence,
      row.codex_workflow_confidence,
      row.materials_quality,
      row.pace_and_depth,
      row.overall_satisfaction,
      row.recommend_training,
      row.most_valuable_takeaway,
      row.improvement_suggestion,
      row.suggested_ai_automation_use_cases,
      row.raw_json
    )
    .run();

  return jsonResponse(request, 200, { ok: true });
}

function adminAuthorized(request, env) {
  const headerToken = request.headers.get("X-Admin-Token") || "";
  const bearer = request.headers.get("Authorization") || "";
  const bearerToken = bearer.startsWith("Bearer ") ? bearer.slice(7) : "";
  return Boolean(env.ADMIN_TOKEN) && (headerToken === env.ADMIN_TOKEN || bearerToken === env.ADMIN_TOKEN);
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

async function exportScores(request, env) {
  if (!adminAuthorized(request, env)) {
    return jsonResponse(request, 401, { ok: false, error: "Unauthorized" });
  }

  const url = new URL(request.url);
  const format = url.searchParams.get("format") || "json";
  const testId = url.searchParams.get("test_id");

  let query = "SELECT * FROM scores";
  const binds = [];
  if (testId) {
    query += " WHERE test_id = ?";
    binds.push(testId);
  }
  query += " ORDER BY updated_at DESC";

  const result = await env.DB.prepare(query).bind(...binds).all();
  const rows = result.results || [];

  if (format === "csv") {
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [
      "test_id",
      "first_name",
      "last_name",
      "email",
      "correct",
      "total",
      "percent",
      "updated_at"
    ];
    const csv = [columns.join(","), ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(","))].join("\n");
    return textResponse(request, 200, csv, "text/csv; charset=utf-8");
  }

  return jsonResponse(request, 200, { ok: true, count: rows.length, rows });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    if (request.method === "GET" && url.pathname === "/health") {
      return jsonResponse(request, 200, { ok: true });
    }

    if (request.method === "POST" && url.pathname === "/submit") {
      return submitScore(request, env);
    }

    if (request.method === "GET" && url.pathname === "/admin/scores") {
      return exportScores(request, env);
    }

    return jsonResponse(request, 404, { ok: false });
  }
};
