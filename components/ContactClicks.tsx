"use client";

import { useEffect } from "react";
import { site } from "@/lib/site";

// Email and booking links leave the site, so GA's page tracking never sees
// them. Report them as `contact_click` events instead.
export function ContactClicks() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.("a");
      const href = link?.getAttribute("href");
      if (!href) return;
      const method = href.startsWith("mailto:")
        ? "email"
        : site.bookingUrl && href === site.bookingUrl
          ? "booking"
          : null;
      if (method) {
        window.gtag?.("event", "contact_click", {
          method,
          page_path: location.pathname,
        });
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
