import type { Metadata } from "next";
import Link from "next/link";
import { AuditForm } from "@/components/AuditForm";
import { Dock } from "@/components/Dock";
import { JsonLd, breadcrumbs } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/lib/site";

const path = "/services/suspension-help/";
const title = "Google Business Profile Suspension Help";
const description =
  "Help getting a suspended Google Business Profile reinstated, for local businesses in the US and Canada. Free review first. Full refund if it isn’t reinstated.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title: "Get your suspended Google profile back",
    description,
    url: path,
    siteName: site.name,
    images: [{ url: site.image, width: 512, height: 512, alt: site.person }],
  },
  twitter: {
    card: "summary",
    title: "Get your suspended Google profile back",
    description,
    images: [site.image],
  },
};

export default function SuspensionHelpPage() {
  return (
    <div className="article-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              "@id": `${site.url}${path}#service`,
              name: "Google Business Profile suspension help",
              serviceType: "Google Business Profile reinstatement",
              description,
              url: `${site.url}${path}`,
              provider: { "@id": `${site.url}/#business` },
              areaServed: [
                { "@type": "Country", name: "United States" },
                { "@type": "Country", name: "Canada" },
              ],
            },
            breadcrumbs([
              { name: "Home", url: `${site.url}/` },
              { name: "Suspension help", url: `${site.url}${path}` },
            ]),
          ],
        }}
      />
      <SiteHeader />
      <main id="main">
        <div className="wrap">
          <header className="hero">
            <div>
              <p className="kicker">Suspension help · US &amp; Canada</p>
              <h1>Google Business Profile suspended? Let’s get it back.</h1>
              <p className="byline">
                Free review first. If I take your case and Google doesn’t
                reinstate the profile, you get your money back.
              </p>
            </div>
          </header>
          <article className="article">
            <p>
              A suspended profile means the phone goes quiet. Sometimes you
              can’t edit anything. Sometimes you’re gone from Maps altogether.
              Google rarely says why, and the appeal form doesn’t tell you what
              it wants to see.
            </p>
            <p>
              Most suspensions come down to the profile not matching the real
              business: the name, the address, the category, or a duplicate
              listing. That’s fixable. I find the cause, fix it, put together
              the proof Google asks for, and file one clean appeal.
            </p>
            <p>
              <a className="btn" href="#review">
                Send me your suspension for a free review
              </a>
            </p>

            <h2>How it works</h2>
            <ol>
              <li>
                <strong>Free review.</strong> Send the form below. I look at the
                profile, the suspension notice, and what the rest of the web
                says about your business. Within one business day you hear what
                I think caused it, and whether I think it’s fixable.
              </li>
              <li>
                <strong>A flat quote.</strong> If I think I can help, I quote
                one fixed fee up front. No hourly billing, no retainer.
              </li>
              <li>
                <strong>Fix the profile.</strong> We correct whatever doesn’t
                match: the business name, the address or service area, the
                categories, and any duplicate listings.
              </li>
              <li>
                <strong>Gather the proof.</strong> I tell you exactly which
                documents and photos to collect, and check them before anything
                goes to Google.
              </li>
              <li>
                <strong>File the appeal and follow up.</strong> One appeal
                through Google’s appeals tool, with the right evidence. Then I
                follow up until there’s a decision.
              </li>
              <li>
                <strong>After it’s back.</strong> I check that you show up on
                Maps again, that your reviews are back, and that a second owner
                is on the profile so it never depends on one login.
              </li>
            </ol>

            <h2>The refund promise</h2>
            <p>
              If I take your case and Google doesn’t reinstate the profile, I
              refund the fee. All of it.
            </p>
            <p>
              That only works because I don’t take every case. If your business
              doesn’t meet Google’s rules as it stands, like a storefront
              listing at a home address customers never visit, I’ll say so in
              the free review. I’ll also tell you what would need to change for
              the profile to qualify.
            </p>

            <h2>What I’ll need from you</h2>
            <ul>
              <li>
                A screenshot of the suspension notice, or what you see when you
                sign in.
              </li>
              <li>Your business license or registration.</li>
              <li>
                A utility bill, lease, or bank statement with the business name
                and address.
              </li>
              <li>
                Photos of your signage with the street number, or your branded
                vehicle and tools if you work at customers’ locations.
              </li>
            </ul>
            <p>
              You don’t need all of it for the free review. A screenshot and a
              link to your website are enough to start.
            </p>

            <h2>What I won’t do</h2>
            <ul>
              <li>
                Promise a date. Google decides the timing. Appeals often take a
                few days to a few weeks.
              </li>
              <li>
                Create a new profile to dodge the suspension. It usually makes
                things worse.
              </li>
              <li>
                Edit or invent documents. Google checks, and it ends the case
                for good.
              </li>
              <li>
                Claim “contacts at Google.” Nobody outside Google can push an
                appeal through.
              </li>
            </ul>

            <h2>Common questions</h2>
            <h3>Do you need my Google password?</h3>
            <p>
              No. Depending on the suspension, you either add me as a manager on
              the profile, or you submit the appeal yourself while I guide you
              through every step.
            </p>
            <h3>Will I get my reviews back?</h3>
            <p>
              When a profile is reinstated, its reviews and photos usually come
              back with it. That’s one of the biggest reasons not to start over
              with a new profile.
            </p>
            <h3>I already appealed and got denied. Can you still help?</h3>
            <p>
              Often, yes. A denial usually means the cause was still there or
              the proof didn’t match. Send it over and I’ll tell you honestly in
              the free review.
            </p>
            <h3>Can I do this myself?</h3>
            <p>
              Yes. I wrote up the whole process in{" "}
              <Link href="/notes/suspended/">
                what to do when your Google profile is suspended
              </Link>
              . Hire me if you’d rather not risk a second denial, or if you’ve
              already had one.
            </p>
          </article>
        </div>

        <section className="book" id="review" aria-labelledby="review-title">
          <div className="wrap">
            <div>
              <span className="section-label">Free review</span>
              <h2 id="review-title">Send me your suspension.</h2>
              <p>
                Tell me about the business and what happened. Within one
                business day, in plain English, you’ll hear:
              </p>
              <ul className="audit-list">
                <li>What most likely triggered the suspension</li>
                <li>Whether I think it can be reinstated, and why</li>
                <li>What to fix before anyone appeals</li>
                <li>A flat quote if you want me to handle it</li>
              </ul>
              <a className="mail" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <p>Send the form, or write that address with a screenshot.</p>
            </div>
            <AuditForm kind="suspension" />
          </div>
        </section>
      </main>
      <SiteFooter />
      <Dock href="#review" label="Get a free suspension review" />
    </div>
  );
}
