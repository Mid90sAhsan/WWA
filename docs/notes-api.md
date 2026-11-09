# Notes API

Queue notes for workwithahsan.com from a bot or script. Each note you send is committed to `content/notes/<slug>.mdx` in the GitHub repo. The scheduled Deploy workflow publishes it on its date. It runs Monday, Wednesday and Friday at 13:00 UTC, so a note dated on another day goes live at the next run after its date.

Base URL: `https://workwithahsan.com/api/notes`

## Authentication

Every request needs:

```
Authorization: Bearer <NOTES_API_TOKEN>
```

A wrong or missing token gets `401`.

## Endpoints

| Method | Path | What it does |
|---|---|---|
| `GET` | `/api/notes` | List all notes, newest first, with `status` (`published` or `queued`) |
| `GET` | `/api/notes/:slug` | Read one note, including its Markdown `content` |
| `POST` | `/api/notes` | Create a note. `409` if the slug exists |
| `PUT` | `/api/notes/:slug` | Replace a **queued** note (send the full note; `slug` comes from the URL) |
| `DELETE` | `/api/notes/:slug` | Delete a **queued** note |

Published notes (dated today or earlier) can be read but not changed or deleted through the API. That returns `403`.

## Note fields

| Field | Required | Rules |
|---|---|---|
| `slug` | yes | URL name: lowercase letters, numbers, single hyphens, up to 80 characters. Becomes `/notes/<slug>/` |
| `title` | yes | The page's H1, up to 120 characters |
| `seoTitle` | no | Shorter title for search results, up to 60 characters. Use it when `title` is over about 45 characters |
| `cardTitle` | no | Title on note cards and social shares, up to 80 characters. Defaults to `title` |
| `description` | yes | Meta description, up to 300 characters (aim for 140–160) |
| `cardDescription` | no | One line for note cards and social shares, up to 200 characters |
| `kicker` | no | Small line above the H1. Defaults to "A note for local business owners" |
| `byline` | no | Line under the H1. Defaults to "Ahsan" |
| `date` | yes | `YYYY-MM-DD`, today (UTC) or later. Best on a Monday, Wednesday or Friday |
| `content` | yes | Markdown body, 200 to 60,000 characters |

All text fields except `content` must be a single line.

### Content rules

Notes are compiled as MDX, where a stray brace or tag breaks the build for every note. So `content` must be plain Markdown:

- Use `##` and `###` for sections. Don't use `#`; the title is the page's only H1.
- Use Markdown links: `[text](https://example.com)` or `[text](/notes/maps/)`. No HTML tags and no `<...>` autolinks.
- No `{` or `}` characters.
- No `import` or `export` lines, and no `---` lines.
- Bold, italics, lists, numbered lists and `>` blockquotes are all fine.

Don't link to another queued note until it has been published, or the link will 404 until then.

## Examples

Create a note:

```bash
curl -X POST https://workwithahsan.com/api/notes \
  -H "Authorization: Bearer $NOTES_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "add-manager-google-business-profile",
    "title": "How to add a manager to your Google Business Profile",
    "seoTitle": "Add a Manager to Your Google Business Profile",
    "cardTitle": "Why your Google profile needs two owners",
    "description": "How to add a manager or second owner to your Google Business Profile, and why every local business should have one.",
    "cardDescription": "A two-minute fix that keeps you from getting locked out.",
    "date": "2026-11-18",
    "content": "Every Google Business Profile should have two people who can manage it...\n\n## How to add a manager\n\n1. Sign in..."
  }'
```

Response (`201`):

```json
{
  "ok": true,
  "note": {
    "slug": "add-manager-google-business-profile",
    "title": "How to add a manager to your Google Business Profile",
    "date": "2026-11-18",
    "status": "queued",
    "publishesOn": "2026-11-18",
    "url": "https://workwithahsan.com/notes/add-manager-google-business-profile/"
  }
}
```

List notes, for example to avoid repeating a topic or to find the next free date:

```bash
curl https://workwithahsan.com/api/notes -H "Authorization: Bearer $NOTES_API_TOKEN"
```

## Errors

Errors look like `{"ok": false, "error": "<code>", "message": "<what to fix>"}`.

| Status | `error` | Meaning |
|---|---|---|
| 400 | `invalid_json` / `invalid` | Body isn't a JSON object |
| 401 | `unauthorized` | Missing or wrong token |
| 403 | `published` | Tried to change or delete a published note |
| 404 | `not_found` | No note with that slug |
| 405 | `method_not_allowed` | Wrong method for that path |
| 409 | `exists` | Slug already taken. Pick another, or `PUT` to replace a queued note |
| 413 | `too_large` | Body over 100 KB |
| 422 | `invalid` | One or more fields broke the rules. `message` lists every problem |
| 502 | `github` | Couldn't reach GitHub. Retry later |
| 503 | `unconfigured` | The API's secrets aren't set |

## Setup (site owner)

1. **GitHub token.** Go to GitHub → Settings → Developer settings → Fine-grained tokens. Create a token for the `Mid90sAhsan/WWA` repo only, with **Contents: Read and write**.
2. **Bot token.** Make a long random string for the bot, for example with `openssl rand -hex 32`.
3. **Store both on the worker:**

   ```bash
   npx wrangler secret put GITHUB_TOKEN
   npx wrangler secret put NOTES_API_TOKEN
   ```

4. **Deploy** with `npm run deploy`, then give the bot the `NOTES_API_TOKEN` and this file.

Notes committed by the API land on `main` on GitHub. Run `git pull` before you work locally.

For local testing, `GITHUB_API` can point the worker at a stub instead of `https://api.github.com`.
