# Advancy AI assessment — QA and readiness report

Date: 10 July 2026

## Outcome

The implementation is technically ready for controlled production sharing with approximately 300 trainees. The Worker is deployed, the EU-jurisdiction D1 database is migrated, the six legacy results are preserved, and the static release is validated for the canonical site and both compatibility redirects.

One clean common registration URL opens the canonical website with two choices:

- **Normal:** 25 AI Charter questions + 25 Normal AI usage questions
- **Advanced:** 25 AI Charter questions + 25 Advanced AI usage questions

The former Normal and Advanced URLs are compatibility redirects to the canonical mode chooser.

## Architecture

```text
GitHub Pages (static HTML/CSS/JavaScript)
        |
        | HTTPS + exact allowed Origin + public registration or private invitation bearer
        v
Cloudflare Worker API v2
        |
        | private D1 binding; parameterized statements
        v
Cloudflare D1 (persistent participant, assignment, attempt and receipt data)
```

The database is independent of the frontend. Updating or rolling back GitHub Pages does not delete or replace D1. Browsers never receive D1 credentials and cannot query D1 directly.

The clean common URL opens public cohort registration once per cohort/email. The Worker keeps the enrollment secret server-side, derives a participant-specific invitation after registration, validates cohort/quiz authorization, applies the attempt limit, computes scores from versioned answer keys, and creates append-only receipts. Private invitation or protected recovery fragments are scrubbed immediately. Combined assessments pass only when both 25-question sections score at least 18/25.

## Questionnaire coherence

All 75 source questions were reviewed.

- Every bank contains exactly 25 questions with five distinct options.
- Every question has one explanation aligned to one correct option.
- Every source bank has a balanced A-E answer distribution of 5/5/5/5/5.
- Charter wording was corrected from “under 10 pages” to “no more than 10 pages”.
- Five repetitive Advanced questions were replaced with applied governance scenarios.
- The Advanced correct-answer length cue was removed: uniquely longest correct choices fell from 23/25 to 0/25 by word count.
- The legacy Charter and Normal answer-position sequences were identical. In the combined Normal path, the module options are repositioned to a different balanced key at all 25 positions. The legacy key remains unchanged for cutover compatibility.
- A client/server contract test proves both 50-answer browser keys exactly match the Worker definitions.

This is a guided learning assessment: explanations reveal answers after each question and the static question bank is downloadable. It is not a proctored or consequential certification system.

## Data saved in D1

- Cohort identifier/name, active window and approved retention days.
- Participant first name, last name and normalized work email.
- SHA-256 hashes of the participant invitation, enrollment idempotency key, and normalized enrollment fingerprint; plaintext credentials are not persisted.
- Authorized quiz/session identifiers and attempt limit.
- The 50 selected answer indexes for each attempt.
- Versioned quiz id, idempotency key/fingerprint, attempt number and opaque receipt.
- Server-calculated Charter, module and overall result, plus pass/fail.
- Client start/completion/duration and server submission timestamp.
- Privacy-notice version and acknowledgement.
- Optional structured training ratings/comments.
- Minimal non-PII admin audit events.

## Data deliberately not saved in the assessment database

- Plaintext enrollment or invitation tokens and raw idempotency keys.
- Passwords or authentication cookies.
- IP addresses or browser user-agent strings.
- Full/referring page URLs.
- Client-supplied scores or correct-answer keys.
- Uploaded files or client documents.
- Raw request bodies or arbitrary raw JSON.

GitHub and Cloudflare may keep their own limited security/operational logs under their service terms. The participant notice discloses the processors and local/session browser storage.

## Persistence and deletion

D1 persists independently of the frontend and Worker code. Attempts are append-only and protected by unique receipt, session/attempt and idempotency constraints.

A daily retention job deletes participant records after cohort close plus the approved retention period; cascading foreign keys delete their sessions, attempts and feedback. The API, import tool and schema hard-cap this period at 365 days. D1 point-in-time recovery can retain deleted data for the applicable recovery window.

