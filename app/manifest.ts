import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.person,
    description:
      "Fast websites and local SEO for local businesses in the US and Canada.",
    start_url: "/",
    display: "browser",
    background_color: "#f3eee4",
    theme_color: "#243226",
  };
}
