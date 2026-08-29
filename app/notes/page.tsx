import type { Metadata } from "next";
import { Dock } from "@/components/Dock";
import { NotesList } from "@/components/NotesList";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllNotes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Plain-English notes on local search, Google Maps, and getting found — for local businesses in the US and Canada.",
  alternates: { canonical: "/notes/" },
  openGraph: {
    title: "Notes",
    description:
      "Plain-English notes on local search, Google Maps, and getting found — for local businesses in the US and Canada.",
    url: "/notes/",
  },
};

export default function NotesIndexPage() {
  const notes = getAllNotes();

  return (
    <div className="article-page">
      <SiteHeader />
      <main id="main" className="wrap notes-index">
        <header className="hero">
          <div>
            <p className="kicker">Notes</p>
            <h1>Plain English for local owners.</h1>
            <p className="byline">
              How local search actually works — no jargon, no ranking promises.
            </p>
          </div>
        </header>
        <NotesList notes={notes} />
      </main>
      <SiteFooter />
      <Dock />
    </div>
  );
}
