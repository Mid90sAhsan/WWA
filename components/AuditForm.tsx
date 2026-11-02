"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";

function mailtoHref(data: FormData) {
  const lines = [
    `Name: ${data.get("name") || ""}`,
    `Email: ${data.get("email") || ""}`,
    `Business: ${data.get("business") || ""}`,
    `City: ${data.get("city") || ""}`,
    `Website: ${data.get("website") || ""}`,
    "",
    String(data.get("notes") || ""),
  ];
  const subject = encodeURIComponent("Free 15-minute site audit");
  const body = encodeURIComponent(lines.join("\n"));
  return `mailto:${site.email}?subject=${subject}&body=${body}`;
}

export function AuditForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [fallback, setFallback] = useState(`mailto:${site.email}`);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setFallback(mailtoHref(data));
    setStatus("sending");

    try {
      const response = await fetch("/api/audit/", { method: "POST", body: data });
      if (response.ok) {
        setStatus("sent");
        window.gtag?.("event", "generate_lead", { form: "audit" });
        return;
      }
    } catch {
      // Network error: fall through to the email fallback below.
    }
    setStatus("error");
  }

  if (status === "sent") {
    return (
      <div className="form-done" role="status">
        <p className="form-done__title">Got it. Thanks.</p>
        <p>
          I’ll reply from {site.email} within one business day with a time for
          the audit. Check your spam folder if you don’t see it.
        </p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <label>
        Your name
        <input type="text" name="name" autoComplete="name" required />
      </label>
      <label>
        Your email
        <input type="email" name="email" autoComplete="email" required />
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
      <label className="form-trap" aria-hidden="true">
        Leave this empty
        <input type="text" name="company_url" tabIndex={-1} autoComplete="off" />
      </label>
      <button
        className="btn btn--light btn--wide"
        type="submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Send my audit request"}
      </button>
      {status === "error" && (
        <p className="form-error" role="alert">
          That didn’t go through. <a href={fallback}>Send it by email instead</a>{" "}
          or write to {site.email}.
        </p>
      )}
    </form>
  );
}
