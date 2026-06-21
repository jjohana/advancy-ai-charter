# Private score collector

Use this Google Apps Script as the write-only collector for both public GitHub Pages quizzes.

Security model:
- The Google Sheet is private to the owner.
- Participants never receive the sheet URL and cannot download a CSV from the quiz.
- The public web app endpoint accepts submissions and upserts one row per `test_id + first_name + last_name + email`.
- For the AI Usage test, the same row also stores training-evaluation ratings and comments.
- The endpoint cannot expose the database contents because it implements only `doPost`.

Deployment steps:
1. Create or open the private score Google Sheet.
2. Open Extensions > Apps Script.
3. Paste `Code.gs`.
4. Replace `PASTE_PRIVATE_GOOGLE_SHEET_ID_HERE` with the private Sheet ID.
5. Deploy > New deployment > Web app.
6. Execute as: Me.
7. Who has access: Anyone.
8. Copy the Web app URL.
9. Put that URL in each quiz `window.quizConfig.scoreEndpoint`.

Do not put a secret API key in the static website. Static JavaScript is public.
