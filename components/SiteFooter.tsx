import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter({
  extraLinks = [],
}: {
  extraLinks?: { href: string; label: string }[];
}) {
  return (
    <footer className="wrap site-footer">
      <div className="footer-row">
        <p>
          {site.person} · <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
        <nav className="footer-nav" aria-label="Footer">
          <Link href="/">Home</Link>
          <Link href="/#work">Services</Link>
          <Link href="/services/suspension-help/">Suspension help</Link>
          <Link href="/notes/">Notes</Link>
          {extraLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          <Link href="/#book">Book an audit</Link>
          <Link href="/privacy/">Privacy</Link>
        </nav>
      </div>
      <p className="fine">
        Local businesses in the US &amp; Canada. No invented results. The site
        has to earn the call on its own.
      </p>
    </footer>
  );
}
