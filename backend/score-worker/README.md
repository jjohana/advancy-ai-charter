# Advancy AI assessment API v2

Cloudflare Worker + D1 backend for the canonical Advancy assessment website. The site offers two selectable 50-question modes:

- `advancy-ai-assessment-normal`: Charter 25 + Usage Normal 25
- `advancy-ai-assessment-advanced`: Charter 25 + Usage Advanced 25

The three former 25-question quiz IDs remain accepted only for an explicitly assigned cutover cohort. This directory is deployment-ready but changes are **not deployed automatically**.

## Architecture and security boundary

The single canonical GitHub Pages site is a static client. D1 is bound only to the Worker and remains independent of front-end deployments. Browsers cannot query D1 directly.

1. The organizer shares the clean canonical URL. It opens rate-limited public cohort registration without putting a bearer credential in the page or URL.
2. `POST /v2/public-enroll` validates the allowed email domain and exchanges the registration once per cohort/email for a participant-specific 256-bit `inv_...` token. The Worker uses its private `ENROLLMENT_TOKEN` only as an HMAC key; raw tokens are not logged or stored in D1, and only the participant token's SHA-256 hash is persisted.
3. By default, the participant token authorizes both combined modes; the participant chooses Normal or Advanced on the canonical landing page.
4. The participant token remains only in `sessionStorage`. Roster import and individual invitation links remain available as an administrator-controlled recovery path.
5. The Worker derives identity from the token, validates the cohort and invitation window, computes the score from its versioned answer key, and inserts an append-only attempt.
6. Admin reads require `ADMIN_TOKEN`; admin endpoints reject browser `Origin` requests.

The answer-key version is `2026-07-09`. A submission is accepted only for a known `(test_id, quiz_version)` pair, preserving auditability after future question changes. New imports receive only the two combined IDs unless `quiz_ids` is supplied explicitly; the accepted legacy IDs are `advancy-ai-charter`, `advancy-ai-usage`, and `advancy-ai-usage-advanced`. To avoid duplicating the Charter answer pattern, the combined Normal module key is a one-position left rotation of the legacy Normal key; the legacy 25-question key itself is unchanged.

## Persisted data

`cohorts`: id, name, active/validity window, DPO-approved retention period.

`participants`: cohort, first and last name, normalized email, invitation-token hash, active/expiry/revocation timestamps. Raw invitation tokens are returned only when created or rotated and cannot be recovered later.

`participant_quizzes`: opaque session id, quiz authorization, optional attempt-limit override.

`attempts`: opaque receipt, quiz id/version, idempotency key, attempt number, selected-answer indexes, server-computed score/pass, client start/end/duration, privacy-notice version/acknowledgement, optional structured training evaluation, and server submission timestamp.

The v2 schema deliberately does **not** store raw enrollment/invitation tokens, raw request JSON, answer keys, source URLs, user agents, IP addresses, cookies, or passwords. The legacy `scores` table is retained unchanged for read-only migration/export. Only the explicitly enabled transitional legacy writer can still write it.

## Public v2 contract

All browser calls require an exact allowed `Origin`. Session and submission calls require `Authorization: Bearer inv_...`; public cohort registration intentionally does not carry a browser-side bearer.

### Register from the common URL

Common-link registration is enabled only when both `SELF_ENROLLMENT_ENABLED=true` and `PUBLIC_SELF_ENROLLMENT_ENABLED=true`:

```http
POST /v2/public-enroll
Idempotency-Key: <random UUID persisted until enrollment succeeds>
Content-Type: application/json

{
  "first_name": "Alice",
  "last_name": "Example",
  "email": "alice@advancy.com",
  "quiz_id": "advancy-ai-assessment-normal",
  "privacy_notice_version": "2026-07-09",
  "privacy_acknowledged": true
}
```

The payload is exact: unknown fields, non-Advancy domains, stale privacy consent, and the three legacy quiz IDs are rejected. Both combined modes are assigned regardless of the selected `quiz_id`. Success returns exactly:

```json
{
  "ok": true,
  "participant_id": "00000000-0000-4000-8000-000000000000",
  "invite_token": "inv_<43 base64url characters>",
  "participant": { "display_name": "Alice Example" },
  "expires_at": "2026-10-08T12:00:00.000Z",
  "request_id": "00000000-0000-4000-8000-000000000000"
}
```

