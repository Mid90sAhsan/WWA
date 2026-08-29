import Link from "next/link";

export function Dock({ home = false }: { home?: boolean }) {
  return (
    <Link className="dock" href={home ? "#book" : "/#book"}>
      Book a free 15-minute site audit
    </Link>
  );
}
