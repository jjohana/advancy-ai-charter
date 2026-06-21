const SHEET_ID = "PASTE_PRIVATE_GOOGLE_SHEET_ID_HERE";
const SHEET_NAME = "Scores";

const HEADERS = [
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
  "correct_answers",
  "evaluation_submitted_at",
  "training_relevance",
  "conceptual_clarity",
  "practical_applicability",
  "governance_confidence",
  "codex_workflow_confidence",
  "materials_quality",
  "pace_and_depth",
  "overall_satisfaction",
  "recommend_training",
  "most_valuable_takeaway",
  "improvement_suggestion",
  "suggested_ai_automation_use_cases",
  "received_at"
];

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");
    validatePayload_(payload);
    upsertScore_(payload);
    return json_({ ok: true });
  } catch (error) {
    return json_({ ok: false, error: String(error && error.message ? error.message : error) });
  }
}

function validatePayload_(payload) {
  const required = [
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
  required.forEach((key) => {
    if (payload[key] === undefined || payload[key] === null || String(payload[key]).trim() === "") {
      throw new Error("Missing field: " + key);
    }
  });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email).trim())) {
    throw new Error("Invalid email");
  }

  if (Number(payload.total) !== 25 || Number(payload.correct) < 0 || Number(payload.correct) > 25) {
    throw new Error("Invalid score");
  }

  if (["advancy-ai-charter", "advancy-ai-usage"].indexOf(String(payload.test_id)) === -1) {
    throw new Error("Invalid test_id");
  }
}

function upsertScore_(payload) {
  const sheet = getSheet_();
  const rows = sheet.getDataRange().getValues();
  const key = scoreKey_(payload);
  let targetRow = -1;

  for (let i = 1; i < rows.length; i += 1) {
    const rowPayload = {
      test_id: rows[i][1],
      first_name: rows[i][3],
      last_name: rows[i][4],
      email: rows[i][5]
    };
    if (scoreKey_(rowPayload) === key) {
      targetRow = i + 1;
      break;
    }
  }

  const values = [
    payload.timestamp,
    payload.test_id,
    payload.test_name,
    payload.first_name,
    payload.last_name,
    String(payload.email).trim().toLowerCase(),
    Number(payload.correct),
    Number(payload.total),
    Number(payload.percent),
    payload.passed,
    payload.answers,
    payload.correct_answers,
    payload.evaluation_submitted_at || "",
    payload.training_relevance || "",
    payload.conceptual_clarity || "",
    payload.practical_applicability || "",
    payload.governance_confidence || "",
    payload.codex_workflow_confidence || "",
    payload.materials_quality || "",
    payload.pace_and_depth || "",
    payload.overall_satisfaction || "",
    payload.recommend_training || "",
    payload.most_valuable_takeaway || "",
    payload.improvement_suggestion || "",
    payload.suggested_ai_automation_use_cases || payload.future_support_request || "",
    new Date().toISOString()
  ];

  if (targetRow > 0) {
    sheet.getRange(targetRow, 1, 1, values.length).setValues([values]);
  } else {
    sheet.appendRow(values);
  }
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const hasHeaders = HEADERS.every((header, index) => firstRow[index] === header);
  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function scoreKey_(payload) {
  return [
    String(payload.test_id || "").trim().toLowerCase(),
    String(payload.first_name || "").trim().toLowerCase(),
    String(payload.last_name || "").trim().toLowerCase(),
    String(payload.email || "").trim().toLowerCase()
  ].join("|");
}

function json_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
