"use client";

import { useEffect, useState } from "react";

// Only the first hard page load is a fair measurement; client-side
// navigations back to the home page reuse the old navigation entry.
let measured = false;

export function LoadTime() {
  const [value, setValue] = useState<string | null>(null);
  const [stale] = useState(() => measured);

  useEffect(() => {
    if (stale) return;
    measured = true;

    const paint = () => {
      const nav = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      // fetchStart comes after any redirects, so tracker hops aren't counted.
      const ms =
        nav && nav.loadEventEnd > 0
          ? nav.loadEventEnd - nav.fetchStart
          : performance.now();
      const seconds = ms / 1000;
      setValue(seconds < 0.1 ? "< 0.1" : seconds < 1 ? seconds.toFixed(2) : seconds.toFixed(1));
    };

    // loadEventEnd is only filled in after the load handlers finish.
    if (document.readyState === "complete") setTimeout(paint, 0);
    else window.addEventListener("load", () => setTimeout(paint, 0), { once: true });
  }, [stale]);

  if (stale) return null;

  return (
    <p className="proof-time">
      <span className="proof-time__row">
        <span className="proof-time__num">{value ?? "—"}</span>
        <span className="proof-time__unit">seconds</span>
      </span>
      <span className="proof-time__label">
        How long this page took to be ready on your device, this visit. Test it
        on your phone.
      </span>
    </p>
  );
}
