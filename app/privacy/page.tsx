import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${site.name} handles analytics, audit requests and email.`,
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <div className="article-page">
      <SiteHeader />
      <main id="main" className="wrap">
        <header className="hero">
          <div>
            <p className="kicker">Privacy</p>
            <h1>What I collect, and why.</h1>
            <p className="byline">Last updated November 2, 2026</p>
          </div>
        </header>
        <article className="article">
          <p>
            This site is run by {site.person} ({site.name}). Questions or
            requests go to <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>

          <h2>Analytics</h2>
          <p>
            The site uses Google Analytics to count visits and see which pages
            are read. Google sets cookies to do this and receives your IP address
            and basic device information. I don’t use it to identify you. You
            can block it with any content blocker or Google’s{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener">
              opt-out add-on
            </a>
            .
          </p>

          <h2>Audit requests</h2>
          <p>
            When you send the audit form, your name, email, business, city,
            website and notes are emailed to me so I can reply. I keep that
            email like any other business correspondence and don’t sell or share
            it.
          </p>

          <h2>Emails from me</h2>
          <p>
            If I emailed you first, I found your business email in a public
            business listing or on your website. Reply “no thanks” (or anything
            like it) and I won’t email you again.
          </p>

          <h2>Your choices</h2>
          <p>
            Ask me at {site.email} to see, correct or delete anything I have
            about you, and I’ll handle it promptly.
          </p>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
