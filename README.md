# PromptVault

PromptVault is a website for sharing AI prompts. People can publish, find, rate and organise prompts for tools like ChatGPT, Claude and Gemini. It is built with the MERN stack (MongoDB, Express, React, Node.js) for COMP229 – Web Application Development.

## Getting the code

```bash
git clone https://github.com/Jude-Anandaraj/PromptVault.git
cd PromptVault
```

## Folder layout

```
PromptVault/
├── client/                 React front end (Vite)
│   └── src/
│       ├── components/     reusable UI: Navbar, PromptCard, PromptForm
│       ├── context/        shared login state
│       ├── pages/          one file per screen: Explore, Login, Register, …
│       └── services/       calls to the Express API
├── server/                 Node.js + Express REST API (MVC)
│   ├── config/             MongoDB connection
│   ├── controllers/        request handlers
│   ├── middleware/         authentication and error handling
│   ├── models/             Mongoose schemas: User, Prompt, Category
│   ├── routes/             URL-to-controller mapping
│   ├── functions/          Netlify Function that runs the API online
│   ├── scripts/            database seed script
│   └── utils/              shared helpers, e.g. login tokens
├── docs/                   project documents and evidence
├── postman/                Postman collection for API tests
├── netlify.toml            Netlify build and redirect settings
├── .gitignore
├── LICENSE
└── README.md
```

`client/`, `server/` and `docs/` each have their own README with more detail. Git does not track empty folders, so each empty folder holds a `.gitkeep` placeholder. Delete it once the folder has real files.

## Requirements

| Tool | Version | Purpose |
|---|---|---|
| Node.js | 22 LTS or newer (includes npm) | runs the server and the React dev server |
| Git | any recent version | version control |
| MongoDB | local Community Server or a MongoDB Atlas cluster | database |
| Postman | any version | API testing |

## Running the project

Run the server and the client in two separate terminals.

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

To also add 3 demo accounts and 12 sample prompts, set `DEMO_PASSWORD` in `server/.env` and run `npm run seed:demo` instead. The server README has the details.

Open http://localhost:3000/api/health to check that the API is running. It should return:

```json
{ "status": "ok", "database": "connected" }
```

**React app: http://localhost:5173**

```bash
cd client
npm install
cp .env.example .env          # Windows PowerShell: Copy-Item .env.example .env
npm run dev
```

Open http://localhost:5173 in a browser.

## Deployment (Netlify)

The site is deployed on Netlify from the `main` branch. Every push to `main` redeploys it. `netlify.toml` holds the settings:
- **React app:** built into `client/dist` and served as static files.
- **API:** the Express app runs as a Netlify Function (`server/functions/api.js`). Requests to `/api/*` are sent to it, so the app and the API share one address.

Environment variables in the Netlify site settings (scope must include **Functions**):

| Variable | Value |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | random string of at least 32 characters, different from any local one |
| `JWT_EXPIRES_IN` | `2h` |

Changes to these only apply after the next deploy (**Deploys → Trigger deploy**). MongoDB Atlas must allow connections from anywhere (`0.0.0.0/0`), because Netlify Functions have no fixed IP address. Run `npm run seed` once against the Atlas database so the categories exist.

Check a deploy at `/api/health`. If the API fails, the errors are under **Logs → Functions → api** in Netlify.

## Team

| Member | Role |
|---|---|
| Jude Anandaraj | Backend, Authentication & Integration |
| Amitabh Bhattacharjee | React Frontend & User Experience |
| Vadim Gubin | Prompt Database, CRUD API & Quality Assurance |

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
