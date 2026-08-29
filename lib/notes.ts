import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type NoteMeta = {
  slug: string;
  title: string;
  cardTitle: string;
  description: string;
  cardDescription: string;
  kicker: string;
  byline: string;
  date: string;
};

export type Note = NoteMeta & { content: string };

const notesDir = path.join(process.cwd(), "content/notes");

function parseNote(slug: string): Note {
  const file = path.join(notesDir, `${slug}.mdx`);
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title),
    cardTitle: String(data.cardTitle ?? data.title),
    description: String(data.description),
    cardDescription: String(data.cardDescription ?? data.description),
    kicker: String(data.kicker ?? "A note for local business owners"),
    byline: String(data.byline ?? "Ahsan"),
    date: String(data.date),
    content,
  };
}

export function getNoteSlugs(): string[] {
  return fs
    .readdirSync(notesDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
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
