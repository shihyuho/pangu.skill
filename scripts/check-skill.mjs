// Guard against the skill drifting from pangu.js.
//
// skills/pangu/SKILL.md teaches the spacing rules as `before → after` examples
// (in fenced blocks and in tables). This extracts every example and asserts
// `pangu.spacingText(before) === after` against the pinned `pangu` dependency,
// so a hand-edited example — or an upstream behavior change after a version
// bump — fails loudly instead of silently teaching agents the wrong rule.
import fs from "node:fs";
import pangu from "pangu";

const FILE = process.argv[2] || "skills/pangu/SKILL.md";
const lines = fs.readFileSync(FILE, "utf8").split("\n");

const cases = [];   // { n, before, after }
const skipped = []; // { n, raw } — table rows that aren't a single before/after pair
let inFence = false;

lines.forEach((raw, idx) => {
  const n = idx + 1;
  if (/^\s*(```|~~~)/.test(raw)) { inFence = !inFence; return; }

  if (inFence) {
    // "→" inside a code fence marks a `before → after` example.
    const i = raw.indexOf("→");
    if (i !== -1) {
      const before = raw.slice(0, i).trim();
      // drop a trailing "   (explanatory comment)" separated by 2+ spaces
      const after = raw.slice(i + 1).trim().split(/\s{2,}/)[0];
      cases.push({ n, before, after });
    }
    return;
  }

  // Table rows: | label | `before` | `after` |
  if (raw.trim().startsWith("|") && raw.includes("`")) {
    const cells = raw.split("|").map((c) => c.trim());
    const beforeCell = cells.at(-3);
    const afterCell = cells.at(-2);
    const bt = (c) => c && /^`[^`]*`$/.test(c);
    if (bt(beforeCell) && bt(afterCell)) {
      cases.push({ n, before: beforeCell.slice(1, -1), after: afterCell.slice(1, -1) });
    } else if (beforeCell && afterCell && (beforeCell.includes("`") || afterCell.includes("`"))) {
      skipped.push({ n, raw: raw.trim() });
    }
  }
});

let failed = 0;
for (const c of cases) {
  const actual = pangu.spacingText(c.before);
  if (actual !== c.after) {
    failed++;
    console.error(`${FILE}:${c.n}`);
    console.error(`  before:       ${JSON.stringify(c.before)}`);
    console.error(`  doc says:     ${JSON.stringify(c.after)}`);
    console.error(`  pangu output: ${JSON.stringify(actual)}`);
  }
}

console.log(`checked ${cases.length} examples against pangu ${pangu.version}`);
if (skipped.length) {
  console.log(`skipped ${skipped.length} non-pair row(s) (rule descriptions, not before/after):`);
  skipped.forEach((s) => console.log(`  ${FILE}:${s.n}  ${s.raw}`));
}
if (failed) {
  console.error(`\n✗ ${failed} example(s) drift from pangu.js — fix SKILL.md so the check passes.`);
  process.exit(1);
}
console.log("✓ every SKILL example matches pangu.js");
