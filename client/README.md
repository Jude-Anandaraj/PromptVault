# client/

The PromptVault front end, built with React and Vite.

## Setup

The API in `server/` must be running first.

```bash
npm install
cp .env.example .env          # Windows PowerShell: Copy-Item .env.example .env
npm run dev                   # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | starts the development server and reloads on changes |
| `npm run build` | builds the production files into `dist/` |
| `npm run preview` | serves the `dist/` build locally |

## Environment variables

Settings are read from `client/.env`:

| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_BASE_URL` | address of the Express API, including `/api` | `http://localhost:3000/api` |

Restart `npm run dev` after changing `.env`. The server only accepts requests from the address in its `CLIENT_ORIGIN` setting (`http://localhost:5173`), so keep the client on that port.

## Structure

| Location | Contents |
|---|---|
| `src/main.jsx` | entry point |
| `src/App.jsx` | page routes; `/create` and `/prompts/:id/edit` require login |
| `src/pages/Home.jsx` | Explore page: search, category filters and prompt list |
| `src/pages/Auth.jsx` | login and register forms |
| `src/pages/PromptDetail.jsx` | one prompt, with copy, edit and delete |
| `src/pages/PromptForm.jsx` | create and edit form |
| `src/components/` | `Navbar`, `PromptCard` |
| `src/context/AuthContext.jsx` | the logged-in user, shared with every page |
| `src/services/api.js` | every call to the API |
| `src/styles.css` | styles |

## Login

- **Logging in or registering:** the server returns a token and the user. `AuthContext` saves the token in `localStorage`.
- **Sending the token:** `api.js` adds it to every request as `Authorization: Bearer <token>`.
- **After a page refresh:** `AuthContext` calls `GET /api/users/profile` to load the user again. If the token has expired, the server answers `401` and the token is removed.
- **Logging out:** the token is deleted.

## API calls

All calls are in `src/services/api.js`:

| Function | Request |
|---|---|
| `api.register(body)` | `POST /api/auth/register` |
| `api.login(body)` | `POST /api/auth/login` |
| `api.profile()` | `GET /api/users/profile` |
| `api.categories()` | `GET /api/categories` |
| `api.prompts(q, category)` | `GET /api/prompts?q=…&category=…` |
| `api.prompt(id)` | `GET /api/prompts/:id` |
| `api.createPrompt(body)` | `POST /api/prompts` |
| `api.updatePrompt(id, body)` | `PUT /api/prompts/:id` |
| `api.deletePrompt(id)` | `DELETE /api/prompts/:id` |

Errors from the server are shown to the user. For validation errors, each field's message from `details` is shown.
