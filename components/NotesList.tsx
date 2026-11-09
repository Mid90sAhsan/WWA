import Link from "next/link";
import type { NoteMeta } from "@/lib/notes";

export function NotesList({
  notes,
  headingLevel = 3,
}: {
  notes: NoteMeta[];
  // h2 on the notes index (directly under the h1), h3 inside a homepage section.
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <ul className="notes-list">
      {notes.map((note) => (
        <li key={note.slug}>
          <Link href={`/notes/${note.slug}/`}>
            <Heading>{note.cardTitle}</Heading>
            <p>{note.cardDescription}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
