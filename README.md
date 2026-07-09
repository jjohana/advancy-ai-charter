# Advancy AI assessment

One canonical website now serves both learning paths:

- [Unified assessment](https://jjohana.github.io/advancy-ai-charter/)
- **Normal:** 25 AI Charter questions + 25 Normal AI usage questions
- **Advanced:** 25 AI Charter questions + 25 Advanced AI usage questions

The former `advancy-ai-usage` and `advancy-ai-usage-advanced` Pages sites are compatibility redirects to the canonical mode chooser.

## Architecture

The GitHub Pages site is a static client. It has no database credentials and cannot query D1 directly.

```text
Participant browser
  -> GitHub Pages static client
  -> authenticated Cloudflare Worker API
  -> private Cloudflare D1 database
```

A protected common registration link carries a 256-bit enrollment credential in its URL fragment. The client removes the fragment immediately, then exchanges the credential, the participant's Advancy identity, and a retry-safe idempotency key for a participant-specific invitation. Raw enrollment and invitation credentials are never stored in D1. The private invitation remains only in the browser-tab session and authorizes both combined modes. Individual administrator-issued invitations remain available as a recovery path.

The Worker resolves identity, enforces one-time registration, cohort windows and attempt limits, and computes all authoritative scores. Each combined result requires at least 18/25 in both the Charter and selected module. Because shared-link registration verifies possession of the link and an allowed email format rather than the mailbox itself, use Advancy SSO for consequential certification or employment decisions.

## Question sources

Reviewed source banks are stored in:

- `question-banks/charter.json`
- `question-banks/normal.json`
- `question-banks/advanced.json`

`scripts/build-unified-questions.mjs` deterministically generates the deployable `questions.js`. The combined Normal module deliberately repositions its correct choices so participants cannot copy the Charter answer-position sequence. The three source banks remain balanced at five correct answers in each A-E position.

## Data and privacy

D1 stores the authorized cohort, participant identity/work email, one-way invitation-token and enrollment-idempotency hashes, quiz assignments, answer indexes, server-calculated section and overall outcomes, attempt/receipt timestamps, privacy-notice acknowledgement, and optional structured training feedback.

It does not store raw enrollment or invitation tokens, raw idempotency keys, passwords, IP addresses, browser user agents, full page URLs, answer keys, uploaded files, or raw request bodies. Participant and attempt data is cascade-deleted after the approved cohort retention period, which is hard-capped at 365 days.

The participant-facing notice is `privacy.html`. Advancy DPO/HR must approve the final legal basis, purpose, recipients, and retention period before production import.

## Validation

```powershell
node scripts/build-unified-questions.mjs --check
node --check questions.js
node --check app.js
node scripts/validate-quiz.mjs

Set-Location backend/score-worker
npm ci
npm test
npx wrangler deploy --dry-run
```

The local synthetic load suite has passed at the configured ceiling with 300 participants, concurrency 50, both combined 50-question modes, 1,800 saved attempts, 1,800 idempotent replays, authoritative section results, and paginated export reconciliation.

## Release safety

Production rollout remains deliberate and manual:

1. obtain DPO/HR approval and decide whether the protected common link is sufficient or Advancy SSO is required;
2. use the EU-jurisdiction D1 database, retain an encrypted/checksummed legacy backup, and apply additive migrations before the Worker;
3. keep `ADMIN_TOKEN` and the shared `ENROLLMENT_TOKEN` distinct and outside source control;
4. deploy and test the Worker, canonical site, and both compatibility redirects;
5. pilot with synthetic identities, then a small authorized group before distributing the common link to approximately 300 people;
6. keep the unauthenticated legacy submission endpoint disabled and rotate the shared enrollment credential after the cohort closes.

The detailed sequence, monitoring, rollback, and deletion procedures are in `docs/runbooks/production-rollout.md`.