Production uses `advancy-ai-results-eu`, created with `--jurisdiction=eu`. The full legacy database was exported and checksummed before migration, all six legacy scores were copied, and additive migrations `0001` and `0002` were applied. Cloudflare states that jurisdiction is fixed at creation and controls where D1 runs and stores data; it does not by itself restrict where Workers execute.

## Robustness and security controls

- Distinct 256-bit enrollment and invitation credentials, with only participant invitation hashes stored.
- Fragment-based access links, immediately scrubbed from the visible URL.
- One-time self-registration per cohort/email with deterministic, hash-only idempotent recovery after a lost response.
- Strict token, origin, method, content-type, field and size validation.
- Server-side versioned scoring and section-safe pass rule.
- Exact-payload idempotent retry, including same-tab reload recovery.
- 12-second request timeouts and bounded retry/backoff for network, 429 and 5xx failures.
- Per-source API rate limiting.
- Append-only attempts and configurable maximum attempts.
- DB-aware health endpoint.
- Admin-only batch import, paginated/formula-safe export, revoke and delete operations.
- Privacy-minimized structured logs.
- Manual Pages deployment workflows, validation gates and rollback runbook.
- Accessibility improvements: semantic radio groups, announced/focused corrections, visible focus, keyboard-safe state and WCAG-AA action-button contrast.
- Legacy submission endpoint disabled by default.

GitHub Pages cannot provide a project-defined `frame-ancestors` response header. The client fails closed when framed, but an Advancy-controlled host supporting security headers is preferable if header-level clickjacking protection is mandatory.

## Verification evidence

Passed:

- Both generated 50-question modes and all 75 source questions.
- Exact client/server answer-key parity.
- Fifteen backend unit/contract tests, including public-registration configuration and canonical millisecond timestamps for browser-validated receipts.
- Fresh legacy schema plus both additive v2 migrations.
- Clean `npm ci`, zero known dependency vulnerabilities and Wrangler 4.110.0 production dry-run.
- PowerShell syntax validation for all admin tools.
- Production security checks: healthy DB-aware endpoint, bad origin 403, protected enrollment without a token 401, public-registration gating, and legacy submission endpoint 410.
- In-app browser QA: clean-link public registration, private-fragment scrubbing and mode handoff, accessible registration, Normal and Advanced session resolution, progress/recovery, section results, another-attempt flow, accessibility focus and compatibility redirect.
- Full production browser attempt: 50 Normal questions, server persistence, section-safe 10/50 result, canonical receipt timestamp, and secure receipt recovery.
- Exhaustive choice QA: all 500 displayed question/option combinations, 500 choose/submit/correction flows, 2,500 option states, 2,500 feedback states, and all 1,352 section-score combinations.
- Production shared-link smoke: ten synthetic participants covering both modes and all five constant answer positions, enrollment replay, submission replay, authoritative scores, and complete participant/attempt cleanup.
- Section-safe failure: 15/25 Charter + 20/25 module = 35/50 (70%) but correctly fails.
- Ceiling load: 300 participants, concurrency 50, both modes, three attempts each, 1,800 stored attempts, 1,800 exact idempotent replays, unique receipts and fully reconciled paginated export.

## Cost posture

At this size, request and storage usage are far below current free Workers/D1 allowances. GitHub Pages also has ample soft bandwidth for 300 participants.

The expected infrastructure cost can therefore be USD 0 on free tiers. For production, the Workers Paid plan is recommended at the current USD 5 monthly account minimum because D1 Time Travel is 30 days on Paid versus 7 days on Free. Set a budget alert and verify pricing again at launch.

Official references:

- [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [Cloudflare D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/)
- [Cloudflare D1 Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/)
- [Cloudflare D1 data location](https://developers.cloudflare.com/d1/configuration/data-location/)
- [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)

## Organizational controls

1. Advancy DPO/HR should approve the processing purpose, legal basis, recipients, retention and participant notice before real trainee data is collected.
2. Public cohort registration validates an allowed email format, not mailbox ownership. Use Advancy SSO for consequential certification or employment use.
3. Move GitHub/Cloudflare ownership to Advancy-controlled accounts if still personal; require 2FA, protected branches and reviewed deployment environments.
4. Pilot with a small authorized group, monitor `400/409/429/5xx` rates, and disable public registration after the cohort closes.
