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
├── server/                 Node.js + Express REST API
│   ├── config/             MongoDB connection
│   ├── controllers/        request handlers
│   ├── middleware/         authentication and error handling
│   ├── models/             Mongoose schemas: User, Prompt, Category
│   └── routes/             URL-to-controller mapping
├── docs/                   project documents and evidence
├── postman/                Postman collection for API tests
├── .gitignore
├── LICENSE
└── README.md
```

`client/`, `server/` and `docs/` each have their own README with more detail. Git does not track empty folders, so each empty folder holds a `.gitkeep` placeholder. Delete it once the folder has real files.

## Requirements

| Tool | Version | Purpose |
|---|---|---|
| Node.js | 20 LTS or newer (includes npm) | runs the server and the React dev server |
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

Add your own MongoDB connection string and JWT secret to `server/.env`. This file is never committed.

**React app: http://localhost:5173**

```bash
cd client
npm install
npm run dev
```

## Team

| Member | Role |
|---|---|
| Jude Anandaraj | Backend, Authentication & Integration |
| Amitabh Bhattacharjee | React Frontend & User Experience |
| Vadim Gubin | Prompt Database, CRUD API & Quality Assurance |

## Contributing

- `main` contains only working, reviewed code. Do not push to it directly.
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
