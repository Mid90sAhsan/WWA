/**
 * Google Apps Script backend for the site's audit form.
 * Saves each request as a row in the Google Sheet (SHEET_ID) and emails it to you.
 *
 * Setup (once):
 * 1. Create a Google Sheet (e.g. "Audit requests") while signed in as ahsan@workwithahsan.com.
 * 2. Extensions → Apps Script. Replace the editor contents with this file.
 * 3. Set SHARED_SECRET below to a long random string (scripts/audit-form.local.gs,
 *    which is gitignored, is a ready-to-paste copy with it filled in).
 * 4. Deploy → New deployment → type "Web app".
 *    Execute as: Me. Who has access: Anyone. Deploy, approve the permissions.
 * 5. Copy the Web app URL and store both values as Worker secrets:
 *      npx wrangler secret put AUDIT_SCRIPT_URL      (paste the Web app URL)
 *      npx wrangler secret put AUDIT_SCRIPT_SECRET   (paste the same SHARED_SECRET)
 * After editing this script later, use Deploy → Manage deployments → Edit → New version
 * so the same URL picks up the change.
 */

const NOTIFY_EMAIL = "ahsan@workwithahsan.com";
const SHEET_ID = "1xll-sAAYK8Sc6pnPo9NCT6VV7y0_0k2qkCW3LS4Ah84"; // the "Audit requests" Sheet
const SHARED_SECRET = "PASTE_SECRET_HERE";
const COLUMNS = ["Received", "Name", "Email", "Business", "City", "Website", "Notes"];

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  if (SHARED_SECRET === "PASTE_SECRET_HERE" || body.secret !== SHARED_SECRET) {
    return json({ ok: false, error: "forbidden" });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);
    // Prefix with ' so values starting with = + - @ are stored as text, not formulas.
    const safe = (v) => (/^[=+\-@]/.test(String(v || "")) ? "'" + v : String(v || ""));
    sheet.appendRow([
      new Date(),
      safe(body.name),
      safe(body.email),
      safe(body.business),
      safe(body.city),
      safe(body.website),
      safe(body.notes),
    ]);
  } finally {
    lock.releaseLock();
  }

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: body.email,
    subject: `Site audit request: ${body.business} (${body.city})`,
    body: [
      `Name: ${body.name}`,
      `Email: ${body.email}`,
      `Business: ${body.business}`,
      `City: ${body.city}`,
      `Website: ${body.website}`,
      "",
      body.notes || "",
      "",
      `Sheet: ${SpreadsheetApp.openById(SHEET_ID).getUrl()}`,
    ].join("\n"),
  });

  return json({ ok: true });
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
