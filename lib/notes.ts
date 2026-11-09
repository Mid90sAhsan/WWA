import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type NoteMeta = {
  slug: string;
  title: string;
  // Shorter title for the browser tab and search results; falls back to `title`.
  seoTitle: string;
  cardTitle: string;
  description: string;
  cardDescription: string;
  kicker: string;
  byline: string;
  date: string;
  updated: string;
};

export type Note = NoteMeta & { content: string };

const notesDir = path.join(process.cwd(), "content/notes");

// YAML turns an unquoted 2026-11-02 into a Date; keep everything as YYYY-MM-DD.
function day(value: unknown): string {
  return value instanceof Date ? value.toISOString().slice(0, 10) : String(value);
}

function parseNote(slug: string): Note {
  const file = path.join(notesDir, `${slug}.mdx`);
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title),
    seoTitle: String(data.seoTitle ?? data.title),
    cardTitle: String(data.cardTitle ?? data.title),
    description: String(data.description),
    cardDescription: String(data.cardDescription ?? data.description),
    kicker: String(data.kicker ?? "A note for local business owners"),
    byline: String(data.byline ?? "Ahsan"),
    date: day(data.date),
    updated: day(data.updated ?? data.date),
    content,
  };
}

// Notes dated in the future are queued: they stay out of production builds
// until their date (UTC), when the scheduled deploy publishes them. `next dev`
// shows them so you can preview the queue.
function isPublished(note: Note): boolean {
  if (process.env.NODE_ENV === "development") return true;
  return note.date <= new Date().toISOString().slice(0, 10);
}

export function getNoteSlugs(): string[] {
  return fs
    .readdirSync(notesDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""))
    .filter((slug) => isPublished(parseNote(slug)));
}

export function getNote(slug: string): Note {
  return parseNote(slug);
}

export function getAllNotes(): NoteMeta[] {
  return getNoteSlugs()
    .map((slug) => {
      const { content: _content, ...meta } = parseNote(slug);
      return meta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
