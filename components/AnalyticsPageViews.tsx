"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { gaId } from "@/lib/analytics";

export function AnalyticsPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const first = useRef(true);

  useEffect(() => {
    // The initial page view is sent by gtag('config') in GoogleAnalytics;
    // only report client-side navigations here.
    if (first.current) {
      first.current = false;
      return;
    }
    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    window.gtag?.("config", gaId, { page_path: pagePath });
  }, [pathname, searchParams]);

  return null;
}
