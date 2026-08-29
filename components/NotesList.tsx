import Link from "next/link";
import type { NoteMeta } from "@/lib/notes";

export function NotesList({ notes }: { notes: NoteMeta[] }) {
  return (
    <ul className="notes-list">
      {notes.map((note) => (
        <li key={note.slug}>
          <Link href={`/notes/${note.slug}/`}>
            <h3>{note.cardTitle}</h3>
            <p>{note.cardDescription}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
