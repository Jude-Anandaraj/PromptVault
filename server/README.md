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

Before the first start, fill in `MONGODB_URI` and `JWT_SECRET` in `.env` (see [Environment variables](#environment-variables)). The server will not start without a valid `JWT_SECRET`.

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
| `server.js` | entry point: loads `.env`, checks the token settings, connects to MongoDB, then starts the server |
| `app.js` | Express app: CORS, JSON parsing, routes and error handling |
| `config/env.js` | loads variables from `.env` |
| `config/database.js` | MongoDB connection |
| `middleware/authMiddleware.js` | `protect`: lets a request through only with a valid login token, and sets `req.user` |
| `middleware/validateAuth.js` | checks registration and login data before it reaches the controller |
| `middleware/errorHandler.js` | 404 handler and central error handler |
| `models/User.js` | User schema: name, email, password hash, role, timestamps |
| `controllers/authController.js` | registration and login |
| `controllers/userController.js` | the logged-in user's profile |
| `routes/authRoutes.js` | `/api/auth` routes |
| `routes/userRoutes.js` | `/api/users` routes |
| `utils/token.js` | creates and checks JWT login tokens |

To add a feature:
1. Create its route file in `routes/`.
2. Mount it in `app.js` above the `notFound` handler.

## Endpoints

| Method | URL | Login required | Response |
|---|---|---|---|
| GET | `/api/health` | no | `200 { "status": "ok", "database": "connected" }`, or `503` if the database is disconnected |
| POST | `/api/auth/register` | no | `201` with a login token and the new user |
| POST | `/api/auth/login` | no | `200` with a login token and the user |
| GET | `/api/users/profile` | **yes** | `200` with the logged-in user |

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

`201 Created` (the token logs the new user in straight away, the same as a login token):

```json
{
  "message": "Registration successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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

### POST /api/auth/login

Request body:

```json
{ "email": "test@example.com", "password": "Password123" }
```

The email is not case-sensitive.

`200 OK`:

```json
{
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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
| `400` | email or password is missing | `{ "error": "Validation failed.", "details": { "password": "Password is required." } }` |
| `401` | wrong email or wrong password | `{ "error": "Invalid email or password." }` |

### GET /api/users/profile

Requires the header `Authorization: Bearer <token>`.

`200 OK`:

```json
{
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

Returns `401` if the token is missing or invalid (see below).

## Authentication

Logging in returns a JWT (JSON Web Token). The client stores it and sends it with every request that needs a logged-in user:

```
Authorization: Bearer <token>
```

- **Contents:** the token holds the user's id and its issue and expiry times, never the email or password.
- **Expiry:** tokens expire after `JWT_EXPIRES_IN`, 2 hours by default. The user then logs in again.
- **Logging out:** there is no logout endpoint. The client deletes its stored token.

### Protecting a route

Add `protect` before the controller:

```js
import { protect } from '../middleware/authMiddleware.js';

router.post('/', protect, createPrompt);
```

Requests without a valid token are stopped with `401` and never reach the controller. Inside the controller, `req.user` is the logged-in user.

To check who owns something, such as a prompt's author, use `req.user._id`. Never trust a user id sent in the request body.

### When `protect` returns 401

| Situation | `error` |
|---|---|
| no `Authorization` header, or not in the form `Bearer <token>` | `You must be logged in. Send the token as "Authorization: Bearer <token>".` |
| the token has expired | `Your session has expired. Please log in again.` |
| the token is invalid or has been changed | `Invalid token. Please log in again.` |
| the account was deleted after the token was issued | `This account no longer exists.` |

## Errors

Errors always come back as JSON in the form `{ "error": "message" }`. Validation errors also include a `details` object with one message per field. Unknown routes return `404`. Server errors return `500` without exposing internal details.

## Environment variables

Settings are read from `server/.env`:

| Variable | Purpose | Default |
|---|---|---|
| `PORT` | port the API listens on | `3000` |
| `MONGODB_URI` | MongoDB connection string | required |
| `CLIENT_ORIGIN` | address of the React app, used for CORS | `http://localhost:5173` |
| `JWT_SECRET` | secret used to sign login tokens; at least 32 random characters | required |
| `JWT_EXPIRES_IN` | how long a login token stays valid, with a unit: `30m`, `2h`, `1d` | `2h` |

Generate a `JWT_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Each developer uses their own secret in their own `.env`. Anyone who knows the secret can create valid tokens, so never commit it or share it.

`.env.example` lists these variables without real credentials and is committed. `.env` holds the real values, stays on each developer's machine and is ignored by Git.
