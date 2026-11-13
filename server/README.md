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
| `middleware/validateAuth.js` | checks registration data before it reaches the controller |
| `models/User.js` | User schema: name, email, password hash, role, timestamps |
| `controllers/authController.js` | registration logic |
| `routes/authRoutes.js` | `/api/auth` routes |

To add a feature:
1. Create its route file in `routes/`.
2. Mount it in `app.js` above the `notFound` handler.

## Endpoints

| Method | URL | Response |
|---|---|---|
| GET | `/api/health` | `200 { "status": "ok", "database": "connected" }`, or `503` if the database is disconnected |
| POST | `/api/auth/register` | `201` with the new user (see below) |

### POST /api/auth/register

Request body:

```json
{ "name": "Test User", "email": "test@example.com", "password": "Password123" }
```

| Field | Rule |
|---|---|
| `name` | required, 2 to 50 characters |
| `email` | required, valid email address, must not already be registered; saved in lowercase |
| `password` | required, 8 to 72 characters; stored only as a bcrypt hash |

New accounts always get the `member` role. A `role` sent in the request is ignored.

`201 Created`:

```json
{
  "message": "Registration successful.",
  "user": {
    "name": "Test User",
    "email": "test@example.com",
    "role": "member",
    "createdAt": "2026-11-13T10:00:00.000Z",
    "updatedAt": "2026-11-13T10:00:00.000Z",
    "id": "6735a1f0c2b4e8a1d2f3a4b5"
  }
}
```

| Status | When | Body |
|---|---|---|
| `400` | a field is missing or invalid | `{ "error": "Validation failed.", "details": { "email": "Enter a valid email address." } }` |
| `409` | the email is already registered | `{ "error": "This email is already in use." }` |

## Errors

Errors always come back as JSON in the form `{ "error": "message" }`. Validation errors also include a `details` object with one message per field. Unknown routes return `404`. Server errors return `500` without exposing internal details.

## Environment variables

Settings are read from `server/.env`:

| Variable | Purpose | Default |
|---|---|---|
| `PORT` | port the API listens on | `3000` |
| `MONGODB_URI` | MongoDB connection string | required |
| `CLIENT_ORIGIN` | address of the React app, used for CORS | `http://localhost:5173` |

`.env.example` lists these variables without real credentials and is committed. `.env` holds the real values, stays on each developer's machine and is ignored by Git.
