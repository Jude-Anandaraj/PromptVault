# server/

The PromptVault REST API, built with Node.js and Express. Data is stored in MongoDB through Mongoose.

## Request flow

```
route  →  middleware  →  controller  →  model  →  MongoDB
```

## Structure

| Location | Contents | Example files |
|---|---|---|
| `server.js` | entry point: starts Express and connects to MongoDB | `server.js` |
| `config/` | configuration and the database connection | `database.js` |
| `models/` | Mongoose schemas | `User.js`, `Prompt.js`, `Category.js` |
| `controllers/` | request handlers | `authController.js`, `promptController.js`, `categoryController.js` |
| `routes/` | URL-to-controller mapping | `authRoutes.js`, `promptRoutes.js`, `categoryRoutes.js` |
| `middleware/` | code that runs before controllers | `authMiddleware.js` |

## Environment variables

Settings are read from `server/.env`:

| Variable | Purpose |
|---|---|
| `PORT` | port the API listens on (default `3000`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | secret used to sign login tokens |
| `CLIENT_ORIGIN` | address of the React app, used for CORS (`http://localhost:5173`) |

`.env.example` lists these variable names without real values and is committed. `.env` holds the real values, stays on each developer's machine and is ignored by Git.
