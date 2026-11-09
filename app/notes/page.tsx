import type { Metadata } from "next";
import { Dock } from "@/components/Dock";
import { JsonLd, breadcrumbs } from "@/components/JsonLd";
import { NotesList } from "@/components/NotesList";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllNotes } from "@/lib/notes";
import { feedAlternates, site } from "@/lib/site";

const description =
  "Plain-English notes on local search, Google Maps, and getting found — for local businesses in the US and Canada.";

export const metadata: Metadata = {
  title: "Local SEO & Google Maps Notes",
  description,
  alternates: { canonical: "/notes/", ...feedAlternates },
  openGraph: {
    title: "Local SEO & Google Maps Notes",
    description,
    url: "/notes/",
    siteName: site.name,
    images: [{ url: site.image, width: 512, height: 512, alt: site.person }],
  },
  twitter: {
    card: "summary",
    title: "Local SEO & Google Maps Notes",
    description,
    images: [site.image],
  },
};

export default function NotesIndexPage() {
  const notes = getAllNotes();

  return (
    <div className="article-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${site.url}/notes/#page`,
              url: `${site.url}/notes/`,
              name: "Local SEO & Google Maps Notes",
              description,
              inLanguage: "en",
              isPartOf: { "@id": `${site.url}/#website` },
              author: { "@id": `${site.url}/#ahsan` },
              mainEntity: {
                "@type": "ItemList",
                itemListElement: notes.map((note, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  url: `${site.url}/notes/${note.slug}/`,
                  name: note.title,
                })),
              },
            },
            breadcrumbs([
              { name: "Home", url: `${site.url}/` },
              { name: "Notes", url: `${site.url}/notes/` },
            ]),
          ],
        }}
      />
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
        <NotesList notes={notes} headingLevel={2} />
      </main>
      <SiteFooter />
      <Dock />
    </div>
  );
}
