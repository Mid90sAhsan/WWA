import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getNote, getNoteSlugs } from "@/lib/notes";
import { site } from "@/lib/site";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Note from Work with Ahsan";

export function generateStaticParams() {
  return getNoteSlugs().map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getNote(slug);
  // Satori can't read woff2, so these are TTF copies of the site fonts
  // (Fraunces fixed at the weight and optical size the headings use).
  const font = (file: string) =>
    fs.readFileSync(path.join(process.cwd(), "fonts", file));

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "#f3eee4",
        color: "#1c1914",
        borderLeft: "24px solid #243226",
        fontFamily: "Source Sans 3",
      }}
    >
      <div style={{ display: "flex", fontSize: 30, color: "#5b554c" }}>
        Plain-English notes for local business owners
      </div>
      <div
        style={{
          display: "flex",
          fontFamily: "Fraunces",
          fontSize: note.cardTitle.length > 40 ? 72 : 84,
          lineHeight: 1.02,
          letterSpacing: "-0.03em",
        }}
      >
        {note.cardTitle}
      </div>
      <div style={{ display: "flex", fontSize: 30, color: "#243226" }}>
        {site.name} · workwithahsan.com
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: font("fraunces-og.ttf"), weight: 500 },
        {
          name: "Source Sans 3",
          data: font("source-sans-3-400.ttf"),
          weight: 400,
        },
      ],
    },
  );
}
