# PromptVault

PromptVault is a website for sharing AI prompts. People can publish, find and organise prompts for tools like ChatGPT, Claude and Gemini. This is the first release for COMP229 – Web Application Development (Project Part 1): the MongoDB database and the Express/Node.js backend, with CRUD, authentication and authorization APIs tested in Postman.

**In this release:** a MongoDB database with `users`, `prompts` and `categories` collections; an Express REST API in MVC structure; full CRUD for users, prompts and categories; JWT authentication with owner and admin authorization; and a Postman collection that tests every endpoint (33 requests, 45 checks).

**Not in this release:** the React web interface and online deployment. They are planned for later releases.

## Getting the code

```bash
git clone https://github.com/Jude-Anandaraj/PromptVault.git
cd PromptVault
```

## Folder layout

```
PromptVault/
├── server/                 Node.js + Express REST API (MVC)
│   ├── config/             MongoDB connection
│   ├── controllers/        request handlers
│   ├── middleware/         authentication, authorization and validation
│   ├── models/             Mongoose schemas: User, Prompt, Category
│   ├── routes/             URL-to-controller mapping
│   ├── scripts/            database seed and make-admin scripts
│   └── utils/              shared helpers, e.g. login tokens
├── docs/                   API contract
├── postman/                Postman collection for API tests
├── .gitignore
├── LICENSE
└── README.md
```

`server/`, `docs/` and `postman/` each have their own README with more detail.

## Requirements

| Tool | Version | Purpose |
|---|---|---|
| Node.js | 22 LTS or newer (includes npm) | runs the server |
| Git | any recent version | version control |
| MongoDB | local Community Server or a MongoDB Atlas cluster | database |
| Postman | any version | API testing |

## Running the project

**API: http://localhost:3000**

```bash
cd server
npm install
cp .env.example .env          # Windows PowerShell: Copy-Item .env.example .env
npm run dev
```

In `server/.env`, set:
- `MONGODB_URI` to your MongoDB connection string
- `JWT_SECRET` to a random string of at least 32 characters. `.env.example` shows a command that generates one.

This file is never committed.

The first time you use a database, add the starting categories:

```bash
npm run seed
```

To also add 4 demo accounts (3 members and 1 admin) and 12 sample prompts, set `DEMO_PASSWORD` in `server/.env` and run `npm run seed:demo` instead. The server README has the details.

Open http://localhost:3000/api/health to check that the API is running. It should return:

```json
{ "status": "ok", "database": "connected" }
```

## Testing the API

`postman/PromptVault.postman_collection.json` tests every endpoint: 33 requests with 45 checks. Run `npm run seed:demo` first, import the collection into Postman, set its `adminPassword` variable to your `DEMO_PASSWORD`, then click **Run collection**. `postman/README.md` has the details, including how to run it from a terminal.

## Who can do what

| | Visitor | Member | Admin |
|---|---|---|---|
| Browse, search and read prompts | ✅ | ✅ | ✅ |
| Create prompts; edit and delete their own | | ✅ | ✅ |
| View, edit or delete their own account | | ✅ | ✅ |
| Edit and delete **any** prompt | | | ✅ |
| Add, rename and delete categories | | | ✅ |

Everyone who signs up is a member. To make an account an admin, run `npm run make-admin -- someone@example.com` in `server/`.

## Team

| Member | Role |
|---|---|
| Jude Anandaraj | Backend, Authentication & Integration |
| Amitabh Bhattacharjee | Frontend & User Experience |
| Vadim Gubin | Database, CRUD API & Quality Assurance |

## Contributing

- `main` contains only working, reviewed code. Do not push to it directly.
- Every team member commits their own work from their own GitHub account.
- Do your work on a feature branch: `feature/auth`, `feature/frontend` or `feature/prompts`. Before you start, update your branch from `main`:
  ```bash
  git checkout main
  git pull
  git checkout feature/<area>
  git merge main
  ```
- Start every commit message with its Jira key so the commit shows on the ticket, for example `SCRUM-12 Configure Express server`.
- Open a pull request into `main` and get approval from at least one teammate. Merge only if the app still starts.
- Run `git status` before committing. `.env` files, `node_modules/`, passwords and tokens must never be committed.
