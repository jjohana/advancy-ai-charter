# Advancy AI assessment

The project serves the original English assessment and a separate French assessment:

- [Advancy AI Knowledge Assessment](https://jjohana.github.io/advancy-ai-charter/)
- [Évaluation IA générative — ADMIN](https://jjohana.github.io/advancy-ai-charter/fr/)
- 20 mixed multiple-choice questions in each version
- one correct answer per question
- the French version is invite-only, follows the September 2026 Generative AI overview, and covers ADMIN work: communication, email, translation, Excel, support, finance, HR, and calendar management
- one short optional feedback and AI use-case form after the QCM

The former `advancy-ai-usage` and `advancy-ai-usage-advanced` Pages sites remain compatibility redirects to the canonical questionnaire.

## Architecture

The GitHub Pages site is a static client. It has no database credentials and cannot query D1 directly.

```text
Participant browser
  -> GitHub Pages static client
  -> rate-limited Cloudflare Worker API
  -> private Cloudflare D1 database
```

A clean common URL opens rate-limited public cohort registration for the English assessment. The French ADMIN assessment does not expose public enrollment: it requires an individual invitation or a protected enrollment link assigned to the ADMIN campaign. The Worker validates the participant's Advancy identity and a retry-safe idempotency key, then uses its server-side enrollment secret to derive a participant-specific invitation. Raw enrollment and invitation credentials are never stored in D1. The private invitation remains only in the browser-tab session and authorizes its assigned questionnaire.

The Worker resolves identity, enforces one-time registration, cohort windows and attempt limits, and computes the authoritative score. The unified result passes at 14/20 (70%). Public cohort registration validates an allowed email format rather than mailbox ownership, so use Advancy SSO for consequential certification or employment decisions.

## Question sources

Reviewed source banks are stored in:

- `question-banks/charter.json`
- `question-banks/normal.json`
- `question-banks/advanced.json`

`scripts/build-unified-questions.mjs` selects and interleaves the 20 deployable questions, adds the two current Chat/Work/Codex routing questions, balances the A-E answer positions, and deterministically generates `questions.js`.

The reviewed French ADMIN question set is stored in `fr/questions.js`. `scripts/validate-french-quiz.mjs` checks its structure, the eight requested ADMIN domains, invite-only access, source coverage, scenario mix, balanced A-E answer positions, option-by-option feedback, and client/server answer-key alignment. The review record is in `docs/assessment-fr-qa-report.md`.

## Data and privacy

D1 stores the authorized cohort, participant identity/work email, one-way invitation-token and enrollment-idempotency hashes, quiz assignments, answer indexes, server-calculated outcome, attempt/receipt timestamps, privacy-notice acknowledgement, and optional structured training feedback.

It does not store raw enrollment or invitation tokens, raw idempotency keys, passwords, IP addresses, browser user agents, full page URLs, answer keys, uploaded files, or raw request bodies. Participant and attempt data is cascade-deleted after the approved cohort retention period, which is hard-capped at 365 days.

The participant-facing notice is `privacy.html`. Advancy DPO/HR must approve the final legal basis, purpose, recipients, and retention period before production import.

## Validation

```powershell
node scripts/build-unified-questions.mjs --check
node --check questions.js
node --check app.js
node scripts/validate-quiz.mjs
node scripts/validate-french-quiz.mjs

Set-Location backend/score-worker
npm ci
npm test
npx wrangler deploy --dry-run
```

The local synthetic load suite is configured for up to 300 participants, concurrency 50, the single 20-question assessment, three attempts per participant, idempotent replays, authoritative scoring, and paginated export reconciliation.

## Release safety

Production rollout remains deliberate and manual:

1. obtain DPO/HR approval and decide whether public cohort registration is sufficient or Advancy SSO is required;
2. use the EU-jurisdiction D1 database, retain an encrypted/checksummed legacy backup, and apply additive migrations before the Worker;
3. keep `ADMIN_TOKEN` and the server-side `ENROLLMENT_TOKEN` distinct and outside source control;
4. deploy and test the Worker, canonical questionnaire, and both compatibility redirects;
5. pilot with synthetic identities, then a small authorized group before distributing the common link to approximately 300 people;
6. keep the unauthenticated legacy submission endpoint disabled and rotate the server-side enrollment secret after the cohort closes.

The detailed sequence, monitoring, rollback, and deletion procedures are in `docs/runbooks/production-rollout.md`.
