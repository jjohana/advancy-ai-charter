# Plan: Advancy AI Charter Questionnaire

## Jira Ticket
N/A - user did not provide a Jira ticket.

## Goal
Create a focused static questionnaire website for assessing knowledge of the Advancy AI usage charter.

## Scope
IN: static questionnaire page, 25 A-E questions, one correct answer per question, option-by-option charter justifications, question-by-question submission, 70% passing score, Advancy logo and website-derived visual styling, GitHub Pages deployment.
OUT: authenticated app integration and backend persistence.

## Steps
- [x] Add the static questionnaire page under `webapp/public/advancy-charter/`.
- [x] Add a root `index.html` for GitHub Pages deployment.
- [x] Encode 25 hard single-answer questions and deterministic scoring.
- [x] Apply Advancy logo and website-derived color palette.
- [x] Replace the question bank with charter-grounded questions and 125 option-level correction justifications.
- [x] Convert the flow to one submitted question at a time.
- [x] Validate page assets and syntax.
- [x] Deploy to GitHub Pages.

## Validation
Run JavaScript syntax checks, validate the question data shape, serve the static assets locally, and inspect git diff.

## Deployment
https://jjohana.github.io/advancy-ai-charter/
