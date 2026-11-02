import { getAllNotes } from "@/lib/notes";
import { site } from "@/lib/site";

export const dynamic = "force-static";

function escape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const notes = getAllNotes();
  const feedUrl = `${site.url}/notes/feed.xml`;

  const items = notes
    .map((note) => {
      const url = `${site.url}/notes/${note.slug}/`;
      return `    <item>
      <title>${escape(note.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escape(note.description)}</description>
      <pubDate>${new Date(`${note.date}T12:00:00Z`).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(`Notes — ${site.name}`)}</title>
    <link>${site.url}/notes/</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>Plain-English notes on local search, Google Maps, and getting found — for local businesses in the US and Canada.</description>
    <language>en</language>
${notes.length ? `    <lastBuildDate>${new Date(`${notes[0].date}T12:00:00Z`).toUTCString()}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
