import Link from "next/link";

export function Dock({
  home = false,
  href,
  label = "Book a free 15-minute site audit",
}: {
  home?: boolean;
  // Pages with their own form (like suspension help) point the dock at it.
  href?: string;
  label?: string;
}) {
  return (
    <Link className="dock" href={href ?? (home ? "#book" : "/#book")}>
      {label}
    </Link>
  );
}
