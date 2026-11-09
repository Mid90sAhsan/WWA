// Cloudflare Worker: serves the static Next.js export from ./out, redirects
// www to the apex, adds security/cache headers, and handles the audit form
// and the notes API (worker/notes-api.ts).

import { handleNotesApi, type NotesEnv } from "./notes-api";

interface Env extends NotesEnv {
  ASSETS: { fetch(request: Request): Promise<Response> };
  AUDIT_SCRIPT_URL?: string;
  AUDIT_SCRIPT_SECRET?: string;
}

const CANONICAL_HOST = "workwithahsan.com";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (url.hostname === `www.${CANONICAL_HOST}` || (url.protocol === "http:" && !isLocal)) {
      url.hostname = CANONICAL_HOST;
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    const response =
      url.pathname === "/api/audit" || url.pathname === "/api/audit/"
        ? request.method === "POST"
          ? await handleAudit(request, env)
          : Response.json({ ok: false }, { status: 405, headers: { Allow: "POST" } })
        : url.pathname === "/api/notes" || url.pathname.startsWith("/api/notes/")
          ? await handleNotesApi(request, env, url.pathname)
          : await env.ASSETS.fetch(request);

    return withHeaders(response, url.pathname);
  },
};

function withHeaders(response: Response, pathname: string) {
  const out = new Response(response.body, response);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) out.headers.set(key, value);
  if (pathname.startsWith("/_next/static/")) {
    out.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else if (pathname.startsWith("/images/")) {
    out.headers.set("Cache-Control", "public, max-age=604800, stale-while-revalidate=86400");
  } else if (pathname.endsWith("/opengraph-image") && response.ok) {
    // Next exports social images without a file extension, so the asset
    // server can't infer the type.
    out.headers.set("Content-Type", "image/png");
    out.headers.set("Cache-Control", "public, max-age=86400");
  }
  return out;
}

const FIELDS = ["name", "email", "business", "city", "website", "notes"] as const;
type Field = (typeof FIELDS)[number];

function clean(value: FormDataEntryValue | null, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function handleAudit(request: Request, env: Env) {
  const data = await request.formData().catch(() => null);
  if (!data) return Response.json({ ok: false, error: "bad_request" }, { status: 400 });

  // Honeypot: real visitors never see or fill this field.
  if (clean(data.get("company_url"))) {
    return Response.json({ ok: true });
  }

  const values = Object.fromEntries(
    FIELDS.map((field) => [field, clean(data.get(field), field === "notes" ? 4000 : 500)]),
  ) as Record<Field, string>;

  if (!values.name || !values.business || !values.city) {
    return Response.json({ ok: false, error: "missing" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    return Response.json({ ok: false, error: "email" }, { status: 400 });
  }

  // Google Apps Script web app (scripts/audit-form.gs): saves to a Sheet and emails you.
  if (!env.AUDIT_SCRIPT_URL || !env.AUDIT_SCRIPT_SECRET) {
    return Response.json({ ok: false, error: "unconfigured" }, { status: 503 });
  }

  try {
    let response = await fetch(env.AUDIT_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, secret: env.AUDIT_SCRIPT_SECRET }),
      redirect: "manual",
    });
    // Apps Script runs the POST, then 302s to a URL that serves the result
    // and only accepts GET, so follow it by hand.
    const location = response.headers.get("Location");
    if (response.status >= 300 && response.status < 400 && location) {
      response = await fetch(location);
    }
    // Apps Script answers 200 even on script errors, so check the JSON too.
    const text = await response.text();
    let result: { ok?: boolean } | null = null;
    try {
      result = JSON.parse(text);
    } catch {}
    if (!response.ok || !result?.ok) {
      // Apps Script error pages are HTML; keep just the readable message.
      const message = text
        .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      console.error("Audit form send failed", response.status, message.slice(0, 500));
      return Response.json({ ok: false, error: "send" }, { status: 502 });
    }
  } catch (error) {
    console.error("Audit form send failed", error);
    return Response.json({ ok: false, error: "send" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
