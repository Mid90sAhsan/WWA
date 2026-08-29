"use client";

import type { FormEvent } from "react";
import { site } from "@/lib/site";

export function AuditForm() {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = [
      `Name: ${data.get("name") || ""}`,
      `Business: ${data.get("business") || ""}`,
      `City: ${data.get("city") || ""}`,
      `Website: ${data.get("website") || ""}`,
      "",
      String(data.get("notes") || ""),
    ];
    const subject = encodeURIComponent("Free 15-minute site audit");
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <label>
        Your name
        <input type="text" name="name" autoComplete="name" required />
      </label>
      <label>
        Business name
        <input type="text" name="business" autoComplete="organization" required />
      </label>
      <label>
        City
        <input type="text" name="city" autoComplete="address-level2" required />
      </label>
      <label>
        Website
        <input
          type="text"
          name="website"
          inputMode="url"
          autoComplete="url"
          placeholder="your-site.com"
        />
      </label>
      <label>
        What’s going on <span className="optional">(optional)</span>
        <textarea
          name="notes"
          rows={4}
          placeholder="Not showing on Maps, site feels slow, just opened…"
        />
      </label>
      <button className="btn btn--light btn--wide" type="submit">
        Email me the audit request
      </button>
    </form>
  );
}
