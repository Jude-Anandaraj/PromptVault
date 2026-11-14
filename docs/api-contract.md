# Prompt and category API

Vadim Gubin, 301538942. First release of the prompt database.

This matches the React client that is already in the repo. Category values on the wire are names, not ids. The database still stores a category id and an author id.

## Collections

Category: name (unique, 2-40), description (optional, up to 200).

Prompt: title (3-100), description (10-500), content (10-12000), platform (`General`, `Chat`, `Code`, or `Image`, default `General`), tags (up to 8, each up to 24 characters), userId, categoryId, createdAt, updatedAt.

The author id is taken from the login token. A client cannot assign a prompt to someone else.

## Responses

List: `{ "prompts": [ ... ] }`

One prompt: `{ "prompt": { ... } }`

Categories: `{ "categories": ["Coding", "Images", "Studying", "Writing"] }`

A prompt object:

```json
{
  "_id": "…",
  "title": "Explain a function",
  "description": "Asks for a short plain-language explanation of a function.",
  "content": "Explain what this function does, in a few sentences. Function: [paste it here]",
  "category": "Coding",
  "platform": "General",
  "tags": ["code", "explain"],
  "author": { "_id": "…", "name": "Alex" },
  "createdAt": "…",
  "updatedAt": "…"
}
```

Errors use `{ "error": "message" }`. Field problems also include `details`.

## Routes

| Method | Path | Who |
| --- | --- | --- |
| GET | /api/prompts?q=&category=&platform= | anyone |
| GET | /api/prompts/:id | anyone |
| GET | /api/categories | anyone |
| POST | /api/prompts | logged-in member |
| PUT | /api/prompts/:id | the author, or an admin |
| DELETE | /api/prompts/:id | the author, or an admin |

`category=All` or an empty category means no category filter. `q` searches title, description, and tags. A search with no hits returns an empty list, not an error.

Status codes: 201 created, 400 bad input or a bad id, 401 missing or bad token, 403 not the owner, 404 no such prompt.

## Sample prompts

These are ordinary examples for a demo. They are not private notes.

Coding: "Explain what this function does, in a few sentences."

Studying: "Turn these notes into five review questions."
