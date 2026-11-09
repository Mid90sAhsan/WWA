// Notes API: lets an outside writer (e.g. a bot) queue notes without touching
// the repo directly. Each note is committed to content/notes/<slug>.mdx on
// GitHub; the scheduled Deploy workflow publishes it on its date.
//
//   GET    /api/notes          list notes (published and queued)
//   GET    /api/notes/:slug    read one note
//   POST   /api/notes          create a note (409 if the slug exists)
//   PUT    /api/notes/:slug    replace a queued note
//   DELETE /api/notes/:slug    delete a queued note
//
// Published notes (date today or earlier) can be read but not changed or
// deleted through the API. See docs/notes-api.md.

export interface NotesEnv {
  NOTES_API_TOKEN?: string;
  GITHUB_TOKEN?: string;
  GITHUB_REPO?: string;
  GITHUB_BRANCH?: string;
  // Override for local testing against a stub; defaults to GitHub.
  GITHUB_API?: string;
}

const NOTES_DIR = "content/notes";
const MAX_BODY_BYTES = 100_000;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

type NoteInput = {
  slug: string;
  title: string;
  seoTitle?: string;
  cardTitle?: string;
  description: string;
  cardDescription?: string;
  kicker?: string;
  byline?: string;
  date: string;
  content: string;
};

// [field, required, max length]
const FIELDS: [keyof NoteInput, boolean, number][] = [
  ["title", true, 120],
  ["seoTitle", false, 60],
  ["cardTitle", false, 80],
  ["description", true, 300],
  ["cardDescription", false, 200],
  ["kicker", false, 100],
  ["byline", false, 100],
];

class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

export async function handleNotesApi(
  request: Request,
  env: NotesEnv,
  pathname: string,
): Promise<Response> {
  try {
    if (!env.NOTES_API_TOKEN || !env.GITHUB_TOKEN || !env.GITHUB_REPO) {
      throw new ApiError(503, "unconfigured", "The notes API is not configured.");
    }
    await authorize(request, env.NOTES_API_TOKEN);

    const github = new GitHub(
      env.GITHUB_API || "https://api.github.com",
      env.GITHUB_TOKEN,
      env.GITHUB_REPO,
      env.GITHUB_BRANCH || "main",
    );
    const slug = pathname.replace(/^\/api\/notes\/?/, "").replace(/\/$/, "");

    if (!slug) {
      if (request.method === "GET") return json(200, { ok: true, notes: await listNotes(github) });
      if (request.method === "POST") return await createNote(request, github);
      return methodNotAllowed("GET, POST");
    }

    if (!SLUG.test(slug)) throw new ApiError(404, "not_found", "No note with that slug.");
    if (request.method === "GET") return json(200, { ok: true, note: await readNote(github, slug) });
    if (request.method === "PUT") return await updateNote(request, github, slug);
    if (request.method === "DELETE") return await deleteNote(github, slug);
    return methodNotAllowed("GET, PUT, DELETE");
  } catch (error) {
    if (error instanceof ApiError) {
      return json(error.status, { ok: false, error: error.code, message: error.message });
    }
    console.error("Notes API failed", error);
    return json(500, { ok: false, error: "server", message: "Something went wrong." });
  }
}

// --- Handlers ---------------------------------------------------------------

async function listNotes(github: GitHub) {
  const files = await github.list(NOTES_DIR);
  const notes = await Promise.all(
    files
      .filter((file) => file.name.endsWith(".mdx"))
      .map(async (file) => {
        const slug = file.name.replace(/\.mdx$/, "");
        const { frontmatter } = parseMdx((await github.read(file.path))!.text);
        return summary(slug, frontmatter);
      }),
  );
  return notes.sort((a, b) => (a.date < b.date ? 1 : -1));
}

async function readNote(github: GitHub, slug: string) {
  const file = await github.read(notePath(slug));
  if (!file) throw new ApiError(404, "not_found", "No note with that slug.");
  const { frontmatter, content } = parseMdx(file.text);
  return { ...summary(slug, frontmatter), ...frontmatter, content };
}

async function createNote(request: Request, github: GitHub) {
  const note = validate(await readJson(request));
  if (await github.read(notePath(note.slug))) {
    throw new ApiError(409, "exists", `A note with slug "${note.slug}" already exists.`);
  }
  await github.write(notePath(note.slug), toMdx(note), `Queue note: ${note.title}`);
  return json(201, { ok: true, note: summary(note.slug, note) });
}

