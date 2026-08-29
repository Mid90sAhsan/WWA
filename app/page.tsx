import Link from "next/link";
import { AuditForm } from "@/components/AuditForm";
import { Dock } from "@/components/Dock";
import { JsonLd } from "@/components/JsonLd";
import { LoadTime } from "@/components/LoadTime";
import { NotesList } from "@/components/NotesList";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllNotes } from "@/lib/notes";
import { site } from "@/lib/site";

export default function HomePage() {
  const notes = getAllNotes();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": `${site.url}/#website`,
              url: `${site.url}/`,
              name: site.name,
              description:
                "Ahsan builds fast websites and gets local businesses in the US and Canada found on Google.",
              inLanguage: "en",
              publisher: { "@id": `${site.url}/#ahsan` },
            },
            {
              "@type": "Person",
              "@id": `${site.url}/#ahsan`,
              name: site.person,
              url: `${site.url}/`,
              email: `mailto:${site.email}`,
              jobTitle: "Web developer and local SEO specialist",
              description:
                "Ahsan builds fast websites and helps local businesses in the US and Canada get found on Google.",
              knowsAbout: [
                "Website development",
                "Local SEO",
                "Google Business Profile",
                "Google Maps",
              ],
              areaServed: [
                { "@type": "Country", name: "United States" },
                { "@type": "Country", name: "Canada" },
              ],
            },
            {
              "@type": ["LocalBusiness", "ProfessionalService"],
              "@id": `${site.url}/#business`,
              name: site.person,
              alternateName: site.name,
              url: `${site.url}/`,
              email: site.email,
              description:
                "Website development and local SEO for local businesses in the US and Canada.",
              areaServed: [
                { "@type": "Country", name: "United States" },
                { "@type": "Country", name: "Canada" },
              ],
              founder: { "@id": `${site.url}/#ahsan` },
              serviceType: [
                "Website development",
                "Local SEO",
                "Google Business Profile",
              ],
            },
          ],
        }}
      />

      <SiteHeader home />

      <main id="main">
        <section className="wrap hero">
          <div>
            <p className="kicker">Local businesses · US &amp; Canada</p>
            <h1>
              I build fast websites that get local businesses{" "}
              <span className="found">found</span> on Google.
            </h1>
            <p className="lede">
              Whether you run a contracting business, a clinic, or a local shop —
              if your customers search “near me,” I help them find you.
            </p>
            <div className="hero-actions">
              <Link className="btn" href="#book">
                Book a free site audit
              </Link>
              <p className="hero-note">15 minutes. Plain English. No pitch deck.</p>
            </div>
          </div>
          <figure className="portrait">
            {/* AHSAN: replace the monogram with /images/ahsan.jpg — head and shoulders, well lit. */}
            <div className="portrait__frame" role="img" aria-label="Ahsan">
              <span className="portrait__initial" aria-hidden="true">
                A
              </span>
            </div>
            <figcaption>
              <span>Ahsan</span>
              <span className="portrait__role">Websites &amp; local SEO</span>
            </figcaption>
          </figure>
        </section>

        <section className="band" id="problem" aria-labelledby="problem-title">
          <div className="wrap band-inner">
            <div>
              <span className="section-label">01 / The problem</span>
              <h2 id="problem-title">
                They already searched. You never got the call.
              </h2>
              <p>
                Someone needs what you do. They pull out their phone and type it
                into Google. If your name isn’t there — or your site takes ten
                seconds to open — they tap the next business. You don’t get a
                second chance to make that list.
              </p>
              <p>
                A slow site and a quiet map pin lose the job before you know it
                was up for grabs.
              </p>
            </div>
            <div>
              <p className="section-label">What they type</p>
              <ul className="queries">
                <li>
                  <q>roofer near me</q>
                </li>
                <li>
                  <q>dentist open Saturday</q>
                </li>
                <li>
                  <q>HVAC in [my city]</q>
                </li>
                <li>
                  <q>coffee shop nearby</q>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <div className="wrap ledger" id="work">
          <section className="block" aria-labelledby="do-title">
            <p className="block__num">02</p>
            <span className="section-label">What I do</span>
            <h2 id="do-title">Three things that get you the call.</h2>
            <p className="prose">
              I don’t sell “packages.” I fix the reasons people can’t find you,
              then make sure the page they land on actually opens.
            </p>
            <ul className="jobs">
              <li>
                <h3>A site that opens before they bounce</h3>
                <p>
                  Most local sites were built once and left alone. I make pages
                  that load in a blink on a phone — the thing your customer is
                  holding in the parking lot.
                </p>
              </li>
              <li>
                <h3>A Google profile that puts you on the map</h3>
                <p>
                  Hours, photos, categories, the pin. That’s how you show up in
                  the map pack when someone searches nearby.
                </p>
              </li>
              <li>
                <h3>Pages that match how people search</h3>
                <p>
                  When they type your service and their city, you should be a
                  name they can tap. I line up the site and the listings so
                  Google can connect those dots.
                </p>
              </li>
            </ul>
          </section>

          <section className="block" aria-labelledby="who-title">
            <p className="block__num">03</p>
            <span className="section-label">Who it’s for</span>
            <h2 id="who-title">
              Any local business whose customers search nearby.
            </h2>
            <div className="range">
              <p>
                Trades. Clinics. Shops. Restaurants. Services with a truck and a
                zip code. If someone in the US or Canada can type what you do
                plus a city — or “near me” — this is for you.
              </p>
              <p>
                I keep this site broad on purpose. The job does not change from
                one kind of business to the next: show up, load fast, get the
                call.
              </p>
            </div>
          </section>

          <section className="block" aria-labelledby="why-title">
            <p className="block__num">04</p>
            <span className="section-label">Why me</span>
            <h2 id="why-title">This page is the proof.</h2>
            <p className="story">
              I don’t have a wall of logos yet. I’m earlier than the agencies
              that don’t return a small shop’s call — which is why I pick up,
              keep the work honest, and treat a handful of local businesses like
              they matter.
            </p>
            <LoadTime />
            <p className="story">
              Notice the phone layout too. Most owners open a link from email
              with one thumb. That’s the test.
            </p>
            {/* AHSAN: two or three sentences on why you do this. Optional: intro rate / how many spots. */}
            <p className="story">
              I’m taking a small number of local businesses at an introductory
              rate. If the work is good, I ask for an honest testimonial. That’s
              the deal.
            </p>
          </section>

          <section className="block" aria-labelledby="process-title">
            <p className="block__num">05</p>
            <span className="section-label">The first three months</span>
            <h2 id="process-title">You always know what I’m doing.</h2>
            <p className="story">
              Local owners have been burned by “SEO guys.” So here’s the work, in
              order. No mystery retainers. No ranking guarantees I can’t keep.
            </p>
            <ol className="months">
              <li>
                <h3>Month 1 — Make the basics true</h3>
                <p>
                  You and I get on a call. I look at your site and your Google
                  profile. Then I fix or rebuild the site so it’s fast on a
                  phone, and I clean up the profile so the name, hours, and pin
                  are right.
                </p>
              </li>
              <li>
                <h3>Month 2 — Get findable</h3>
                <p>
                  On-page work. Service and city pages that match how people
                  search. Listings Google already trusts, lined up with the same
                  name and address.
                </p>
              </li>
              <li>
                <h3>Month 3 — Keep it moving</h3>
                <p>
                  Photos, review asks, small fixes. You should start seeing the
                  map and the calls shift. This is not a light switch — you’ll
                  know what changed and why.
                </p>
              </li>
            </ol>
          </section>

          <section className="block" aria-labelledby="notes-title">
            <p className="block__num">06</p>
            <span className="section-label">Plain-English notes</span>
            <h2 id="notes-title">If you want the long version first.</h2>
            <p className="story">
              No case studies yet. These notes are how I think — written for
              owners, not marketers.
            </p>
            <NotesList notes={notes} />
          </section>
        </div>

        <section className="book" id="book" aria-labelledby="book-title">
          <div className="wrap">
            <div>
              <span className="section-label">07 / Next step</span>
              <h2 id="book-title">Book a free 15-minute site audit.</h2>
              <p>
                Send me your site and your city. I’ll tell you, in plain English,
                why the calls aren’t coming — and what I’d fix first.
              </p>
              <a className="mail" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              {/* AHSAN: add a calendar URL button and optional phone here. */}
              <p>Send the form, or write that address. That’s enough to start.</p>
            </div>
            <AuditForm />
          </div>
        </section>
      </main>

      <SiteFooter />
      <Dock home />
    </>
  );
}