Enrollment is one-time per cohort/email. The client must reuse the exact UUID and normalized payload after an ambiguous failure: the Worker derives the same `inv_...` token with HMAC-SHA256 and returns the same participant, token, and expiry without storing either raw credential. Reusing a key with changed enrollment data returns `409 IDEMPOTENCY_KEY_REUSED`; a different key for an enrolled email returns `409 ENROLLMENT_USED`. An inactive or revoked participant returns `403 PARTICIPANT_REVOKED` and cannot self-reactivate. Recovery requires an administrator to issue a new individual invitation. Public registration validates an allowed email format but does not prove mailbox ownership; use email verification or Advancy SSO if the result will have certification or employment consequences. The protected `POST /v2/enroll` bearer flow remains available as a recovery path.

### Resolve a quiz session

```http
GET /v2/session?test_id=advancy-ai-assessment-normal&quiz_version=2026-07-09
Authorization: Bearer <invitation-token>
```

The response contains `session_id`, display name, quiz metadata, effective expiry, `status`, attempt counts, and the latest receipt/score if one exists. It contains no email or token.

### Submit an attempt

```http
POST /v2/submit
Authorization: Bearer <invitation-token>
Idempotency-Key: <random UUID retained with local progress>
Content-Type: application/json

{
  "session_id": "...",
  "test_id": "advancy-ai-assessment-normal",
  "quiz_version": "2026-07-09",
  "answers": [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ],
  "attempt_started_at": "2026-07-09T09:00:00.000Z",
  "completed_at": "2026-07-09T09:15:00.000Z",
  "duration_seconds": 900,
  "privacy_notice_version": "2026-07-09",
  "privacy_acknowledged": true,
  "evaluation": null
}
```

For either combined mode, `answers` must contain exactly 50 indexes from 0 through 4. The three cutover IDs still require 25. Combined results pass only when the participant scores at least 18/25 (70%) in both the Charter section and the selected module; a 70% aggregate is not sufficient if either section fails. Authoritative submit and recovered-receipt responses add this ordered breakdown while legacy score objects remain unchanged:

```json
{
  "score": {
    "correct": 40,
    "total": 50,
    "percent": 80,
    "passed": true,
    "sections": [
      { "id": "charter", "name": "AI Charter", "correct": 20, "total": 25, "percent": 80, "passed": true },
      { "id": "normal", "name": "Normal module", "correct": 20, "total": 25, "percent": 80, "passed": true }
    ]
  }
}
```

The Advanced mode uses `{ "id": "advanced", "name": "Advanced module" }` for the second section. Evaluation is optional; supplied fields are range/length checked. A first insert returns `201`. Replaying the same idempotency key returns `200`, the same receipt/score, and `idempotent_replay: true`. A new key beyond the configured attempt limit returns `409`.

Errors use `{ok:false,error:{code,message,request_id,details?}}`. Every response has `X-Request-ID` and `Cache-Control: no-store`.

## Administration

Set a random admin secret (prefer at least 32 bytes):

```powershell
npx wrangler secret put ADMIN_TOKEN
npx wrangler secret put ENROLLMENT_TOKEN
```

`ENROLLMENT_TOKEN` must be a separately generated 256-bit value formatted as `enr_` plus 43 base64url characters. Never reuse `ADMIN_TOKEN`, place either token in source control, or put the enrollment token in a query string.

Keep the same value in the ignored `.admin-token` file for local scripts.

Import a CSV with `FirstName,LastName,Email` headers:

```powershell
.\admin-import-participants.ps1 `
  -CsvPath .\participants.csv `
  -CohortId ai-training-2026-09 `
  -CohortName "AI training September 2026" `
  -ExpectedCount 300 `
  -CanonicalSiteUrl https://jjohana.github.io/advancy-ai-charter/ `
  -ExpiresAt 2026-10-31T23:59:59Z