async function updateNote(request: Request, github: GitHub, slug: string) {
  const body = await readJson(request);
  const note = validate({ ...(body as object), slug });
  const existing = await github.read(notePath(slug));
  if (!existing) throw new ApiError(404, "not_found", "No note with that slug.");
  assertQueued(parseMdx(existing.text).frontmatter.date);
  await github.write(notePath(slug), toMdx(note), `Update queued note: ${note.title}`, existing.sha);
  return json(200, { ok: true, note: summary(slug, note) });
}

async function deleteNote(github: GitHub, slug: string) {
  const existing = await github.read(notePath(slug));
  if (!existing) throw new ApiError(404, "not_found", "No note with that slug.");
  assertQueued(parseMdx(existing.text).frontmatter.date);
  await github.remove(notePath(slug), `Remove queued note: ${slug}`, existing.sha);
  return json(200, { ok: true });
}

// --- Validation -------------------------------------------------------------

function validate(body: unknown): NoteInput {
  if (!body || typeof body !== "object") {
    throw new ApiError(400, "invalid", "Send a JSON object.");
  }
  const input = body as Record<string, unknown>;
  const problems: string[] = [];
  const note: Record<string, string> = {};

  const slug = input.slug;
  if (typeof slug !== "string" || !SLUG.test(slug) || slug.length > 80) {
    problems.push("slug: lowercase letters, numbers and single hyphens, up to 80 characters");
  } else {
    note.slug = slug;
  }

  for (const [field, required, max] of FIELDS) {
    const value = input[field];
    if (value === undefined || value === null || value === "") {
      if (required) problems.push(`${field}: required`);
      continue;
    }
    if (typeof value !== "string" || value.trim().length > max || /[\r\n]/.test(value)) {
      problems.push(`${field}: single-line text, up to ${max} characters`);
      continue;
    }
    note[field] = value.trim();
  }

  const date = input.date;
  if (typeof date !== "string" || !DAY.test(date) || Number.isNaN(Date.parse(date))) {
    problems.push("date: YYYY-MM-DD");
  } else if (date < today()) {
    problems.push(`date: must be today (${today()}) or later`);
  } else {
    note.date = date;
  }

  const content = input.content;
  if (typeof content !== "string" || content.trim().length < 200 || content.length > 60_000) {
    problems.push("content: Markdown body, 200 to 60,000 characters");
  } else {
    problems.push(...checkMarkdown(content));
    note.content = content.trim();
  }

  if (problems.length) {
    throw new ApiError(422, "invalid", `Fix these fields: ${problems.join("; ")}`);
  }
  return note as NoteInput;
}

// Notes are compiled as MDX at build time. Braces, angle-bracket tags and
// import/export lines would be read as code, and one broken note fails the
// whole scheduled build, so the API only accepts plain Markdown.
function checkMarkdown(content: string): string[] {
  const problems: string[] = [];
  if (/[{}]/.test(content)) problems.push("content: no { or } characters");
  if (/<[A-Za-z/!]/.test(content)) {
    problems.push("content: no HTML or angle-bracket tags; use Markdown links like [text](https://…)");
  }
  if (/^\s*(import|export)\s/m.test(content)) problems.push("content: no import/export lines");
  if (/^---\s*$/m.test(content)) problems.push("content: no --- lines (frontmatter is built from the fields)");
  if (/^#\s/m.test(content)) problems.push("content: no # headings; the title is the page's only h1, start sections at ##");
  return problems;
}

function assertQueued(date: string | undefined) {
  if (!date || date <= today()) {
    throw new ApiError(
      403,
      "published",
      "This note is already published. Published notes can’t be changed through the API.",
    );
  }
}

// --- MDX files --------------------------------------------------------------

const ORDER: (keyof NoteInput)[] = [
  "title",
  "seoTitle",
  "cardTitle",
  "description",
  "cardDescription",
  "kicker",
  "byline",
  "date",
];

function toMdx(note: NoteInput): string {
  // JSON strings are valid double-quoted YAML scalars, so this escapes safely.
  const lines = ORDER.filter((key) => note[key]).map(
    (key) => `${key}: ${JSON.stringify(note[key])}`,
  );
  return `---\n${lines.join("\n")}\n---\n\n${note.content}\n`;
}

function parseMdx(text: string): { frontmatter: Record<string, string>; content: string } {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content: text };
  const frontmatter: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const pair = line.match(/^([A-Za-z]+):\s*(.*)$/);
    if (!pair) continue;
    let value = pair[2].trim();
    if (value.startsWith('"')) {
      try {
        value = JSON.parse(value);
      } catch {
        value = value.slice(1, -1);
      }
    }
    frontmatter[pair[1]] = value;
  }
  return { frontmatter, content: match[2].trim() };
}

