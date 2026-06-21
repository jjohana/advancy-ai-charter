# Advancy AI score API

This Cloudflare Worker receives assessment submissions from both GitHub Pages questionnaires and stores them in a private Cloudflare D1 database.

Deployed API:
`https://advancy-ai-score-api.advancy-ai-training.workers.dev`

Admin token local file:
`.admin-token`

## Properties

- Public write endpoint: `POST /submit`
- Private read endpoint: `GET /admin/scores`, protected by `ADMIN_TOKEN`
- Upsert key: `test_id + first_name + last_name + email`
- Accepted tests: `advancy-ai-charter`, `advancy-ai-usage`, `advancy-ai-usage-advanced`
- No public database export or CSV endpoint without the admin token
- Transactional D1 writes, so concurrent consultant submissions do not race on a shared file

## Deploy

1. Authenticate Cloudflare:
   `npx wrangler login`
2. Create the database:
   `npx wrangler d1 create advancy-ai-results`
3. Copy the returned `database_id` into `wrangler.toml`.
4. Apply the schema:
   `npx wrangler d1 execute advancy-ai-results --remote --file=./schema.sql`
5. Set a long private admin token:
   `npx wrangler secret put ADMIN_TOKEN`
6. Deploy:
   `npx wrangler deploy`
7. Put the returned Worker URL plus `/submit` into `scoreEndpoint` in both `questions.js` files.

## Read results

JSON:
`curl -H "X-Admin-Token: <token>" https://advancy-ai-score-api.advancy-ai-training.workers.dev/admin/scores`

CSV:
`curl -H "X-Admin-Token: <token>" "https://advancy-ai-score-api.advancy-ai-training.workers.dev/admin/scores?format=csv"`

PowerShell export from this folder:
`.\admin-export.ps1 -Format csv`

Response counts:
`.\admin-count.ps1`
