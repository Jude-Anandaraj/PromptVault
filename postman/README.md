# postman/

`PromptVault.postman_collection.json` tests every API endpoint: 33 requests with 45 checks.

## Running it

1. Start the API (`cd server && npm run dev`) and make sure the database has been seeded with `npm run seed:demo`. The collection needs at least one category and an admin account.
2. In Postman, choose **Import**, then select `PromptVault.postman_collection.json`.
3. Open the collection's **Variables** tab:
   - `adminPassword`: the `DEMO_PASSWORD` from `server/.env`. This logs in as `admin.demo@example.com`.
   - `baseUrl`: leave as `http://localhost:3000/api`.
4. Click **Run collection**, then **Run PromptVault API**.

Each run registers two new test members, uses them, and deletes them again at the end, so it can be run as often as needed.

## Running it from a terminal

Newman, Postman's command-line runner, runs the same collection. With the API running, from the `PromptVault/` folder:

```bash
npx newman run postman/PromptVault.postman_collection.json --env-var adminPassword=<your DEMO_PASSWORD>
```

A full run ends with a summary table; every request and assertion should show 0 failed.

## What it covers

| Folder | Requests |
|---|---|
| Health check | API and database are running |
| 1. Accounts | register, duplicate email (409), invalid data (400), wrong password (401), login, profile with and without a token, update name, email change without the current password (403) |
| 2. Prompts | categories, create without a token (401), create, invalid data (400), search, get one, update, another member editing or deleting it (403), delete, deleted prompt (404) |
| 3. Admin | admin login, member blocked from admin routes (403), list categories with counts, deleting a category in use (409), add, rename and delete a category |
| 4. Clean up | delete without a password (400), delete both test accounts, old token refused (401) |

Tokens and ids are saved automatically between requests, so nothing has to be copied by hand.
