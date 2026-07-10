# Production rollout runbook

This runbook covers the canonical Advancy AI assessment site and its shared Cloudflare Worker/D1 service for a cohort of approximately 300 participants. One clean common URL opens public cohort registration and a landing page where each trainee chooses one of two 50-question modes: Charter + Usage Normal or Charter + Usage Advanced.

## 1. Approval gate

Before any real participant is imported:

- Confirm that the question content may remain publicly downloadable. Invitation authentication protects submissions and identity, not the static question bank. Use private hosting/SSO if the content itself must be internal.
- Have Advancy HR/DPO approve the controller wording, processing purpose, legal basis, recipients, the cohort retention period (hard maximum: 365 days after cohort close), and the participant notice in `privacy.html`.
- Name at least two production operators. Require 2FA on the GitHub and Cloudflare accounts and move ownership to an Advancy-controlled organization if it is currently personal.
- Decide whether public cohort registration plus participant-specific invitations are sufficient. The registration form validates an allowed email format but does not verify mailbox ownership; use Advancy SSO for consequential certification or employment use.
- GitHub Pages cannot supply a project-defined `frame-ancestors` response header. If clickjacking protection is a launch requirement, serve the static artifact from an Advancy-controlled host that supports security response headers.

## 2. Create EU-restricted D1

The current database runs in Western Europe but has no jurisdiction guarantee. Jurisdiction cannot be added after creation.

```powershell
Set-Location backend/score-worker
npx wrangler@4.110.0 d1 create advancy-ai-results-eu --jurisdiction=eu
```

Create separate staging and production databases. Replace the D1 binding id only after local and staging verification. A location hint such as `weur` is not a residency control.

Before legacy migration, export the current database, encrypt the export, record its SHA-256 checksum and expiry, and capture a Time Travel bookmark. The additive v2 migration does not alter the legacy `scores` table.

## 3. Validate the release

```powershell
node scripts/build-unified-questions.mjs --check
node --check app.js
node scripts/validate-quiz.mjs
node scripts/validate-full-contract.mjs

Set-Location backend/score-worker
npm ci
npm test
npm run db:legacy-schema:local
npm run db:migrate:local
npx wrangler deploy --dry-run
```

Validate the assembled 50-question Normal and Advanced banks in the canonical deployment artifact. Confirm the combined Normal module options implement the backend's one-position left rotation of the legacy Normal key at all 25 positions while the legacy ID remains unchanged. Confirm the canonical artifact's `app.js`, `styles.css`, `privacy.html`, and `robots.txt` hashes match the reviewed release manifest.

## 4. Backward-compatible cutover

1. Apply migration `0001_hardened_assessments.sql` to staging.
2. Deploy the Worker with `/v2/enroll`, `/v2/session`, and `/v2/submit` only after both additive migrations are applied.
3. Keep `LEGACY_SUBMISSIONS_ENABLED=false` unless a short, explicitly timed transition is unavoidable.
4. Deploy the canonical site as a canary through the manual Pages workflow.
5. Verify that the clean base URL opens registration in a fresh browser, registration is one-time per email, an ambiguous enrollment response replays the same participant invitation, and on-site Normal/Advanced selection works. Also verify that optional protected recovery fragments are scrubbed and survive the landing-to-mode handoff.
6. Complete all 50 questions in each mode and verify optional feedback, server score, receipt, submission idempotency, admin count/export and participant deletion. Both combined IDs must advertise quiz/privacy version `2026-07-09`. Verify `score.sections` uses the confirmed Charter + Normal/Advanced order, and that 15/25 Charter plus 20/25 module fails despite a 70% aggregate.
7. Deploy and test the two former questionnaire sites as compatibility redirects to the canonical mode chooser, including clean public registration and strict private-invitation fragment transfer.
8. Confirm the three 25-question IDs remain accepted only for participants explicitly assigned during cutover, and confirm the unauthenticated legacy endpoint returns `410`.

If a temporary legacy window is used, enable it only after recording the owner and stop time. Disable it immediately after the last cached old client is no longer in use.

## 5. Pilot and cohort access

Generate a distinct 256-bit `ENROLLMENT_TOKEN` and store it only as a Worker secret. Enable `PUBLIC_SELF_ENROLLMENT_ENABLED` only for the approved cohort window, then distribute the clean canonical URL. The Worker uses the secret to derive participant invitations; it is never placed in the website or participant link. Disable public registration and rotate the secret after the cohort closes.

Pilot with 5-10 authorized users across both combined modes. Reconcile registrations, invitations, attempts and receipts before distributing the link to the full cohort. Shared-link registration is limited to the configured email domain and is one-time for each cohort/email.

Individual roster import remains the recovery path when a participant loses the browser-tab invitation or when a shared link is not appropriate. Use a UTF-8 CSV with exactly these headers:

Use a UTF-8 CSV with exactly these headers:

```csv
FirstName,LastName,Email
Alice,Example,alice@example.invalid
```

Run the import script with an expected row count and cohort window. It sends batches of 50. The generated CSV contains one canonical `AssessmentInvite` per person; the participant chooses Normal or Advanced on that landing page. The file contains credentials and personal data: keep it in approved encrypted storage, distribute recovery links individually, and delete the working file after delivery.

```powershell
.\admin-import-participants.ps1 `
  -CsvPath .\participants.csv `
  -ExpectedCount 300 `
  -CohortId ai-training-2026-09 `
  -CohortName "AI training September 2026" `
  -CanonicalSiteUrl https://jjohana.github.io/advancy-ai-charter/ `
  -ExpiresAt 2026-10-31T23:59:59Z
```

Do not publish participant-specific invitation links in a shared channel. Revoke and rotate an invitation if it is forwarded or exposed. Only the separately scoped common enrollment link is intended for cohort-wide distribution.

## 6. Live monitoring

Freeze deployments during the main training window. Monitor:

- Worker 5xx exceptions and D1 errors;
- `401`, `409` and `429` trends;
- request latency and rate-limit events;
- imported, assigned, completed and failed counts by cohort;
- the DB-aware `/health` check.

At this scale, capacity is not the constraint: 300 people choosing one 50-question mode is approximately 300 primary submissions and 900 at the three-attempt ceiling. If everyone completes both modes, those figures are 600 and 1,800. Credential distribution and reconciliation are the main operational risks.

The Free Workers/D1 limits are technically ample for this cohort. For production, the Workers Paid plan (currently a USD 5 monthly account minimum) is recommended for the longer 30-day D1 Time Travel recovery window instead of 7 days on Free. Set an account budget alert and verify current pricing before launch.

## 7. Rollback

- Frontend: redeploy the previous reviewed Git SHA through the Pages workflow.
- Worker: roll back only to a version compatible with the active schema. Worker rollback does not roll back D1.
- Before real v2 writes, database rollback can switch to the untouched legacy binding.
- After real v2 writes begin, prefer fixing forward. Any database switch must reconcile post-cutover attempts first.
- Never drop or rename v2 tables during the first production release.

## 8. End of cohort

- Export only the minimum approved report and protect it as personal data.
- Delete temporary roster and invite files.
- Process correction/deletion requests through the DPO workflow.
- The daily Worker job deletes participant PII and cascading attempts after cohort expiry plus the approved retention period.
- Document that deleted rows may remain in D1 Time Travel until the applicable recovery window expires.
