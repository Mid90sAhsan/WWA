import Link from "next/link";
import { Pin } from "./Pin";

export function SiteHeader({ home = false }: { home?: boolean }) {
  const workHref = home ? "#work" : "/#work";
  const bookHref = home ? "#book" : "/#book";

  return (
    <header className="site-header">
      <div className="wrap site-header__bar">
        <Link className="wordmark" href="/">
          <Pin className="pin" />
          work with ahsan
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link href={workHref}>Work</Link>
          <Link href="/notes/">Notes</Link>
          <Link className="btn header-cta" href={bookHref}>
            Book a free site audit
          </Link>
        </nav>
      </div>
    </header>
  );
}
