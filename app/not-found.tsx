import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="wrap notfound">
        <h1>This page isn’t on the map.</h1>
        <p>The link is wrong or the page moved. The rest of the site is still here.</p>
        <p>
          <Link className="btn" href="/">
            Back to the home page
          </Link>
        </p>
      </main>
    </>
  );
}
