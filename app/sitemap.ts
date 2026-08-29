import type { MetadataRoute } from "next";
import { getAllNotes } from "@/lib/notes";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const notes = getAllNotes().map((note) => ({
    url: `${site.url}/notes/${note.slug}/`,
    lastModified: note.date,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: `${site.url}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${site.url}/notes/`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...notes,
  ];
}
