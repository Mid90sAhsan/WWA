"use client";

import { useEffect, useState } from "react";

export function LoadTime() {
  const [value, setValue] = useState("< 1");

  useEffect(() => {
    const paint = () => {
      const nav = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      const ms = nav && nav.loadEventEnd > 0 ? nav.loadEventEnd : performance.now();
      const seconds = ms / 1000;
      setValue(seconds < 0.1 ? "< 0.1" : seconds < 1 ? seconds.toFixed(2) : seconds.toFixed(1));
    };

    if (document.readyState === "complete") paint();
    else window.addEventListener("load", paint, { once: true });
  }, []);

  return (
    <p className="proof-time">
      <span className="proof-time__row">
        <span className="proof-time__num">{value}</span>
        <span className="proof-time__unit">seconds</span>
      </span>
      <span className="proof-time__label">
        How long this page took to be ready on your device, this visit. If it
        ever feels slow, don’t hire me.
      </span>
    </p>
  );
}
