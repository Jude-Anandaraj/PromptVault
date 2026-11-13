# server/

The PromptVault REST API, built with Node.js and Express. Data is stored in MongoDB through Mongoose.

The API follows the MVC pattern:
- **Models** define the data.
- **Controllers** hold the logic.
- **Routes** expose the endpoints.

The React app in `client/` is the view.

## Setup

```bash
npm install
cp .env.example .env          # Windows PowerShell: Copy-Item .env.example .env
npm run dev
```

| Script | What it does |
|---|---|
| `npm run dev` | starts the API and restarts it whenever a file changes |
| `npm start` | starts the API without restarting on changes |

## Request flow

```
route  →  middleware  →  controller  →  model  →  MongoDB
```

## Structure

| Location | Contents |
|---|---|
| `server.js` | entry point: loads `.env`, connects to MongoDB, then starts the server |
| `app.js` | Express app: CORS, JSON parsing, routes and error handling |
| `config/env.js` | loads variables from `.env` |
| `config/database.js` | MongoDB connection |
| `middleware/errorHandler.js` | 404 handler and central error handler |
| `models/` | Mongoose schemas, e.g. `User.js`, `Prompt.js`, `Category.js` |
| `controllers/` | request handlers, e.g. `authController.js`, `promptController.js` |
| `routes/` | URL-to-controller mapping, e.g. `authRoutes.js`, `promptRoutes.js` |

To add a feature:
1. Create its route file in `routes/`.
2. Mount it in `app.js` above the `notFound` handler.

## Endpoints

| Method | URL | Response |
|---|---|---|
| GET | `/api/health` | `200 { "status": "ok", "database": "connected" }`, or `503` if the database is disconnected |

Errors always come back as JSON in the form `{ "error": "message" }`. Unknown routes return `404`. Server errors return `500` without exposing internal details.

## Environment variables

Settings are read from `server/.env`:

| Variable | Purpose | Default |
|---|---|---|
| `PORT` | port the API listens on | `3000` |
| `MONGODB_URI` | MongoDB connection string | required |
| `CLIENT_ORIGIN` | address of the React app, used for CORS | `http://localhost:5173` |

`.env.example` lists these variables without real credentials and is committed. `.env` holds the real values, stays on each developer's machine and is ignored by Git.