```

The script sends batches of 50 and creates a sensitive, one-time CSV containing one `AssessmentInvite` link per person. The token remains in the URL fragment and the participant selects Normal or Advanced after opening the canonical site. Do not place this file in shared storage; delete it after individual distribution. Re-importing keeps existing tokens by default. Use `-RotateExistingTokens` only when old links must be invalidated.

Other operations:

```powershell
.\admin-count.ps1
.\admin-export.ps1 -Format csv -CohortId ai-training-2026-09
.\admin-participant.ps1 -Action revoke -ParticipantId <uuid>
.\admin-participant.ps1 -Action delete -ParticipantId <uuid>
```

Exports are keyset-paginated (500 maximum per page). The script follows all cursors. CSV values beginning with spreadsheet formula characters are neutralized server-side. `/admin/legacy-scores` returns a restricted read-only view of at most 500 legacy rows and omits `raw_json`, answer keys, URLs, and user agents.

## Persistence and retention

D1 persists independently of GitHub Pages and Worker code deployments. Writes are parameterized. Attempts are append-only and protected by unique session/idempotency and session/attempt-number constraints.

The daily cron purges participant PII after `cohort.expires_at + cohort.retention_days`; foreign-key cascade removes sessions, attempts, and evaluation text. Logs contain only aggregate purge counts. The API and schema enforce a hard maximum of 365 days after cohort close. `RETENTION_DAYS=365` is only a proposed default: the DPO/HR owner must approve the actual, potentially shorter period before import. Admins can revoke immediately or explicitly delete a participant earlier.

Use D1 Time Travel and test a restore before launch. Time Travel is not a substitute for a documented export/restore procedure. The health endpoint queries the v2 schema and returns `503` if D1 or the migration is unavailable.

## Configuration

Committed production defaults are in `wrangler.toml`:

- exact origin: `https://jjohana.github.io`
- EU-jurisdiction D1 binding: `advancy-ai-results-eu`
- allowed import domain: `advancy.com` (empty in local tests means unrestricted)
- invitation lifetime: 90 days, capped by cohort expiry
- maximum attempts: 3 unless a participant override is imported
- default retention: 365 days, copied into each cohort
- legacy unauthenticated submissions: disabled
- public cohort registration: explicitly enabled, one-time per cohort/email, using the configured cohort id/name/expiry and the server-side enrollment secret
- Worker logs/metrics: enabled, with structured request completion records and no payload/identity fields
- per-source public API rate limit: 600 requests/minute (high enough for a shared office pilot while bounding simple abuse)
- enrollment limit: 5 attempts/minute for each source/email pair

An email-domain restriction is an import guard, **not authentication**. The invitation bearer token is the participant credential. For stronger identity assurance, put the sites/API behind Advancy SSO in a later phase.

## Migration and safe cutover

Never point a command at `--remote` until a local rehearsal and backup are complete.

```powershell
npm ci
npm test
npm run db:legacy-schema:local
npm run db:migrate:local
npx wrangler deploy --dry-run
```

With a local Worker running and the same local admin value in `LOCAL_ADMIN_TOKEN`, a synthetic contract/load check can exercise up to 300 invitations, 50 concurrent clients, both combined modes (600 first attempts or 1,800 attempts at the configured three-attempt ceiling), idempotent replays, and paginated reconciliation. It rejects non-loopback API URLs. Add `--include-legacy` only when explicitly testing all five accepted IDs:

```powershell
$env:LOCAL_ADMIN_TOKEN = "local-test-admin-token-at-least-32-characters"
npm run smoke:local -- --participants 300 --concurrency 50 --attempts-per-quiz 1
```

`npm run smoke:shared-link` exercises the common-link exchange with ten synthetic participants: both modes crossed with all five constant answer positions. It checks enrollment recovery, authoritative section scores, and submission replay, then deletes every synthetic participant in `finally`. It reads `API_BASE`, `ENROLLMENT_TOKEN`, and `ADMIN_TOKEN` from the environment, never prints them or synthetic identity, and requires `SMOKE_CONFIRM=DELETE_SYNTHETIC_PARTICIPANTS` for a non-loopback API.

Production sequence:

1. Export/backup D1 and record a Time Travel restore bookmark.
2. Run `npm run db:migrate:remote`. Migration `0001` does not alter or drop `scores`.
3. Set and verify the distinct `ADMIN_TOKEN` and `ENROLLMENT_TOKEN` secrets; verify the self-enrollment cohort expiry is still in the future.
4. Deploy the Worker with `/v2/*`; do not enable the legacy flag unless an explicitly timed cutover window requires it.
5. Deploy the canonical client pointing to `/v2/public-enroll`, `/v2/session`, and `/v2/submit`; retain `/v2/enroll` for protected recovery links and run synthetic smoke tests.
6. Pilot the common link with a small synthetic group, verify both selectable combined modes and admin reconciliation, then share it with the approximately 300-person cohort.
7. Confirm `LEGACY_SUBMISSIONS_ENABLED=false`. If it was temporarily enabled, disable it immediately after client cutover and schedule deletion of the legacy handler.

`LEGACY_SUBMISSIONS_ENABLED=true` restores an unauthenticated compatibility writer at `/submit`. It is intentionally off, is not suitable for participant use, and should exist only for a short, monitored deployment transition.

## Capacity and cost posture

For roughly 300 participants choosing one combined mode, the expected first-attempt volume is 300 submissions and the configured three-attempt ceiling is 900. If everyone completes both assigned modes, those figures are 600 and 1,800. Each attempt stores 50 selected-answer indexes, but storage and request volume remain tiny for Workers/D1. The operational risks are public-registration abuse, identity denial through pre-registration, quota abuse, and recovery; database capacity is not the concern. Monitor Worker errors, D1 latency/write failures, `400/409/429` trends, and daily health; configure Cloudflare account budget alerts before sharing broadly.
