import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";

const require = createRequire(import.meta.url);
const kit = execFileSync(
  "/Users/ahsan/.npm/_npx/1516db5df6474702/node_modules/pingfusi/bin/pingfusi",
  ["where"],
  { encoding: "utf8" },
).trim();
const core = require(path.join(kit, "packages/core"));

const stateFile = path.resolve(".pingfusi/beautify/workwithahsan/review.json");
fs.mkdirSync(path.dirname(stateFile), { recursive: true });
const currentDraft = JSON.parse(
  fs.readFileSync(".pingfusi/beautify/workwithahsan/current.json", "utf8"),
);
const verdicts = ["Professionally polished", "Needs another pass"];

const { ping_id } = await core.review.file(stateFile, {
  url: currentDraft.url,
  title: "Is this page professionally designed?",
  instructions:
    "This is a freelance site for Ahsan: fast websites and local SEO for US/Canada local businesses. Judge it as a shop owner would. Pin or draw on anything that feels generic, messy, or hard to use.",
  steps: [
    {
      text: "Changed since last review: unfinished yellow notes and empty photo box are gone; header, type, and portrait are tightened. Confirm the page renders.",
      options: ["Renders cleanly", "Still broken"],
      check: null,
    },
    {
      text: "First impression: does this feel intentionally and professionally designed?",
      options: ["Clearly polished", "Almost there", "Still rough"],
      check: null,
    },
    {
      text: "Check hierarchy, typography, spacing, alignment, color, and contrast. Pin a sticky comment or draw on every current-page region that needs a specific change.",
      check: null,
    },
    {
      text: "Check desktop and phone layouts, interaction states, and any motion. Note clipping, awkward wrapping, weak affordances, or distracting effects.",
      check: null,
    },
    {
      text: "FINAL REQUIRED STEP — verdict. Pick one exactly.",
      options: verdicts,
      check: null,
    },
  ],
  verdict_options: verdicts,
  approve_verdicts: [verdicts[0]],
  n_target: 1,
  require_evidence: "none",
});

console.log(JSON.stringify({ ping_id, filed: true }));

for (;;) {
  const waited = await core.review.wait(ping_id, { maxWaitSeconds: 45 });
  const status = waited?.status || waited?.result?.status || "unknown";
  console.log(JSON.stringify({ ping_id, status, waited }));
  if (status !== "pending") break;
}

const verified = await core.review.verify(stateFile);
console.log(JSON.stringify({ verified }, null, 2));
process.exit(verified.ok ? 0 : 2);
