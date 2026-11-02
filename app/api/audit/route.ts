import { NextResponse } from "next/server";
import { site } from "@/lib/site";

const FIELDS = ["name", "email", "business", "city", "website", "notes"] as const;
type Field = (typeof FIELDS)[number];

function clean(value: FormDataEntryValue | null, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const data = await request.formData();

  // Honeypot: real visitors never see or fill this field.
  if (clean(data.get("company_url"))) {
    return NextResponse.json({ ok: true });
  }

  const values = Object.fromEntries(
    FIELDS.map((field) => [field, clean(data.get(field), field === "notes" ? 4000 : 500)]),
  ) as Record<Field, string>;

  if (!values.name || !values.business || !values.city) {
    return NextResponse.json({ ok: false, error: "missing" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    return NextResponse.json({ ok: false, error: "email" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "unconfigured" }, { status: 503 });
  }

  const text = [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Business: ${values.business}`,
    `City: ${values.city}`,
    `Website: ${values.website}`,
    "",
    values.notes,
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.AUDIT_FROM_EMAIL || `Audit form <audit@${new URL(site.url).hostname}>`,
      to: [site.email],
      reply_to: values.email,
      subject: `Site audit request: ${values.business} (${values.city})`,
      text,
    }),
  });

  if (!response.ok) {
    console.error("Audit form send failed", response.status, await response.text());
    return NextResponse.json({ ok: false, error: "send" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
