"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { gaId } from "@/lib/analytics";

export function AnalyticsPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    window.gtag?.("config", gaId, { page_path: pagePath });
  }, [pathname, searchParams]);

  return null;
}
