import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { site } from "@/lib/site";
import "./site.css";

const fraunces = localFont({
  src: "../fonts/fraunces-latin-standard.woff2",
  variable: "--font-fraunces",
  weight: "100 900",
  display: "swap",
});

const sourceSans = localFont({
  src: [
    {
      path: "../fonts/source-sans-3-latin-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/source-sans-3-latin-600.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.person}`,
  },
  description: site.description,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description:
      "Fast websites and local SEO for local businesses in the US and Canada. Book a free 15-minute site audit.",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: site.title,
    description:
      "Fast websites and local SEO for local businesses in the US and Canada. Book a free 15-minute site audit.",
  },
};

export const viewport: Viewport = {
  themeColor: "#243226",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${sourceSans.variable}`}>
      <body>
        <GoogleAnalytics />
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
