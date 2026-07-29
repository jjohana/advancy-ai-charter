# Advancy AI assessment — review and QA report

Date: 29 July 2026

## Outcome

The questionnaire has been simplified to one participant journey:

1. secure registration;
2. one mixed 20-question QCM;
3. one concise feedback form;
4. authoritative score and receipt.

The Normal/Advanced choice and the two 50-question paths have been removed from the participant-facing website.

## Questionnaire design

- Exactly 20 questions.
- Exactly five choices and one correct answer per question.
- AI Charter, governance, evidence, tool use and controlled automation are interleaved rather than presented as separate sections.
- Correct-answer positions are balanced across A-E at 4/4/4/4/4.
- Every choice has a specific correction explaining why it is right or wrong.
- The pass threshold is 14/20 (70%).

Two questions apply the approved `Advancy ChatGPT Enterprise Practical Usage & Credit Guide`:

- Start document review and most Word/Excel work in Chat with Sol Thinking; move to Work only for a named file-processing or layout failure.
- Use Work with Luna High for template-compliant PowerPoint production with render-and-correct iteration; use Codex with Terra for reusable skill and repository engineering, escalating only against a named failure.

## Feedback

The previous multi-field training evaluation has been reduced to:

- one optional 1-5 overall rating;
- one optional comments or suggestions field;
- one `Submit assessment` action.

The participant may leave both feedback fields blank. The form repeats the warning not to enter client, confidential, personal or market-sensitive information.

## Technical and browser QA

Passed:

- deterministic generation and synchronization of `questions.js`;
- JavaScript syntax checks for the questionnaire and application;
- questionnaire-content, accessibility and privacy contracts;
- exact client/server answer-key parity for quiz version `2026-07-29`;
- 15 backend scoring, enrollment, privacy and idempotency tests;
- Cloudflare Worker production dry-run;
- local browser registration with a synthetic `@advancy.com` identity;
- all 20 answer/correction/next-question transitions;
- the final feedback form with one rating, one comment and one submit button;
- authoritative 20/20 result, receipt creation and attempt-count update;
- no browser console errors and no horizontal page overflow at the tested desktop viewport.

The synthetic participant and attempt created during QA were deleted from the local test database after verification.

## Release note

The static website and Worker must be deployed together because the current 20-question answer key uses quiz version `2026-07-29`. The prior Normal/Advanced and 25-question definitions remain available at version `2026-07-09` for explicitly assigned cutover cohorts.

This review did not deploy or publish the changes.
