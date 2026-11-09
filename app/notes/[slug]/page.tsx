import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Dock } from "@/components/Dock";
import { JsonLd, breadcrumbs } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllNotes, getNote, getNoteSlugs } from "@/lib/notes";
import { feedAlternates, site } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams() {
  return getNoteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!getNoteSlugs().includes(slug)) return {};
  const note = getNote(slug);
  return {
    title: note.seoTitle,
    description: note.description,
    alternates: { canonical: `/notes/${note.slug}/`, ...feedAlternates },
    openGraph: {
      type: "article",
      siteName: site.name,
      title: note.cardTitle,
      description: note.cardDescription,
      url: `/notes/${note.slug}/`,
      publishedTime: note.date,
      modifiedTime: note.updated,
      authors: [site.person],
    },
    // The image comes from opengraph-image.tsx; Twitter falls back to it.
    twitter: {
      card: "summary_large_image",
      title: note.cardTitle,
      description: note.cardDescription,
    },
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  if (!getNoteSlugs().includes(slug)) notFound();

  const note = getNote(slug);
  const others = getAllNotes().filter((item) => item.slug !== slug);

  return (
    <div className="article-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              headline: note.title,
              description: note.description,
              image: `${site.url}/notes/${note.slug}/opengraph-image`,
              datePublished: note.date,
              dateModified: note.updated,
              author: {
                "@type": "Person",
                name: site.person,
                url: `${site.url}/`,
              },
              publisher: {
                "@type": "Person",
                name: site.person,
                url: `${site.url}/`,
              },
              mainEntityOfPage: `${site.url}/notes/${note.slug}/`,
              inLanguage: "en",
            },
            breadcrumbs([
              { name: "Home", url: `${site.url}/` },
              { name: "Notes", url: `${site.url}/notes/` },
              { name: note.cardTitle, url: `${site.url}/notes/${note.slug}/` },
            ]),
          ],
        }}
      />
      <SiteHeader />
      <main id="main" className="wrap">
        <header className="hero">
          <div>
            <p className="kicker">{note.kicker}</p>
            <h1>{note.title}</h1>
            <p className="byline">{note.byline}</p>
          </div>
        </header>
        <article className="article">
          <MDXRemote source={note.content} />
          <p>
            <Link className="btn" href="/#book">
              Book a free site audit
            </Link>
          </p>
        </article>
      </main>
      <SiteFooter
        extraLinks={others.map((item) => ({
          href: `/notes/${item.slug}/`,
          label: item.cardTitle,
        }))}
      />
      <Dock />
    </div>
  );
}
