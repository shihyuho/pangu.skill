// Guard against the skill drifting from pangu.js.
//
// skills/pangu/SKILL.md teaches the spacing rules as `before → after` examples
// (in fenced blocks and in tables). This extracts every example and asserts
// `pangu.spacingText(before) === after` against the pinned `pangu` dependency,
// so a hand-edited example — or an upstream behavior change after a version
// bump — fails loudly instead of silently teaching agents the wrong rule.
import fs from "node:fs";
import pangu from "pangu";

const args = process.argv.slice(2);
const FIX_STAMPS = args.includes("--fix-stamps");
const FILE = args.find((a) => !a.startsWith("--")) || "skills/pangu/SKILL.md";
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

// Version stamps: every place that pins pangu — the skill's own footer and the
// site's live-demo CDN — must name the installed pangu, so a bump can't leave a
// stale number teaching the wrong version. Guarded here so CI catches it too.
const STAMPS = [
  { file: "skills/pangu/SKILL.md", re: /pangu \*\*(\d+\.\d+\.\d+)\*\*/, what: "SKILL.md rules stamp" },
  { file: "site/index.html", re: /cdn\.jsdelivr\.net\/npm\/pangu@(\d+\.\d+\.\d+)/, what: "site live-demo CDN pin" },
];
let stampFailed = 0;
for (const s of STAMPS) {
  const text = fs.readFileSync(s.file, "utf8");
  const found = text.match(s.re);
  if (!found) {
    stampFailed++;
    console.error(`${s.file}: no pangu version stamp (${s.what}); expected pangu ${pangu.version}`);
  } else if (found[1] !== pangu.version) {
    if (FIX_STAMPS) {
      // Rewrite the stamp in place — same regex the guard matches on, so the
      // fixer and the guard can never disagree about what counts as a stamp.
      fs.writeFileSync(s.file, text.replace(s.re, (m) => m.replace(found[1], pangu.version)));
      console.log(`${s.file}: ${s.what} rewritten ${found[1]} → ${pangu.version}`);
    } else {
      stampFailed++;
      console.error(`${s.file}: ${s.what} says pangu ${found[1]}, but the pinned pangu is ${pangu.version}`);
    }
  }
}

console.log(`checked ${cases.length} examples against pangu ${pangu.version}`);
if (skipped.length) {
  console.log(`skipped ${skipped.length} non-pair row(s) (rule descriptions, not before/after):`);
  skipped.forEach((s) => console.log(`  ${FILE}:${s.n}  ${s.raw}`));
}
if (failed || stampFailed) {
  if (failed) console.error(`\n✗ ${failed} example(s) drift from pangu.js — fix SKILL.md so the check passes.`);
  if (stampFailed) console.error(`✗ ${stampFailed} version stamp(s) out of date — set them to pangu ${pangu.version}.`);
  process.exit(1);
}
console.log(`✓ every SKILL example matches pangu.js, and all version stamps read ${pangu.version}`);