function summary(slug: string, fields: Record<string, string | undefined>) {
  const date = fields.date ?? "";
  return {
    slug,
    title: fields.title ?? slug,
    date,
    status: date > today() ? "queued" : "published",
    publishesOn: date > today() ? nextDeployDay(date) : null,
    url: `https://workwithahsan.com/notes/${slug}/`,
  };
}

// The Deploy workflow runs Mon/Wed/Fri, so a note dated on another day goes
// live on the next run after its date.
function nextDeployDay(date: string): string {
  const day = new Date(`${date}T00:00:00Z`);
  while (![1, 3, 5].includes(day.getUTCDay())) day.setUTCDate(day.getUTCDate() + 1);
  return day.toISOString().slice(0, 10);
}

function notePath(slug: string) {
  return `${NOTES_DIR}/${slug}.mdx`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

// --- GitHub contents API ----------------------------------------------------

class GitHub {
  constructor(
    private api: string,
    private token: string,
    private repo: string,
    private branch: string,
  ) {}

  private async call(path: string, init: RequestInit = {}) {
    const response = await fetch(`${this.api}/repos/${this.repo}/contents/${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "workwithahsan-notes-api",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
      },
    });
    if (response.status === 404) return null;
    if (!response.ok) {
      console.error("GitHub API error", response.status, (await response.text()).slice(0, 500));
      throw new ApiError(502, "github", "Couldn’t reach the repository. Try again shortly.");
    }
    return response.json() as Promise<any>;
  }

  async list(dir: string): Promise<{ name: string; path: string }[]> {
    return (await this.call(`${dir}?ref=${this.branch}`)) ?? [];
  }

  async read(path: string): Promise<{ text: string; sha: string } | null> {
    const file = await this.call(`${path}?ref=${this.branch}`);
    if (!file || Array.isArray(file)) return null;
    return { text: fromBase64(file.content), sha: file.sha };
  }

  async write(path: string, text: string, message: string, sha?: string) {
    await this.call(path, {
      method: "PUT",
      body: JSON.stringify({ message, content: toBase64(text), branch: this.branch, sha }),
    });
  }

  async remove(path: string, message: string, sha: string) {
    await this.call(path, {
      method: "DELETE",
      body: JSON.stringify({ message, branch: this.branch, sha }),
    });
  }
}

function toBase64(text: string) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

function fromBase64(base64: string) {
  const binary = atob(base64.replace(/\s/g, ""));
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
}

// --- Request helpers --------------------------------------------------------

async function authorize(request: Request, token: string) {
  const header = request.headers.get("Authorization") ?? "";
  const given = header.startsWith("Bearer ") ? header.slice(7) : "";
  // Compare digests so the check takes the same time however much matches.
  const [a, b] = await Promise.all([digest(given), digest(token)]);
  let diff = given ? 0 : 1;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  if (diff !== 0) {
    throw new ApiError(401, "unauthorized", "Send Authorization: Bearer <token>.");
  }
}

async function digest(value: string) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

async function readJson(request: Request): Promise<unknown> {
  const length = Number(request.headers.get("Content-Length") ?? 0);
  if (length > MAX_BODY_BYTES) throw new ApiError(413, "too_large", "Body is over 100 KB.");
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) throw new ApiError(413, "too_large", "Body is over 100 KB.");
  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError(400, "invalid_json", "Body must be JSON.");
  }
}

function json(status: number, body: unknown) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}

function methodNotAllowed(allow: string) {
  return Response.json(
    { ok: false, error: "method_not_allowed" },
    { status: 405, headers: { Allow: allow } },
  );
}
