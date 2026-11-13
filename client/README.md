# client/

The PromptVault front end, built with React and Vite.

## Creating the React app

Run Vite from inside this folder:

```bash
cd client
npm create vite@latest . -- --template react
npm install
npm run dev        # http://localhost:5173
```

Vite will say the folder is not empty. Choose **"Ignore files and continue"** so the `src/` folders below are kept.

## Structure

| Location | Contents | Example files |
|---|---|---|
| `src/pages/` | one component per screen | `Explore`, `Login`, `Register`, `PromptDetails`, `CreatePrompt`, `EditPrompt` |
| `src/components/` | reusable UI pieces | `Navbar`, `PromptCard`, `PromptForm` |
| `src/services/` | calls to the Express API | `api.js` |
| `src/context/` | shared login state | `AuthContext.jsx` |

## Environment variables

Put the API address in `client/.env`:

```
VITE_API_URL=http://localhost:3000
```

`client/.env.example` lists the same variable name and is committed. `.env` is ignored by Git.
